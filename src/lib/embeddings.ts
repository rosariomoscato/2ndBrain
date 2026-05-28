import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { db } from "@/lib/db";
import { noteEmbeddings } from "@/lib/schema";
import { sql, eq } from "drizzle-orm";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-large";

/**
 * Chunks text into smaller pieces for embedding generation.
 * Uses overlap to preserve context at chunk boundaries.
 */
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

/**
 * Generates a simple hash for content comparison.
 * Used to avoid regenerating embeddings for unchanged notes.
 */
function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generates vector embeddings for a note and stores them in the database.
 * This function is async and non-blocking — errors are caught and logged.
 * Silently skips if OPENAI_API_KEY is not set.
 */
export async function generateEmbeddings(noteId: string, content: string) {
  if (!process.env.OPENAI_API_KEY) return;

  const contentHash = hashContent(content);

  const existing = await db.select().from(noteEmbeddings)
    .where(eq(noteEmbeddings.noteId, noteId)).limit(1);

  if (existing.length > 0 && existing[0] && existing[0].contentHash === contentHash) {
    return;
  }

  await db.delete(noteEmbeddings).where(eq(noteEmbeddings.noteId, noteId));

  const chunks = chunkText(content);

  for (let i = 0; i < chunks.length; i++) {
    const embeddingResult = await embed({
      model: openai.embedding(EMBEDDING_MODEL) as any,
      value: chunks[i],
    });

    if (!embeddingResult.embedding) {
      console.error(`Failed to generate embedding for chunk ${i} of note ${noteId}`);
      continue;
    }

    const embeddingStr = `[${embeddingResult.embedding.join(",")}]`;
    const hash = i === 0 ? contentHash : `${contentHash}_chunk_${i}`;
    const idx = i;
    const txt = chunks[i];

    await db.insert(noteEmbeddings).values({
      noteId: noteId,
      contentHash: hash,
      chunkIndex: idx,
      chunkText: txt,
      embedding: embeddingStr,
    } as any);

    // Set the vector column via raw SQL since Drizzle doesn't support vector types natively
    await db.execute(sql`UPDATE note_embeddings SET embedding_vec = ${embeddingStr}::vector WHERE note_id = ${noteId} AND chunk_index = ${i}`);
  }
}

/**
 * Searches for similar notes using vector similarity.
 * Returns results ordered by cosine similarity score (higher is better).
 */
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

  // Handle postgres.js results - can be array or object with rows property
  const rows = Array.isArray(results) ? results : (results as any).rows || [];

  return rows.map((row: Record<string, unknown>) => ({
    noteId: row.note_id as string,
    chunkText: row.chunk_text as string,
    chunkIndex: row.chunk_index as number,
    similarity: Number(row.similarity),
  }));
}

/**
 * Generates an embedding vector for a search query.
 * Returns null if OPENAI_API_KEY is not set.
 */
export async function getQueryEmbedding(query: string) {
  if (!process.env.OPENAI_API_KEY) return null;

  const embeddingResult = await embed({
    model: openai.embedding(EMBEDDING_MODEL) as any,
    value: query,
  });

  return embeddingResult.embedding;
}