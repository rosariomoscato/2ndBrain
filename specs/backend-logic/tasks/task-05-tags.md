# Task 05: Tags Server Actions

## Status

complete

## Wave

2

## Description

Implement server actions for tags CRUD and usage count computation. The tag manager UI (tag-manager.tsx) currently uses 5 hardcoded tags with local state. These server actions provide create, read, update, delete, and bulk delete operations, with computed usageCount derived from the note_tags junction table.

## Dependencies

**Depends on:** task-01-schema.md, task-02-types.md
**Blocks:** task-14-graph-ui.md

**Context from dependencies:** task-01 creates the `tags` and `note_tags` tables. task-02 creates the `Tag` type (`{ id, name, color: TagColor, usageCount, createdAt }`) and Zod schemas (`createTagSchema`, `updateTagSchema`, `deleteTagSchema`). TagColor is `"purple" | "cyan" | "blue" | "pink" | "green" | "orange"`.

## Files to Create

- `src/lib/actions/tags.ts` — All tag server actions

## Files to Modify

None

## Technical Details

### Implementation Steps

1. Create `src/lib/actions/tags.ts`:

```typescript
"use server";

import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { tags, noteTags } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { createTagSchema, updateTagSchema, deleteTagSchema } from "@/lib/validations";
import type { Tag } from "@/lib/types";
import { headers } from "next/headers";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}
```

2. **getTags action:**

```typescript
export async function getTags(options?: { sortBy?: "name" | "usage" | "date" }) {
  const session = await getSession();
  const sortBy = options?.sortBy ?? "name";

  const result = await db
    .select({
      id: tags.id,
      name: tags.name,
      color: tags.color,
      createdAt: tags.createdAt,
      usageCount: sql<number>`(SELECT COUNT(*) FROM note_tags WHERE note_tags.tag_id = ${tags.id})`,
    })
    .from(tags)
    .where(eq(tags.userId, session.user.id));

  const tagList: Tag[] = result.map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color as Tag["color"],
    usageCount: Number(t.usageCount),
    createdAt: new Date(t.createdAt),
  }));

  switch (sortBy) {
    case "usage":
      return tagList.sort((a, b) => b.usageCount - a.usageCount);
    case "date":
      return tagList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    default:
      return tagList.sort((a, b) => a.name.localeCompare(b.name));
  }
}
```

3. **createTag action:**

```typescript
export async function createTag(input: { name: string; color: string }) {
  const session = await getSession();
  const validated = createTagSchema.parse(input);

  const existing = await db
    .select()
    .from(tags)
    .where(and(eq(tags.userId, session.user.id), eq(tags.name, validated.name)))
    .limit(1);

  if (existing.length > 0) {
    throw new Error(`Tag "${validated.name}" already exists`);
  }

  const [tag] = await db
    .insert(tags)
    .values({
      userId: session.user.id,
      name: validated.name,
      color: validated.color,
    })
    .returning();

  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
    usageCount: 0,
    createdAt: new Date(tag.createdAt),
  } satisfies Tag;
}
```

4. **updateTag action:**

```typescript
export async function updateTag(input: { id: string; name?: string; color?: string }) {
  const session = await getSession();
  const validated = updateTagSchema.parse(input);

  const updates: Record<string, string> = {};
  if (validated.name !== undefined) updates.name = validated.name;
  if (validated.color !== undefined) updates.color = validated.color;

  await db
    .update(tags)
    .set(updates)
    .where(and(eq(tags.id, validated.id), eq(tags.userId, session.user.id)));

  const result = await db
    .select({
      usageCount: sql<number>`(SELECT COUNT(*) FROM note_tags WHERE note_tags.tag_id = ${tags.id})`,
    })
    .from(tags)
    .where(eq(tags.id, validated.id))
    .limit(1);

  return { id: validated.id, ...updates, usageCount: Number(result[0]?.usageCount ?? 0) };
}
```

5. **deleteTag action:**

```typescript
export async function deleteTag(id: string) {
  const session = await getSession();
  const validated = deleteTagSchema.parse({ id });

  await db.delete(tags).where(and(eq(tags.id, validated.id), eq(tags.userId, session.user.id)));
  return { success: true };
}
```

6. **bulkDeleteTags action:**

```typescript
export async function bulkDeleteTags(ids: string[]) {
  const session = await getSession();

  for (const id of ids) {
    await db.delete(tags).where(and(eq(tags.id, id), eq(tags.userId, session.user.id)));
  }
  return { success: true, deletedCount: ids.length };
}
```

## Acceptance Criteria

- [ ] All 5 server actions compile without errors
- [ ] `getTags()` returns tags with computed usageCount from junction table
- [ ] `getTags({ sortBy: "usage" })` sorts by usage count descending
- [ ] `createTag()` prevents duplicate names per user
- [ ] `updateTag()` only updates provided fields
- [ ] `deleteTag()` cascades to remove note_tags associations
- [ ] `bulkDeleteTags()` removes multiple tags
- [ ] All actions enforce user ownership
