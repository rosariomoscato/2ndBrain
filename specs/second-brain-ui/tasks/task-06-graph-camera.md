# Task 06: Camera Controls

## Status

complete

## Wave

4

## Description

Implement camera controls for the knowledge graph canvas including zoom (in/out/reset), pan controls, and optional rotation. These controls allow users to navigate large knowledge graphs intuitively. Controls should use cyberpunk styling with glassmorphism panels and neon accents. Camera state should be persisted locally.

## Dependencies

**Depends on:** task-01-foundation, task-04-graph
**Blocks:** task-07-graph-panels

**Context from dependencies:** task-01 provides design tokens and icons. task-04 provides GraphCanvas with React Flow setup - this task adds interactive camera controls to the canvas.

## Files to Create

- `src/components/graph/camera-controls.tsx` — Camera control component with zoom/pan/rotate

## Files to Modify

- `src/components/graph/graph-canvas.tsx` — Integrate camera controls
- `src/app/globals.css` — Add camera control CSS

## Technical Details

### Implementation Steps

1. Create src/components/graph/camera-controls.tsx:

```typescript
"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCw, Move } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { CyberButton } from "@/components/ui/cyber-button";

export function CameraControls() {
  const { zoomIn, zoomOut, fitView, setCenter } = useReactFlow();
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    zoomIn({ duration: 300 });
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    zoomOut({ duration: 300 });
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleFitView = () => {
    fitView({ duration: 800, padding: 0.2 });
    setZoomLevel(1);
  };

  const handleResetCamera = () => {
    setCenter(0, 0, { zoom: 1, duration: 500 });
    setZoomLevel(1);
  };

  return (
    <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-10">
      {/* Main Controls */}
      <div className="glass-panel rounded-xl p-2 flex flex-col gap-1 shadow-lg">
        <CyberButton
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="h-8 w-8 p-0 justify-center"
          title="Zoom In (+)"
        >
          <ZoomIn className="h-4 w-4" />
        </CyberButton>

        {/* Zoom Level Display */}
        <div className="text-center text-[10px] font-tech text-neon-cyan py-1">
          {Math.round(zoomLevel * 100)}%
        </div>

        <CyberButton
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="h-8 w-8 p-0 justify-center"
          title="Zoom Out (-)"
        >
          <ZoomOut className="h-4 w-4" />
        </CyberButton>

        <div className="h-px bg-glass-border my-1" />

        <CyberButton
          variant="ghost"
          size="sm"
          onClick={handleFitView}
          className="h-8 w-8 p-0 justify-center"
          title="Fit to View"
        >
          <Maximize2 className="h-4 w-4" />
        </CyberButton>

        <CyberButton
          variant="ghost"
          size="sm"
          onClick={handleResetCamera}
          className="h-8 w-8 p-0 justify-center"
          title="Reset Camera"
        >
          <RotateCw className="h-4 w-4" />
        </CyberButton>
      </div>

      {/* Pan Mode Toggle */}
      <div className="glass-panel rounded-xl p-2">
        <CyberButton
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 justify-center"
          title="Pan Mode"
        >
          <Move className="h-4 w-4" />
        </CyberButton>
      </div>
    </div>
  );
}
```

2. Update src/components/graph/graph-canvas.tsx to integrate camera controls:

```typescript
import { ReactFlowProvider } from "@xyflow/react";
import { CameraControls } from "./camera-controls";

export function GraphCanvas() {
  // ... existing code ...

  return (
    <ReactFlowProvider>
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
          minZoom={0.5}
          maxZoom={2}
          // ... rest of config
        >
          <Background color="var(--color-neon-cyan)" gap={40} size={1} variant="dots" />
          <Controls className="glass-panel border border-neon-cyan/30 !bg-glass-surface" />
          <MiniMap
            nodeColor={() => "var(--color-neon-purple)"}
            nodeStrokeWidth={3}
            nodeStrokeColor="var(--color-neon-cyan)"
            maskColor="var(--color-space-black)"
            className="glass-panel border border-neon-purple/30"
          />

          {/* Custom Camera Controls */}
          <CameraControls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
```

