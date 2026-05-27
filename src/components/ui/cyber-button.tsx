import * as React from "react";
import { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "neon";
  size?: "sm" | "md" | "lg" | "icon";
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, asChild = false, variant = "primary", size = "md", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const variants = {
      primary:
        "command-strip text-space-black font-bold hover:scale-105 transition-transform",
      secondary:
        "bg-glass-surface border border-glass-border text-text-primary hover:bg-glass-highlight",
      outline:
        "bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10",
      ghost:
        "bg-transparent text-text-primary hover:bg-glass-highlight",
      neon:
        "command-strip text-space-black font-bold glow-text hover:scale-105 hover-glow-border transition-all",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
      icon: "h-9 w-9 px-0",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:ring-[3px] focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CyberButton.displayName = "CyberButton";

export { CyberButton };