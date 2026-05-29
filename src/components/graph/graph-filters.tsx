"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { NeonBadge } from "@/components/ui/neon-badge";

export type NodeType = "all" | "note" | "concept" | "tag" | "reference";

interface GraphFiltersProps {
  availableTags: string[];
  onFilterChange?: (filters: { type: NodeType; tags: string[] }) => void;
  isOpen?: boolean | undefined;
  onToggle?: (() => void) | undefined;
}

export function GraphFilters({
  availableTags,
  onFilterChange,
  isOpen = false,
  onToggle,
}: GraphFiltersProps) {
  const [filters, setFilters] = useState<{
    type: NodeType;
    tags: string[];
  }>({
    type: "all",
    tags: [],
  });

  const filterCount = (filters.type !== "all" ? 1 : 0) + filters.tags.length;

  const setTypeFilter = (type: NodeType) => {
    const newFilters = { ...filters, type };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    const newFilters = { ...filters, tags: newTags };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAll = () => {
    const newFilters = { type: "all" as NodeType, tags: [] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="absolute top-6 left-6 z-10">
      {/* Filter Panel */}
      {isOpen && (
        <div className="glass-panel animate-scale-in w-72 rounded-xl">
          <div className="border-glass-border flex items-center justify-between border-b p-4">
            <h3 className="font-display text-text-primary text-sm font-semibold">Filters</h3>
            <CyberButton variant="ghost" size="icon" onClick={onToggle}>
              <X className="h-4 w-4" />
            </CyberButton>
          </div>

          {/* Content */}
          <div className="space-y-4 p-4">
            {/* Node Type Filter */}
            <div>
              <h4 className="font-tech text-text-dim mb-2 text-[10px] font-bold tracking-wider uppercase">
                Node Type
              </h4>
              <div className="flex flex-wrap gap-1">
                {(["all", "note", "concept", "tag", "reference"] as NodeType[]).map((type) => (
                  <NeonBadge
                    key={type}
                    variant={filters.type === type ? "purple" : "cyan"}
                    className="cursor-pointer text-[10px] transition-transform hover:scale-110"
                    onClick={() => setTypeFilter(type)}
                  >
                    {type.toUpperCase()}
                  </NeonBadge>
                ))}
              </div>
            </div>

            {/* Tag Filter */}
            <div>
              <h4 className="font-tech text-text-dim mb-2 text-[10px] font-bold tracking-wider uppercase">
                Tags
              </h4>
              {availableTags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {availableTags.map((tag) => (
                    <NeonBadge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "purple" : "cyan"}
                      className="cursor-pointer text-[10px] transition-transform hover:scale-110"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </NeonBadge>
                  ))}
                </div>
              ) : (
                <p className="text-text-dim text-xs italic">No tags available</p>
              )}
            </div>

            {/* Clear All */}
            {filterCount > 0 && (
              <CyberButton variant="outline" size="sm" className="w-full" onClick={clearAll}>
                <X className="mr-2 h-4 w-4" />
                Clear All
              </CyberButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
