"use server";

import { headers } from "next/headers";
import { eq, and, sql, or } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { graphNodes, graphEdges, notes, noteTags, tags } from "@/lib/schema";
import type { Node, Edge } from "@xyflow/react";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/**
 * Retrieves all graph nodes and edges for a user, formatted for React Flow.
 * Includes node data with tags, connection counts, and metadata.
 */
export async function getGraphData(): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const session = await getSession();

  const nodes = await db.select().from(graphNodes)
    .where(eq(graphNodes.userId, session.user.id));

  const edges = await db.select().from(graphEdges)
    .where(eq(graphEdges.userId, session.user.id));

  const nodeIds = nodes.map(n => n.id);

  const tagRows = nodeIds.length > 0 ? await db.select({
    nodeId: graphNodes.id,
    tagName: tags.name,
  })
  .from(graphNodes)
  .leftJoin(notes, eq(graphNodes.noteId, notes.id))
  .leftJoin(noteTags, eq(notes.id, noteTags.noteId))
  .leftJoin(tags, eq(noteTags.tagId, tags.id))
  .where(eq(graphNodes.userId, session.user.id)) : [];

  const nodeTagMap = new Map<string, string[]>();
  for (const t of tagRows) {
    if (t.tagName) {
      const arr = nodeTagMap.get(t.nodeId) ?? [];
      arr.push(t.tagName);
      nodeTagMap.set(t.nodeId, arr);
    }
  }

  const connectionCounts = await db.select({
    nodeId: graphNodes.id,
    count: sql<number>`(
      SELECT COUNT(*) FROM graph_edges
      WHERE graph_edges.source_id = ${graphNodes.id} OR graph_edges.target_id = ${graphNodes.id}
    )`,
  }).from(graphNodes).where(eq(graphNodes.userId, session.user.id));

  const connMap = new Map(connectionCounts.map(c => [c.nodeId, Number(c.count)]));

  const reactFlowNodes: Node[] = nodes.map(n => ({
    id: n.id,
    type: "cyberNode",
    position: { x: n.positionX ?? Math.random() * 800, y: n.positionY ?? Math.random() * 600 },
    data: {
      label: n.label,
      type: n.type,
      tags: nodeTagMap.get(n.id) ?? [],
      updatedAt: n.updatedAt.toISOString(),
      connections: connMap.get(n.id) ?? 0,
      importance: n.importance,
    },
  }));

  const reactFlowEdges: Edge[] = edges.map(e => ({
    id: e.id,
    source: e.sourceId,
    target: e.targetId,
    type: "cyberEdge",
    animated: true,
    data: { edgeType: e.type ?? "tag" },
  }));

  return { nodes: reactFlowNodes, edges: reactFlowEdges };
}

/**
 * Creates a graph node for a note. Called automatically when a note is created.
 * Checks if a node already exists for the note to prevent duplicates.
 */
export async function createNodeForNote(noteId: string, title: string, userId: string) {
  const existing = await db.select().from(graphNodes)
    .where(and(eq(graphNodes.noteId, noteId), eq(graphNodes.userId, userId)))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [node] = await db.insert(graphNodes).values({
    userId,
    noteId,
    label: title,
    type: "note",
    importance: 3,
    positionX: Math.floor(Math.random() * 800),
    positionY: Math.floor(Math.random() * 600),
  }).returning();

  await autoConnectNotesByTags(userId).catch(console.error);

  return node;
}

/**
 * Updates the position of a graph node after dragging.
 * Persists the new X and Y coordinates to the database.
 */
export async function updateNodePosition(nodeId: string, x: number, y: number) {
  const session = await getSession();
  await db.update(graphNodes).set({ positionX: x, positionY: y })
    .where(and(eq(graphNodes.id, nodeId), eq(graphNodes.userId, session.user.id)));
  return { success: true };
}

/**
 * Creates an edge between two nodes in the knowledge graph.
 * Prevents duplicate edges by checking both directions (source->target and target->source).
 */
