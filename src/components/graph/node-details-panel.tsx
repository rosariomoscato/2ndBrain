"use client";

import { X, Clock, Link2, ExternalLink, Info } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { NeonBadge } from "@/components/ui/neon-badge";
import { NodeData } from "./graph-node";

interface NodeDetailsPanelProps {
  node: NodeData | null;
  onClose: () => void;
  onNavigate?: () => void;
  onShowConnections?: () => void;
}

export function NodeDetailsPanel({
  node,
  onClose,
  onNavigate,
  onShowConnections,
}: NodeDetailsPanelProps) {
  if (!node) return null;

  const { type, label, tags, connections, importance } = node;

  const typeConfig: Record<string, { color: string; bgColor: string }> = {
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
    <div className="glass-panel animate-scale-in absolute top-6 right-6 z-10 w-80 rounded-xl">
      {/* Header */}
      <div className="border-glass-border flex items-start justify-between border-b p-4">
        <div className="min-w-0 flex-1">
          <div
            className={`font-tech text-[10px] font-bold tracking-wider uppercase ${config.color} mb-1`}
          >
            {type}
          </div>
          <h2 className="font-display text-text-primary line-clamp-2 text-sm leading-tight font-semibold">
            {label}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-text-dim hover:text-text-primary ml-2 flex-shrink-0 p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        {/* Type Badge */}
        <NeonBadge variant={getTypeVariant(type)} className="text-[10px]">
          {type.toUpperCase()}
        </NeonBadge>

        {/* Excerpt */}
        {node.excerpt && (
          <div className="text-text-secondary line-clamp-4 text-xs">{node.excerpt}</div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag: string, index: number) => (
              <NeonBadge key={index} variant="cyan" className="text-[10px]">
                {tag}
              </NeonBadge>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Connections */}
          <div className="glass-panel rounded-lg p-3">
            <div className="mb-1 flex items-center gap-2">
              <Link2 className="text-text-dim h-3 w-3" />
              <span className="text-text-dim text-[10px] tracking-wider uppercase">
                Connections
              </span>
            </div>
            <div className="font-display text-neon-cyan glow-text text-lg font-bold">
              {connections}
            </div>
          </div>

          {/* Importance */}
          <div className="glass-panel group relative rounded-lg p-3">
            <div className="mb-1 flex items-center gap-2">
              <Clock className="text-text-dim h-3 w-3" />
              <span className="text-text-dim text-[10px] tracking-wider uppercase">Importance</span>
              <Info className="text-text-dim h-3 w-3 cursor-help" />
              <div className="bg-space-black/95 border-neon-purple/30 text-text-secondary pointer-events-none invisible absolute top-full left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded-lg border p-3 text-[10px] leading-relaxed opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="text-text-primary mb-1 font-bold">
                  How it&apos;s calculated (1-5)
                </div>
                <div className="space-y-0.5">
                  <div>+1 base (every node)</div>
                  <div>+1 if 1+ connections</div>
                  <div>+1 if 4+ connections</div>
                  <div>+1 if content &gt; 200 chars</div>
                  <div>+1 if has tags</div>
                </div>
              </div>
            </div>
            <div className="font-display text-neon-purple glow-text text-lg font-bold">
              {importance}/5
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-2">
          {node.createdAt && (
            <div className="text-text-dim flex items-center gap-2 text-[10px]">
              <Clock className="h-3 w-3" />
              <span>Created: {formatDate(node.createdAt)}</span>
            </div>
          )}
          <div className="text-text-dim flex items-center gap-2 text-[10px]">
            <Clock className="h-3 w-3" />
            <span>Updated: {formatDate(node.updatedAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="border-glass-border flex flex-col gap-2 border-t pt-2">
          {node.noteId && onNavigate && (
            <CyberButton variant="outline" size="sm" className="w-full" onClick={onNavigate}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Full Note
            </CyberButton>
          )}
          <CyberButton variant="ghost" size="sm" className="w-full" onClick={onShowConnections}>
            <Link2 className="mr-2 h-4 w-4" />
            Show Connections
          </CyberButton>
        </div>
      </div>
    </div>
  );
}
