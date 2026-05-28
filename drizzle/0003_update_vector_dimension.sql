-- Update embedding vector dimension from 1536 to 1024 for OpenRouter's free model
DROP INDEX IF EXISTS "note_embeddings_vec_idx";
--> statement-breakpoint
ALTER TABLE "note_embeddings" DROP COLUMN IF EXISTS "embedding_vec";
--> statement-breakpoint
ALTER TABLE "note_embeddings" ADD COLUMN "embedding_vec" vector(1024);
--> statement-breakpoint
CREATE INDEX "note_embeddings_vec_idx" ON "note_embeddings" USING ivfflat ("embedding_vec" vector_cosine_ops);