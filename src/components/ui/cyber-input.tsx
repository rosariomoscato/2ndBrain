import * as React from "react";
import { cn } from "@/lib/utils";

export interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl bg-glass-surface border-2 border-glass-border",
          "px-4 py-2 text-sm text-text-primary placeholder:text-text-dim",
          "transition-all duration-200",
          "hover:border-neon-cyan/50",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/50 focus-visible:border-neon-cyan",
          "disabled:pointer-events-none disabled:opacity-50",
          "backdrop-blur-md",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CyberInput.displayName = "CyberInput";

export { CyberInput };