# Task 14: Shared UI Components

## Status

complete

## Wave

1

## Description

Create reusable UI components that follow cyberpunk design system. These components (buttons, inputs, cards, badges, loading orb) will be used across the application. Each component includes neon glow effects, glassmorphism styling, and hover/interaction states consistent with cyberpunk aesthetic.

## Dependencies

**Depends on:** task-01-foundation
**Blocks:** task-03-dashboard, task-05-graph-nodes, task-08-note-editor, task-10-notes-list, task-11-notes-cards, task-13-ai-query

**Context from dependencies:** task-01-foundation provides cyberpunk design tokens (colors, fonts, effects) in globals.css and cyber-theme.ts that these components will reference via CSS variables and Tailwind classes.

## Files to Create

- `src/components/ui/cyber-button.tsx` — Cyberpunk button with neon glow
- `src/components/ui/cyber-input.tsx` — Glassmorphism input with focus ring
- `src/components/ui/cyber-card.tsx` — Card with glass effect and hover lift
- `src/components/ui/neon-badge.tsx` — Badge with glowing text
- `src/components/ui/loading-orb.tsx` — Animated neon orb for loading states

## Files to Modify

- `src/components/ui/button.tsx` — Update to use cyberpunk styling (or replace)
- `src/components/ui/input.tsx` — Update to use cyberpunk styling (or replace)
- `src/components/ui/card.tsx` — Update to use cyberpunk styling (or replace)
- `src/components/ui/badge.tsx` — Update to use cyberpunk styling (or replace)

## Technical Details

### Implementation Steps

1. Create src/components/ui/cyber-button.tsx:

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes } from "react";

export interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "neon";
  size?: "sm" | "md" | "lg";
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
    };

    return (
      <Comp
        className={cn(
          "rounded-xl font-medium transition-all focus-visible:ring-[3px] focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50",
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
```

2. Create src/components/ui/cyber-input.tsx:

```typescript
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
```

3. Create src/components/ui/cyber-card.tsx:

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass-panel rounded-2xl overflow-hidden",
        "hover:-translate-y-0.5 transition-transform duration-200",
        "hover-glow-border",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-bold leading-none tracking-tight font-display text-text-primary glow-text",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-text-secondary", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

4. Create src/components/ui/neon-badge.tsx:

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

export interface NeonBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "purple" | "cyan" | "blue" | "pink" | "green" | "orange";
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
```

5. Create src/components/ui/loading-orb.tsx:

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

export interface LoadingOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const LoadingOrb = React.forwardRef<HTMLDivElement, LoadingOrbProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "w-6 h-6",
      md: "w-12 h-12",
      lg: "w-16 h-16",
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
```

6. Update src/components/ui/button.tsx (or delete if fully replaced by cyber-button):

```typescript
// Either update existing button to use cyberpunk styles
// Or replace with import from cyber-button
export { CyberButton as Button } from "./cyber-button";
```

### Code Snippets

CSS utility classes used:

```typescript
cn(
  // Base classes
  "glass-panel", // Glassmorphism with backdrop blur
  "glow-text", // Neon glow on text
  "glow-border", // Neon glow on borders
  "command-strip", // Gradient background
  "micro-label", // Uppercase monospace label

  // Interaction states
  "hover-lift", // -translate-y-0.5 on hover
  "hover-glow-border", // Glow effect on hover
  "focus-visible:ring-[3px] focus-visible:ring-accent/50", // Focus ring

  // Transitions
  "transition-all duration-200"
);
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] CyberButton component created with 5 variants (primary, secondary, outline, ghost, neon)
- [ ] CyberButton has 3 size options (sm, md, lg)
- [ ] CyberButton includes hover scale effect and focus ring
- [ ] CyberInput component created with glassmorphism styling
- [ ] CyberInput has focus state with neon cyan border and glow
- [ ] CyberCard component created with 5 sub-components (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- [ ] CyberCard has hover lift effect and glow border
- [ ] NeonBadge component created with 6 color variants
- [ ] NeonBadge uses monospace font and uppercase text
- [ ] LoadingOrb component created with 3 size options
- [ ] LoadingOrb has spinning animation and pulsing glow
- [ ] All components use cyberpunk design tokens from globals.css
- [ ] All components have TypeScript interfaces and forwardRef
- [ ] All components use cn() utility for className merging
- [ ] Components export correctly and have displayName set

## Notes

- All components use forwardRef for ref forwarding to enable composition
- Button variants use gradient background (command-strip) for primary and neon variants
- Glassmorphism achieved through backdrop-filter and translucent backgrounds
- Neon glow effects use text-shadow for text and box-shadow for borders
- Hover effects use CSS transforms for performance
- Focus states use ring utility with accent color and 50% opacity
- Badge variants map to neon color palette defined in task-01
- Loading orb uses nested divs with different animations (spin, pulse) for complex effect
- All transitions use 200ms duration for snappy feel
- Components follow Radix UI patterns (slot, forwardRef) for consistency
