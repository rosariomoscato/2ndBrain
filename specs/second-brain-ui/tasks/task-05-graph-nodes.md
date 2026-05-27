# Task 05: Graph Nodes & Edges

## Status

complete

## Wave

3

## Description

Create custom graph node and edge components with cyberpunk styling. Custom nodes replace React Flow default nodes and include glow effects, inner shadows, and metadata displays. Custom edges use animated gradient strokes and handle hover interactions. This task brings the cyberpunk aesthetic to the knowledge graph visualization.

## Dependencies

**Depends on:** task-01-foundation, task-04-graph
**Blocks:** task-06-graph-camera, task-07-graph-panels

**Context from dependencies:** task-01 provides design tokens (neon colors, glow effects). task-04 initializes GraphCanvas with React Flow and default nodes - this task replaces default nodes with custom components.

## Files to Create

- `src/components/graph/graph-node.tsx` — Custom node component with cyberpunk styling
- `src/components/graph/graph-edge.tsx` — Custom edge component with animated strokes

## Files to Modify

- `src/components/graph/graph-canvas.tsx` — Update to use custom node and edge types
- `src/app/globals.css` — Add custom node/edge CSS overrides

## Technical Details

### Implementation Steps

1. Create src/components/graph/graph-node.tsx:

```typescript
import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Clock, Tag, FileText, Link as LinkIcon } from "lucide-react";
import { NeonBadge } from "@/components/ui/neon-badge";

interface NodeData {
  label: string;
  type?: "note" | "concept" | "tag" | "reference";
  tags?: string[];
  updatedAt?: string;
  connections?: number;
  importance?: number; // 1-5
}

export const GraphNode = memo(({ data, selected }: NodeProps<NodeData>) => {
  const nodeType = data.type || "concept";
  const importance = data.importance || 3;

  // Border color based on node type
  const borderColor = {
    note: "border-neon-cyan",
    concept: "border-neon-purple",
    tag: "border-neon-blue",
    reference: "border-neon-pink",
  }[nodeType];

  // Icon based on node type
  const Icon = {
    note: FileText,
    concept: LinkIcon,
    tag: Tag,
    reference: FileText,
  }[nodeType];

  return (
    <div
      className={`
        relative px-4 py-3 rounded-xl
        bg-glass-surface backdrop-blur-md
        border-2 ${borderColor}
        ${selected ? "glow-border scale-105" : ""}
        transition-all duration-200
        min-w-[200px] max-w-[280px]
      `}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-neon-cyan border-2 border-space-black"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-neon-purple border-2 border-space-black"
      />

      {/* Node Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Icon className="h-4 w-4 text-neon-cyan flex-shrink-0" />
          <h3
            className={`
              text-sm font-bold font-display tracking-tight
              ${selected ? "text-neon-cyan glow-text" : "text-text-primary"}
              line-clamp-2
            `}
          >
            {data.label}
          </h3>
        </div>
        {/* Importance Indicator */}
        <div className="flex gap-0.5 flex-shrink-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-4 rounded-full ${
                i < importance
                  ? "bg-neon-purple"
                  : "bg-glass-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Node Metadata */}
      <div className="space-y-1.5">
        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.tags.slice(0, 3).map((tag) => (
              <NeonBadge key={tag} variant="cyan" className="text-[10px] px-1.5 py-0.5">
                {tag}
              </NeonBadge>
            ))}
            {data.tags.length > 3 && (
              <span className="text-[10px] text-text-dim">+{data.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-3 text-[10px] text-text-dim">
          {data.connections !== undefined && (
            <div className="flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              {data.connections}
            </div>
          )}
          {data.updatedAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {data.updatedAt}
            </div>
          )}
        </div>
      </div>

      {/* Inner Glow for Selected */}
      {selected && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, var(--color-neon-cyan / 0.1), transparent)",
          }}
        />
      )}
    </div>
  );
});

GraphNode.displayName = "GraphNode";
```

2. Create src/components/graph/graph-edge.tsx:

```typescript
import { memo } from "react";
import { EdgeProps, getBezierPath } from "@xyflow/react";

export const GraphEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  animated = true,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Animated gradient edge */}
      <path
        id={id}
        style={{
          stroke: selected ? "var(--color-neon-cyan)" : "var(--color-neon-purple)",
          strokeWidth: selected ? 3 : 2,
          fill: "none",
          ...style,
        }}
        className={`
          ${animated ? "animate-pulse" : ""}
          ${selected ? "glow-text" : ""}
        `}
        d={edgePath}
      />

      {/* Glowing effect overlay */}
      {selected && (
        <path
          style={{
            stroke: "var(--color-neon-cyan)",
            strokeWidth: 6,
            fill: "none",
            opacity: 0.3,
            filter: "blur(4px)",
          }}
          d={edgePath}
        />
      )}

      {/* Arrow marker */}
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="10"
          markerHeight="10"
          refX="10"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,10 L10,5 z"
            fill={selected ? "var(--color-neon-cyan)" : "var(--color-neon-purple)"}
          />
        </marker>
      </defs>
    </>
  );
});

GraphEdge.displayName = "GraphEdge";
```

3. Update src/components/graph/graph-canvas.tsx to use custom node/edge types:

```typescript
import { GraphNode } from "./graph-node";
import { GraphEdge } from "./graph-edge";

// Update mock nodes to use custom data
const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: "cyberNode", // Custom type name
    position: { x: 250, y: 0 },
    data: {
      label: "Main Concept",
      type: "concept",
      tags: ["AI", "ML"],
      connections: 2,
      importance: 5,
      updatedAt: "2h ago",
    },
  },
  {
    id: "2",
    type: "cyberNode",
    position: { x: 100, y: 100 },
    data: {
      label: "Transformers Architecture",
      type: "note",
      tags: ["Deep Learning", "NLP"],
      connections: 3,
      importance: 4,
      updatedAt: "5h ago",
    },
  },
  {
    id: "3",
    type: "cyberNode",
    position: { x: 400, y: 100 },
    data: {
      label: "Attention Mechanism",
      type: "concept",
      tags: ["NLP"],
      connections: 1,
      importance: 5,
      updatedAt: "1d ago",
    },
  },
];

// Update edge types
const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "cyberEdge", // Custom type name
    animated: true,
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "cyberEdge",
    animated: true,
  },
];

// Register custom node and edge types
const nodeTypes = {
  cyberNode: GraphNode,
};

const edgeTypes = {
  cyberEdge: GraphEdge,
};

export function GraphCanvas() {
  // ... existing code ...

  return (
    <div className="w-full h-full relative blueprint-surface">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: "cyberEdge",
          animated: true,
        }}
        // ... rest of config
      >
        {/* ... existing components ... */}
      </ReactFlow>
    </div>
  );
}
```

4. Add custom node/edge CSS to src/app/globals.css:

```css
/* Custom Node Styles */
.react-flow__node-cyberNode {
  /* Default styles applied via component props */
}

/* Custom Edge Styles */
.react-flow__edge-path {
  stroke-linecap: round;
  transition: stroke-width 0.2s, stroke 0.2s;
}

/* Edge hover effect */
.react-flow__edge:hover .react-flow__edge-path {
  stroke-width: 3px;
  filter: drop-shadow(0 0 5px var(--color-neon-cyan));
}

/* Node hover effect */
.react-flow__node:hover {
  transform: scale(1.05);
}

/* Handle styles override */
.react-flow__handle {
  transition: all 0.2s;
}

.react-flow__handle:hover {
  transform: scale(1.2);
  box-shadow: 0 0 10px var(--color-neon-cyan);
}

/* Edge label background (if using edge labels) */
.react-flow__edge-label {
  background: var(--color-glass-surface);
  border: 1px solid var(--color-glass-border);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 10px;
  font-family: var(--font-tech);
  color: var(--color-neon-cyan);
}
```

### Code Snippets

Node data interface:
```typescript
interface NodeData {
  label: string;
  type?: "note" | "concept" | "tag" | "reference";
  tags?: string[];
  updatedAt?: string;
  connections?: number;
  importance?: number; // 1-5
}
```

Registering custom types:
```typescript
const nodeTypes = {
  cyberNode: GraphNode,
};

const edgeTypes = {
  cyberEdge: GraphEdge,
};

<ReactFlow
  nodeTypes={nodeTypes}
  edgeTypes={edgeTypes}
  // ...
>
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] GraphNode component created with cyberpunk styling
- [ ] GraphNode supports 4 node types (note, concept, tag, reference)
- [ ] GraphNode displays icon based on node type
- [ ] GraphNode shows label with truncate (line-clamp-2)
- [ ] GraphNode displays tags (max 3 visible, show +X for more)
- [ ] GraphNode shows stats (connections, updated at)
- [ ] GraphNode displays importance indicator (1-5 bars)
- [ ] GraphNode has connection handles (top/bottom)
- [ ] GraphNode uses glass-panel styling with type-specific border color
- [ ] GraphNode has glow effect when selected
- [ ] GraphNode scales to 105% on hover
- [ ] GraphEdge component created with animated gradient stroke
- [ ] GraphEdge uses bezier path for smooth curves
- [ ] GraphEdge has arrow marker at end
- [ ] GraphEdge uses neon purple by default, cyan when selected
- [ ] GraphEdge has glow overlay when selected
- [ ] GraphEdge supports animated pulse effect
- [ ] GraphCanvas updated to use custom node/edge types
- [ ] Mock nodes include proper NodeData interface
- [ ] Mock edges use cyberEdge type
- [ ] CSS overrides added for custom node/edge styling
- [ ] Handles have hover effect with scale and glow
- [ ] Edges increase stroke width on hover
- [ ] Node min-width 200px, max-width 280px

## Notes

- Node types determine border color and icon
- Importance displayed as 5 vertical bars (filled = important)
- Tags use NeonBadge component with cyan variant
- Edges use bezier curves for smooth path routing
- Arrow marker defined in SVG defs with unique ID per edge
- Selected state adds glow effect and scale transform
- Animated edges use CSS animate-pulse for flowing effect
- Hover states use CSS transforms for performance
- Handle positions are fixed (top/bottom) for consistent connections
- Node uses backdrop-blur for glassmorphism effect
- Edges use stroke-linecap: round for softer ends
- Custom types registered in nodeTypes and edgeTypes objects
- Component wrapped in memo() for performance optimization
- Selected state adds inner radial gradient for glow effect
- Stats row shows icons (Link, Clock) for visual clarity
- Tags limited to 3 displayed to prevent overflow
- Connections count shows total node degree