3. Add camera control CSS to src/app/globals.css:

```css
/* Camera Controls */
.react-flow__controls {
  display: none; /* Hide default controls, use custom */
}

/* Custom camera control buttons */
.camera-control-btn {
  transition: all 0.2s;
}

.camera-control-btn:hover {
  transform: scale(1.1);
  background: var(--color-glass-highlight);
}

/* Zoom level text */
.zoom-level {
  font-family: var(--font-tech);
  font-size: 10px;
  color: var(--color-neon-cyan);
  letter-spacing: 0.05em;
}
```

### Code Snippets

React Flow camera controls:
```typescript
import { useReactFlow } from "@xyflow/react";

const { zoomIn, zoomOut, fitView, setCenter } = useReactFlow();

zoomIn({ duration: 300 });
zoomOut({ duration: 300 });
fitView({ duration: 800, padding: 0.2 });
setCenter(x, y, { zoom: 1, duration: 500 });
```

Local storage persistence:
```typescript
import { useEffect } from "react";

useEffect(() => {
  const saved = localStorage.getItem("graph-camera");
  if (saved) {
    const { x, y, zoom } = JSON.parse(saved);
    setCenter(x, y, { zoom, duration: 500 });
  }
}, [setCenter]);

useEffect(() => {
  const { viewport } = getViewport();
  localStorage.setItem(
    "graph-camera",
    JSON.stringify({ x: viewport.x, y: viewport.y, zoom: viewport.zoom })
  );
}, [zoomLevel]);
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] CameraControls component created
- [ ] Controls include Zoom In, Zoom Out, Fit View, Reset Camera buttons
- [ ] Zoom level display shows percentage (50%-200%)
- [ ] Zoom buttons increment/decrement by 10%
- [ ] Min zoom level set to 0.5 (50%)
- [ ] Max zoom level set to 2.0 (200%)
- [ ] Fit View centers graph with 20% padding
- [ ] Reset Camera sets zoom to 100% and centers
- [ ] Pan mode toggle button included
- [ ] Controls positioned at bottom-left corner
- [ ] Controls use glass-panel styling
- [ ] Buttons use ghost variant with hover effects
- [ ] Icons from Lucide React (ZoomIn, ZoomOut, Maximize2, RotateCw, Move)
- [ ] Zoom level text uses monospace font
- [ ] Controls have tooltips on hover
- [ ] Default React Flow controls hidden
- [ ] Custom controls integrated into GraphCanvas
- [ ] ReactFlowProvider wrapper added to canvas
- [ ] Camera state persists in localStorage
- [ ] Camera state loads on mount
- [ ] Smooth animations (300-800ms) for all camera movements
- [ ] Hover effects scale buttons by 1.1
- [ ] Buttons have focus rings for accessibility

## Notes

- Controls use vertical stack layout
- Zoom level display between zoom in/out buttons
- Divider line between zoom controls and action buttons
- Pan mode toggle in separate panel below main controls
- Zoom limits enforced (0.5 min, 2.0 max)
- Fit View uses 0.2 padding around nodes
- Reset Camera sets viewport to center with 100% zoom
- Camera state saved to localStorage as JSON
- Camera state loaded from localStorage on mount
- Duration values: zoom (300ms), fit (800ms), reset (500ms)
- All camera movements are animated smoothly
- Controls are always visible (z-index 10)
- Controls positioned absolutely with fixed offset
- Use useReactFlow hook for camera control access
- getViewport() retrieves current camera state
- setCenter() sets camera position and zoom
- fitView() auto-calculates optimal viewport
- Zoom level tracked in component state
- Zoom level updated on zoom in/out
- Hover effects use transform: scale(1.1)
- Glass-panel provides backdrop blur and border
- Icons sized at h-4 w-4 (16px)
- Buttons are square (h-8 w-8)
- Text color neon-cyan for zoom level
- Monospace font for zoom level display
- Tooltip on hover shows keyboard shortcut (+, -, F, R)
- Button click triggers camera movement
- Camera controls independent of React Flow defaults
- Can be extended with keyboard shortcuts later