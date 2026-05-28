# Task 04: Notes Server Actions

## Status

pending

## Wave

2

## Description

Implement all server actions for notes CRUD: create, read, update, delete, and list with search/filter capabilities. These server actions replace the mock note arrays in the UI (5 hardcoded notes in notes/page.tsx, 1 mock note in notes/[id]/page.tsx) and the console.log placeholder handlers. All actions must validate input with Zod, enforce user ownership via Better Auth session, and return data matching the `Note` type from `src/lib/types.ts`.

## Dependencies

**Depends on:** task-01-schema.md, task-02-types.md
**Blocks:** task-07-embeddings.md, task-09-graph.md, task-11-dashboard.md, task-12-notes-ui.md

**Context from dependencies:** task-01 creates the `notes`, `tags`, `note_tags` tables in PostgreSQL. task-02 creates the `Note` type, `NoteTag` type, and Zod schemas (`createNoteSchema`, `updateNoteSchema`, `deleteNoteSchema`) in `src/lib/types.ts` and `src/lib/validations.ts`. The Drizzle client is at `src/lib/db.ts` exporting `db`. Auth session is obtained via `src/lib/auth.ts` exporting `auth` with `auth.api.getSession()`.

## Files to Create

- `src/lib/actions/notes.ts` — All note server actions

## Files to Modify

None

## Technical Details

### Implementation Steps

1. Create `src/lib/actions/notes.ts` with these server actions:

```typescript
"use server";

import { eq, and, desc, sql, or, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import { notes, noteTags, tags } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { createNoteSchema, updateNoteSchema, deleteNoteSchema } from "@/lib/validations";
import type { Note, NoteTag } from "@/lib/types";
import { headers } from "next/headers";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function generateExcerpt(content: string): string {
  const plain = content.replace(/[#*`>\-\[\]()!]/g, "").trim();
  return plain.slice(0, 200) + (plain.length > 200 ? "..." : "");
}
```

2. **getNotes action:**
```typescript
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

  let query = db.select({
    id: notes.id,
    title: notes.title,
    content: notes.content,
    excerpt: notes.excerpt,
    importance: notes.importance,
    updatedAt: notes.updatedAt,
  }).from(notes).where(eq(notes.userId, userId));

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
```

3. **getNoteById action:**
```typescript
export async function getNoteById(id: string) {
  const session = await getSession();
  const result = await db.select().from(notes).where(
    and(eq(notes.id, id), eq(notes.userId, session.user.id))
  ).limit(1);
  
  if (result.length === 0) return null;
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
    importance: note.importance,
  } satisfies Note;
}
```

4. **createNote action:**
```typescript
export async function createNote(input: {
  title: string;
  content: string;
  tags?: string[];
  importance?: number;
}) {
  const session = await getSession();
  const validated = createNoteSchema.parse(input);
  const excerpt = generateExcerpt(validated.content);

  const [note] = await db.insert(notes).values({
    userId: session.user.id,
    title: validated.title,
    content: validated.content,
    excerpt,
    importance: validated.importance ?? 3,
  }).returning();

  if (validated.tags && validated.tags.length > 0) {
    for (const tagName of validated.tags) {
      const existingTag = await db.select().from(tags).where(
        and(eq(tags.userId, session.user.id), eq(tags.name, tagName))
      ).limit(1);
      
      let tagId: string;
      if (existingTag.length > 0) {
        tagId = existingTag[0].id;
      } else {
        const [newTag] = await db.insert(tags).values({
          userId: session.user.id,
          name: tagName,
          color: "cyan",
        }).returning();
        tagId = newTag.id;
      }
      
      await db.insert(noteTags).values({ noteId: note.id, tagId });
    }
  }

  return getNoteById(note.id);
}
```

5. **updateNote action:**
```typescript
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

  if (Object.keys(updates).length > 0) {
    await db.update(notes).set(updates).where(
      and(eq(notes.id, validated.id), eq(notes.userId, session.user.id))
    );
  }

  if (validated.tags !== undefined) {
    await db.delete(noteTags).where(eq(noteTags.noteId, validated.id));
    for (const tagName of validated.tags) {
      const existingTag = await db.select().from(tags).where(
        and(eq(tags.userId, session.user.id), eq(tags.name, tagName))
      ).limit(1);
      
      let tagId: string;
      if (existingTag.length > 0) {
        tagId = existingTag[0].id;
      } else {
        const [newTag] = await db.insert(tags).values({
          userId: session.user.id,
          name: tagName,
          color: "cyan",
        }).returning();
        tagId = newTag.id;
      }
      await db.insert(noteTags).values({ noteId: validated.id, tagId });
    }
  }

  return getNoteById(validated.id);
}
```

6. **deleteNote action:**
```typescript
export async function deleteNote(id: string) {
  const session = await getSession();
  const validated = deleteNoteSchema.parse({ id });
  
  await db.delete(notes).where(
    and(eq(notes.id, validated.id), eq(notes.userId, session.user.id))
  );
  return { success: true };
}
```

7. **getNoteCount action (for dashboard stats):**
```typescript
export async function getNoteCount() {
  const session = await getSession();
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(notes).where(eq(notes.userId, session.user.id));
  return result[0].count;
}
```

### Important Notes

- ALL server actions must call `getSession()` first to verify authentication
- ALL mutations must validate input with Zod schemas before database operations
- The `createNote` and `updateNote` actions auto-create tags if they don't exist (matching UI behavior where tags are typed as strings)
- `generateExcerpt` strips markdown syntax and takes first 200 chars
- `connections` field is hardcoded to 0 for now — will be populated by graph data layer (task-09)
- Use `"use server";` at top of file — this is required for Next.js Server Actions
- The `sql` import from drizzle-orm is needed for raw SQL expressions like `count(*)`

## Acceptance Criteria

- [ ] All 6 server actions compile without errors
- [ ] `getNotes()` returns notes matching the `Note` type with tags included
- [ ] `getNoteById()` returns null for non-existent or non-owned notes
- [ ] `createNote()` creates note with auto-generated excerpt and auto-creates tags
- [ ] `updateNote()` updates fields and syncs tags (add/remove)
- [ ] `deleteNote()` removes note and cascades to note_tags
- [ ] `getNoteCount()` returns integer count
- [ ] All actions enforce user ownership (cannot access other users' notes)
- [ ] All mutations validate input with Zod schemas
