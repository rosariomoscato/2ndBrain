# Design System - Second Brain (Cyberpunk Command Center)

## Overview

This project uses a cyberpunk command center aesthetic inspired by Tron, Blade Runner, and SpaceX mission control. Interfaces should feel like a futuristic knowledge management workspace with neon accents, glassmorphism panels, and space-themed backgrounds.

---

## Stack

- **Framework:** Next.js App Router + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 via `@theme inline` in `app/globals.css`
- **Components:** Cyberpunk-styled primitives in `components/ui`
- **Icons:** Lucide React
- **Fonts:** Orbitron for display, JetBrains Mono for technical, Space Grotesk for body
- **Graph Visualization:** React Flow (@xyflow/react)
- **Editor:** Monaco Editor (@monaco-editor/react)
- **Animations:** Framer Motion
- **Dark mode:** Dark-only (cyberpunk aesthetic requires dark backgrounds)

---

## Visual Direction

The app is a personal Second Brain command center, not a generic SaaS dashboard.

- Use deep space backgrounds with animated neon grids and nebula glow effects.
- Use glassmorphism panels with backdrop blur, inner highlights, and translucent borders.
- Neon glow effects on text and borders (purple, cyan, blue, pink, green).
- Make controls feel tactile: rounded pills, inner shadows, hover lift, visible focus rings.
- Scan line animations and particle effects for atmosphere.
- Avoid generic gradients, flat panels, and default-looking interfaces.

---

## Color Tokens (OKLCH)

All semantic tokens live in `app/globals.css` using OKLCH color space for perceptual uniformity.

### Primary Neon Colors

| Token         | Value                  | Usage                    |
| ------------- | ---------------------- | ------------------------ |
| `neon-purple` | `oklch(0.65 0.25 320)` | Command actions, accents |
| `neon-cyan`   | `oklch(0.75 0.18 190)` | Highlights, focus states |
| `neon-blue`   | `oklch(0.60 0.22 250)` | Secondary accents        |
| `neon-pink`   | `oklch(0.70 0.20 350)` | Emphasis, warnings       |
| `neon-green`  | `oklch(0.70 0.20 140)` | Success, online status   |

### Space Backgrounds

| Token           | Value                  | Usage                  |
| --------------- | ---------------------- | ---------------------- |
| `space-black`   | `oklch(0.08 0.01 270)` | Main background        |
| `starfield`     | `oklch(0.12 0.02 270)` | Backgrounds with stars |
| `nebula-dark`   | `oklch(0.15 0.04 260)` | Dark nebula overlays   |
| `nebula-purple` | `oklch(0.20 0.06 290)` | Purple nebula glows    |

### Glass/Surfaces

| Token             | Value                        | Usage                |
| ----------------- | ---------------------------- | -------------------- |
| `glass-surface`   | `oklch(0.10 0.03 270 / 0.6)` | Glassmorphism panels |
| `glass-border`    | `oklch(0.50 0.15 190 / 0.4)` | Panel borders        |
| `glass-highlight` | `oklch(0.60 0.15 190 / 0.2)` | Hover highlights     |

### Text

| Token            | Value                  | Usage           |
| ---------------- | ---------------------- | --------------- |
| `text-primary`   | `oklch(0.95 0.02 270)` | Primary text    |
| `text-secondary` | `oklch(0.70 0.02 270)` | Secondary text  |
| `text-dim`       | `oklch(0.50 0.02 270)` | Supporting copy |

### Status Colors

| Token               | Value                  | Usage              |
| ------------------- | ---------------------- | ------------------ |
| `status-online`     | `oklch(0.70 0.20 140)` | Online/active      |
| `status-processing` | `oklch(0.75 0.18 190)` | Processing/loading |
| `status-error`      | `oklch(0.65 0.25 320)` | Error/destructive  |

### Semantic Tokens

| Token              | Value                         | Usage              |
| ------------------ | ----------------------------- | ------------------ |
| `background`       | `oklch(0.08 0.01 270)`        | Page canvas        |
| `foreground`       | `oklch(0.95 0.02 270)`        | Primary text       |
| `card`             | `oklch(0.10 0.03 270 / 0.6)`  | Glass panels       |
| `primary`          | `oklch(0.65 0.25 320)`        | Command actions    |
| `accent`           | `oklch(0.75 0.18 190)`        | Highlights         |
| `secondary`        | `oklch(0.20 0.06 290 / 0.8)`  | Secondary surfaces |
| `muted`            | `oklch(0.15 0.04 260 / 0.64)` | Subtle surfaces    |
| `muted-foreground` | `oklch(0.70 0.02 270)`        | Supporting copy    |
| `border`           | `oklch(0.50 0.15 190 / 0.4)`  | Panel borders      |
| `ring`             | `oklch(0.80 0.15 178)`        | Focus rings        |
| `destructive`      | `oklch(0.65 0.25 320)`        | Delete/error       |

