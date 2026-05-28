import { headers } from "next/headers";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { z } from "zod";
import { getNoteById } from "@/lib/actions/notes";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getQueryEmbedding, searchSimilarNotes } from "@/lib/embeddings";
import { aiQueries } from "@/lib/schema";
import type { Citation } from "@/lib/types";

// Zod schema for request validation
const aiQueryRequestSchema = z.object({
  query: z.string().min(1, "Query cannot be empty").max(10000, "Query too long"),
});

/**
 * POST /api/ai-query
 * 
 * Performs a RAG query with streaming response.
 * 
 * This endpoint:
 * 1. Verifies user authentication
 * 2. Validates the query
 * 3. Generates query embedding
 * 4. Searches for similar notes using vector similarity
 * 5. Builds context from top-matching chunks
 * 6. Streams AI response from OpenRouter with context
 * 7. Stores query history after streaming completes
 * 
 * @returns Streaming response with AI-generated answer
 */
export async function POST(req: Request) {
  // Verify user is authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse and validate request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = aiQueryRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid request",
        details: parsed.error.flatten().fieldErrors,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { query } = parsed.data;

  // Generate embedding for the query (uses OpenAI API)
  const queryEmbedding = await getQueryEmbedding(query);

  let context = "";
  const citations: Citation[] = [];

  // If we successfully generated an embedding, search for similar notes
  if (queryEmbedding) {
    const results = await searchSimilarNotes(queryEmbedding, 5, session.user.id);

    const seenNoteIds = new Set<string>();
    const contextParts: string[] = [];

    for (const result of results) {
      // Filter out low-quality matches using similarity threshold
      if (result.similarity < 0.5) continue;

      // Deduplicate by note ID (avoid multiple chunks from same note)
      if (!seenNoteIds.has(result.noteId)) {
        seenNoteIds.add(result.noteId);
        const note = await getNoteById(result.noteId);

        if (note) {
          contextParts.push(`--- Note: "${note.title}" ---\n${result.chunkText}`);
          citations.push({
            noteId: note.id,
            noteTitle: note.title,
            excerpt: result.chunkText.slice(0, 150) + "...",
            relevance: Math.round(result.similarity * 100) / 100,
          });
        }
      }
    }
    context = contextParts.join("\n\n");
  }

  // Validate OpenRouter API key is configured
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OpenRouter API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const openrouter = createOpenRouter({ apiKey });
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-5-mini";

  // Construct system prompt with context if available
  const systemPrompt = `You are an AI assistant for a personal knowledge management system called 2ndBrain. Answer questions based on the user's notes and knowledge base. Always cite your sources when referencing specific information from the notes. If the context doesn't contain relevant information, say so honestly.

${
  context
    ? `User's relevant notes:\n${context}`
    : "No relevant notes found for this query. Answer based on general knowledge but mention that no matching notes were found."
}`;

  // Generate streaming response using OpenRouter
  const result = streamText({
    model: openrouter(model) as any,
    system: systemPrompt,
    prompt: query,
    onFinish: async ({ text: answer }) => {
      // Store query history after streaming completes
      try {
        await db.insert(aiQueries).values({
          userId: session.user.id,
          query,
          answer,
          citations,
        });
      } catch (error) {
        console.error("Failed to store query history:", error);
      }
    },
  });

  return (result as unknown as { toUIMessageStreamResponse: () => Response }).toUIMessageStreamResponse();
}