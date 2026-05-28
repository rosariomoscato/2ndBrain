import { memo } from "react";
import {
  EdgeProps,
  getBezierPath,
  BaseEdge,
} from "@xyflow/react";

const tagColor = "var(--color-neon-cyan)";
const semanticColor = "var(--color-neon-purple)";

const GraphEdge = memo(({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const edgeType = (data as { edgeType?: string })?.edgeType ?? "tag";
  const color = edgeType === "semantic" ? semanticColor : tagColor;

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: selected ? "var(--color-neon-green)" : color,
          strokeWidth: selected ? 3 : 2,
          strokeLinecap: "round",
          transition: "all 0.2s ease",
        }}
      />

      {selected && (
        <BaseEdge
          path={edgePath}
          style={{
            stroke: "var(--color-neon-green)",
            strokeWidth: 6,
            opacity: 0.3,
            filter: "blur(2px)",
          }}
        />
      )}

      <BaseEdge
        path={edgePath}
        style={{
          stroke: selected ? "var(--color-neon-green)" : color,
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
