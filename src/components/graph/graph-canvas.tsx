"use client";

import { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { useRouter } from "next/navigation";
import "@xyflow/react/dist/style.css";
import { LoadingOrb } from "@/components/ui/loading-orb";
import { getGraphData, createEdge, updateNodePosition } from "@/lib/actions/graph";
import { CameraControls } from "./camera-controls";
import { GraphEdge } from "./graph-edge";
import { GraphFilters, type NodeType } from "./graph-filters";
import { GraphNode, NodeData } from "./graph-node";
import { GraphSearch } from "./graph-search";
import { NodeDetailsPanel } from "./node-details-panel";

// GraphCanvas component with panels
function GraphCanvasContent({ filtersOpen, onFiltersToggle }: {
  filtersOpen?: boolean | undefined;
  onFiltersToggle?: (() => void) | undefined;
}) {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "all" as NodeType,
    tags: [] as string[],
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCenter } = useReactFlow();

  // Track initial node position for drag optimization
  const [dragStartPositions, setDragStartPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Load graph data on mount
  useEffect(() => {
    async function loadGraph() {
      try {
        setLoading(true);
        const data = await getGraphData();
        
        // Extract all unique tags from nodes
        const tagSet = new Set<string>();
        data.nodes.forEach((node) => {
          const nodeData = node.data as unknown as NodeData;
          nodeData.tags.forEach((tag) => tagSet.add(tag));
        });
        setAvailableTags(Array.from(tagSet));
        
        setNodes(data.nodes);
        setEdges(data.edges);
      } catch (error) {
        console.error("Failed to load graph:", error);
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters to nodes
  useEffect(() => {
    if (filters.type === "all" && filters.tags.length === 0) {
      setNodes((prev) => prev.map((node) => ({ ...node, hidden: false })));
      return;
    }

    const filteredIds = new Set(
      nodes
        .filter((node) => {
          const nodeData = node.data as unknown as NodeData;
          if (filters.type !== "all" && nodeData.type !== filters.type) return false;
          if (filters.tags.length > 0) {
            const hasTag = filters.tags.some((tag) => nodeData.tags.includes(tag));
            if (!hasTag) return false;
          }
          return true;
        })
        .map((n) => n.id)
    );

    setNodes((prev) =>
      prev.map((node) => ({ ...node, hidden: !filteredIds.has(node.id) }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.type, filters.tags]);

  const onConnect = useCallback(
    async (params: Connection) => {
      if (!params.source || !params.target) return;
      
      try {
        const edge = await createEdge(params.source, params.target);
        if (edge) {
          setEdges((eds) => addEdge({
            id: edge.id,
            source: params.source!,
            target: params.target!,
            type: "cyberEdge",
            animated: true,
          }, eds));
        }
      } catch (error) {
        console.error("Failed to create edge:", error);
      }
    },
    [setEdges]
  );

  const onNodeDragStart = useCallback((_event: React.MouseEvent, node: Node) => {
    setDragStartPositions(prev => ({
      ...prev,
      [node.id]: { x: node.position.x, y: node.position.y }
    }));
  }, []);

  const onNodeDragStop = useCallback(async (_event: React.MouseEvent, node: Node) => {
    const startPos = dragStartPositions[node.id];
    if (!startPos) return;

    // Calculate distance moved
    const dx = node.position.x - startPos.x;
    const dy = node.position.y - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only update if position changed significantly (> 10px)
    if (distance > 10) {
      await updateNodePosition(node.id, node.position.x, node.position.y);
    }

    // Clear the drag start position
    setDragStartPositions(prev => {
      const updated = { ...prev };
      delete updated[node.id];
      return updated;
    });
  }, [dragStartPositions]);

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as unknown as NodeData);
    setSelectedNodeId(node.id);
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setSelectedNode(node.data as unknown as NodeData);
      setSelectedNodeId(node.id);
      setCenter(node.position.x, node.position.y, { zoom: 1.2, duration: 500 });
    }
  }, [nodes, setCenter]);

  const handleFilterChange = useCallback((newFilters: { type: NodeType; tags: string[] }) => {
    setFilters(newFilters);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedNode(null);
    setSelectedNodeId(null);
  }, []);

  const handleNavigate = useCallback(() => {
    if (selectedNode?.noteId) {
      router.push(`/notes/${selectedNode.noteId}`);
    }
  }, [selectedNode, router]);

  const handleShowConnections = useCallback(() => {
    if (!selectedNodeId) return;

    const connectedNodeIds = new Set<string>();
    for (const edge of edges) {
      if (edge.source === selectedNodeId) connectedNodeIds.add(edge.target);
      if (edge.target === selectedNodeId) connectedNodeIds.add(edge.source);
    }

    if (connectedNodeIds.size === 0) return;

    const connectedNodes = nodes.filter(
      (n) => connectedNodeIds.has(n.id) || n.id === selectedNodeId
    );

    const avgX = connectedNodes.reduce((sum, n) => sum + n.position.x, 0) / connectedNodes.length;
    const avgY = connectedNodes.reduce((sum, n) => sum + n.position.y, 0) / connectedNodes.length;
    setCenter(avgX, avgY, { zoom: 1, duration: 500 });
  }, [selectedNodeId, edges, nodes, setCenter]);

  // Register custom node and edge types
  const nodeTypes = {
    cyberNode: GraphNode,
  };

  const edgeTypes = {
    cyberEdge: GraphEdge,
  };

  // Show loading state while data loads
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center blueprint-surface">
        <div className="flex flex-col items-center gap-4">
          <LoadingOrb size="lg" />
          <p className="text-text-secondary text-sm font-tech">Loading graph data...</p>
        </div>
      </div>
    );
  }

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
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
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
          isOpen={filtersOpen}
          onToggle={onFiltersToggle}
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
          onShowConnections={handleShowConnections}
        />
      </ReactFlow>
    </div>
  );
}

// Export with provider wrapper
export function GraphCanvas({ filtersOpen, onFiltersToggle }: {
  filtersOpen?: boolean | undefined;
  onFiltersToggle?: (() => void) | undefined;
}) {
  return (
    <ReactFlowProvider>
      <GraphCanvasContent filtersOpen={filtersOpen} onFiltersToggle={onFiltersToggle} />
    </ReactFlowProvider>
  );
}