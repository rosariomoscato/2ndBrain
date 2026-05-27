import { memo } from "react";
import {
  EdgeProps,
  getBezierPath,
  BaseEdge,
} from "@xyflow/react";

const GraphEdge = memo(({ source, target, selected }: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX: (typeof source === 'string' ? { x: 0, y: 0 } : source).x,
    sourceY: (typeof source === 'string' ? { x: 0, y: 0 } : source).y,
    targetX: (typeof target === 'string' ? { x: 0, y: 0 } : target).x,
    targetY: (typeof target === 'string' ? { x: 0, y: 0 } : target).y,
  });

  return (
    <>
      {/* Edge Path */}
      <BaseEdge
        path={edgePath}
        style={{
          stroke: selected ? "var(--color-neon-cyan)" : "var(--color-neon-purple)",
          strokeWidth: selected ? 3 : 2,
          strokeLinecap: "round",
          transition: "all 0.2s ease",
        }}
      />

      {/* Selected Glow Overlay */}
      {selected && (
        <BaseEdge
          path={edgePath}
          style={{
            stroke: "var(--color-neon-cyan)",
            strokeWidth: 6,
            opacity: 0.3,
            filter: "blur(2px)",
          }}
        />
      )}

      {/* Animated Pulse Effect */}
      <BaseEdge
        path={edgePath}
        style={{
          stroke: selected ? "var(--color-neon-cyan)" : "var(--color-neon-purple)",
          strokeWidth: selected ? 3 : 2,
          strokeLinecap: "round",
          opacity: 0.6,
        }}
        className="animate-pulse"
      />
    </>
  );
});

GraphEdge.displayName = "GraphEdge";

export { GraphEdge };