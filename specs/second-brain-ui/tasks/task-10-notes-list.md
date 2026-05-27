# Task 10: Notes List View

## Status

complete

## Wave

3

## Description

Create the notes list view page with grid and list toggle, search functionality, and filter controls. This page displays all notes in a visually appealing grid layout with option to switch to list view. Notes are displayed using cyberpunk-styled cards with hover effects and metadata. Search and filters allow users to quickly find specific notes.

## Dependencies

**Depends on:** task-01-foundation, task-02-layout, task-11-notes-cards
**Blocks:** task-08-note-editor, task-12-tags-manager

**Context from dependencies:** task-01 provides design tokens and animations. task-02 provides layout components (CyberHeader, CyberSidebar, MainViewport). task-11 provides NoteCard component for displaying individual notes.

## Files to Create

- `src/app/notes/page.tsx` — Notes list page with grid/list toggle
- `src/components/notes/notes-grid.tsx` — Grid view component
- `src/components/notes/notes-list.tsx` — List view component

## Files to Modify

- None (create new pages and components)

## Technical Details

### Implementation Steps

1. Create src/components/notes/notes-grid.tsx:

```typescript
import { NoteCard } from "./note-card";

interface Note {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  updatedAt: string;
  connections: number;
  importance: number;
}

interface NotesGridProps {
  notes: Note[];
  onNoteClick: (noteId: string) => void;
}

export function NotesGrid({ notes, onNoteClick }: NotesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={() => onNoteClick(note.id)}
        />
      ))}
    </div>
  );
}
```

2. Create src/components/notes/notes-list.tsx:

```typescript
import { Clock, Link2 } from "lucide-react";
import { NeonBadge } from "@/components/ui/neon-badge";
import { CyberButton } from "@/components/ui/cyber-button";

interface Note {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  updatedAt: string;
  connections: number;
  importance: number;
}

interface NotesListProps {
  notes: Note[];
  onNoteClick: (noteId: string) => void;
}

export function NotesList({ notes, onNoteClick }: NotesListProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-text-dim font-tech uppercase tracking-wider">
        <div className="col-span-5">Title</div>
        <div className="col-span-3">Tags</div>
        <div className="col-span-2">Stats</div>
        <div className="col-span-2">Updated</div>
      </div>

      {/* Notes */}
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onNoteClick(note.id)}
          className="glass-panel rounded-lg p-4 hover-lift hover-glow-border text-left transition-all duration-200 w-full group"
        >
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Title */}
            <div className="col-span-5">
              <h3 className="text-base font-semibold font-display text-text-primary group-hover:text-neon-cyan transition-colors line-clamp-2">
                {note.title}
              </h3>
              <p className="text-sm text-text-secondary mt-1 line-clamp-1">
                {note.excerpt}
              </p>
            </div>

            {/* Tags */}
            <div className="col-span-3">
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 2).map((tag) => (
                  <NeonBadge key={tag} variant="cyan" className="text-[10px] px-1.5 py-0.5">
                    {tag}
                  </NeonBadge>
                ))}
                {note.tags.length > 2 && (
                  <span className="text-[10px] text-text-dim">+{note.tags.length - 2}</span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 text-xs text-text-dim">
                <div className="flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  {note.connections}
                </div>
              </div>
            </div>

            {/* Updated */}
            <div className="col-span-2">
              <div className="flex items-center gap-1 text-xs text-text-dim">
                <Clock className="h-3 w-3" />
                {note.updatedAt}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
```

3. Create src/app/notes/page.tsx:

