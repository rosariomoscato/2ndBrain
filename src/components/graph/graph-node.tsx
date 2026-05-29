import { memo } from "react";
import {
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import { FileText, Link, Tag as TagIcon } from "lucide-react";
import { NeonBadge } from "@/components/ui/neon-badge";

export interface NodeData {
  label: string;
  type: "note" | "concept" | "tag" | "reference";
  noteId: string | null;
  excerpt: string;
  tags: string[];
  updatedAt: string;
  createdAt?: string;
  connections: number;
  importance: number;
}

const GraphNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as NodeData;
  const { label, type, tags, updatedAt, connections, importance } = nodeData;

  const typeConfig: Record<
    string,
    {
      borderColor: string;
      icon: React.ElementType;
      color: string;
    }
  > = {
    note: {
      borderColor: "border-neon-cyan",
      icon: FileText,
      color: "text-neon-cyan",
    },
    concept: {
      borderColor: "border-neon-purple",
      icon: Link,
      color: "text-neon-purple",
    },
    tag: {
      borderColor: "border-neon-blue",
      icon: TagIcon,
      color: "text-neon-blue",
    },
    reference: {
      borderColor: "border-neon-pink",
      icon: FileText,
      color: "text-neon-pink",
    },
  };

  const config = typeConfig[type] || typeConfig.concept;
  if (!config) return null;

  const Icon = config.icon;

  // Format updated at time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div
      className={`glass-panel rounded-xl overflow-hidden min-w-[200px] max-w-[280px] border-2 ${config.borderColor} transition-all duration-200 ${
        selected ? "scale-105 glow-border" : ""
      }`}
    >
      {/* Selected glow overlay */}
      {selected && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle, color-mix(in srgb, var(--color-neon-cyan) 10%, transparent) 0%, transparent 70%)"
          }}
        />
      )}

      {/* Top Handle (Target) */}
      <Handle
        type="target"
        position={Position.Top}
        className={`!w-3 !h-3 !border-2 !border-space-black !bg-neon-cyan !transition-all duration-200 hover:!scale-125 hover:!glow-border`}
      />

      {/* Node Content */}
      <div className="relative p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start gap-2">
          <Icon
            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color} ${selected ? "glow-text" : ""}`}
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-semibold font-display line-clamp-2 leading-tight text-text-primary ${
                selected ? "glow-text" : ""
              }`}
            >
              {label}
            </h3>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag: string, index: number) => (
              <NeonBadge
                key={index}
                variant="cyan"
                className="text-[10px]"
              >
                {tag}
              </NeonBadge>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] text-text-dim">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-glass-border">
          <div className="flex items-center gap-1 text-[10px] text-text-dim">
            <Link className="w-3 h-3" />
            <span>{connections}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-text-dim">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatTime(updatedAt)}</span>
          </div>
        </div>

        {/* Importance Indicator */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`w-1 h-3 rounded-sm ${
                index < importance ? config.color : "bg-glass-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Handle (Source) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`!w-3 !h-3 !border-2 !border-space-black !bg-neon-purple !transition-all duration-200 hover:!scale-125 hover:!glow-border`}
      />
    </div>
  );
});

GraphNode.displayName = "GraphNode";

export { GraphNode };