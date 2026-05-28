"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, LayoutGrid, List, Filter } from "lucide-react";
import { MainViewport } from "@/components/layout/main-viewport";
import { NotesGrid } from "@/components/notes/notes-grid";
import { NotesList } from "@/components/notes/notes-list";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { LoadingOrb } from "@/components/ui/loading-orb";
import { NeonBadge } from "@/components/ui/neon-badge";
import { getNotes } from "@/lib/actions/notes";
import type { Note } from "@/lib/types";

type ViewMode = "grid" | "list";

export default function NotesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notes on mount
  useEffect(() => {
    async function loadNotes() {
      try {
        setLoading(true);
        setError(null);
        const notes = await getNotes();
        setAllNotes(notes);
      } catch (err) {
        setError("Failed to load notes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, []);

  // Filter notes based on search and active filter
  const filteredNotes = allNotes.filter((note) => {
    const matchesSearch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === null || note.tags.some(tag => tag.name === activeFilter);

    return matchesSearch && matchesFilter;
  });

  const handleNoteClick = (noteId: string) => {
    router.push(`/notes/${noteId}`);
  };

  // Get unique tags for filter
  const uniqueTags = Array.from(
    new Set(allNotes.flatMap((note) => note.tags.map(t => t.name)))
  ).sort();

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
                {loading ? "Loading..." : `${filteredNotes.length} ${filteredNotes.length === 1 ? "note" : "notes"}`}
              </p>
            </div>
            <CyberButton
              variant="primary"
              size="sm"
              onClick={() => router.push("/notes/new")}
            >
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
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingOrb />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-text-dim">
              <div className="text-center">
                <p className="text-lg font-medium text-neon-pink">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          ) : filteredNotes.length > 0 ? (
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
                <p className="text-lg font-medium">
                  {allNotes.length === 0 ? "No notes yet" : "No notes found"}
                </p>
                <p className="text-sm mt-1">
                  {allNotes.length === 0
                    ? "Create your first note to get started"
                    : "Try adjusting your search or filters"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainViewport>
  );
}