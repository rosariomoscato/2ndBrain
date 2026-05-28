-- Recreate note_embeddings table with vector column
CREATE TABLE "note_embeddings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "note_id" uuid NOT NULL,
  "content_hash" text NOT NULL,
  "chunk_index" integer DEFAULT 0 NOT NULL,
  "chunk_text" text NOT NULL,
  "embedding" text,
  "embedding_vec" vector(1536),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create index for vector similarity search
-- Using ivfflat with cosine similarity
CREATE INDEX "note_embeddings_vec_idx" ON "note_embeddings" USING ivfflat ("embedding_vec" vector_cosine_ops);

-- Create note_id index
CREATE INDEX "note_embeddings_note_id_idx" ON "note_embeddings" USING btree ("note_id");

-- Add foreign key constraint
ALTER TABLE "note_embeddings" ADD CONSTRAINT "note_embeddings_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;