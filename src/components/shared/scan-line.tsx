"use client";

import { useEffect, useState } from "react";

interface ScanLineProps {
  color?: "cyan" | "purple" | "blue";
  speed?: number;
  opacity?: number;
}

export function ScanLine({
  color = "cyan",
  speed = 3000,
  opacity = 0.3,
}: ScanLineProps) {
  const [position, setPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const glowColors: Record<string, string> = {
    cyan: "rgba(96, 247, 252, 0.5)",
    purple: "rgba(168, 85, 247, 0.5)",
    blue: "rgba(59, 130, 246, 0.5)",
  };

  const glowColor = glowColors[color] || glowColors.cyan;

  useEffect(() => {
    let animationFrame: number | undefined;
    const startTime = performance.now();

    const animate = (timestamp: number) => {
      if (!isPaused) {
        const elapsed = timestamp - startTime;
        const progress = (elapsed % speed) / speed;
        setPosition(progress * 100);
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPaused, speed]);

  return (
    <div
      className="absolute inset-x-0 hover:cursor-pointer"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`blur-sm absolute inset-x-0`}
        style={{
          top: `${position}%`,
          opacity: opacity * 0.5,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
        }}
      />
      <div
        className="absolute inset-x-0"
        style={{
          top: `${position}%`,
          opacity,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
        }}
      />
    </div>
  );
}