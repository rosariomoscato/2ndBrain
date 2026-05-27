import * as React from "react";
import { cn } from "@/lib/utils";

export interface NeonBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "purple" | "cyan" | "blue" | "pink" | "green" | "orange" | "neon" | "default" | "secondary" | "outline";
}

const NeonBadge = React.forwardRef<HTMLDivElement, NeonBadgeProps>(
  ({ className, variant = "cyan", ...props }, ref) => {
    const variants = {
      purple: "border-neon-purple text-neon-purple glow-text",
      cyan: "border-neon-cyan text-neon-cyan glow-text",
      blue: "border-neon-blue text-neon-blue glow-text",
      pink: "border-neon-pink text-neon-pink glow-text",
      green: "border-neon-green text-neon-green glow-text",
      orange: "border-orange-500 text-orange-500",
      neon: "border-neon-cyan text-neon-cyan glow-text",
      default: "border-neon-cyan bg-neon-cyan text-space-black font-bold glow-text",
      secondary: "border-glass-border bg-glass-surface text-text-primary",
      outline: "border-glass-border bg-transparent text-text-primary",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center border-2 rounded-full px-2.5 py-0.5 text-xs font-bold font-tech uppercase tracking-wider",
          "transition-all duration-200",
          "hover:scale-110",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

NeonBadge.displayName = "NeonBadge";

export { NeonBadge };