### Chart Colors

| Token     | Value                  | Usage       |
| --------- | ---------------------- | ----------- |
| `chart-1` | `oklch(0.65 0.25 320)` | Neon purple |
| `chart-2` | `oklch(0.75 0.18 190)` | Neon cyan   |
| `chart-3` | `oklch(0.60 0.22 250)` | Neon blue   |
| `chart-4` | `oklch(0.70 0.20 350)` | Neon pink   |
| `chart-5` | `oklch(0.70 0.20 140)` | Neon green  |

---

## Typography

| Font             | Usage                                          |
| ---------------- | ---------------------------------------------- |
| `Orbitron`       | Hero headings, card titles, display text       |
| `JetBrains Mono` | Technical labels, code, metadata, micro labels |
| `Space Grotesk`  | Body text, controls, forms                     |

Guidelines:

- Hero headings use `font-display` (Orbitron), tight tracking, large scale (`text-5xl` to `text-8xl`).
- Card titles use `font-display text-xl font-bold tracking-tight`.
- Technical eyebrows use `.micro-label`: mono, uppercase, wide tracking.
- Body copy uses `font-body` (Space Grotesk) with `leading-7` or `leading-8`.
- Code blocks use `font-tech` (JetBrains Mono).

---

## Core Utilities

Defined in `app/globals.css`:

- `.glow-text`: Multi-layer neon glow on text (cyan, purple, cyan)
- `.glow-border`: Neon glow on borders
- `.glass-panel`: Glassmorphism with backdrop blur, borders, shadow
- `.neon-grid`: Animated grid background with pulse effect
- `.scan-line`: Scanning line animation
- `.command-strip`: Gradient background for buttons (cyan → purple → blue)
- `.blueprint-surface`: Grid surface for graphs
- `.paper-card`: Glass card with shadow and highlight
- `.micro-label`: Uppercase monospace label style
- `.planner-bg`: Layered background with nebula glows
- `.hover-lift`: Lift effect on hover (-translate-y-0.5)
- `.focus-ring`: Focus ring with accent color
- `.animate-fade-up`: Fade in from bottom
- `.animate-scale-in`: Scale in animation

---

## Components

### Buttons

Cyberpunk buttons with neon glow effects:

```tsx
<CyberButton variant="neon" size="md">
  Button Text
</CyberButton>
```

Variants:

- `primary`: Gradient background (command-strip)
- `secondary`: Glass surface with border
- `outline`: Transparent with neon border
- `ghost`: Transparent with hover highlight
- `neon`: Gradient with glow text

Sizes: `sm`, `md`, `lg`

### Inputs

Glassmorphism inputs with neon focus rings:

```tsx
<CyberInput placeholder="Search..." />
```

### Cards

Glass cards with hover lift and glow effects:

```tsx
<CyberCard>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</CyberCard>
```

### Badges

Neon badges with monospace font:

```tsx
<NeonBadge variant="cyan">LABEL</NeonBadge>
```

Variants: `purple`, `cyan`, `blue`, `pink`, `green`, `orange`

### Loading States

Animated neon orb for loading:

```tsx
<LoadingOrb size="md" />
```

---

## Graph Components

### Knowledge Graph (React Flow)

```tsx
<GraphCanvas>
  <ReactFlow
    nodes={nodes}
    edges={edges}
    // Configuration
  >
    <Background color="neon-cyan" gap={40} size={1} variant="dots" />
    <Controls className="glass-panel" />
    <MiniMap nodeColor="neon-purple" />
  </ReactFlow>
</GraphCanvas>
```

- Nodes use `glass-panel` with neon borders
- Edges use animated strokes with neon colors
- Background uses dots pattern with neon cyan
- Controls and MiniMap use glassmorphism
- Selected nodes/edges have glow effects

---

## Layout

### Command Center Layout

```tsx
<div className="bg-space-black flex h-screen flex-col overflow-hidden">
  {/* Header */}
  <CyberHeader />

  {/* Main Content */}
  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar */}
    <CyberSidebar />

    {/* Viewport */}
    <MainViewport>{/* Page content */}</MainViewport>
  </div>
</div>
```

Dimensions:

- Header: `h-16` (4rem)
- Sidebar: `w-72` (18rem)
- Bottom Panel: `h-80` (20rem)
- Viewport: `flex-1` (remaining space)

### Grid Layout

