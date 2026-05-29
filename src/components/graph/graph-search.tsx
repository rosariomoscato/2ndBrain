"use client";

import { useState } from "react";
import { Node } from "@xyflow/react";
import { Search, X } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { NeonBadge } from "@/components/ui/neon-badge";

interface GraphSearchProps {
  nodes: Node[];
  onNodeSelect?: (nodeId: string) => void;
}

export function GraphSearch({ nodes, onNodeSelect }: GraphSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredNodes = query
    ? nodes
        .filter((node) => {
          const label = node.data.label as string | undefined;
          return label?.toLowerCase().includes(query.toLowerCase()) ?? false;
        })
        .slice(0, 5)
    : [];

  const handleSearch = (value: string) => {
    setQuery(value);
    setIsOpen(value.length > 0);
    if (value.length > 0) {
      console.log("Search query:", value);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleNodeSelect = (node: Node) => {
    console.log("Selected node:", node.id);
    onNodeSelect?.(node.id);
    setQuery("");
    setIsOpen(false);
  };

  const getTypeVariant = (type: string | undefined): "cyan" | "purple" | "blue" | "pink" => {
    if (!type) return "cyan";
    const variants: Record<string, "cyan" | "purple" | "blue" | "pink"> = {
      note: "cyan",
      concept: "purple",
      tag: "blue",
      reference: "pink",
    };
    return variants[type] || "cyan";
  };

  return (
    <div className="absolute top-6 left-1/2 z-20 -translate-x-1/2">
      {/* Search Input */}
      <div className="glass-panel relative w-96 rounded-xl">
        <Search className="text-text-dim absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search nodes..."
          className="text-text-primary placeholder:text-text-dim h-10 w-full rounded-xl border-none bg-transparent pr-8 pl-10 text-sm focus:outline-none"
        />
        {query && (
          <button onClick={clearSearch} className="absolute top-1/2 right-2 -translate-y-1/2">
            <CyberButton variant="ghost" size="icon" className="h-6 w-6">
              <X className="h-3 w-3" />
            </CyberButton>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && filteredNodes.length > 0 && (
        <div className="glass-panel animate-scale-in absolute top-12 left-0 max-h-64 w-96 overflow-y-auto rounded-xl">
          {filteredNodes.map((node, index) => (
            <button
              key={node.id}
              onClick={() => handleNodeSelect(node)}
              className={`hover:bg-glass-highlight w-full px-4 py-3 text-left transition-colors ${
                index !== filteredNodes.length - 1 ? "border-glass-border border-b" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-text-primary truncate text-sm font-medium">
                    {String(node.data.label || "")}
                  </div>
                </div>
                <NeonBadge
                  variant={getTypeVariant(node.data.type as string | undefined)}
                  className="flex-shrink-0 text-[10px]"
                >
                  {String(node.data.type || "").toUpperCase()}
                </NeonBadge>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && query && filteredNodes.length === 0 && (
        <div className="glass-panel animate-scale-in absolute top-12 left-0 w-96 rounded-xl p-4">
          <p className="text-text-dim text-center text-sm">No nodes found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