export async function createEdge(sourceId: string, targetId: string) {
  const session = await getSession();

  const existing = await db.select().from(graphEdges).where(
    and(
      eq(graphEdges.userId, session.user.id),
      or(
        and(eq(graphEdges.sourceId, sourceId), eq(graphEdges.targetId, targetId)),
        and(eq(graphEdges.sourceId, targetId), eq(graphEdges.targetId, sourceId)),
      )
    )
  ).limit(1);

  if (existing.length > 0) return existing[0];

  const [edge] = await db.insert(graphEdges).values({
    userId: session.user.id,
    sourceId,
    targetId,
  }).returning();

  return edge;
}

/**
 * Deletes an edge from the knowledge graph.
 * Only allows deletion of edges belonging to the current user.
 */
export async function deleteEdge(edgeId: string) {
  const session = await getSession();
  await db.delete(graphEdges).where(
    and(eq(graphEdges.id, edgeId), eq(graphEdges.userId, session.user.id))
  );
  return { success: true };
}

/**
 * Returns the total count of graph nodes for the current user.
 * Used for dashboard statistics.
 */
export async function getNodeCount() {
  const session = await getSession();
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(graphNodes).where(eq(graphNodes.userId, session.user.id));
  return result[0]?.count ?? 0;
}

/**
 * Returns the total count of graph edges for the current user.
 * Used for dashboard statistics.
 */
export async function getEdgeCount() {
  const session = await getSession();
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(graphEdges).where(eq(graphEdges.userId, session.user.id));
  return result[0]?.count ?? 0;
}

/**
 * Auto-generates edges between notes that share tags.
 * Called after a note is created/updated to keep the graph connected.
 */
export async function autoConnectNotesByTags(userId: string) {
  const userNodes = await db.select().from(graphNodes)
    .where(eq(graphNodes.userId, userId));

  if (userNodes.length < 2) return;

  for (let i = 0; i < userNodes.length; i++) {
    for (let j = i + 1; j < userNodes.length; j++) {
      const nodeA = userNodes[i];
      const nodeB = userNodes[j];

      if (!nodeA.noteId || !nodeB.noteId) continue;

      const existing = await db.select().from(graphEdges).where(
        and(
          eq(graphEdges.userId, userId),
          or(
            and(eq(graphEdges.sourceId, nodeA.id), eq(graphEdges.targetId, nodeB.id)),
            and(eq(graphEdges.sourceId, nodeB.id), eq(graphEdges.targetId, nodeA.id)),
          )
        )
      ).limit(1);

      if (existing.length > 0) continue;

      let shouldConnect = false;

      const tagsA = await db.select({ tagId: noteTags.tagId })
        .from(noteTags).where(eq(noteTags.noteId, nodeA.noteId));
      const tagsB = await db.select({ tagId: noteTags.tagId })
        .from(noteTags).where(eq(noteTags.noteId, nodeB.noteId));

      const sharedTags = tagsA.filter(t => tagsB.some(b => b.tagId === t.tagId));
      if (sharedTags.length > 0) shouldConnect = true;

      if (!shouldConnect) {
        const [noteA] = await db.select({ content: notes.content })
          .from(notes).where(eq(notes.id, nodeA.noteId)).limit(1);
        const [noteB] = await db.select({ content: notes.content })
          .from(notes).where(eq(notes.id, nodeB.noteId)).limit(1);

        if (noteA?.content && noteB?.content) {
          const keywords = ["react", "component", "typescript", "javascript", "server",
            "database", "search", "api", "type", "session", "postgres",
            "authentication", "routing", "caching", "embedding", "vector"];
          const sharedKeywords = keywords.filter(kw =>
            noteA.content.toLowerCase().includes(kw) && noteB.content.toLowerCase().includes(kw)
          );
          if (sharedKeywords.length >= 2) shouldConnect = true;
        }
      }

      if (shouldConnect) {
        await db.insert(graphEdges).values({
          userId,
          sourceId: nodeA.id,
          targetId: nodeB.id,
          type: sharedTags.length > 0 ? "tag" : "semantic",
        });
      }
    }
  }
}