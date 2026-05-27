# Task 04: Knowledge Graph Canvas Initialization

## Status

complete

## Wave

2

## Description

Initialize the knowledge graph canvas using React Flow (`@xyflow/react`). Set up the basic flow structure, interactive canvas, controls (zoom, fit), and minimap. Configure the graph to use cyberpunk styling with a dark background and neon grid. Create placeholder mock data to verify the rendering engine works.

## Dependencies

**Depends on:** task-01-foundation
**Blocks:** task-05-graph-nodes, task-06-graph-camera

**Context from dependencies:** task-01-foundation provides the cyberpunk color tokens (--neon-cyan, --neon-purple, --space-black) and layout classes that the graph canvas will reference for styling.

## Files to Create

- `src/components/graph/graph-canvas.tsx` — React Flow canvas wrapper component

## Files to Modify

- `src/app/globals.css` — Add React Flow specific cyberpunk CSS overrides

## Technical Details

### Implementation Steps

1. Create src/components/graph/graph-canvas.tsx:

```typescript
"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Import custom node types (will be implemented in task-05)
// import { CyberNode } from "./graph-node";

// Mock data for initialization
const initialNodes: Node[] = [
  {
    id: "1",
    type: "default", // Use "cyberNode" type in task-05
    position: { x: 250, y: 0 },
    data: { label: "Main Concept" },
    style: {
      background: "rgba(15, 23, 42, 0.8)",
      border: "2px solid var(--color-neon-cyan)",
      borderRadius: "8px",
      color: "var(--color-text-primary)",
      padding: "10px",
    },
  },
  {
    id: "2",
    type: "default",
    position: { x: 100, y: 100 },
    data: { label: "Subtopic A" },
    style: {
      background: "rgba(15, 23, 42, 0.8)",
      border: "2px solid var(--color-neon-purple)",
      borderRadius: "8px",
      color: "var(--color-text-primary)",
      padding: "10px",
    },
  },
  {
    id: "3",
    type: "default",
    position: { x: 400, y: 100 },
    data: { label: "Subtopic B" },
    style: {
      background: "rgba(15, 23, 42, 0.8)",
      border: "2px solid var(--color-neon-blue)",
      borderRadius: "8px",
      color: "var(--color-text-primary)",
      padding: "10px",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    animated: true,
    style: { stroke: "var(--color-neon-cyan)", strokeWidth: 2 },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "smoothstep",
    animated: true,
    style: { stroke: "var(--color-neon-purple)", strokeWidth: 2 },
  },
];

export function GraphCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full relative blueprint-surface">
      {/* Background grid */}
      <div className="neon-grid absolute inset-0 pointer-events-none opacity-20" />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: { stroke: "var(--color-neon-cyan)", strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Cyberpunk Background */}
        <Background
          color="var(--color-neon-cyan)"
          gap={40}
          size={1}
          variant={BackgroundVariant.Dots}
        />

        {/* Cyberpunk Controls */}
        <Controls
          className="glass-panel border border-neon-cyan/30 !bg-glass-surface"
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />

        {/* Cyberpunk MiniMap */}
        <MiniMap
          nodeColor={() => "var(--color-neon-purple)"}
          nodeStrokeWidth={3}
          nodeStrokeColor="var(--color-neon-cyan)"
          maskColor="var(--color-space-black)"
          className="glass-panel border border-neon-purple/30"
        />
      </ReactFlow>
    </div>
  );
}
```

2. Add React Flow overrides to src/app/globals.css (append to end of file):

```css
/* React Flow Cyberpunk Overrides */

/* Hide default attribution as we use proOptions */
.react-flow__attribution {
  display: none !important;
}

/* Node Selection */
.react-flow__node.selected {
  box-shadow:
    0 0 10px var(--color-neon-cyan),
    0 0 20px var(--color-neon-purple);
  border-color: var(--color-neon-cyan) !important;
}

/* Edge Selection */
.react-flow__edge.selected .react-flow__edge-path {
  stroke: var(--color-neon-cyan) !important;
  stroke-width: 3 !important;
  filter: drop-shadow(0 0 5px var(--color-neon-cyan));
}

/* Handle Styles (Connection Points) */
.react-flow__handle {
  width: 10px;
  height: 10px;
  background: var(--color-neon-cyan);
  border: 2px solid var(--color-space-black);
}

.react-flow__handle-top {
  top: -6px;
}
.react-flow__handle-right {
  right: -6px;
}
.react-flow__handle-bottom {
  bottom: -6px;
}
.react-flow__handle-left {
  left: -6px;
}

/* Controls styling */
.react-flow__controls-button {
  background: var(--color-glass-surface) !important;
  border: 1px solid var(--color-glass-border) !important;
  fill: var(--color-neon-cyan) !important;
  transition: all 0.2s;
}

.react-flow__controls-button:hover {
  background: var(--color-glass-highlight) !important;
  transform: scale(1.1);
}

/* MiniMap styling */
.react-flow__minimap {
  background: var(--color-space-black) !important;
  border: 1px solid var(--color-neon-purple) !important;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.2);
}

/* Edge Paths */
.react-flow__edge-path {
  stroke: var(--color-neon-cyan);
  stroke-width: 2;
}

/* Selection Box */
.react-flow__selection {
  background: var(--color-neon-cyan / 0.1);
  border: 1px dashed var(--color-neon-cyan);
}
```

### Code Snippets

React Flow provider (use in parent if needed, usually layout handles it):
```typescript
// Wrap application or layout component
import { ReactFlowProvider } from "@xyflow/react";

function App() {
  return (
    <ReactFlowProvider>
      <GraphCanvas />
    </ReactFlowProvider>
  );
}
```

Node configuration:
```typescript
const node: Node = {
  id: "1",
  type: "customNodeType", // Defined in task-05
  position: { x: 0, y: 0 },
  data: { label: "Node Text" },
  style: { /* inline styles override defaults */ },
};
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] GraphCanvas component created with React Flow setup
- [ ] Component uses `useNodesState` and `useEdgesState` hooks
- [ ] Mock data includes 3 nodes and 2 edges
- [ ] Nodes are draggable and connectable
- [ ] Background component renders dots grid with neon cyan color
- [ ] Controls component is visible and styled with glass-panel
- [ ] MiniMap component is visible and styled with cyberpunk colors
- [ ] Edges are animated (dashed line flow)
- [ ] Graph fits to view on load
- [ ] CSS overrides added to globals.css for cyberpunk styling
- [ ] Selected nodes have neon glow effect
- [ ] Selected edges have glow and increased stroke width
- [ ] Snap to grid is enabled (15px grid)
- [ ] Default edge options set to smoothstep with animation
- [ ] Attribution is hidden (proOptions)

## Notes

- React Flow uses CSS variables defined in task-01 for styling
- This task initializes the canvas with default node types; custom nodes are task-05
- Background dots use neon-cyan color for cyberpunk aesthetic
- MiniMap uses neon-purple for node colors to differentiate from main graph
- Controls use glassmorphism styling from task-01
- Smoothstep edges provide clean path routing between nodes
- Animated edges simulate data flow in the knowledge graph
- Snap grid helps align nodes cleanly
- Canvas uses `blueprint-surface` class for base background styling
- `proOptions={{ hideAttribution: true }}` removes React Flow attribution
- Make sure to import `@xyflow/react/dist/style.css` for default styles to work
- Canvas height/width should be 100% of parent container
- Node positions use absolute coordinate system (pixels from top-left)