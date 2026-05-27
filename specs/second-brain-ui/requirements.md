# Requirements: Second Brain UI - Cyberpunk Command Center

## Summary

A personal Second Brain application for managing notes, visualizing knowledge graphs, and querying data using AI. The UI features a cyberpunk command center aesthetic inspired by Tron and Blade Runner, with dark space backgrounds, neon accents (purple, cyan, blue, pink), glassmorphism panels, and 3D visual effects.

The application serves as a personal knowledge management system where users can create and edit markdown notes, visualize connections between concepts through an interactive 3D knowledge graph, and perform semantic searches using AI-powered queries. Graphify is used to extract and maintain the knowledge graph from notes and other content.

## Goals

- Create an immersive cyberpunk command center UI with space theme
- Implement an interactive 3D knowledge graph with camera controls
- Build a split-view markdown note editor with AI assistant panel
- Provide an AI query interface for semantic searches across notes
- Display note relationships and connections derived from Graphify
- Support markdown editing with live preview
- Enable tag-based organization of notes
- Create a responsive layout optimized for desktop use

## Non-Goals

- Multi-user support (personal use only)
- Real-time collaboration features
- Cloud synchronization
- Mobile app development
- Database schema implementation (UI-only phase)
- Graphify backend integration (UI-only phase)
- Authentication system (personal use)

## Acceptance Criteria

- [ ] Dashboard displays command center layout with graph, sidebar, and bottom panels
- [ ] Knowledge graph renders nodes and edges with neon glow effects
- [ ] Camera controls enable zoom, pan, and rotate of graph view
- [ ] Note editor provides split view with markdown input and live preview
- [ ] AI chat panel in note editor allows querying about note content
- [ ] Notes list supports grid and list view toggles
- [ ] Note cards display with 3D hover effects and cyberpunk styling
- [ ] Tag manager allows creating, editing, and deleting tags
- [ ] AI query interface accepts natural language questions
- [ ] AI query responses display with markdown formatting and source citations
- [ ] Settings panel provides theme customization options
- [ ] All components use cyberpunk design tokens (neon colors, glassmorphism, particles)
- [ ] Background displays animated starfield with neon grid
- [ ] Interactive elements have hover effects with neon glow
- [ ] Loading states display with animated neon orb

## Assumptions

- User will use Graphify for knowledge graph extraction
- Backend API will be implemented separately after UI phase
- User has modern browser supporting CSS Grid, Flexbox, and animations
- Application will run locally on user's machine
- Graphify output will be available as JSON for graph visualization
- AI API (OpenAI, Anthropic, or similar) will be available for semantic queries

## Technical Constraints

- **Framework**: Next.js App Router with React 19 and TypeScript
- **Styling**: Tailwind CSS v4 with custom cyberpunk design tokens in OKLCH color space
- **Icons**: Lucide React for UI icons
- **Graph Library**: React Flow for knowledge graph visualization
- **Editor**: Monaco Editor for markdown editing
- **Markdown**: react-markdown for preview rendering
- **Animations**: Framer Motion for smooth animations
- **Fonts**: Orbitron (display), JetBrains Mono (technical), Space Grotesk (body)
- **Design System**: Custom cyberpunk tokens replacing existing DESIGN.md
- **Layout**: Command center with sticky sidebar, main viewport, and bottom widgets
- **Routing**: App Router with routes for /, /notes, /graph, /ai, /settings
- **No Backend Logic**: UI components with mock data and placeholders only

## Aesthetic Requirements

- **Primary Colors**: Neon purple (#magenta-320), Neon cyan (#cyan-190), Neon blue (#blue-250), Neon pink (#pink-350)
- **Backgrounds**: Deep space black with animated starfield and neon grid overlay
- **Surfaces**: Glassmorphism panels with backdrop blur, inner highlights, and translucent borders
- **Effects**: Neon glow on text and borders, scan line animations, particle effects
- **Typography**: Tight tracking on display headings, monospace for technical labels
- **Interactions**: Hover lift effects, focus rings with neon glow, smooth transitions
- **Graph**: Nodes with glow effects, edges with gradient strokes, camera controls for navigation

## Component Constraints

- All components must use custom cyberpunk design tokens from updated DESIGN.md
- Glass panels must have consistent backdrop blur (20px) and border opacity (40%)
- Neon glow effects should use consistent spread (10px, 20px, 30px for multi-layer)
- Hover effects should use -translate-y-0.5 for lift effect
- Focus states should use ring-accent/50 with 3px width
- Loading states should use LoadingOrb component
- All text must have high contrast on translucent panels (foreground primary/secondary)
- Buttons use .command-strip gradient with pill border-radius
- Cards use .paper-card or .glass-panel classes
- Graph canvas uses .blueprint-surface for container background