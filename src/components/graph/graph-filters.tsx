"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { NeonBadge } from "@/components/ui/neon-badge";

export type NodeType = "all" | "note" | "concept" | "tag" | "reference";

interface GraphFiltersProps {
  availableTags: string[];
  onFilterChange?: (filters: { type: NodeType; tags: string[] }) => void;
}

export function GraphFilters({
  availableTags,
  onFilterChange,
}: GraphFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<{
    type: NodeType;
    tags: string[];
  }>({
    type: "all",
    tags: [],
  });

  const filterCount = (filters.type !== "all" ? 1 : 0) + filters.tags.length;

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

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
      {/* Filter Toggle Button */}
      <CyberButton
        variant="neon"
        size="icon"
        onClick={toggleFilter}
        className="relative"
      >
        <Filter className="w-4 h-4" />
        {filterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-purple text-space-black text-xs font-bold rounded-full flex items-center justify-center glow-border">
            {filterCount}
          </span>
        )}
      </CyberButton>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-72 glass-panel rounded-xl animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-glass-border">
            <h3 className="text-sm font-semibold font-display text-text-primary">
              Filters
            </h3>
            <CyberButton
              variant="ghost"
              size="icon"
              onClick={toggleFilter}
            >
              <X className="w-4 h-4" />
            </CyberButton>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Node Type Filter */}
            <div>
              <h4 className="text-[10px] font-bold font-tech uppercase tracking-wider text-text-dim mb-2">
                Node Type
              </h4>
              <div className="flex flex-wrap gap-1">
                {(["all", "note", "concept", "tag", "reference"] as NodeType[]).map((type) => (
                  <NeonBadge
                    key={type}
                    variant={filters.type === type ? "purple" : "cyan"}
                    className="text-[10px] cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setTypeFilter(type)}
                  >
                    {type.toUpperCase()}
                  </NeonBadge>
                ))}
              </div>
            </div>

            {/* Tag Filter */}
            <div>
              <h4 className="text-[10px] font-bold font-tech uppercase tracking-wider text-text-dim mb-2">
                Tags
              </h4>
              {availableTags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {availableTags.map((tag) => (
                    <NeonBadge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "purple" : "cyan"}
                      className="text-[10px] cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </NeonBadge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-dim italic">
                  No tags available
                </p>
              )}
            </div>

            {/* Clear All */}
            {filterCount > 0 && (
              <CyberButton
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearAll}
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </CyberButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}