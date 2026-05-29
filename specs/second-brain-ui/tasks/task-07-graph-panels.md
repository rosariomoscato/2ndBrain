# Task 07: Graph Detail Panels

## Status

complete

## Wave

5

## Description

Create detail panels for the knowledge graph including node details panel, filter controls, and search within graph. These panels provide additional information about selected nodes, allow filtering by node type or tags, and enable searching for specific nodes in the graph. Panels use glassmorphism styling and can be toggled open/closed.

## Dependencies

**Depends on:** task-01-foundation, task-04-graph, task-05-graph-nodes, task-06-graph-camera
**Blocks:** None

**Context from dependencies:** task-01 provides design tokens and icons. task-04 provides GraphCanvas with React Flow. task-05 provides GraphNode component with metadata. task-06 provides camera controls for graph navigation.

## Files to Create

- `src/components/graph/node-details-panel.tsx` — Node details panel component
- `src/components/graph/graph-filters.tsx` — Graph filter controls component
- `src/components/graph/graph-search.tsx` — Search within graph component

## Files to Modify

- `src/components/graph/graph-canvas.tsx` — Integrate detail panels and filters

## Technical Details

### Implementation Steps

1. Create src/components/graph/node-details-panel.tsx:

```typescript
import { Clock, Link2, Tag, X, ExternalLink } from "lucide-react";
import { NeonBadge } from "@/components/ui/neon-badge";
import { CyberCard, CardHeader, CardTitle, CardContent } from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";

interface NodeData {
  id: string;
  label: string;
  type?: "note" | "concept" | "tag" | "reference";
  tags?: string[];
  excerpt?: string;
  createdAt?: string;
  updatedAt?: string;
  connections?: number;
  importance?: number;
}

interface NodeDetailsPanelProps {
  node: NodeData | null;
  onClose: () => void;
  onNavigate?: (nodeId: string) => void;
}

export function NodeDetailsPanel({ node, onClose, onNavigate }: NodeDetailsPanelProps) {
  if (!node) {
    return null;
  }

  return (
    <div className="absolute top-6 right-6 w-80 z-10 animate-scale-in">
      <CyberCard>
        <CardHeader className="border-b border-glass-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Node Details</CardTitle>
            <CyberButton variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </CyberButton>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Node Header */}
          <div>
            <NeonBadge variant={node.type === "note" ? "cyan" : node.type === "concept" ? "purple" : node.type === "tag" ? "blue" : "pink"}>
              {node.type?.toUpperCase()}
            </NeonBadge>
            <h3 className="text-xl font-display font-bold text-text-primary mt-2 line-clamp-2">
              {node.label}
            </h3>
          </div>

          {/* Excerpt */}
          {node.excerpt && (
            <div>
              <p className="micro-label mb-1">EXCERPT</p>
              <p className="text-sm text-text-secondary line-clamp-4">
                {node.excerpt}
              </p>
            </div>
          )}

          {/* Tags */}
          {node.tags && node.tags.length > 0 && (
            <div>
              <p className="micro-label mb-2 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                TAGS
              </p>
              <div className="flex flex-wrap gap-1">
                {node.tags.map((tag) => (
                  <NeonBadge key={tag} variant="cyan" className="text-[10px]">
                    {tag}
                  </NeonBadge>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-panel rounded-lg p-3">
              <div className="flex items-center gap-2 text-text-dim mb-1">
                <Link2 className="h-3 w-3" />
                <span className="text-xs">Connections</span>
              </div>
              <div className="text-xl font-display font-bold text-neon-cyan">
                {node.connections || 0}
              </div>
            </div>
            <div className="glass-panel rounded-lg p-3">
              <div className="flex items-center gap-2 text-text-dim mb-1">
                <div className="w-3 h-3 rounded-full bg-neon-purple" />
                <span className="text-xs">Importance</span>
              </div>
              <div className="text-xl font-display font-bold text-neon-purple">
                {node.importance || 0}/5
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-2 text-xs text-text-dim">
            {node.createdAt && (
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Created: {node.createdAt}</span>
              </div>
            )}
            {node.updatedAt && (
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Updated: {node.updatedAt}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {onNavigate && (
              <CyberButton variant="primary" className="w-full justify-start gap-2" onClick={() => onNavigate(node.id)}>
                <ExternalLink className="h-4 w-4" />
                View Full Note
              </CyberButton>
            )}
            <CyberButton variant="secondary" className="w-full justify-start gap-2">
              <Link2 className="h-4 w-4" />
              Show Connections
            </CyberButton>
          </div>
        </CardContent>
      </CyberCard>
    </div>
  );
}
```

2. Create src/components/graph/graph-filters.tsx:

