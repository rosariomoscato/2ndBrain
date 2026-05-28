# Task 02: Shared Types & Validation

## Status

complete

## Wave

1

## Description

Create centralized TypeScript type definitions and Zod validation schemas for all backend operations. The UI components currently have duplicated interface definitions scattered across multiple files (Note interface is duplicated 3 times, Tag interface is local to tag components). This task creates a single source of truth for types that both server actions and UI components can import from, plus Zod schemas for input validation.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-04-notes, task-05-tags, task-06-settings

**Context from dependencies:** No dependencies on other tasks. The UI components define these local interfaces that need to be centralized:
- `Note { id, title, excerpt, tags, updatedAt, connections, importance }` (in page.tsx, note-card.tsx, notes-grid.tsx, notes-list.tsx)
- `Tag { id, name, color: TagColor, usageCount, createdAt }` (in tag-editor-modal.tsx)
- `TagColor = "purple" | "cyan" | "blue" | "pink" | "green" | "orange"`
- `NodeData { label, type: "note"|"concept"|"tag"|"reference", tags, updatedAt, createdAt?, connections, importance }` (in graph-node.tsx)
- `AIResponse { query, answer, citations: Citation[], timestamp }` (in ai-response-view.tsx)
- `Citation { noteId, noteTitle, excerpt, relevance }` (in ai-response-view.tsx)
- `QueryHistoryItem { id, query, timestamp }` (in query-history.tsx)

## Files to Create

- `src/lib/types.ts` — Centralized TypeScript interfaces and type aliases
- `src/lib/validations.ts` — Zod validation schemas for all inputs

## Files to Modify

None — this is purely additive.

## Technical Details

### Implementation Steps

1. Create `src/lib/types.ts`:

```typescript
import type { TagColor } from "./types";

export type { TagColor };

export type NodeType = "note" | "concept" | "tag" | "reference";

export type NoteTag = {
  id: string;
  name: string;
  color: TagColor;
};

export type Note = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  tags: NoteTag[];
  updatedAt: string;
  connections: number;
  importance: number;
};

export type Tag = {
  id: string;
  name: string;
  color: TagColor;
  usageCount: number;
  createdAt: Date;
};

export type NodeData = {
  label: string;
  type: NodeType;
  tags: string[];
  updatedAt: string;
  createdAt?: string;
  connections: number;
  importance: number;
};

export type Citation = {
  noteId: string;
  noteTitle: string;
  excerpt: string;
  relevance: number;
};

export type AIResponse = {
  query: string;
  answer: string;
  citations: Citation[];
  timestamp: string;
};

export type QueryHistoryItem = {
  id: string;
  query: string;
  timestamp: string;
};

export type UserThemeSettings = {
  neonIntensity?: number;
  gridVisibility?: number;
  particleDensity?: number;
  scanLineSpeed?: number;
  preset?: "minimal" | "balanced" | "cyberpunk";
};

export type UserSystemSettings = {
  glassmorphism?: boolean;
  animations?: boolean;
  notifications?: boolean;
  soundEffects?: boolean;
};

export type UserAISettings = {
  model?: string;
  streamResponses?: boolean;
  includeCitations?: boolean;
  desktopNotifications?: boolean;
};

export type GraphNode = {
  id: string;
  label: string;
  type: NodeType;
  noteId: string | null;
  importance: number;
  positionX: number | null;
  positionY: number | null;
  tags: string[];
  updatedAt: string;
  connections: number;
};

export type GraphEdge = {
  id: string;
  sourceId: string;
  targetId: string;
};

export type DashboardStats = {
  totalNotes: number;
  totalNodes: number;
  totalConnections: number;
  notesTrend: string;
  nodesTrend: string;
  connectionsTrend: string;
};

export type RecentActivity = {
  id: string;
  action: string;
  target: string;
  time: string;
  type: "create" | "connect" | "query" | "update";
};
```

2. Create `src/lib/validations.ts`:

```typescript
import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  content: z.string().max(100000, "Content too long"),
  tags: z.array(z.string()).max(20, "Too many tags"),
  importance: z.number().int().min(1).max(5).optional(),
});

export const updateNoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(500).optional(),
  content: z.string().max(100000).optional(),
  tags: z.array(z.string()).max(20).optional(),
  importance: z.number().int().min(1).max(5).optional(),
});

export const deleteNoteSchema = z.object({
  id: z.string().uuid(),
});

export const createTagSchema = z.object({
  name: z.string().min(1).max(50).trim(),
  color: z.enum(["purple", "cyan", "blue", "pink", "green", "orange"]),
});

export const updateTagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50).trim().optional(),
  color: z.enum(["purple", "cyan", "blue", "pink", "green", "orange"]).optional(),
});

export const deleteTagSchema = z.object({
  id: z.string().uuid(),
});

export const aiQuerySchema = z.object({
  query: z.string().min(1).max(2000),
});

export const updateSettingsSchema = z.object({
  theme: z.object({
    neonIntensity: z.number().min(0).max(100).optional(),
    gridVisibility: z.number().min(0).max(100).optional(),
    particleDensity: z.number().min(0).max(100).optional(),
    scanLineSpeed: z.number().min(0).max(100).optional(),
    preset: z.enum(["minimal", "balanced", "cyberpunk"]).optional(),
  }).optional(),
  system: z.object({
    glassmorphism: z.boolean().optional(),
    animations: z.boolean().optional(),
    notifications: z.boolean().optional(),
    soundEffects: z.boolean().optional(),
  }).optional(),
  ai: z.object({
    model: z.string().optional(),
    streamResponses: z.boolean().optional(),
    includeCitations: z.boolean().optional(),
    desktopNotifications: z.boolean().optional(),
  }).optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type DeleteTagInput = z.infer<typeof deleteTagSchema>;
export type AIQueryInput = z.infer<typeof aiQuerySchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
```

### Important Notes

- Do NOT use enums — use string literal union types (TypeScript best practice for Next.js)
- The `Note` type is what the UI components expect — server actions return this shape
- The `Tag` type includes `usageCount` which is computed from the note_tags junction table
- The `NodeData` type is what graph-node.tsx expects — the GraphNode type maps to this
- The Zod schemas are used in server actions for input validation before database operations
- `TagColor` is a union type, not an enum, matching the existing UI usage

## Acceptance Criteria

- [ ] `src/lib/types.ts` exports all types listed above
- [ ] `src/lib/validations.ts` exports all schemas and inferred types
- [ ] Both files compile without errors (run `pnpm run typecheck`)
- [ ] No import errors — types are importable from `@/lib/types` and `@/lib/validations`
