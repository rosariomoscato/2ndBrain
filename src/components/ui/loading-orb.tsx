import * as React from "react";
import { cn } from "@/lib/utils";

export interface LoadingOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "icon";
}

const LoadingOrb = React.forwardRef<HTMLDivElement, LoadingOrbProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "w-6 h-6",
      md: "w-12 h-12",
      lg: "w-16 h-16",
      icon: "w-9 h-9",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center",
          sizes[size],
          className
        )}
        {...props}
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full border-2 border-neon-cyan animate-pulse" />

        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-t-2 border-neon-purple animate-spin" />

        {/* Inner core */}
        <div className="absolute inset-2 rounded-full bg-neon-cyan animate-pulse glow-text" />
      </div>
    );
  }
);

LoadingOrb.displayName = "LoadingOrb";

export { LoadingOrb };