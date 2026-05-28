# Task 10: Graphify Auto-Extract

## Status

pending

## Wave

4

## Description

Integrate Graphify CLI to automatically extract knowledge graph structure from notes. After notes are created/updated, the system can run Graphify to discover concepts, relationships, and cross-references between notes, then sync the extracted graph data into the graph_nodes and graph_edges tables. This creates a richer, AI-generated knowledge graph beyond the simple one-node-per-note default.

## Dependencies

**Depends on:** task-09-graph.md
**Blocks:** task-11-dashboard.md

**Context from dependencies:** task-09 creates the graph data layer with `getGraphData()`, `createNodeForNote()`, `createEdge()`. The graph_nodes and graph_edges tables store the knowledge graph. Graphify CLI is installed via opencode skills. Running `graphify update .` extracts AST-based relationships from code files and generates `graphify-out/graph.json`.

## Files to Create

- `src/lib/graphify.ts` — Graphify runner and graph sync utilities
- `src/lib/actions/graphify-sync.ts` — Server action to trigger Graphify and sync results

## Files to Modify

None

## Technical Details

### Implementation Steps

1. Create `src/lib/graphify.ts`:

```typescript
import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface GraphifyNode {
  id: string;
  label: string;
  type: string;
  filePath?: string;
  connections?: number;
}

interface GraphifyEdge {
  source: string;
  target: string;
  label?: string;
}

interface GraphifyGraph {
  nodes: GraphifyNode[];
  edges: GraphifyEdge[];
}

export function runGraphify(projectRoot: string): void {
  try {
    execSync("graphify update .", {
      cwd: projectRoot,
      timeout: 60000,
      stdio: "pipe",
    });
  } catch (error) {
    console.error("Graphify execution failed:", error);
    throw new Error("Graphify extraction failed");
  }
}

export function readGraphifyOutput(projectRoot: string): GraphifyGraph | null {
  const graphPath = join(projectRoot, "graphify-out", "graph.json");
  if (!existsSync(graphPath)) return null;
  
  try {
    const raw = readFileSync(graphPath, "utf-8");
    return JSON.parse(raw) as GraphifyGraph;
  } catch {
    return null;
  }
}
```

2. Create `src/lib/actions/graphify-sync.ts`:

```typescript
"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { graphNodes, graphEdges } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { runGraphify, readGraphifyOutput } from "@/lib/graphify";
import { headers } from "next/headers";
import path from "path";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function syncGraphifyGraph() {
  const session = await getSession();
  
  const projectRoot = process.cwd();
  
  runGraphify(projectRoot);
  
  const graphData = readGraphifyOutput(projectRoot);
  if (!graphData) {
    return { success: false, message: "No graph data generated" };
  }

  for (const node of graphData.nodes) {
    const existing = await db.select().from(graphNodes)
      .where(and(eq(graphNodes.label, node.label), eq(graphNodes.userId, session.user.id)))
      .limit(1);
    
    if (existing.length === 0) {
      await db.insert(graphNodes).values({
        userId: session.user.id,
        label: node.label,
        type: node.type || "concept",
        importance: 3,
        positionX: Math.floor(Math.random() * 800),
        positionY: Math.floor(Math.random() * 600),
      });
    }
  }

  const allNodes = await db.select().from(graphNodes)
    .where(eq(graphNodes.userId, session.user.id));
  const labelToId = new Map(allNodes.map(n => [n.label, n.id]));

  for (const edge of graphData.edges) {
    const sourceId = labelToId.get(edge.source);
    const targetId = labelToId.get(edge.target);
    
    if (!sourceId || !targetId) continue;
    
    const existing = await db.select().from(graphEdges).where(
      and(
        eq(graphEdges.userId, session.user.id),
        eq(graphEdges.sourceId, sourceId),
        eq(graphEdges.targetId, targetId),
      )
    ).limit(1);
    
    if (existing.length === 0) {
      await db.insert(graphEdges).values({
        userId: session.user.id,
        sourceId,
        targetId,
      });
    }
  }

  return { 
    success: true, 
    nodesCreated: graphData.nodes.length,
    edgesCreated: graphData.edges.length,
  };
}
```

### Notes

- Graphify runs as a CLI command via `execSync` — it must be installed and available in PATH
- The sync is idempotent — running it multiple times won't create duplicate nodes/edges
- This is a manual trigger for now (could be automated on a schedule later)
- Graphify extracts from code files — for note-based extraction, the notes need to be in the project directory or Graphify needs to be configured to scan note content
- The graphify-out/ directory is generated by the CLI and should be in .gitignore

## Acceptance Criteria

- [ ] `runGraphify()` executes the CLI and generates graph.json
- [ ] `readGraphifyOutput()` parses the generated graph data
- [ ] `syncGraphifyGraph()` creates new nodes and edges from extracted data
- [ ] Sync is idempotent — no duplicates on repeated runs
- [ ] Error handling for Graphify CLI failures
