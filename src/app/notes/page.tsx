"use client";

import { useState } from "react";
import { Search, LayoutGrid, List, Filter } from "lucide-react";
import { MainViewport } from "@/components/layout/main-viewport";
import { NotesGrid } from "@/components/notes/notes-grid";
import { NotesList } from "@/components/notes/notes-list";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { NeonBadge } from "@/components/ui/neon-badge";

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
    // eslint-disable-next-line no-console
    console.log("Navigate to note:", noteId);
  };

  // Get unique tags for filter
  const uniqueTags = Array.from(new Set(allNotes.flatMap((note) => note.tags))).sort();

  return (
    <MainViewport>
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
    </MainViewport>
  );
}