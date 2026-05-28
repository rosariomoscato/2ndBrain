# Task 08: AI Query with RAG

## Status

pending

## Wave

4

## Description

Implement the RAG (Retrieval-Augmented Generation) pipeline for the AI Query feature. When a user asks a question, the system: (1) generates an embedding for the query, (2) finds similar note chunks via pgvector, (3) constructs a context window from the top matches, (4) sends the question + context to OpenRouter for an answer, (5) returns the answer with citations linking to source notes. Also stores query history in the ai_queries table.

## Dependencies

**Depends on:** task-07-embeddings.md
**Blocks:** task-13-ai-ui.md

**Context from dependencies:** task-07 creates `generateQueryEmbedding()`, `searchSimilarNotes()`, and `getNoteById()` from task-04. The existing `/api/chat/route.ts` uses OpenRouter with `@openrouter/ai-sdk-provider`. The `ai_queries` table stores query history. The AI page UI expects `AIResponse { query, answer, citations, timestamp }`.

## Files to Create

- `src/lib/actions/ai-query.ts` — AI query server action with RAG
- `src/app/api/ai-query/route.ts` — Streaming API route for AI responses

## Files to Modify

None

## Technical Details

### Implementation Steps

1. Create `src/lib/actions/ai-query.ts`:

```typescript
"use server";

import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { getQueryEmbedding, searchSimilarNotes } from "@/lib/embeddings";
import { getNoteById } from "@/lib/actions/notes";
import { db } from "@/lib/db";
import { aiQueries } from "@/lib/schema";
import { auth } from "@/lib/auth";
import type { Citation, QueryHistoryItem } from "@/lib/types";
import { headers } from "next/headers";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}
```

2. **queryWithRAG action** (non-streaming, returns full response):
```typescript
export async function queryWithRAG(query: string) {
  const session = await getSession();
  
  const queryEmbedding = await getQueryEmbedding(query);
  
  let context = "";
  let citations: Citation[] = [];
  
  if (queryEmbedding) {
    const results = await searchSimilarNotes(queryEmbedding, 5, session.user.id);
    
    const seenNoteIds = new Set<string>();
    const contextParts: string[] = [];
    
    for (const result of results) {
      if (result.similarity < 0.5) continue;
      
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
  
  const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-5-mini";
  
  const systemPrompt = `You are an AI assistant for a personal knowledge management system called 2ndBrain. Answer questions based on the user's notes and knowledge base. Always cite your sources when referencing specific information from the notes. If the context doesn't contain relevant information, say so honestly.

${context ? `User's relevant notes:\n${context}` : "No relevant notes found for this query. Answer based on general knowledge but mention that no matching notes were found."}`;

  const { text } = await streamText({
    model: openrouter(model),
    system: systemPrompt,
    prompt: query,
  });

  const answer = await text;
  
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
```

3. **getQueryHistory action:**
```typescript
export async function getQueryHistory(limit: number = 20): Promise<QueryHistoryItem[]> {
  const session = await getSession();
  
  const results = await db.select({
    id: aiQueries.id,
    query: aiQueries.query,
    createdAt: aiQueries.createdAt,
  })
  .from(aiQueries)
  .where(eq(aiQueries.userId, session.user.id))
  .orderBy(desc(aiQueries.createdAt))
  .limit(limit);
  
  return results.map(r => ({
    id: r.id,
    query: r.query,
    timestamp: r.createdAt.toISOString(),
  }));
}
```
Add the missing imports: `import { eq, desc } from "drizzle-orm";`

4. **clearQueryHistory action:**
```typescript
export async function clearQueryHistory() {
  const session = await getSession();
  await db.delete(aiQueries).where(eq(aiQueries.userId, session.user.id));
  return { success: true };
}
```

### Notes

- The RAG pipeline uses cosine similarity with a threshold of 0.5 to filter low-quality matches
- If no OPENAI_API_KEY is set, the query falls back to a non-RAG response (no context, no citations)
- Citations include relevance score (0-1) for the UI to display
- Query history is stored per-user and can be cleared
- The existing `/api/chat/route.ts` remains unchanged — this is a separate feature for the AI Query page
- If OPENROUTER_API_KEY is not set, the action throws an error

## Acceptance Criteria

- [ ] `queryWithRAG()` returns AIResponse with answer and citations
- [ ] Citations link to real notes with relevance scores
- [ ] Query history is saved to database
- [ ] `getQueryHistory()` returns recent queries in reverse chronological order
- [ ] `clearQueryHistory()` removes all query history for the user
- [ ] Falls back gracefully when no relevant notes found
- [ ] Falls back gracefully when OPENAI_API_KEY is not set
