import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
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
      className={`glass-panel max-w-[280px] min-w-[200px] overflow-hidden rounded-xl border-2 ${config.borderColor} transition-all duration-200 ${
        selected ? "glow-border scale-105" : ""
      }`}
    >
      {/* Selected glow overlay */}
      {selected && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-neon-cyan) 10%, transparent) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Top Handle (Target) */}
      <Handle
        type="target"
        position={Position.Top}
        className={`!border-space-black !bg-neon-cyan hover:!glow-border !h-3 !w-3 !border-2 !transition-all duration-200 hover:!scale-125`}
      />

      {/* Node Content */}
      <div className="relative space-y-2 p-3">
        {/* Header */}
        <div className="flex items-start gap-2">
          <Icon
            className={`mt-0.5 h-4 w-4 flex-shrink-0 ${config.color} ${selected ? "glow-text" : ""}`}
          />
          <div className="min-w-0 flex-1">
            <h3
              className={`font-display text-text-primary line-clamp-2 text-sm leading-tight font-semibold ${
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
              <NeonBadge key={index} variant="cyan" className="text-[10px]">
                {tag}
              </NeonBadge>
            ))}
            {tags.length > 3 && (
              <span className="text-text-dim text-[10px]">+{tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="border-glass-border flex items-center justify-between border-t pt-2">
          <div className="text-text-dim flex items-center gap-1 text-[10px]">
            <Link className="h-3 w-3" />
            <span>{connections}</span>
          </div>
          <div className="text-text-dim flex items-center gap-1 text-[10px]">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatTime(updatedAt)}</span>
          </div>
        </div>

        {/* Importance Indicator */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`h-3 w-1 rounded-sm ${
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
        className={`!border-space-black !bg-neon-purple hover:!glow-border !h-3 !w-3 !border-2 !transition-all duration-200 hover:!scale-125`}
      />
    </div>
  );
});

GraphNode.displayName = "GraphNode";

export { GraphNode };
