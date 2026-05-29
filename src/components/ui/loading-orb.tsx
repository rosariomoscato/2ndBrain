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
        className={cn("relative flex items-center justify-center", sizes[size], className)}
        {...props}
      >
        {/* Outer glow ring */}
        <div className="border-neon-cyan absolute inset-0 animate-pulse rounded-full border-2" />

        {/* Spinning ring */}
        <div className="border-neon-purple absolute inset-0 animate-spin rounded-full border-t-2" />

        {/* Inner core */}
        <div className="bg-neon-cyan glow-text absolute inset-2 animate-pulse rounded-full" />
      </div>
    );
  }
);

LoadingOrb.displayName = "LoadingOrb";

export { LoadingOrb };
