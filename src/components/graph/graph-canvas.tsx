"use client";

import { useCallback, useState } from "react";
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
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CameraControls } from "./camera-controls";
import { GraphEdge } from "./graph-edge";
import { GraphFilters } from "./graph-filters";
import { GraphNode, NodeData } from "./graph-node";
import { GraphSearch } from "./graph-search";
import { NodeDetailsPanel } from "./node-details-panel";

// Mock data for initialization
const initialNodes: Node[] = [
  {
    id: "1",
    type: "cyberNode",
    position: { x: 250, y: 0 },
    data: {
      label: "Main Concept",
      type: "concept",
      tags: ["important", "core"],
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      connections: 3,
      importance: 5,
    },
  },
  {
    id: "2",
    type: "cyberNode",
    position: { x: 100, y: 100 },
    data: {
      label: "Subtopic A",
      type: "note",
      tags: ["research", "draft"],
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      connections: 1,
      importance: 3,
    },
  },
  {
    id: "3",
    type: "cyberNode",
    position: { x: 400, y: 100 },
    data: {
      label: "Subtopic B",
      type: "reference",
      tags: ["external", "link"],
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      connections: 1,
      importance: 2,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "cyberEdge",
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

// GraphCanvas component with panels
function GraphCanvasContent() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [_filters, setFilters] = useState({
    type: "all" as const,
    tags: [] as string[],
  });
  const { setCenter } = useReactFlow();

  // Available tags (mock data for now)
  const availableTags = ["AI", "ML", "NLP", "Project", "Research"];

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as unknown as NodeData);
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setSelectedNode(node.data as unknown as NodeData);
      setCenter(node.position.x, node.position.y, { zoom: 1.2, duration: 500 });
    }
  }, [nodes, setCenter]);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    console.log("Filters changed:", newFilters);
    // Actual filtering will be implemented in future
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleNavigate = useCallback(() => {
    console.log("Navigate to full note:", selectedNode);
  }, [selectedNode]);

  // Register custom node and edge types
  const nodeTypes = {
    cyberNode: GraphNode,
  };

  const edgeTypes = {
    cyberEdge: GraphEdge,
  };

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
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        snapToGrid
        snapGrid={[15, 15]}
        minZoom={0.5}
        maxZoom={2}
        defaultEdgeOptions={{
          type: "cyberEdge",
          animated: true,
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

        {/* Cyberpunk Controls (hidden, replaced by CameraControls) */}
        <Controls className="react-flow__controls" showZoom={false} showFitView={false} showInteractive={false} />

        {/* Custom Camera Controls */}
        <CameraControls />

        {/* Cyberpunk MiniMap */}
        <MiniMap
          nodeColor={() => "var(--color-neon-purple)"}
          nodeStrokeWidth={3}
          nodeStrokeColor="var(--color-neon-cyan)"
          maskColor="var(--color-space-black)"
          className="glass-panel border border-neon-purple/30"
        />

        {/* Graph Filters Panel */}
        <GraphFilters
          availableTags={availableTags}
          onFilterChange={handleFilterChange}
        />

        {/* Graph Search */}
        <GraphSearch
          nodes={nodes}
          onNodeSelect={handleNodeSelect}
        />

        {/* Node Details Panel */}
        <NodeDetailsPanel
          node={selectedNode}
          onClose={handleCloseDetails}
          onNavigate={handleNavigate}
        />
      </ReactFlow>
    </div>
  );
}

// Export with provider wrapper
export function GraphCanvas() {
  return (
    <ReactFlowProvider>
      <GraphCanvasContent />
    </ReactFlowProvider>
  );
}