```typescript
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { NeonBadge } from "@/components/ui/neon-badge";
import { CyberButton } from "@/components/ui/cyber-button";

type NodeType = "all" | "note" | "concept" | "tag" | "reference";

interface GraphFiltersProps {
  onFilterChange: (filters: { type: NodeType; tags: string[] }) => void;
  availableTags?: string[];
}

export function GraphFilters({ onFilterChange, availableTags = [] }: GraphFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<NodeType>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const nodeTypes: NodeType[] = ["all", "note", "concept", "tag", "reference"];

  const handleToggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onFilterChange({ type: selectedType, tags: newTags });
  };

  const handleClearFilters = () => {
    setSelectedType("all");
    setSelectedTags([]);
    onFilterChange({ type: "all", tags: [] });
  };

  return (
    <div className="absolute top-6 left-6 z-10">
      <CyberButton
        variant={isOpen ? "primary" : "secondary"}
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Filter className="h-4 w-4" />
        Filters
        {selectedType !== "all" || selectedTags.length > 0 && (
          <NeonBadge variant="pink" className="text-[10px]">
            {selectedType !== "all" ? 1 : 0} + {selectedTags.length}
          </NeonBadge>
        )}
      </CyberButton>

      {isOpen && (
        <div className="glass-panel rounded-xl p-4 mt-2 w-72 animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <p className="micro-label">FILTERS</p>
            {(selectedType !== "all" || selectedTags.length > 0) && (
              <CyberButton variant="ghost" size="sm" onClick={handleClearFilters} className="h-6 p-0 text-xs">
                Clear all
              </CyberButton>
            )}
          </div>

          {/* Node Type Filter */}
          <div className="mb-4">
            <p className="text-xs text-text-dim mb-2">Node Type</p>
            <div className="flex flex-wrap gap-1">
              {nodeTypes.map((type) => (
                <NeonBadge
                  key={type}
                  variant={selectedType === type ? "purple" : "cyan"}
                  onClick={() => {
                    setSelectedType(type);
                    onFilterChange({ type, tags: selectedTags });
                  }}
                  className="cursor-pointer"
                >
                  {type.toUpperCase()}
                </NeonBadge>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          {availableTags.length > 0 && (
            <div>
              <p className="text-xs text-text-dim mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {availableTags.map((tag) => (
                  <NeonBadge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "purple" : "cyan"}
                    onClick={() => handleToggleTag(tag)}
                    className="cursor-pointer"
                  >
                    {tag}
                  </NeonBadge>
                ))}
              </div>
            </div>
          )}

          {availableTags.length === 0 && (
            <div className="text-xs text-text-dim text-center py-2">
              No tags available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

3. Create src/components/graph/graph-search.tsx:

```typescript
"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { CyberInput } from "@/components/ui/cyber-input";
import { CyberButton } from "@/components/ui/cyber-button";

interface Node {
  id: string;
  label: string;
  type?: string;
}

interface GraphSearchProps {
  nodes: Node[];
  onSearch: (query: string) => void;
  onNodeSelect?: (nodeId: string) => void;
}

