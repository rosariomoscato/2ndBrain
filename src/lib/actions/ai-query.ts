"use server";

import { headers } from "next/headers";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";
import { resolveOpenRouterConfig } from "@/lib/actions/ai-settings";
import { getNoteById } from "@/lib/actions/notes";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getQueryEmbedding, searchSimilarNotes } from "@/lib/embeddings";
import { aiQueries, tags, noteTags, notes } from "@/lib/schema";
import type { Citation, QueryHistoryItem, AIResponse } from "@/lib/types";

/**
 * Helper function to get authenticated session.
 * Throws if user is not authenticated.
 */
async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/**
 * Performs a RAG (Retrieval-Augmented Generation) query against the user's knowledge base.
 * 
 * Process:
 * 1. Generates embedding for the query
 * 2. Searches for similar note chunks using vector similarity
 * 3. Builds context from top-matching chunks (similarity threshold: 0.5)
 * 4. Sends query + context to OpenRouter for AI generation
 * 5. Returns answer with citations linking to source notes
 * 6. Stores query history in the database
 * 
 * @param query - The user's question or query
 * @returns AIResponse with answer and citations
 * @throws Error if not authenticated or OpenRouter API key is not configured
 */
export async function queryWithRAG(query: string): Promise<AIResponse> {
  const session = await getSession();
  console.log("Session user ID:", session.user.id);
  console.log("Query:", query);

  // Extract keywords from query (simple approach: words with first letter capitalized or length > 4)
  const keywords = query
    .split(/[\s,.;!?]+/)
    .filter(w => w.length > 0)
    .filter(w => /^[A-Z]/.test(w) || w.length > 4); // Keep capitalized words or long words
  
  console.log("Extracted keywords:", keywords);

  // Search for notes with matching tags (case-insensitive, matching any keyword)
  const matchingTagNotes = await db
    .select({
      noteId: notes.id,
      noteTitle: notes.title,
      noteUserId: notes.userId,
      tagName: tags.name,
      tagUserId: tags.userId,
    })
    .from(notes)
    .innerJoin(noteTags, eq(notes.id, noteTags.noteId))
    .innerJoin(tags, eq(noteTags.tagId, tags.id))
    .where(
      and(
        eq(notes.userId, session.user.id),
        keywords.length > 0
          ? or(...keywords.map(kw => ilike(tags.name, `%${kw}%`)))
          : sql`1=0` // No keywords, no tag matches
      )
    );

  console.log("Found", matchingTagNotes.length, "notes with matching tags:", matchingTagNotes.map(n => ({ title: n.noteTitle, tag: n.tagName })));

  // Generate embedding for the query (uses OpenAI API)
  const queryEmbedding = await getQueryEmbedding(query, session.user.id);

  let context = "";
  const citations: Citation[] = [];

  // Collect all relevant note IDs from both tag search and embedding search
  const relevantNoteIds = new Set<string>();
  const tagMatchNoteIds = new Map<string, string>(); // noteId -> matched tag name

  // Add notes with matching tags
  for (const match of matchingTagNotes) {
    relevantNoteIds.add(match.noteId);
    tagMatchNoteIds.set(match.noteId, match.tagName);
  }

  // If we successfully generated an embedding, search for similar notes
  const embeddingResults = queryEmbedding ? await searchSimilarNotes(queryEmbedding, 5, session.user.id) : [];
  console.log("RAG search results:", embeddingResults.length, embeddingResults.map((r: { similarity: number; chunkText: string }) => ({ sim: r.similarity.toFixed(3), text: r.chunkText.substring(0, 40) })));

  const seenNoteIds = new Set<string>();
  const contextParts: string[] = [];

  for (const result of embeddingResults) {
    // Filter out low-quality matches using similarity threshold
    if (result.similarity < 0.3) continue;

    // Deduplicate by note ID (avoid multiple chunks from same note)
    if (!seenNoteIds.has(result.noteId)) {
      seenNoteIds.add(result.noteId);
      relevantNoteIds.add(result.noteId);
      
      const note = await getNoteById(result.noteId);

      if (note) {
        const matchedTag = tagMatchNoteIds.get(note.id);
        const matchReason = matchedTag ? `(matches tag "${matchedTag}")` : `(similarity: ${(result.similarity * 100).toFixed(0)}%)`;
        contextParts.push(`--- Note: "${note.title}" ${matchReason} ---\n${result.chunkText}`);
        citations.push({
          noteId: note.id,
          noteTitle: note.title,
          excerpt: result.chunkText.slice(0, 150) + "...",
          relevance: Math.max(result.similarity, matchedTag ? 0.8 : 0), // Tag matches get higher relevance
        });
      }
    }
  }

  // Add notes with matching tags that weren't found via embeddings
  for (const match of matchingTagNotes) {
    if (!seenNoteIds.has(match.noteId)) {
      const note = await getNoteById(match.noteId);
      
      if (note) {
        console.log(`Adding note from tag match: ${note.title}, content length: ${note.content?.length || 0}`);
        contextParts.push(`--- Note: "${note.title}" (matches tag "${match.tagName}") ---\n${note.content || note.excerpt || ""}`);
        citations.push({
          noteId: note.id,
          noteTitle: note.title,
          excerpt: note.excerpt || "No excerpt available",
          relevance: 0.8, // Tag matches get high relevance
        });
      }
    }
  }

  context = contextParts.join("\n\n");
  console.log(`Final context length: ${context.length} chars, citations: ${citations.length}`);

  // Resolve OpenRouter config (user key or env var fallback)
  const config = await resolveOpenRouterConfig();
  if (!config) {
    throw new Error("OpenRouter API key not configured. Go to Settings > AI to add your key.");
  }

  const openrouter = createOpenRouter({ apiKey: config.apiKey });
  const model = config.model;

  // Construct system prompt with context if available
  const systemPrompt = `You are an AI assistant for a personal knowledge management system called 2ndBrain. Answer questions based on the user's notes and knowledge base. Always cite your sources when referencing specific information from the notes. If the context doesn't contain relevant information, say so honestly.

${
  context
    ? `User's relevant notes:\n${context}`
    : "No relevant notes found for this query. Answer based on general knowledge but mention that no matching notes were found."
}`;

  // Generate response using OpenRouter (non-streaming for server action)
  const { text } = await streamText({
    model: openrouter(model) as any,
    system: systemPrompt,
    prompt: query,
  });

  const answer = await text;

  // Store query history in the database
  await db.insert(aiQueries).values({
    userId: session.user.id,
    query,
    answer,
    citations,
  });

  return {
    query,
    answer,
    citations,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Retrieves the user's query history.
 * 
 * @param limit - Maximum number of queries to return (default: 20)
 * @returns QueryHistoryItem[] ordered by most recent
 */
export async function getQueryHistory(limit: number = 20): Promise<QueryHistoryItem[]> {
  const session = await getSession();

  const results = await db
    .select({
      id: aiQueries.id,
      query: aiQueries.query,
      createdAt: aiQueries.createdAt,
    })
    .from(aiQueries)
    .where(eq(aiQueries.userId, session.user.id))
    .orderBy(desc(aiQueries.createdAt))
    .limit(limit);

  return results.map((r) => ({
    id: r.id,
    query: r.query,
    timestamp: r.createdAt.toISOString(),
  }));
}

/**
 * Clears all query history for the authenticated user.
 * 
 * @returns Success indicator
 */
export async function clearQueryHistory() {
  const session = await getSession();
  await db.delete(aiQueries).where(eq(aiQueries.userId, session.user.id));
  return { success: true };
}