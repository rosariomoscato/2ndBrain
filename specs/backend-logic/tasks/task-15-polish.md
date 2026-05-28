# Task 15: Navigation & Error Handling

## Status

complete

## Wave

6

## Description

Fix all remaining navigation issues, add proper error handling and loading states across the application. This is the final polish task that ensures: all buttons and links navigate correctly, active sidebar state is dynamic, error boundaries exist for each route, loading states use the LoadingOrb component, and toast notifications show for all operations.

## Dependencies

**Depends on:** task-11-dashboard.md, task-12-notes-ui.md, task-13-ai-ui.md, task-14-graph-ui.md
**Blocks:** None

**Context from dependencies:** All previous tasks have wired the UI to real backend data. This task fixes cross-cutting concerns: navigation, error handling, and loading states that span multiple pages.

## Files to Modify

- `src/components/layout/cyber-sidebar.tsx` — Dynamic active state based on current path
- `src/components/layout/cyber-header.tsx` — User info display from session
- `src/app/page.tsx` — Header buttons (Refresh, New Note) wired to actions
- `src/app/notes/page.tsx` — New Note button navigates to /notes/new
- `src/app/error.tsx` — Cyberpunk-styled error boundary
- `src/app/notes/error.tsx` — Notes-specific error boundary
- `src/app/ai/error.tsx` — AI page error boundary
- `src/app/notes/loading.tsx` — Notes loading state
- `src/app/ai/loading.tsx` — AI page loading state
- `src/app/not-found.tsx` — Cyberpunk 404 page

## Technical Details

### Implementation Steps

1. **Sidebar active state** (cyber-sidebar.tsx):
- Use `usePathname()` from `next/navigation` to determine current route
- Set `active: true` dynamically based on pathname match

```typescript
import { usePathname } from "next/navigation";

const pathname = usePathname();

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Notes", href: "/notes" },
  { icon: Network, label: "Knowledge Graph", href: "/graph" },
  { icon: MessageSquare, label: "AI Query", href: "/ai" },
  { icon: Settings, label: "Settings", href: "/settings" },
];
```
In the map: `item.href === pathname ? "bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan glow-text" : "..."`

2. **Dashboard header buttons:**
- "Refresh" button: `onClick={() => window.location.reload()}`
- "New Note" button: wrap in `<Link href="/notes/new">` or use `useRouter().push("/notes/new")`

3. **Error boundaries** — Create cyberpunk-styled error pages:
```typescript
// src/app/error.tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="glass-panel rounded-2xl p-8 text-center max-w-lg">
        <div className="text-6xl font-display font-bold text-neon-purple mb-4">ERROR</div>
        <p className="text-text-secondary mb-6">{error.message || "Something went wrong"}</p>
        <button onClick={reset} className="command-strip px-6 py-3 rounded-xl font-bold">
          Try Again
        </button>
      </div>
    </div>
  );
}
```

4. **Loading states:**
```typescript
// src/app/notes/loading.tsx
import { LoadingOrb } from "@/components/ui/loading-orb";
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingOrb />
    </div>
  );
}
```

5. **404 page** — Update not-found.tsx with cyberpunk styling:
```typescript
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="glass-panel rounded-2xl p-8 text-center">
        <div className="text-8xl font-display font-bold glow-text mb-4">404</div>
        <p className="text-text-secondary mb-6">Node not found in the knowledge graph</p>
        <a href="/" className="command-strip px-6 py-3 rounded-xl font-bold inline-block">
          Return to Command Center
        </a>
      </div>
    </div>
  );
}
```

6. **Toast notifications:**
- Ensure `sonner` Toaster is in the root layout (check src/app/layout.tsx)
- All server action calls should show success/error toasts
- Use `toast.success()` and `toast.error()` from sonner

### Notes

- Error boundaries must be client components (`"use client"`)
- Loading files must be server components (no `"use client"`)
- The sidebar needs `"use client"` for `usePathname()` — it likely already has it
- 404 page can be a server component (no interactivity needed beyond links)

## Acceptance Criteria

- [ ] Sidebar highlights current page dynamically
- [ ] All navigation links work (sidebar, header, dashboard buttons)
- [ ] Error boundaries display cyberpunk-styled error messages
- [ ] Loading states show LoadingOrb component
- [ ] 404 page has cyberpunk styling
- [ ] Toast notifications show for all CRUD operations
- [ ] Refresh button on dashboard reloads data
- [ ] No console.error leaks in production (all caught and shown to user)
