# Task 11: Dashboard Real Data

## Status

pending

## Wave

5

## Description

Replace all mock data in the dashboard page (src/app/page.tsx) and sidebar (src/components/layout/cyber-sidebar.tsx) with real database queries. Currently the dashboard shows hardcoded stats (123 notes, 456 nodes, 789 connections), 4 hardcoded recent activities, and hardcoded system status. The sidebar shows hardcoded quick stats and 3 hardcoded recent notes. Wire these to the real server actions.

## Dependencies

**Depends on:** task-04-notes.md, task-09-graph.md, task-10-graphify.md
**Blocks:** task-15-polish.md

**Context from dependencies:** task-04 provides `getNoteCount()` and `getNotes()`. task-09 provides `getNodeCount()` and `getEdgeCount()`. The dashboard expects `DashboardStats`, `RecentActivity` types. The sidebar expects `quickStats` (3 items with value/trend) and `recentNotes` (3 items with title/time).

## Files to Modify

- `src/app/page.tsx` — Replace mock stats, activity, and status with real data
- `src/components/layout/cyber-sidebar.tsx` — Replace mock quick stats and recent notes with real data

## Technical Details

### Implementation Steps

1. In `src/app/page.tsx`:
- Make the component async (server component)
- Import server actions: `getNoteCount`, `getNodeCount`, `getEdgeCount` from their respective files
- Import `getNotes` to get recent notes for activity
- Replace the `stats` array with real data from server actions
- Replace `recentActivity` with recent notes (last 4, mapped to activity format)
- Replace hardcoded System Status with real database connection check (can call diagnostics API or just check if counts are returned)
- The page already has `"use client"` — either remove it and make it a server component, or create a separate async data component

**Important:** The page.tsx currently has `"use client"`. To use server actions directly in the render, convert it to a server component. Alternatively, create a wrapper:
- Create a client component for interactive parts
- Use a parent server component that fetches data and passes as props

**Recommended approach:** Keep page.tsx as `"use client"` but use `useEffect` + `useState` to call server actions on mount. This is simpler and matches the existing pattern.

Add at the top of the component:
```typescript
const [stats, setStats] = useState([
  { label: "Total Notes", value: "...", change: "Loading...", icon: FileText, color: "neon-cyan" },
  { label: "Knowledge Nodes", value: "...", change: "Loading...", icon: Network, color: "neon-purple" },
  { label: "Connections", value: "...", change: "Loading...", icon: Activity, color: "neon-blue" },
]);
const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  async function loadData() {
    try {
      const [noteCount, nodeCount, edgeCount, recentNotes] = await Promise.all([
        getNoteCount(),
        getNodeCount(),
        getEdgeCount(),
        getNotes({ limit: 4 }),
      ]);
      
      setStats([
        { label: "Total Notes", value: String(noteCount), change: `${noteCount} total`, icon: FileText, color: "neon-cyan" },
        { label: "Knowledge Nodes", value: String(nodeCount), change: `${nodeCount} total`, icon: Network, color: "neon-purple" },
        { label: "Connections", value: String(edgeCount), change: `${edgeCount} total`, icon: Activity, color: "neon-blue" },
      ]);
      
      setRecentActivity(recentNotes.map((note, i) => ({
        id: note.id,
        action: i === 0 ? "Created new note" : "Updated note",
        target: note.title,
        time: note.updatedAt,
        type: i === 0 ? "create" as const : "update" as const,
      })));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoaded(true);
    }
  }
  loadData();
}, []);
```
Add the `// eslint-disable-next-line react-hooks/set-state-in-effect` before the useEffect.

2. In `src/components/layout/cyber-sidebar.tsx`:
- Add `useEffect` and `useState` imports
- Add state for `quickStats` and `recentNotes`
- Fetch real data on mount via server actions
- Replace hardcoded arrays with state values
- Add `"use client"` at top if not present (it doesn't have it currently)
- Make the component client-side since it needs state

```typescript
"use client";

import { useState, useEffect } from "react";
// ... existing imports
import { getNoteCount } from "@/lib/actions/notes";
import { getNodeCount, getEdgeCount } from "@/lib/actions/graph";
import { getNotes } from "@/lib/actions/notes";

// In component body:
const [noteCount, setNoteCount] = useState("...");
const [nodeCount, setNodeCount] = useState("...");
const [connectionCount, setConnectionCount] = useState("...");
const [recentNotesData, setRecentNotesData] = useState<{id: number; title: string; time: string}[]>([]);

useEffect(() => {
  async function load() {
    const [n, nd, e, recent] = await Promise.all([
      getNoteCount(),
      getNodeCount(),
      getEdgeCount(),
      getNotes({ limit: 3 }),
    ]);
    setNoteCount(String(n));
    setNodeCount(String(nd));
    setConnectionCount(String(e));
    setRecentNotesData(recent.map(note => ({
      id: Number(note.id.charAt(0)),
      title: note.title,
      time: note.updatedAt,
    })));
  }
  load().catch(console.error);
}, []);
```

### Notes

- Keep the loading states showing "..." or the LoadingOrb component
- The dashboard page needs `"use client"` for interactivity (hover effects, etc.)
- Error states should show the cyberpunk error styling
- The `quickActions` array doesn't change — it's navigation links
- System Status section can show real DB connection status (green if queries succeed, red if they fail)

## Acceptance Criteria

- [ ] Dashboard stats show real note/node/connection counts from database
- [ ] Recent Activity shows last 4 modified notes
- [ ] Sidebar Quick Stats show real counts
- [ ] Sidebar Recent Notes show last 3 notes with real titles and times
- [ ] Loading states display while data is being fetched
- [ ] Error states handle failed queries gracefully