```tsx
grid gap-6 lg:grid-cols-[minmax(0,18fr)_minmax(0,1fr)]
```

Left column: Navigation rail (18fr)
Right column: Content area (1fr)

---

## Interaction Patterns

### Hover Effects

```tsx
hover:-translate-y-0.5 hover-glow-border hover:bg-glass-highlight
```

### Focus States

```tsx
focus-visible:ring-[3px] focus-visible:ring-accent/50 focus-visible:ring-accent
```

### Disabled States

```tsx
disabled:pointer-events-none disabled:opacity-50
```

### Transitions

```tsx
transition-all duration-200
```

### Animations

- `animate-fade-up`: Fade in from bottom (0.6s)
- `animate-scale-in`: Scale in (0.4s)
- `animate-pulse`: Pulse effect
- `animate-spin`: Rotate indefinitely
- Grid pulse: `animation: grid-pulse 4s ease-in-out infinite`
- Scan line: `animation: scan 3s linear infinite`

---

## Animations & Effects

### Keyframes

```css
@keyframes grid-pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes scan {
  0% {
    top: 0;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}
```

### Particle Effects

- Nebula glows: Radial gradients with blur
- Starfield: Small dots scattered
- Particles: Three.js or CSS animations (optional)

### Sound Effects (Optional)

- Hover: Short beep
- Click: Mechanical click
- Notification: Cyberpunk chime
- Typing: Keyboard sounds

---

## Responsive Design

### Desktop (> 1024px)

- Full command center layout
- Sidebar visible and sticky
- Bottom panel visible
- All widgets expanded

### Tablet (768px - 1024px)

- Sidebar hidden (toggle button)
- Bottom panel visible
- Reduced widget sizes
- Adaptive grid columns

### Mobile (< 768px)

- Sidebar hidden (off-canvas or collapsed)
- Bottom panel stacked or hidden
- Single column layout
- Touch-friendly controls
- Simplified navigation

---

## Accessibility

- Focus rings visible on all interactive controls
- High contrast text on translucent panels (WCAG AA)
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels for icons and buttons
- Screen reader support for graphs
- Colorblind-friendly palette (avoid color-only indicators)
- Touch target minimum 44x44px

---

## Performance

- Debounce search inputs (300ms)
- Virtual scroll for long lists
- Lazy load heavy components
- Use `will-change` for animations
- Optimize images (WebP, lazy load)
- Reduce re-renders with React.memo
- Use CSS transforms instead of layout thrashing

---

## Browser Compatibility

- Chrome/Edge: Full support (Chromium)
- Firefox: Full support
- Safari: Full support (including backdrop-filter)
- Fallback for browsers without backdrop-filter:
  ```css
  @supports not (backdrop-filter: blur(20px)) {
    .glass-panel {
      background: oklch(0.1 0.03 270);
      backdrop-filter: none;
    }
  }
  ```

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx          → Root layout with fonts
│   ├── page.tsx            → Dashboard
│   └── globals.css         → Design tokens and utilities
├── components/
│   ├── layout/             → CyberHeader, CyberSidebar, MainViewport, BottomPanel
│   ├── graph/              → GraphCanvas, GraphNode, GraphEdge, CameraControls
│   ├── notes/              → NoteEditor, NotePreview, AI Panel, RelatedNotesPanel
│   ├── ai/                 → AIQueryInput, AIResponseView, QueryHistory
│   ├── ui/                 → CyberButton, CyberInput, CyberCard, NeonBadge, LoadingOrb
│   └── shared/             → StarfieldBg, ScanLine
└── lib/
    ├── utils.ts            → cn() utility
    └── cyber-theme.ts      → Theme configuration
```

---

## Usage Guidelines

### Do

- Use neon colors sparingly as accents
- Maintain consistent spacing (4px, 8px, 16px, 24px, 32px)
- Keep text contrast high
- Use glassmorphism for panels and cards
- Add subtle animations for feedback
- Use monospace for technical labels

### Don't

- Overuse neon glow (causes visual fatigue)
- Use pure white backgrounds
- Mix too many colors (max 3 per component)
- Ignore accessibility (contrast, focus states)
- Use animations that distract from content
- Break grid alignment

---

## Customization

### Theme Variables

Override in `app/globals.css`:

```css
@theme {
  --color-neon-cyan: oklch(0.75 0.18 190);
  --color-neon-purple: oklch(0.65 0.25 320);
  /* ... */
}
```

### Component Styles

Extend components:

```tsx
<CyberButton className="custom-neon-style">Custom Button</CyberButton>
```

### Animations

Adjust timing:

```css
@keyframes grid-pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}
```

Change duration in utility classes.
