-- Add foreign key constraints for the new tables
ALTER TABLE "ai_queries" ADD CONSTRAINT "ai_queries_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_source_id_graph_nodes_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."graph_nodes"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_target_id_graph_nodes_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."graph_nodes"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "graph_nodes" ADD CONSTRAINT "graph_nodes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "graph_nodes" ADD CONSTRAINT "graph_nodes_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "note_embeddings" ADD CONSTRAINT "note_embeddings_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "note_tags" ADD CONSTRAINT "note_tags_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "note_tags" ADD CONSTRAINT "note_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;