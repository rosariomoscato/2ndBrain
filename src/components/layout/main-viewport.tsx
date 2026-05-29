"use client";

import { ReactNode } from "react";

interface MainViewportProps {
  children: ReactNode;
}

export function MainViewport({ children }: MainViewportProps) {
  return (
    <main className="flex-1 relative overflow-hidden planner-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated grid */}
        <div
          className="neon-grid absolute inset-0"
          style={{ opacity: "var(--theme-grid-opacity, 0.3)" }}
        />

        {/* Nebula glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-neon-cyan/10 rounded-full blur-[100px] animate-pulse delay-500" />

        {/* Scan line */}
        <div className="scan-line" />
      </div>

      {/* Content */}
      <div className="relative h-full overflow-auto">
        {children}
      </div>
    </main>
  );
}