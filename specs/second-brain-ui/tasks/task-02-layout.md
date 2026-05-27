# Task 02: Core Layout Components

## Status

complete

## Wave

2

## Description

Create the core layout components that form the command center structure: CyberHeader (top navigation), CyberSidebar (left navigation and widgets), MainViewport (main content area), and BottomPanel (bottom widgets panel). These components establish the responsive grid layout that all other UI elements will slot into.

## Dependencies

**Depends on:** task-01-foundation, task-14-shared-ui
**Blocks:** task-03-dashboard, task-08-note-editor, task-10-notes-list, task-13-ai-query, task-16-settings

**Context from dependencies:** task-01-foundation provides cyberpunk design tokens and layout classes (.planner-bg, .glass-panel). task-14-shared-ui provides CyberButton and other shared components used in navigation and headers.

## Files to Create

- `src/components/layout/cyber-header.tsx` — Top header with logo, search, AI query, user profile
- `src/components/layout/cyber-sidebar.tsx` — Left sidebar with navigation, stats, recent notes
- `src/components/layout/main-viewport.tsx` — Main content area container
- `src/components/layout/bottom-panel.tsx` — Bottom panel with widget tabs

## Files to Modify

- `src/app/layout.tsx` — Update to use new layout components
- `src/lib/utils.ts` — Add utility functions if needed (e.g., cn from clsx)

## Technical Details

### Implementation Steps

1. Create src/components/layout/cyber-header.tsx:

```typescript
import { Search, Sparkles, User, Terminal } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";

export function CyberHeader() {
  return (
    <header className="glass-panel border-b border-neon-cyan/30 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-6 w-6 text-neon-cyan glow-text" />
          <h1 className="text-xl font-display font-bold tracking-tight text-text-primary">
            SECOND<span className="text-neon-cyan">BRAIN</span>
          </h1>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
          <CyberInput
            placeholder="Search notes, query knowledge graph..."
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Right: AI Query & User */}
      <div className="flex items-center gap-3">
        <CyberButton variant="neon" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Query</span>
        </CyberButton>
        <div className="flex items-center gap-2 border-l border-glass-border pl-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
            <User className="h-5 w-5 text-space-black" />
          </div>
        </div>
      </div>
    </header>
  );
}
```

2. Create src/components/layout/cyber-sidebar.tsx:

```typescript
import {
  Home,
  FileText,
  Network,
  MessageSquare,
  Settings,
  TrendingUp,
  Clock,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NeonBadge } from "@/components/ui/neon-badge";
import { CyberButton } from "@/components/ui/cyber-button";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

export function CyberSidebar() {
  const navItems: NavItem[] = [
    { icon: Home, label: "Dashboard", href: "/", active: true },
    { icon: FileText, label: "Notes", href: "/notes" },
    { icon: Network, label: "Knowledge Graph", href: "/graph" },
    { icon: MessageSquare, label: "AI Query", href: "/ai" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const quickStats = [
    { label: "Notes", value: "123", trend: "+5" },
    { label: "Nodes", value: "456", trend: "+12" },
    { label: "Connections", value: "789", trend: "+8" },
  ];

  const recentNotes = [
    { id: 1, title: "Project Alpha Research", time: "2h ago" },
    { id: 2, title: "Meeting Notes - Q4 Planning", time: "5h ago" },
    { id: 3, title: "AI Architecture Doc", time: "1d ago" },
  ];

  return (
    <aside className="glass-panel border-r border-neon-purple/30 w-72 flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                "hover:bg-glass-highlight hover:-translate-x-1",
                item.active
                  ? "bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan glow-text"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="pt-6 pb-2">
          <p className="micro-label mb-3">QUICK STATS</p>
          <div className="grid grid-cols-3 gap-2">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel rounded-xl p-3 text-center hover-lift"
              >
                <div className="text-lg font-bold font-display text-neon-cyan">
                  {stat.value}
                </div>
                <div className="text-xs text-text-dim mt-1">{stat.label}</div>
                <div className="text-xs text-neon-green mt-0.5 flex items-center justify-center gap-0.5">
                  <TrendingUp className="h-2.5 w-2.5" />
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notes */}
        <div className="pt-4">
          <p className="micro-label mb-3">RECENT NOTES</p>
          <div className="space-y-2">
            {recentNotes.map((note) => (
              <a
                key={note.id}
                href={`/notes/${note.id}`}
                className="glass-panel rounded-lg p-3 hover-lift hover-glow-border cursor-pointer"
              >
                <div className="text-sm font-medium text-text-primary line-clamp-2">
                  {note.title}
                </div>
                <div className="text-xs text-text-dim mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {note.time}
                </div>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-glass-border">
        <CyberButton variant="primary" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </CyberButton>
      </div>
    </aside>
  );
}
```

3. Create src/components/layout/main-viewport.tsx:

```typescript
import { ReactNode } from "react";

interface MainViewportProps {
  children: ReactNode;
}

export function MainViewport({ children }: MainViewportProps) {
  return (
    <main className="flex-1 relative overflow-hidden planner-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated grid */}
        <div className="neon-grid absolute inset-0 opacity-30" />

        {/* Nebula glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-neon-cyan/10 rounded-full blur-[100px] animate-pulse delay-500" />

        {/* Scan line */}
        <div className="scan-line" />
      </div>

      {/* Content */}
      <div className="relative h-full overflow-auto">
        {children}
      </div>
    </main>
  );
}
```

4. Create src/components/layout/bottom-panel.tsx:

```typescript
import { useState } from "react";
import { MessageSquare, Network, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { CyberButton } from "@/components/ui/cyber-button";

type Tab = "ai" | "related" | "details";

export function BottomPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("ai");

  const tabs = [
    { id: "ai" as Tab, icon: MessageSquare, label: "AI Chat" },
    { id: "related" as Tab, icon: Network, label: "Related Notes" },
    { id: "details" as Tab, icon: Info, label: "Details" },
  ];

  return (
    <div className="glass-panel border-t border-neon-cyan/20 h-80 flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-glass-border">
        {tabs.map((tab) => (
          <CyberButton
            key={tab.id}
            variant={activeTab === tab.id ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </CyberButton>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "ai" && (
          <div className="h-full flex items-center justify-center text-text-dim">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-neon-cyan/50" />
              <p>AI chat panel content</p>
              <p className="text-sm mt-1">Ask questions about your notes</p>
            </div>
          </div>
        )}
        {activeTab === "related" && (
          <div className="h-full flex items-center justify-center text-text-dim">
            <div className="text-center">
              <Network className="h-12 w-12 mx-auto mb-2 text-neon-purple/50" />
              <p>Related notes content</p>
              <p className="text-sm mt-1">Connected nodes from knowledge graph</p>
            </div>
          </div>
        )}
        {activeTab === "details" && (
          <div className="h-full flex items-center justify-center text-text-dim">
            <div className="text-center">
              <Info className="h-12 w-12 mx-auto mb-2 text-neon-blue/50" />
              <p>Node details content</p>
              <p className="text-sm mt-1">Metadata and connections</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

5. Update src/app/layout.tsx to use new layout:

```typescript
import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CyberHeader } from "@/components/layout/cyber-header";
import { CyberSidebar } from "@/components/layout/cyber-sidebar";
import { MainViewport } from "@/components/layout/main-viewport";

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

export const metadata: Metadata = {
  title: "Second Brain - Cyberpunk Command Center",
  description: "Personal knowledge management system with cyberpunk aesthetic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${techFont.variable} antialiased`}
      >
        <div className="flex flex-col h-screen overflow-hidden bg-space-black">
          {/* Header */}
          <CyberHeader />

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <CyberSidebar />

            {/* Viewport */}
            <MainViewport>{children}</MainViewport>
          </div>
        </div>
      </body>
    </html>
  );
}
```

### Code Snippets

Grid layout pattern for responsive design:
```css
/* Desktop: Sidebar + Viewport */
.sidebar {
  width: 18rem; /* w-72 */
  flex-shrink: 0;
}

.viewport {
  flex: 1;
  min-width: 0; /* Prevent flex overflow */
}

/* Mobile: Stack vertically */
@media (max-width: 768px) {
  .sidebar {
    display: none; /* Or transform: translateX(-100%) with toggle */
  }
}
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] CyberHeader created with logo, search input, AI query button, and user profile
- [ ] CyberHeader uses glass-panel styling and sticky positioning
- [ ] CyberSidebar created with 5 navigation items (Dashboard, Notes, Graph, AI Query, Settings)
- [ ] CyberSidebar includes quick stats widget with 3 metrics
- [ ] CyberSidebar includes recent notes list with 3 sample notes
- [ ] CyberSidebar includes "New Note" button
- [ ] MainViewport created with animated grid background and nebula glow effects
- [ ] MainViewport includes scan line animation
- [ ] BottomPanel created with 3 tabs (AI Chat, Related Notes, Details)
- [ ] BottomPanel uses tab switching with state management
- [ ] RootLayout updated to use all layout components
- [ ] Layout is responsive (sidebar behavior on mobile defined)
- [ ] All components use cyberpunk design tokens
- [ ] All components have TypeScript interfaces and proper typing
- [ ] Navigation links use correct href patterns
- [ ] Active states implemented for navigation items

## Notes

- Sidebar width fixed at 18rem (288px) for desktop
- Bottom panel height fixed at 20rem (320px)
- Header height fixed at 4rem (64px)
- Viewport fills remaining space with flex-1
- Navigation items have hover effect with -translate-x-1 (slide right)
- Quick stats use grid layout for equal width columns
- Recent notes truncate to 2 lines with line-clamp-2
- Background effects use absolute positioning with pointer-events-none
- Nebula glows use blur-[120px] for soft effect
- Scan line animation runs continuously with 3s duration
- Tab content is placeholder - will be filled by subsequent tasks
- Layout uses flexbox for responsive behavior
- Glassmorphism panels use backdrop-blur for transparency
- All borders use cyberpunk colors (neon-cyan, neon-purple)