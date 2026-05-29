CREATE TABLE "note_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"file_type" text DEFAULT 'application/pdf' NOT NULL,
	"file_size" integer NOT NULL,
	"extracted_text" text,
	"page_count" integer,
	"pdf_metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "graph_edges" ADD COLUMN "type" text DEFAULT 'tag' NOT NULL;--> statement-breakpoint
ALTER TABLE "note_attachments" ADD CONSTRAINT "note_attachments_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "note_attachments_note_id_idx" ON "note_attachments" USING btree ("note_id");