# Task 07: Embedding Pipeline

## Status

pending

## Wave

3

## Description

Build the pipeline that generates vector embeddings for notes using OpenAI's text-embedding-3-large model and stores them in pgvector. This enables semantic search for the AI Query feature. The pipeline runs when a note is created or updated, chunks long notes into smaller pieces, generates embeddings via the AI SDK, and stores them with cosine similarity index for fast vector search.

## Dependencies

**Depends on:** task-01-schema.md, task-04-notes.md
**Blocks:** task-08-rag.md

**Context from dependencies:** task-01 creates the `note_embeddings` table with `embedding_vec vector(1536)` column (added via raw SQL in migration). task-04 creates the notes server actions. The `@ai-sdk/openai` package needs to be installed. The existing `ai` SDK package (v5) provides `embed()` function. The env.example already references `OPENAI_EMBEDDING_MODEL=text-embedding-3-large`.

## Files to Create

- `src/lib/embeddings.ts` — Embedding generation and search utilities

## Files to Modify

- `src/lib/env.ts` — Add OPENAI_API_KEY and OPENAI_EMBEDDING_MODEL to schema
- `env.example` — Add OPENAI_API_KEY with comment
- `src/lib/actions/notes.ts` — Call embedding pipeline on create/update

## Technical Details

### Implementation Steps

1. Install OpenAI provider for AI SDK:
```bash
pnpm add @ai-sdk/openai
```

2. Add to `src/lib/env.ts` server schema:
```typescript
OPENAI_API_KEY: z.string().optional(),
OPENAI_EMBEDDING_MODEL: z.string().default("text-embedding-3-large"),
```

3. Add to `env.example`:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxx
OPENAI_EMBEDDING_MODEL=text-embedding-3-large
```

4. Create `src/lib/embeddings.ts`:

```typescript
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { db } from "@/lib/db";
import { noteEmbeddings } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-large";

function chunkText(text: string): string[] {
  if (text.length <= CHUNK_SIZE) return [text];
  
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    chunks.push(text.slice(start, end));
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export async function generateEmbeddings(noteId: string, content: string) {
  if (!process.env.OPENAI_API_KEY) return;
  
  const contentHash = hashContent(content);
  
  const existing = await db.select().from(noteEmbeddings)
    .where(eq(noteEmbeddings.noteId, noteId)).limit(1);
  
  if (existing.length > 0 && existing[0].contentHash === contentHash) {
    return;
  }
  
  await db.delete(noteEmbeddings).where(eq(noteEmbeddings.noteId, noteId));
  
  const chunks = chunkText(content);
  
  for (let i = 0; i < chunks.length; i++) {
    const { embedding } = await embed({
      model: openai.embedding(EMBEDDING_MODEL),
      value: chunks[i],
    });
    
    const embeddingStr = `[${embedding.join(",")}]`;
    
    await db.insert(noteEmbeddings).values({
      noteId,
      contentHash: i === 0 ? contentHash : `${contentHash}_chunk_${i}`,
      chunkIndex: i,
      chunkText: chunks[i],
      embedding: embeddingStr,
    });
    
    await db.execute(sql`UPDATE note_embeddings SET embedding_vec = ${embeddingStr}::vector WHERE note_id = ${noteId} AND chunk_index = ${i}`);
  }
}

export async function searchSimilarNotes(queryEmbedding: number[], limit: number = 5, userId?: string) {
  const embeddingStr = `[${queryEmbedding.join(",")}]`;
  
  const results = await db.execute(sql`
    SELECT 
      ne.note_id,
      ne.chunk_text,
      ne.chunk_index,
      1 - (ne.embedding_vec <=> ${embeddingStr}::vector) as similarity
    FROM note_embeddings ne
    INNER JOIN notes n ON n.id = ne.note_id
    ${userId ? sql`WHERE n.user_id = ${userId}` : sql``}
    ORDER BY ne.embedding_vec <=> ${embeddingStr}::vector
    LIMIT ${limit}
  `);
  
  return results.rows.map((row: Record<string, unknown>) => ({
    noteId: row.note_id as string,
    chunkText: row.chunk_text as string,
    chunkIndex: row.chunk_index as number,
    similarity: Number(row.similarity),
  }));
}

export async function getQueryEmbedding(query: string) {
  if (!process.env.OPENAI_API_KEY) return null;
  
  const { embedding } = await embed({
    model: openai.embedding(EMBEDDING_MODEL),
    value: query,
  });
  
  return embedding;
}
```

5. Modify `src/lib/actions/notes.ts`:
- Import `generateEmbeddings` from `@/lib/embeddings`
- In `createNote` action, after the insert, add: `await generateEmbeddings(note.id, validated.content).catch(console.error);`
- In `updateNote` action, after the update, add: `if (validated.content !== undefined) { await generateEmbeddings(validated.id, validated.content).catch(console.error); }`
- In `deleteNote` action, embeddings are cascade-deleted via foreign key

### Notes

- The embedding pipeline is async and non-blocking — errors are caught and logged, not thrown
- If OPENAI_API_KEY is not set, the pipeline silently skips (app still works without embeddings)
- Content hashing prevents regenerating embeddings for unchanged notes
- Chunks overlap to avoid losing context at chunk boundaries
- The `embedding_vec` column is set via raw SQL because Drizzle doesn't support vector types natively
- Embedding dimension is 1536 (text-embedding-3-large default)

## Acceptance Criteria

- [ ] `@ai-sdk/openai` package installed
- [ ] OPENAI_API_KEY added to env validation
- [ ] `generateEmbeddings()` creates chunks and stores embeddings with vector column
- [ ] Content hashing prevents duplicate embedding generation
- [ ] `searchSimilarNotes()` returns results ordered by cosine similarity
- [ ] `getQueryEmbedding()` generates embedding for a search query
- [ ] createNote and updateNote actions trigger embedding generation
- [ ] No errors when OPENAI_API_KEY is not set (graceful skip)
