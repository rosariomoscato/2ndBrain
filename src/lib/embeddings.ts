import { sql, eq } from "drizzle-orm";
import { decrypt } from "@/lib/crypto";
import { db } from "@/lib/db";
import { noteEmbeddings, userSettings } from "@/lib/schema";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const DEFAULT_EMBEDDING_MODEL = "openai/text-embedding-3-small";
const EMBEDDING_DIMENSION = 1536;

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
 * Retrieves the OpenRouter API key for a specific user.
 * Tries to get the user's encrypted key from settings and decrypt it.
 * Falls back to the global environment variable.
 *
 * @param userId - The user ID to get the API key for
 * @returns Promise resolving to the API key, or null if not available
 */
async function getEmbeddingApiKey(userId: string): Promise<string | null> {
  try {
    const existing = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    if (existing.length > 0 && existing[0]) {
      const ai = existing[0].ai as Record<string, unknown> | undefined;
      const encryptedKey = ai?.openrouterApiKey as string | undefined;

      if (encryptedKey) {
        try {
          return decrypt(encryptedKey);
        } catch (error) {
          console.error(`Error decrypting API key for user ${userId}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Error retrieving API key for user ${userId}:`, error);
  }

  // Fallback to environment variable
  return process.env.OPENROUTER_API_KEY ?? null;
}

/**
 * Retrieves the embedding model for a specific user.
 * Tries to get the user's selected embedding model from settings.
 * Falls back to the default model.
 *
 * @param userId - The user ID to get the embedding model for
 * @returns Promise resolving to the embedding model ID
 */
async function getEmbeddingModel(userId: string): Promise<string> {
  try {
    const existing = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    if (existing.length > 0 && existing[0]) {
      const ai = existing[0].ai as Record<string, unknown> | undefined;
      const model = ai?.embeddingModel as string | undefined;

      if (model) {
        return model;
      }
    }
  } catch (error) {
    console.error(`Error retrieving embedding model for user ${userId}:`, error);
  }

  // Fallback to default model
  return DEFAULT_EMBEDDING_MODEL;
}

/**
 * Calls OpenRouter's embeddings API to generate embeddings.
 * Returns an array of numbers (embedding vector).
 */
async function generateOpenRouterEmbeddings(
  texts: string[],
  apiKey: string,
  model: string
): Promise<number[][]> {
  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: texts,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter embeddings API failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (Array.isArray(data.data)) {
    return data.data.map((item: any) =>
      Array.isArray(item) ? item : item.embedding
    );
  }

  return [];
}

/**
 * Generates vector embeddings for a note and stores them in the database.
 * Uses the user's configured API key and embedding model, with fallbacks to defaults.
 * This function is async and non-blocking — errors are caught and logged.
 *
 * @param noteId - The note ID to generate embeddings for
 * @param content - The note content to embed
 * @param userId - The user ID who owns the note (required for per-user API key)
 */
export async function generateEmbeddings(noteId: string, content: string, userId: string) {
  const apiKey = await getEmbeddingApiKey(userId);
  if (!apiKey) {
    console.warn(`No API key available for user ${userId}, skipping embeddings`);
    return;
  }

  const model = await getEmbeddingModel(userId);
  const contentHash = hashContent(content);

  const existing = await db.select().from(noteEmbeddings)
    .where(eq(noteEmbeddings.noteId, noteId)).limit(1);

  if (existing.length > 0 && existing[0] && existing[0].contentHash === contentHash) {
    return;
  }

  await db.delete(noteEmbeddings).where(eq(noteEmbeddings.noteId, noteId));

  const chunks = chunkText(content);

  try {
    const embeddings = await generateOpenRouterEmbeddings(chunks, apiKey, model);

    for (let i = 0; i < embeddings.length; i++) {
      const embedding = embeddings[i];
      if (!embedding) continue;

      const embeddingStr = `[${embedding.join(",")}]`;
      const hash = i === 0 ? contentHash : `${contentHash}_chunk_${i}`;

      await db.insert(noteEmbeddings).values({
        noteId,
        contentHash: hash,
        chunkIndex: i,
        chunkText: chunks[i],
        embedding: embeddingStr,
      } as any);

      const vecStr = embedding.join(",");
      await db.execute(sql`UPDATE note_embeddings SET embedding_vec = ${vecStr}::vector WHERE note_id = ${noteId} AND chunk_index = ${i}`);
    }
  } catch (error) {
    console.error(`Failed to generate embeddings for note ${noteId}:`, error);
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
 * Returns null if no API key is available.
 *
 * @param query - The search query text
 * @param userId - The user ID to get the API key for
 * @returns Promise resolving to the embedding vector, or null if unavailable
 */
export async function getQueryEmbedding(query: string, userId: string) {
  const apiKey = await getEmbeddingApiKey(userId);
  if (!apiKey) {
    console.error(`No API key available for user ${userId}, skipping query embedding`);
    return null;
  }

  const model = await getEmbeddingModel(userId);

  console.log(`getQueryEmbedding called with model: ${model} for user: ${userId}`);

  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: query,
    }),
  });

  if (!response.ok) {
    console.error("OpenRouter embeddings API failed:", response.status, response.statusText);
    const errorBody = await response.text();
    console.error("Error body:", errorBody);
    return null;
  }

  const data = await response.json();
  console.log("OpenRouter response keys:", Object.keys(data));
  console.log("data.data type:", typeof data.data, Array.isArray(data.data), "length:", data.data?.length);

  if (Array.isArray(data.data) && data.data.length > 0) {
    const firstResult = data.data[0];
    console.log("firstResult type:", typeof firstResult, Array.isArray(firstResult) ? `array len=${firstResult.length}` : `object keys=${Object.keys(firstResult).join(',')}`);
    if (Array.isArray(firstResult)) {
      return firstResult;
    }
    if (firstResult?.embedding && Array.isArray(firstResult.embedding)) {
      console.log("Returning embedding array of length:", firstResult.embedding.length);
      return firstResult.embedding;
    }
  }

  console.error("Could not parse embedding from response");
  return null;
}