export function GraphSearch({ nodes, onSearch, onNodeSelect }: GraphSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredNodes, setFilteredNodes] = useState<Node[]>([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);

    if (searchQuery.length > 0) {
      const filtered = nodes.filter((node) =>
        node.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNodes(filtered.slice(0, 5)); // Show top 5 results
      setIsOpen(true);
    } else {
      setFilteredNodes([]);
      setIsOpen(false);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
    setIsOpen(false);
    setQuery("");
    setFilteredNodes([]);
  };

  const handleClear = () => {
    setQuery("");
    setFilteredNodes([]);
    setIsOpen(false);
    onSearch("");
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-96">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
        <CyberInput
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search nodes in graph..."
          className="pl-10 pr-8"
        />
        {query && (
          <CyberButton
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </CyberButton>
        )}

        {/* Search Results Dropdown */}
        {isOpen && filteredNodes.length > 0 && (
          <div className="glass-panel rounded-xl mt-2 max-h-64 overflow-auto animate-scale-in">
            {filteredNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                className="w-full text-left px-4 py-3 hover:bg-glass-highlight transition-colors border-b border-glass-border last:border-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-primary line-clamp-1">{node.label}</span>
                  {node.type && (
                    <NeonBadge variant="cyan" className="text-[10px]">
                      {node.type}
                    </NeonBadge>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

4. Update src/components/graph/graph-canvas.tsx to integrate panels:

```typescript
import { useState, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { NodeDetailsPanel } from "./node-details-panel";
import { GraphFilters } from "./graph-filters";
import { GraphSearch } from "./graph-search";

export function GraphCanvas() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filters, setFilters] = useState({ type: "all", tags: [] as string[] });
  const { setCenter } = useReactFlow();

  const handleNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node.data);
  }, []);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    // Filter logic will be implemented with actual graph data
    console.log("Filters changed:", newFilters);
  }, []);

  const handleGraphSearch = useCallback((query: string) => {
    // Search logic will be implemented
    console.log("Graph search:", query);
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setCenter(node.position.x, node.position.y, { zoom: 1.2, duration: 500 });
      setSelectedNode(node.data);
    }
  }, [nodes, setCenter]);

  return (
    <div className="w-full h-full relative blueprint-surface">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        // ... rest of config
      >
        {/* Search */}
        <GraphSearch
          nodes={nodes.map((n) => ({ id: n.id, label: n.data.label, type: n.data.type }))}
          onSearch={handleGraphSearch}
          onNodeSelect={handleNodeSelect}
        />

        {/* Filters */}
        <GraphFilters
          onFilterChange={handleFilterChange}
          availableTags={["AI", "ML", "NLP", "Project", "Research"]}
        />

        {/* Node Details Panel */}
        <NodeDetailsPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onNavigate={(nodeId) => console.log("Navigate to note:", nodeId)}
        />

        {/* Background, Controls, MiniMap */}
        <Background color="var(--color-neon-cyan)" gap={40} size={1} variant="dots" />
        <Controls className="glass-panel border border-neon-cyan/30 !bg-glass-surface" />
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

### Code Snippets

Node selection handler:

```typescript
const handleNodeClick = useCallback((event: any, node: any) => {
  setSelectedNode(node.data);
}, []);

<ReactFlow
  onNodeClick={handleNodeClick}
  // ...
>
```

Filter state management:

```typescript
const [filters, setFilters] = useState({
  type: "all",
  tags: [] as string[],
});

const handleFilterChange = (newFilters: any) => {
  setFilters(newFilters);
  // Apply filter logic
};
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] NodeDetailsPanel component created
- [ ] Panel shows node type badge
- [ ] Panel shows node title
- [ ] Panel shows excerpt if available
- [ ] Panel shows tags with badges
- [ ] Panel shows connections count
- [ ] Panel shows importance rating
- [ ] Panel shows timestamps (created, updated)
- [ ] Panel has "View Full Note" button
- [ ] Panel has "Show Connections" button
- [ ] Panel can be closed with X button
- [ ] Panel positioned at top-right
- [ ] Panel uses scale-in animation
- [ ] GraphFilters component created
- [ ] Filters button toggles panel open/closed
- [ ] Filters show active filter count badge
- [ ] Node type filter has 5 options
- [ ] Tag filter shows available tags
- [ ] Tags can be selected/deselected
- [ ] Clear all button resets filters
- [ ] Filters positioned at top-left
- [ ] GraphSearch component created
- [ ] Search input positioned at top-center
- [ ] Search results dropdown shows top 5 matches
- [ ] Search results clickable to select node
- [ ] Search results show node type badge
- [ ] Clear button appears when query has text
- [ ] GraphCanvas integrates all panels
- [ ] Node click opens details panel
- [ ] Search selects node and centers camera
- [ ] All panels use glass-panel styling
- [ ] All panels use cyberpunk colors
- [ ] All panels have proper animations
- [ ] All panels have hover effects

## Notes

- NodeDetailsPanel width fixed at 320px (w-80)
- NodeDetailsPanel uses animate-scale-in for entrance
- NodeDetailsPanel displays mock data from node.data
- Node type badge uses color based on type
- Excerpt uses line-clamp-4 for truncation
- Tags displayed as flex wrap with badges
- Connections and importance in 2-column grid
- Stats use glass-panel background
- Timestamps use Clock icon
- Actions buttons use full width
- GraphFilters positioned at top-left (6px padding)
- Filters button shows count of active filters
- Filter panel width fixed at 288px (w-72)
- Filter panel uses animate-scale-in
- Node type badges use purple for active
- Tag badges use purple for active
- Clear all button visible when filters active
- No tags available message when empty
- GraphSearch positioned at top-center with translate
- Search results max-height 256px (max-h-64)
- Search results show top 5 matches
- Search results use line-clamp-1 for labels
- Search dropdown uses animate-scale-in
- Search results have hover background effect
- Search results have border-bottom
- Clear button positioned absolute right
- Search icon positioned absolute left
- Search input uses pl-10 pr-8 padding
- Search matches case-insensitive
- GraphCanvas passes nodes to search component
- onNodeSelect centers camera with zoom 1.2
- onNodeSelect opens details panel
- Camera center uses 500ms duration
- onNodeClick sets selected node data
- All panels use z-index for layering
- Search z-index 20 (highest)
- Details z-index 10
- Filters z-index 10
- All panels use glass-panel styling
- All panels use cyberpunk colors
- All panels use proper hover effects
- All panels use proper focus states
- Components modular and reusable
- Type safety with TypeScript interfaces
- NodeData interface for details panel
- FilterState interface for filters
- Search results limited to 5 for performance
- Filter panel shows "No tags available" when empty
- Details panel closes on X button click
- Details panel closes on background click (optional)
- Search dropdown closes on selection
- Search dropdown closes on clear
- All buttons use appropriate variants
- All text uses cyberpunk colors
- All icons from Lucide React
- All animations use CSS classes
- Responsive considerations handled in parent
- Panels positioned absolutely within canvas
- Panels offset from edges with padding
- Can be extended with more filters later
- Can be extended with export options later
- Can be extended with bulk actions later
