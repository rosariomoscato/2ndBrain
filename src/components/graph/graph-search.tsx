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
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
      {/* Search Input */}
      <div className="relative w-96 glass-panel rounded-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search nodes..."
          className="w-full h-10 pl-10 pr-8 bg-transparent text-sm text-text-primary placeholder:text-text-dim focus:outline-none border-none rounded-xl"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <CyberButton variant="ghost" size="icon" className="w-6 h-6">
              <X className="w-3 h-3" />
            </CyberButton>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && filteredNodes.length > 0 && (
        <div className="absolute top-12 left-0 w-96 glass-panel rounded-xl animate-scale-in max-h-64 overflow-y-auto">
          {filteredNodes.map((node, index) => (
            <button
              key={node.id}
              onClick={() => handleNodeSelect(node)}
              className={`w-full px-4 py-3 text-left hover:bg-glass-highlight transition-colors ${
                index !== filteredNodes.length - 1 ? "border-b border-glass-border" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {String(node.data.label || "")}
                  </div>
                </div>
                <NeonBadge
                  variant={getTypeVariant(node.data.type as string | undefined)}
                  className="text-[10px] flex-shrink-0"
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
        <div className="absolute top-12 left-0 w-96 glass-panel rounded-xl animate-scale-in p-4">
          <p className="text-sm text-text-dim text-center">
            No nodes found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}