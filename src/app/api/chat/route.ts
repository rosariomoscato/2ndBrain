import { headers } from "next/headers";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { z } from "zod";
import { resolveOpenRouterConfig } from "@/lib/actions/ai-settings";
import { auth } from "@/lib/auth";

// Zod schema for message validation
const messagePartSchema = z.object({
  type: z.string(),
  text: z.string().max(10000, "Message text too long").optional(),
});

const messageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(messagePartSchema).optional(),
  content: z.union([z.string(), z.array(messagePartSchema)]).optional(),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).max(100, "Too many messages"),
  context: z.string().optional(),
  noteTitle: z.string().optional(),
});

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

  const parsed = chatRequestSchema.safeParse(body);
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

  const { messages, context, noteTitle } = parsed.data as {
    messages: UIMessage[];
    context?: string;
    noteTitle?: string;
  };

  // Resolve OpenRouter config (user key or env var fallback)
  const config = await resolveOpenRouterConfig();
  if (!config) {
    return new Response(
      JSON.stringify({
        error: "OpenRouter API key not configured. Go to Settings > AI to add your key.",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Construct system prompt with context if available
  const systemPrompt = context
    ? `You are an AI assistant helping the user work with their note "${noteTitle || "this note"}". Here is the note content:\n\n${context}\n\nAnswer questions about this note, suggest improvements, help with research, and provide insights.`
    : "You are a helpful AI assistant for 2ndBrain, a personal knowledge management system.";

  const openrouter = createOpenRouter({ apiKey: config.apiKey });

  const result = streamText({
    model: openrouter(config.model) as any,
    system: systemPrompt,
    messages: convertToModelMessages(messages),
  });

  return (
    result as unknown as { toUIMessageStreamResponse: () => Response }
  ).toUIMessageStreamResponse();
}
