"use server";

import { headers } from "next/headers";
import { eq, and, desc, sql, or, ilike } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateEmbeddings } from "@/lib/embeddings";
import { notes, noteTags, tags, graphNodes } from "@/lib/schema";
import type { Note, NoteTag } from "@/lib/types";
import { createNoteSchema, updateNoteSchema, deleteNoteSchema } from "@/lib/validations";
import { createNodeForNote } from "./graph";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function generateExcerpt(content: string): string {
  const plain = content.replace(/[#*`>\-\[\]()!]/g, "").trim();
  return plain.slice(0, 200) + (plain.length > 200 ? "..." : "");
}

export async function getNotes(options?: {
  search?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}) {
  const session = await getSession();
  const userId = session.user.id;
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  const result = await db.select({
    id: notes.id,
    title: notes.title,
    content: notes.content,
    excerpt: notes.excerpt,
    importance: notes.importance,
    updatedAt: notes.updatedAt,
  })
  .from(notes)
  .where(
    and(
      eq(notes.userId, userId),
      options?.search ? or(
        ilike(notes.title, `%${options.search}%`),
        ilike(notes.content, `%${options.search}%`)
      ) : undefined,
    )
  )
  .orderBy(desc(notes.updatedAt))
  .limit(limit)
  .offset(offset);

  // Get tags for all notes
  const noteIds = result.map(n => n.id);
  const tagRows = noteIds.length > 0 ? await db.select({
    noteId: noteTags.noteId,
    tagId: tags.id,
    tagName: tags.name,
    tagColor: tags.color,
  })
  .from(noteTags)
  .innerJoin(tags, eq(noteTags.tagId, tags.id))
  .where(sql`${noteTags.noteId} IN ${noteIds}`) : [];

  const tagMap = new Map<string, NoteTag[]>();
  for (const t of tagRows) {
    const arr = tagMap.get(t.noteId) ?? [];
    arr.push({ id: t.tagId, name: t.tagName, color: t.tagColor as NoteTag["color"] });
    tagMap.set(t.noteId, arr);
  }

  // If tag filter specified, filter results
  let filtered = result;
  if (options?.tag) {
    filtered = result.filter(n => {
      const noteTagsList = tagMap.get(n.id) ?? [];
      return noteTagsList.some(t => t.name === options.tag);
    });
  }

  return filtered.map(n => ({
    id: n.id,
    title: n.title,
    excerpt: n.excerpt,
    content: n.content,
    tags: tagMap.get(n.id) ?? [],
    updatedAt: n.updatedAt.toISOString(),
    connections: 0,
    importance: n.importance,
  })) satisfies Note[];
}

export async function getNoteById(id: string) {
  const session = await getSession();
  const result = await db.select().from(notes).where(
    and(eq(notes.id, id), eq(notes.userId, session.user.id))
  ).limit(1);
  
  if (result.length === 0 || !result[0]) return null;
  const note = result[0];
  
  const tagRows = await db.select({
    id: tags.id,
    name: tags.name,
    color: tags.color,
  }).from(noteTags)
    .innerJoin(tags, eq(noteTags.tagId, tags.id))
    .where(eq(noteTags.noteId, id));

  return {
    id: note.id,
    title: note.title,
    content: note.content,
    excerpt: note.excerpt,
    tags: tagRows.map(t => ({ id: t.id, name: t.name, color: t.color as NoteTag["color"] })),
    updatedAt: note.updatedAt.toISOString(),
    connections: 0,
    importance: note.importance ?? 3,
  } satisfies Note;
}

export async function createNote(input: {
  title: string;
  content: string;
  tags?: string[];
  importance?: number;
}) {
  const session = await getSession();
  const validated = createNoteSchema.parse(input);
  const excerpt = generateExcerpt(validated.content ?? "");

  const [note] = await db.insert(notes).values({
    userId: session.user.id,
    title: validated.title,
    content: validated.content ?? "",
    excerpt,
    importance: validated.importance ?? 3,
  }).returning();

  if (!note) {
    throw new Error("Failed to create note");
  }

  // Generate embeddings for the note (non-blocking)
  generateEmbeddings(note.id, validated.content ?? "", session.user.id).catch(console.error);

  if (validated.tags && validated.tags.length > 0) {
    for (const tagName of validated.tags) {
      const existingTag = await db.select().from(tags).where(
        and(eq(tags.userId, session.user.id), eq(tags.name, tagName))
      ).limit(1);

      let tagId: string;
      if (existingTag.length > 0 && existingTag[0]) {
        tagId = existingTag[0].id;
      } else {
        const [newTag] = await db.insert(tags).values({
          userId: session.user.id,
          name: tagName,
          color: "cyan",
        }).returning();

        if (!newTag) {
          throw new Error("Failed to create tag");
        }

        tagId = newTag.id;
      }

      await db.insert(noteTags).values({ noteId: note.id, tagId });
    }
  }

  // Auto-create graph node for the new note
  await createNodeForNote(note.id, validated.title, session.user.id).catch(console.error);

  return getNoteById(note.id);
}

export async function updateNote(input: {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  importance?: number;
}) {
  const session = await getSession();
  const validated = updateNoteSchema.parse(input);

  const updates: Record<string, unknown> = {};
  if (validated.title !== undefined) updates.title = validated.title;
  if (validated.content !== undefined) {
    updates.content = validated.content;
    updates.excerpt = generateExcerpt(validated.content);
  }
  if (validated.importance !== undefined) updates.importance = validated.importance;

  // If title changed, update the corresponding graph node label
  if (validated.title !== undefined) {
    await db.update(graphNodes).set({ label: validated.title })
      .where(and(eq(graphNodes.noteId, validated.id), eq(graphNodes.userId, session.user.id)));
  }

  if (Object.keys(updates).length > 0) {
    await db.update(notes).set(updates).where(
      and(eq(notes.id, validated.id), eq(notes.userId, session.user.id))
    );
  }

  // Regenerate embeddings if content changed (non-blocking)
  if (validated.content !== undefined) {
    generateEmbeddings(validated.id, validated.content, session.user.id).catch(console.error);
  }

  if (validated.tags !== undefined) {
    await db.delete(noteTags).where(eq(noteTags.noteId, validated.id));
    for (const tagName of validated.tags) {
      const existingTag = await db.select().from(tags).where(
        and(eq(tags.userId, session.user.id), eq(tags.name, tagName))
      ).limit(1);

      let tagId: string;
      if (existingTag.length > 0 && existingTag[0]) {
        tagId = existingTag[0].id;
      } else {
        const [newTag] = await db.insert(tags).values({
          userId: session.user.id,
          name: tagName,
          color: "cyan",
        }).returning();

        if (!newTag) {
          throw new Error("Failed to create tag");
        }

        tagId = newTag.id;
      }
      await db.insert(noteTags).values({ noteId: validated.id, tagId });
    }
  }

  return getNoteById(validated.id);
}

export async function deleteNote(id: string) {
  const session = await getSession();
  const validated = deleteNoteSchema.parse({ id });
  
  await db.delete(notes).where(
    and(eq(notes.id, validated.id), eq(notes.userId, session.user.id))
  );
  return { success: true };
}

export async function getNoteCount() {
  const session = await getSession();
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(notes).where(eq(notes.userId, session.user.id));
  return result[0]?.count ?? 0;
}