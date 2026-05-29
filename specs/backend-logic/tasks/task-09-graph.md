# Task 09: Graph Data Layer

## Status

complete

## Wave

3

## Description

Implement server actions for the knowledge graph data layer. This provides CRUD operations for graph nodes and edges, plus a `getGraphData` action that returns all nodes and edges for a user formatted for React Flow. Initially, nodes are created when notes are created (one node per note). Edges represent connections between concepts.

## Dependencies

**Depends on:** task-01-schema.md, task-04-notes.md
**Blocks:** task-10-graphify.md, task-14-graph-ui.md

**Context from dependencies:** task-01 creates `graph_nodes` and `graph_edges` tables. task-04 creates notes server actions. The graph UI (graph-canvas.tsx) expects React Flow `Node` objects with `NodeData` type: `{ label, type, tags, updatedAt, connections, importance }`. The graph-edge.tsx expects edges with `animated` and `style` properties.

## Files to Create

- `src/lib/actions/graph.ts` — Graph data server actions

## Files to Modify

- `src/lib/actions/notes.ts` — Auto-create graph node when note is created

## Technical Details

### Implementation Steps

1. Create `src/lib/actions/graph.ts`:

```typescript
"use server";

import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { graphNodes, graphEdges, notes, noteTags, tags } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}
```

2. **getGraphData action** (returns React Flow formatted data):

```typescript
export async function getGraphData() {
  const session = await getSession();

  const nodes = await db.select().from(graphNodes).where(eq(graphNodes.userId, session.user.id));

  const edges = await db.select().from(graphEdges).where(eq(graphEdges.userId, session.user.id));

  const nodeIds = nodes.map((n) => n.id);

  const tagRows =
    nodeIds.length > 0
      ? await db
          .select({
            nodeId: graphNodes.id,
            tagName: tags.name,
          })
          .from(graphNodes)
          .leftJoin(notes, eq(graphNodes.noteId, notes.id))
          .leftJoin(noteTags, eq(notes.id, noteTags.noteId))
          .leftJoin(tags, eq(noteTags.tagId, tags.id))
          .where(eq(graphNodes.userId, session.user.id))
      : [];

  const nodeTagMap = new Map<string, string[]>();
  for (const t of tagRows) {
    if (t.tagName) {
      const arr = nodeTagMap.get(t.nodeId) ?? [];
      arr.push(t.tagName);
      nodeTagMap.set(t.nodeId, arr);
    }
  }

  const connectionCounts = await db
    .select({
      nodeId: graphNodes.id,
      count: sql<number>`(
      SELECT COUNT(*) FROM graph_edges 
      WHERE graph_edges.source_id = ${graphNodes.id} OR graph_edges.target_id = ${graphNodes.id}
    )`,
    })
    .from(graphNodes)
    .where(eq(graphNodes.userId, session.user.id));

  const connMap = new Map(connectionCounts.map((c) => [c.nodeId, Number(c.count)]));

  const reactFlowNodes = nodes.map((n) => ({
    id: n.id,
    type: "cyber",
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

  const reactFlowEdges = edges.map((e) => ({
    id: e.id,
    source: e.sourceId,
    target: e.targetId,
    animated: true,
    style: { stroke: "url(#edge-gradient)" },
  }));

  return { nodes: reactFlowNodes, edges: reactFlowEdges };
}
```

3. **createNodeForNote action** (auto-called when note is created):

```typescript
export async function createNodeForNote(noteId: string, title: string, userId: string) {
  const existing = await db
    .select()
    .from(graphNodes)
    .where(and(eq(graphNodes.noteId, noteId), eq(graphNodes.userId, userId)))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [node] = await db
    .insert(graphNodes)
    .values({
      userId,
      noteId,
      label: title,
      type: "note",
      importance: 3,
      positionX: Math.floor(Math.random() * 800),
      positionY: Math.floor(Math.random() * 600),
    })
    .returning();

  return node;
}
```

4. **updateNodePosition action:**

```typescript
export async function updateNodePosition(nodeId: string, x: number, y: number) {
  const session = await getSession();
  await db
    .update(graphNodes)
    .set({ positionX: x, positionY: y })
    .where(and(eq(graphNodes.id, nodeId), eq(graphNodes.userId, session.user.id)));
  return { success: true };
}
```

5. **createEdge action:**

```typescript
export async function createEdge(sourceId: string, targetId: string) {
  const session = await getSession();

  const existing = await db
    .select()
    .from(graphEdges)
    .where(
      and(
        eq(graphEdges.userId, session.user.id),
        or(
          and(eq(graphEdges.sourceId, sourceId), eq(graphEdges.targetId, targetId)),
          and(eq(graphEdges.sourceId, targetId), eq(graphEdges.targetId, sourceId))
        )
      )
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [edge] = await db
    .insert(graphEdges)
    .values({
      userId: session.user.id,
      sourceId,
      targetId,
    })
    .returning();

  return edge;
}
```

Add `import { or } from "drizzle-orm";`

6. **deleteEdge action:**

```typescript
export async function deleteEdge(edgeId: string) {
  const session = await getSession();
  await db
    .delete(graphEdges)
    .where(and(eq(graphEdges.id, edgeId), eq(graphEdges.userId, session.user.id)));
  return { success: true };
}
```

7. **getNodeCount and getEdgeCount** (for dashboard):

```typescript
export async function getNodeCount() {
  const session = await getSession();
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(graphNodes)
    .where(eq(graphNodes.userId, session.user.id));
  return result[0].count;
}

export async function getEdgeCount() {
  const session = await getSession();
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(graphEdges)
    .where(eq(graphEdges.userId, session.user.id));
  return result[0].count;
}
```

8. Modify `src/lib/actions/notes.ts`:

- Import `createNodeForNote` from `@/lib/actions/graph`
- In `createNote`, after the note insert: `await createNodeForNote(note.id, validated.title, session.user.id).catch(console.error);`
- In `updateNote`, after the update: if title changed, update graph node label too

### Notes

- Graph nodes are auto-created for each note but can also exist without a note (for concepts, tags, references)
- Position is randomized on creation — users can drag to reposition (persisted via updateNodePosition)
- Duplicate edges are prevented (checks both directions)
- The getGraphData response format matches React Flow's expected Node/Edge types

## Acceptance Criteria

- [ ] `getGraphData()` returns React Flow formatted nodes and edges
- [ ] `createNodeForNote()` auto-creates node when note is created
- [ ] `updateNodePosition()` persists drag positions
- [ ] `createEdge()` prevents duplicates (both directions)
- [ ] `deleteEdge()` removes edge
- [ ] `getNodeCount()` and `getEdgeCount()` return correct counts
- [ ] Node data includes tags, connections count, and importance
