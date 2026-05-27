# Task 01: Foundation Setup

## Status

complete

## Wave

1

## Description

Install new dependencies for graph visualization, markdown editing, and animations. Define cyberpunk design tokens in globals.css replacing the existing design system. Create cyber-theme.ts configuration file for Tailwind v4 integration. This foundational work enables all subsequent UI components to use consistent cyberpunk styling.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-02-layout, task-04-graph, task-14-shared-ui

**Context from dependencies:** No dependencies. This task creates the foundation that all other tasks build upon.

## Files to Create

- `src/lib/cyber-theme.ts` — Cyberpunk theme configuration with color tokens
- `src/styles/cyberpunk.css` — Custom CSS animations and effects classes

## Files to Modify

- `package.json` — Add new dependencies
- `src/app/globals.css` — Replace existing design tokens with cyberpunk tokens
- `tailwind.config.ts` — Update to use cyberpunk theme

## Technical Details

### Implementation Steps

1. Install dependencies with pnpm:
```bash
pnpm add react-flow @xyflow/react d3 framer-motion monaco-editor @monaco-editor/react react-markdown three @react-three/fiber @react-three/drei
pnpm add -D @types/three
```

2. Create cyberpunk color tokens in src/app/globals.css using OKLCH color space:

```css
@import "tailwindcss";

@theme {
  /* Primary Neon Colors */
  --color-neon-purple: oklch(0.65 0.25 320);
  --color-neon-cyan: oklch(0.75 0.18 190);
  --color-neon-blue: oklch(0.60 0.22 250);
  --color-neon-pink: oklch(0.70 0.20 350);
  --color-neon-green: oklch(0.70 0.20 140);

  /* Space Backgrounds */
  --color-space-black: oklch(0.08 0.01 270);
  --color-starfield: oklch(0.12 0.02 270);
  --color-nebula-dark: oklch(0.15 0.04 260);
  --color-nebula-purple: oklch(0.20 0.06 290);

  /* Glass/Surfaces */
  --color-glass-surface: oklch(0.10 0.03 270 / 0.6);
  --color-glass-border: oklch(0.50 0.15 190 / 0.4);
  --color-glass-highlight: oklch(0.60 0.15 190 / 0.2);

  /* Text */
  --color-text-primary: oklch(0.95 0.02 270);
  --color-text-secondary: oklch(0.70 0.02 270);
  --color-text-dim: oklch(0.50 0.02 270);

  /* Status Colors */
  --color-status-online: oklch(0.70 0.20 140);
  --color-status-processing: oklch(0.75 0.18 190);
  --color-status-error: oklch(0.65 0.25 320);

  /* Semantic Tokens (replacing existing ones) */
  --color-background: oklch(0.08 0.01 270);
  --color-foreground: oklch(0.95 0.02 270);
  --color-card: oklch(0.10 0.03 270 / 0.6);
  --color-primary: oklch(0.65 0.25 320);
  --color-accent: oklch(0.75 0.18 190);
  --color-secondary: oklch(0.20 0.06 290 / 0.8);
  --color-muted: oklch(0.15 0.04 260 / 0.64);
  --color-muted-foreground: oklch(0.70 0.02 270);
  --color-border: oklch(0.50 0.15 190 / 0.4);
  --color-ring: oklch(0.80 0.15 178);
  --color-destructive: oklch(0.65 0.25 320);

  /* Chart Colors */
  --color-chart-1: oklch(0.65 0.25 320);
  --color-chart-2: oklch(0.75 0.18 190);
  --color-chart-3: oklch(0.60 0.22 250);
  --color-chart-4: oklch(0.70 0.20 350);
  --color-chart-5: oklch(0.70 0.20 140);

  /* Fonts */
  --font-display: "Orbitron", system-ui, sans-serif;
  --font-tech: "JetBrains Mono", monospace;
  --font-body: "Space Grotesk", system-ui, sans-serif;
}

/* Base Styles */
body {
  background-color: var(--color-space-black);
  color: var(--color-text-primary);
  font-family: var(--font-body);
}
```

3. Add custom CSS classes in src/app/globals.css:

```css
/* Neon Glow Effects */
.glow-text {
  text-shadow:
    0 0 10px var(--color-neon-cyan),
    0 0 20px var(--color-neon-purple),
    0 0 30px var(--color-neon-cyan);
}

.glow-border {
  box-shadow:
    0 0 15px var(--color-neon-cyan),
    inset 0 0 10px var(--color-neon-cyan / 0.1);
}

/* Glass Panels */
.glass-panel {
  background: var(--color-glass-surface);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-glass-border);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Neon Grid Background */
.neon-grid {
  background-image:
    linear-gradient(rgba(96, 247, 252, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(96, 247, 252, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-pulse 4s ease-in-out infinite;
}

@keyframes grid-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* Scan Line Effect */
.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-neon-cyan),
    transparent
  );
  animation: scan 3s linear infinite;
}

@keyframes scan {
  0% { top: 0; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* Command Strip Gradient */
.command-strip {
  background: linear-gradient(
    135deg,
    var(--color-neon-cyan),
    var(--color-neon-purple),
    var(--color-neon-blue)
  );
}

/* Blueprint Surface */
.blueprint-surface {
  background:
    linear-gradient(
      rgba(96, 247, 252, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(96, 247, 252, 0.05) 1px,
      transparent 1px
    ),
    var(--color-space-black);
  background-size: 40px 40px;
}

/* Paper Card */
.paper-card {
  background: var(--color-glass-surface);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-glass-border);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Micro Label */
.micro-label {
  font-family: var(--font-tech);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  color: var(--color-neon-cyan);
}

/* Planner Background (for layout containers) */
.planner-bg {
  background:
    radial-gradient(circle at 25% 25%, var(--color-nebula-purple) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, var(--color-neon-cyan / 0.2) 0%, transparent 50%),
    var(--color-space-black);
}

/* Interactive Elements */
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-0.125rem);
}

/* Focus States */
.focus-ring {
  transition: box-shadow 0.2s ease;
}

.focus-ring:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px var(--color-ring / 0.5),
    0 0 0 1px var(--color-ring);
}

/* Animation Classes */
.animate-fade-up {
  animation: fade-up 0.6s ease-out;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(1.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-scale-in {
  animation: scale-in 0.4s ease-out;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

4. Create src/lib/cyber-theme.ts:

```typescript
export const cyberTheme = {
  colors: {
    neon: {
      purple: "var(--color-neon-purple)",
      cyan: "var(--color-neon-cyan)",
      blue: "var(--color-neon-blue)",
      pink: "var(--color-neon-pink)",
      green: "var(--color-neon-green)",
    },
    space: {
      black: "var(--color-space-black)",
      starfield: "var(--color-starfield)",
      nebulaDark: "var(--color-nebula-dark)",
      nebulaPurple: "var(--color-nebula-purple)",
    },
    glass: {
      surface: "var(--color-glass-surface)",
      border: "var(--color-glass-border)",
      highlight: "var(--color-glass-highlight)",
    },
    text: {
      primary: "var(--color-text-primary)",
      secondary: "var(--color-text-secondary)",
      dim: "var(--color-text-dim)",
    },
  },
  fonts: {
    display: "Orbitron, system-ui, sans-serif",
    tech: "JetBrains Mono, monospace",
    body: "Space Grotesk, system-ui, sans-serif",
  },
};
```

5. Update tailwind.config.ts to use cyberpunk theme:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "system-ui", "sans-serif"],
        tech: ["JetBrains Mono", "monospace"],
        body: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        neon: {
          purple: "var(--color-neon-purple)",
          cyan: "var(--color-neon-cyan)",
          blue: "var(--color-neon-blue)",
          pink: "var(--color-neon-pink)",
          green: "var(--color-neon-green)",
        },
        space: {
          black: "var(--color-space-black)",
          starfield: "var(--color-starfield)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

6. Add font imports to src/app/layout.tsx:

```typescript
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

const techFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-tech",
  weight: ["300", "400", "500", "600", "700"],
});
```

### Code Snippets

Cyberpunk color palette values:
```css
/* Reference values for OKLCH colors */
oklch(0.65 0.25 320)  /* Neon Purple - Magenta hue */
oklch(0.75 0.18 190)  /* Neon Cyan - Bright cyan */
oklch(0.60 0.22 250)  /* Neon Blue - Electric blue */
oklch(0.70 0.20 350)  /* Neon Pink - Hot pink */
oklch(0.70 0.20 140)  /* Neon Green - Matrix green */
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] All required dependencies installed successfully in package.json
- [ ] src/app/globals.css updated with cyberpunk design tokens in OKLCH color space
- [ ] Custom CSS classes (glow-text, glow-border, glass-panel, neon-grid, etc.) defined in globals.css
- [ ] src/lib/cyber-theme.ts created with cyber theme configuration
- [ ] tailwind.config.ts updated to use cyberpunk theme with custom fonts
- [ ] Fonts (Orbitron, JetBrains Mono, Space Grotesk) imported in layout.tsx
- [ ] npm run dev starts successfully with no CSS errors
- [ ] Page background displays deep space black color
- [ ] No existing design tokens remain in globals.css (fully replaced)

## Notes

- OKLCH color space provides perceptually uniform colors and better control over hue/chroma
- Cyberpunk theme uses dark backgrounds with high-contrast neon accents for maximum visibility
- Glassmorphism panels use backdrop-filter for transparency effects - ensure browser compatibility
- All animations use CSS transitions for performance (60fps target)
- Token naming follows semantic pattern: --color-{category}-{variant}
- Font loading may impact initial page load - consider font-display: swap for faster rendering
- Backdrop-filter is not supported in some older browsers - provide fallback if needed