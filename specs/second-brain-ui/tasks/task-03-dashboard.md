# Task 03: Dashboard Command Center

## Status

complete

## Wave

3

## Description

Create the main dashboard view that serves as the command center landing page. This page displays the knowledge graph canvas prominently with sidebar widgets for quick stats and recent notes. The dashboard provides an overview of the entire Second Brain system and serves as the primary entry point for navigation.

## Dependencies

**Depends on:** task-01-foundation, task-02-layout, task-04-graph
**Blocks:** task-05-graph-nodes, task-06-graph-camera, task-07-graph-panels

**Context from dependencies:** task-01 provides design tokens, task-02 provides layout components (CyberHeader, CyberSidebar, MainViewport, BottomPanel), task-04 provides GraphCanvas component with React Flow initialization.

## Files to Create

- `src/app/page.tsx` — Main dashboard page (replacing existing boilerplate home)

## Files to Modify

- None (create new page replacing existing)

## Technical Details

### Implementation Steps

1. Create src/app/page.tsx:

```typescript
"use client";

import { CyberButton } from "@/components/ui/cyber-button";
import { CyberCard, CardContent, CardHeader, CardTitle } from "@/components/ui/cyber-card";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import {
  Plus,
  Search,
  TrendingUp,
  Clock,
  Zap,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const quickActions = [
    { icon: Plus, label: "New Note", href: "/notes/new", variant: "primary" as const },
    { icon: Search, label: "Search", href: "/notes", variant: "secondary" as const },
    { icon: Zap, label: "AI Query", href: "/ai", variant: "neon" as const },
  ];

  const stats = [
    {
      label: "Total Notes",
      value: "123",
      change: "+5 this week",
      icon: FileText,
      color: "neon-cyan",
    },
    {
      label: "Knowledge Nodes",
      value: "456",
      change: "+12 this week",
      icon: Network,
      color: "neon-purple",
    },
    {
      label: "Connections",
      value: "789",
      change: "+8 this week",
      icon: Activity,
      color: "neon-blue",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Created new note",
      target: "Project Alpha Research",
      time: "2 hours ago",
      type: "create",
    },
    {
      id: 2,
      action: "Connected nodes",
      target: "AI Architecture → Deep Learning",
      time: "4 hours ago",
      type: "connect",
    },
    {
      id: 3,
      action: "Ran AI query",
      target: "\"How do transformers work?\"",
      time: "6 hours ago",
      type: "query",
    },
    {
      id: 4,
      action: "Updated note",
      target: "Meeting Notes - Q4 Planning",
      time: "1 day ago",
      type: "update",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="glass-panel border-b border-neon-cyan/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary glow-text">
              COMMAND CENTER
            </h1>
            <p className="text-text-secondary mt-1">
              Your Second Brain at a glance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CyberButton variant="secondary" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </CyberButton>
            <CyberButton variant="primary" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </CyberButton>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Left Column: Graph (3 columns) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Knowledge Graph */}
            <div className="flex-1 min-h-[500px]">
              <div className="glass-panel rounded-2xl p-1 h-full overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <NeonBadge variant="purple">KNOWLEDGE GRAPH</NeonBadge>
                </div>
                <GraphCanvas />
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <CyberCard key={stat.label} className="hover-lift">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-glass-surface border border-glass-border flex items-center justify-center">
                        <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                      </div>
                      <TrendingUp className="h-4 w-4 text-neon-green" />
                    </div>
                    <div className="text-2xl font-bold font-display text-text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-text-secondary mt-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-neon-green mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </div>
                  </CardContent>
                </CyberCard>
              ))}
            </div>
          </div>

          {/* Right Column: Widgets (1 column) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Quick Actions */}
            <CyberCard>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action) => (
                  <CyberButton
                    key={action.label}
                    variant={action.variant}
                    className="w-full justify-start gap-3"
                    asChild
                  >
                    <a href={action.href}>
                      <action.icon className="h-4 w-4" />
                      {action.label}
                    </a>
                  </CyberButton>
                ))}
              </CardContent>
            </CyberCard>

            {/* Recent Activity */}
            <CyberCard className="flex-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="glass-panel rounded-lg p-3 hover-lift cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-glass-surface border border-glass-border flex items-center justify-center flex-shrink-0">
                          {activity.type === "create" && <Plus className="h-4 w-4 text-neon-green" />}
                          {activity.type === "connect" && <Link className="h-4 w-4 text-neon-cyan" />}
                          {activity.type === "query" && <Zap className="h-4 w-4 text-neon-purple" />}
                          {activity.type === "update" && <RefreshCw className="h-4 w-4 text-neon-blue" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-text-primary">
                            {activity.action}
                          </div>
                          <div className="text-xs text-neon-cyan mt-0.5 line-clamp-1">
                            {activity.target}
                          </div>
                          <div className="text-xs text-text-dim mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CyberCard>

            {/* System Status */}
            <CyberCard>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Graph Engine</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-sm text-neon-green">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">AI Service</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-sm text-neon-green">Ready</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Knowledge Graph</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                    <span className="text-sm text-neon-cyan">Synced</span>
                  </div>
                </div>
              </CardContent>
            </CyberCard>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Code Snippets

Stats data structure:
```typescript
interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: "neon-cyan" | "neon-purple" | "neon-blue" | "neon-pink" | "neon-green";
}
```

Activity item structure:
```typescript
interface ActivityItem {
  id: number;
  action: string;
  target: string;
  time: string;
  type: "create" | "connect" | "query" | "update";
}
```

Grid layout for dashboard:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
  {/* Left: Graph (75%) */}
  <div className="lg:col-span-3">
    {/* Graph and stats */}
  </div>
  {/* Right: Widgets (25%) */}
  <div className="lg:col-span-1">
    {/* Actions, activity, status */}
  </div>
</div>
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] Dashboard page created with command center layout
- [ ] Page header displays "COMMAND CENTER" title with neon glow
- [ ] Knowledge graph canvas displayed prominently (3 columns width)
- [ ] Graph canvas has "KNOWLEDGE GRAPH" badge overlay
- [ ] Quick stats row displays 3 cards (Total Notes, Knowledge Nodes, Connections)
- [ ] Each stat card shows value, label, and trend indicator
- [ ] Quick actions panel displays 3 buttons (New Note, Search, AI Query)
- [ ] Recent activity panel displays 4 sample activities
- [ ] Each activity shows icon, action text, target, and timestamp
- [ ] System status panel displays 3 status items (Graph Engine, AI Service, Knowledge Graph)
- [ ] Status indicators show pulsing dots with appropriate colors
- [ ] All cards use glass-panel styling with hover lift effect
- [ ] Grid layout responsive (stacks on mobile, 4 columns on desktop)
- [ ] Refresh and New Note buttons in header
- [ ] Page uses MainViewport wrapper (animated grid background)
- [ ] Page has proper TypeScript typing

## Notes

- Dashboard is the main landing page (route: /)
- Graph canvas takes up 75% of width on desktop
- Widgets take up 25% of width on desktop
- Graph canvas minimum height 500px to ensure visibility
- Quick stats show trend indicators with +X this week format
- Recent activity shows last 4 actions with different icons per type
- System status uses pulsing dots (animate-pulse) for live feel
- All text uses cyberpunk color tokens for consistency
- Stats use different neon colors (cyan, purple, blue) for visual variety
- Activity icons map to type: create→Plus, connect→Link, query→Zap, update→RefreshCw
- Page wrapper provides grid background and scan line animation
- Components are modular - stats and activity can be extracted to separate components later
- Layout uses flexbox for vertical stacking and grid for horizontal distribution
- Hover effects on cards use -translate-y-0.5 for lift
- Buttons use primary/secondary/neon variants appropriately