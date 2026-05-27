"use client";

import { X, Clock, Link2, ExternalLink } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { NeonBadge } from "@/components/ui/neon-badge";
import { NodeData } from "./graph-node";

interface NodeDetailsPanelProps {
  node: NodeData | null;
  onClose: () => void;
  onNavigate?: () => void;
}

export function NodeDetailsPanel({
  node,
  onClose,
  onNavigate,
}: NodeDetailsPanelProps) {
  if (!node) return null;

  const { type, label, tags, connections, importance } = node;

  const typeConfig: Record<
    string,
    { color: string; bgColor: string }
  > = {
    note: {
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/20",
    },
    concept: {
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/20",
    },
    tag: {
      color: "text-neon-blue",
      bgColor: "bg-neon-blue/20",
    },
    reference: {
      color: "text-neon-pink",
      bgColor: "bg-neon-pink/20",
    },
  };

  const config = typeConfig[type] || typeConfig.concept;
  if (!config) return null;

  // Format timestamp
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeVariant = (nodeType: string): "cyan" | "purple" | "blue" | "pink" => {
    const variants: Record<string, "cyan" | "purple" | "blue" | "pink"> = {
      note: "cyan",
      concept: "purple",
      tag: "blue",
      reference: "pink",
    };
    return variants[nodeType] || "cyan";
  };

  return (
    <div className="absolute top-6 right-6 w-80 glass-panel rounded-xl animate-scale-in z-10">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-glass-border">
        <div className="flex-1 min-w-0">
          <div className={`text-[10px] font-bold font-tech uppercase tracking-wider ${config.color} mb-1`}>
            {type}
          </div>
          <h2 className="text-sm font-semibold font-display text-text-primary line-clamp-2 leading-tight">
            {label}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 p-1 text-text-dim hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Type Badge */}
        <NeonBadge
          variant={getTypeVariant(type)}
          className="text-[10px]"
        >
          {type.toUpperCase()}
        </NeonBadge>

        {/* Excerpt */}
        <div className="text-xs text-text-secondary line-clamp-4">
          This is a sample excerpt for the selected node. In production, this would display
          actual content from the note, concept, tag, or reference.
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag: string, index: number) => (
              <NeonBadge
                key={index}
                variant="cyan"
                className="text-[10px]"
              >
                {tag}
              </NeonBadge>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Connections */}
          <div className="glass-panel rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Link2 className="w-3 h-3 text-text-dim" />
              <span className="text-[10px] text-text-dim uppercase tracking-wider">Connections</span>
            </div>
            <div className="text-lg font-bold font-display text-neon-cyan glow-text">
              {connections}
            </div>
          </div>

          {/* Importance */}
          <div className="glass-panel rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-text-dim" />
              <span className="text-[10px] text-text-dim uppercase tracking-wider">Importance</span>
            </div>
            <div className="text-lg font-bold font-display text-neon-purple glow-text">
              {importance}/5
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-2">
          {node.createdAt && (
            <div className="flex items-center gap-2 text-[10px] text-text-dim">
              <Clock className="w-3 h-3" />
              <span>Created: {formatDate(node.createdAt)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-[10px] text-text-dim">
            <Clock className="w-3 h-3" />
            <span>Updated: {formatDate(node.updatedAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-glass-border">
          <CyberButton
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onNavigate}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Full Note
          </CyberButton>
          <CyberButton
            variant="ghost"
            size="sm"
            className="w-full"
          >
            <Link2 className="w-4 h-4 mr-2" />
            Show Connections
          </CyberButton>
        </div>
      </div>
    </div>
  );
}