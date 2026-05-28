"use server";

/**
 * Graphify sync server actions.
 *
 * This module provides server actions to trigger Graphify extraction and
 * sync the results into the application's knowledge graph tables.
 */

import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { runGraphify, readGraphifyOutput } from "@/lib/graphify";
import { graphNodes, graphEdges } from "@/lib/schema";

/**
 * Gets the current authenticated user session.
 * Throws an error if no valid session exists.
 */
async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/**
 * Synchronizes Graphify-generated knowledge graph data into the database.
 *
 * This action:
 * 1. Runs the Graphify CLI to extract graph data from the project
 * 2. Reads the generated graph.json file
 * 3. Creates new nodes (concepts) that don't already exist
 * 4. Creates new edges (relationships) that don't already exist
 * 5. Returns statistics about what was created
 *
 * The sync is idempotent - running it multiple times won't create duplicates.
 * Nodes are matched by label within the user's scope.
 * Edges are matched by source and target node IDs within the user's scope.
 *
 * @returns Object with success status and counts of created nodes/edges
 */
export async function syncGraphifyGraph() {
  const session = await getSession();
  const projectRoot = process.cwd();

  // Step 1: Run Graphify to extract graph structure
  runGraphify(projectRoot);

  // Step 2: Read the generated graph data
  const graphData = readGraphifyOutput(projectRoot);
  if (!graphData) {
    return { success: false, message: "No graph data generated" };
  }

  // Step 3: Sync nodes (idempotent by label)
  let nodesCreated = 0;
  for (const node of graphData.nodes) {
    const existing = await db
      .select()
      .from(graphNodes)
      .where(
        and(
          eq(graphNodes.label, node.label),
          eq(graphNodes.userId, session.user.id)
        )
      )
      .limit(1);

    // Only create if node doesn't exist
    if (existing.length === 0) {
      await db.insert(graphNodes).values({
        userId: session.user.id,
        label: node.label,
        type: node.type || "concept",
        importance: 3,
        positionX: Math.floor(Math.random() * 800),
        positionY: Math.floor(Math.random() * 600),
      });
      nodesCreated++;
    }
  }

  // Step 4: Sync edges (idempotent by source/target)
  let edgesCreated = 0;

  // Get all node IDs mapped by label for edge lookup
  const allNodes = await db
    .select()
    .from(graphNodes)
    .where(eq(graphNodes.userId, session.user.id));
  const labelToId = new Map(allNodes.map((n) => [n.label, n.id]));

  for (const edge of graphData.edges) {
    const sourceId = labelToId.get(edge.source);
    const targetId = labelToId.get(edge.target);

    // Skip if either node doesn't exist
    if (!sourceId || !targetId) continue;

    const existing = await db
      .select()
      .from(graphEdges)
      .where(
        and(
          eq(graphEdges.userId, session.user.id),
          eq(graphEdges.sourceId, sourceId),
          eq(graphEdges.targetId, targetId)
        )
      )
      .limit(1);

    // Only create if edge doesn't exist
    if (existing.length === 0) {
      await db.insert(graphEdges).values({
        userId: session.user.id,
        sourceId,
        targetId,
      });
      edgesCreated++;
    }
  }

  return {
    success: true,
    nodesCreated,
    edgesCreated,
  };
}