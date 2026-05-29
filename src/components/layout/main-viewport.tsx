"use client";

import { ReactNode } from "react";

interface MainViewportProps {
  children: ReactNode;
}

export function MainViewport({ children }: MainViewportProps) {
  return (
    <main className="planner-bg relative flex-1 overflow-hidden">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Animated grid */}
        <div
          className="neon-grid absolute inset-0"
          style={{ opacity: "var(--theme-grid-opacity, 0.3)" }}
        />

        {/* Nebula glow effects */}
        <div className="bg-neon-purple/10 absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full blur-[120px]" />
        <div className="bg-neon-cyan/10 absolute right-1/4 bottom-1/4 h-72 w-72 animate-pulse rounded-full blur-[100px] delay-500" />

        {/* Scan line */}
        <div className="scan-line" />
      </div>

      {/* Content */}
      <div className="relative h-full overflow-auto">{children}</div>
    </main>
  );
}
