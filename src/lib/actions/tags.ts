"use server";

import { headers } from "next/headers";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tags } from "@/lib/schema";
import type { Tag } from "@/lib/types";
import { createTagSchema, updateTagSchema, deleteTagSchema } from "@/lib/validations";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/**
 * Fetch all tags for the authenticated user with computed usage counts.
 * Supports optional sorting by name, usage count, or creation date.
 */
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

/**
 * Create a new tag for the authenticated user.
 * Enforces unique tag names per user.
 */
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

  if (!tag) {
    throw new Error("Failed to create tag");
  }

  return {
    id: tag.id,
    name: tag.name,
    color: tag.color as Tag["color"],
    usageCount: 0,
    createdAt: new Date(tag.createdAt),
  } satisfies Tag;
}

/**
 * Update an existing tag for the authenticated user.
 * Only updates provided fields (name and/or color).
 */
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
      id: tags.id,
      name: tags.name,
      color: tags.color,
      createdAt: tags.createdAt,
      usageCount: sql<number>`(SELECT COUNT(*) FROM note_tags WHERE note_tags.tag_id = ${tags.id})`,
    })
    .from(tags)
    .where(eq(tags.id, validated.id))
    .limit(1);

  const tag = result[0];
  if (!tag) {
    throw new Error("Tag not found");
  }

  return {
    id: validated.id,
    name: tag.name,
    color: tag.color as Tag["color"],
    createdAt: new Date(tag.createdAt),
    usageCount: Number(tag.usageCount),
  } satisfies Tag;
}

/**
 * Delete a tag for the authenticated user.
 * Cascades to remove note_tags associations via database foreign key constraint.
 */
export async function deleteTag(id: string) {
  const session = await getSession();
  const validated = deleteTagSchema.parse({ id });

  await db.delete(tags).where(and(eq(tags.id, validated.id), eq(tags.userId, session.user.id)));
  return { success: true };
}

/**
 * Delete multiple tags for the authenticated user in a single operation.
 * Cascades to remove note_tags associations via database foreign key constraints.
 */
export async function bulkDeleteTags(ids: string[]) {
  const session = await getSession();

  for (const id of ids) {
    await db.delete(tags).where(and(eq(tags.id, id), eq(tags.userId, session.user.id)));
  }
  return { success: true, deletedCount: ids.length };
}