```typescript
"use client";

import { useState } from "react";
import { Search, LayoutGrid, List, Filter, SortAsc } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { NeonBadge } from "@/components/ui/neon-badge";
import { NotesGrid } from "@/components/notes/notes-grid";
import { NotesList } from "@/components/notes/notes-list";

type ViewMode = "grid" | "list";

interface Note {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  updatedAt: string;
  connections: number;
  importance: number;
}

export default function NotesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Mock notes data
  const allNotes: Note[] = [
    {
      id: "1",
      title: "Transformers Architecture Explained",
      excerpt: "Deep dive into transformer architecture and attention mechanisms...",
      tags: ["AI", "ML", "NLP"],
      updatedAt: "2h ago",
      connections: 12,
      importance: 5,
    },
    {
      id: "2",
      title: "Project Alpha Research Notes",
      excerpt: "Initial research on project alpha requirements and technical specifications...",
      tags: ["Project", "Research"],
      updatedAt: "5h ago",
      connections: 8,
      importance: 4,
    },
    {
      id: "3",
      title: "Meeting Notes - Q4 Planning",
      excerpt: "Discussion about quarterly goals, resource allocation, and timeline...",
      tags: ["Meeting", "Planning"],
      updatedAt: "1d ago",
      connections: 5,
      importance: 3,
    },
    {
      id: "4",
      title: "AI System Design Document",
      excerpt: "High-level architecture design for AI-powered knowledge management system...",
      tags: ["AI", "Architecture", "Design"],
      updatedAt: "2d ago",
      connections: 15,
      importance: 5,
    },
    {
      id: "5",
      title: "Cyberpunk UI Design Principles",
      excerpt: "Guidelines for creating cyberpunk interfaces with neon accents and glassmorphism...",
      tags: ["Design", "UI", "Cyberpunk"],
      updatedAt: "3d ago",
      connections: 7,
      importance: 4,
    },
  ];

  // Filter notes based on search and active filter
  const filteredNotes = allNotes.filter((note) => {
    const matchesSearch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === null || note.tags.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  const handleNoteClick = (noteId: string) => {
    // Navigate to note editor (will be implemented in task-08)
    console.log("Navigate to note:", noteId);
  };

  // Get unique tags for filter
  const uniqueTags = Array.from(new Set(allNotes.flatMap((note) => note.tags))).sort();

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="glass-panel border-b border-neon-cyan/20 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary glow-text">
              NOTES
            </h1>
            <p className="text-text-secondary mt-1">
              {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
            </p>
          </div>
          <CyberButton variant="primary" size="sm">
            New Note
          </CyberButton>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
            <CyberInput
              placeholder="Search notes by title or content..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border-l border-glass-border pl-4">
            <CyberButton
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </CyberButton>
            <CyberButton
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </CyberButton>
          </div>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="px-6 py-3 border-b border-glass-border flex items-center gap-2">
        <Filter className="h-4 w-4 text-text-dim mr-2" />
        <NeonBadge
          variant={activeFilter === null ? "purple" : "cyan"}
          onClick={() => setActiveFilter(null)}
          className="cursor-pointer"
        >
          All
        </NeonBadge>
        {uniqueTags.map((tag) => (
          <NeonBadge
            key={tag}
            variant={activeFilter === tag ? "purple" : "cyan"}
            onClick={() => setActiveFilter(tag === activeFilter ? null : tag)}
            className="cursor-pointer"
          >
            {tag}
          </NeonBadge>
        ))}
      </div>

      {/* Notes Container */}
      <div className="flex-1 overflow-auto p-6">
        {filteredNotes.length > 0 ? (
          <>
            {viewMode === "grid" && (
              <NotesGrid notes={filteredNotes} onNoteClick={handleNoteClick} />
            )}
            {viewMode === "list" && (
              <NotesList notes={filteredNotes} onNoteClick={handleNoteClick} />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-text-dim">
            <div className="text-center">
              <Search className="h-12 w-12 mx-auto mb-2 text-glass-border" />
              <p className="text-lg font-medium">No notes found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Code Snippets

Note interface:
```typescript
interface Note {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  updatedAt: string;
  connections: number;
  importance: number;
}
```

Filtering logic:
```typescript
const filteredNotes = allNotes.filter((note) => {
  const matchesSearch =
    searchQuery === "" ||
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesFilter =
    activeFilter === null || note.tags.includes(activeFilter);

  return matchesSearch && matchesFilter;
});
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] NotesGrid component created with responsive grid layout
- [ ] NotesGrid displays 1-4 columns based on screen size
- [ ] NotesGrid uses NoteCard component for each note
- [ ] NotesList component created with table-like layout
- [ ] NotesList displays header row with column labels
- [ ] NotesList shows title, tags, stats, and updated columns
- [ ] Notes list page created at /notes route
- [ ] Page header displays "NOTES" title with note count
- [ ] Search input filters notes by title and excerpt
- [ ] View toggle buttons switch between grid and list modes
- [ ] Tags filter bar displays unique tags
- [ ] Tags filter allows selecting/deselecting tags
- [ ] "All" button resets tag filter
- [ ] Active filter highlighted with purple variant
- [ ] Empty state displays when no notes match filters
- [ ] All components use cyberpunk styling
- [ ] Hover effects on notes trigger lift and glow
- [ ] Notes count updates dynamically based on filters
- [ ] Search input has icon placeholder
- [ ] View toggle icons change based on active mode
- [ ] Page uses MainViewport wrapper

## Notes

- Grid responsive: 1 col (mobile), 2 col (md), 3 col (lg), 4 col (xl)
- List view uses fixed grid (12 columns) for consistent layout
- Filter tags sorted alphabetically
- Active filter shown with purple badge, inactive with cyan
- Search is case-insensitive
- Empty state shows search icon and helpful message
- Note click handlers log to console (navigation in task-08)
- Notes use line-clamp for text truncation
- Stats show connections count with icon
- Updated time uses relative format (2h ago, 1d ago)
- Header uses glass-panel styling with border
- Tags filter bar uses glass-panel background
- Search input uses CyberInput component
- Buttons use appropriate variants (primary/ghost)
- Layout uses flexbox for vertical stacking
- Container has overflow-auto for scrolling
- Page count updates in real-time
- Mock data includes 5 sample notes
- Tags extracted from notes for filter bar
- Filter logic uses AND (matches search AND matches filter)
- View mode persists in state
- Search query persists in state
- Active filter persists in state
- Components are modular and reusable
- List view uses button for row interactivity
- Grid view uses NoteCard component
- Both views handle empty states gracefully