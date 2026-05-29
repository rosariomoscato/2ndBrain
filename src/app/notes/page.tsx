"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, LayoutGrid, List, Filter, Upload } from "lucide-react";
import { MainViewport } from "@/components/layout/main-viewport";
import { NotesGrid } from "@/components/notes/notes-grid";
import { NotesList } from "@/components/notes/notes-list";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { LoadingOrb } from "@/components/ui/loading-orb";
import { NeonBadge } from "@/components/ui/neon-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PDFUploadZone } from "@/components/pdf/pdf-upload-zone";
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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Load notes on mount
  const loadNotes = async () => {
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
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleUploadComplete = () => {
    setUploadDialogOpen(false);
    loadNotes();
  };

  // Filter notes based on search and active filter
  const filteredNotes = allNotes.filter((note) => {
    const matchesSearch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === null || note.tags.some((tag) => tag.name === activeFilter);

    return matchesSearch && matchesFilter;
  });

  const handleNoteClick = (noteId: string) => {
    router.push(`/notes/${noteId}`);
  };

  // Get unique tags for filter
  const uniqueTags = Array.from(
    new Set(allNotes.flatMap((note) => note.tags.map((t) => t.name)))
  ).sort();

  return (
    <MainViewport>
      <div className="flex h-full flex-col">
        {/* Page Header */}
        <div className="glass-panel border-neon-cyan/20 border-b px-6 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="font-display text-text-primary glow-text text-3xl font-bold tracking-tight">
                NOTES
              </h1>
              <p className="text-text-secondary mt-1">
                {loading
                  ? "Loading..."
                  : `${filteredNotes.length} ${filteredNotes.length === 1 ? "note" : "notes"}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <CyberButton variant="secondary" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload PDF
                  </CyberButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload PDF</DialogTitle>
                  </DialogHeader>
                  <PDFUploadZone
                    mode="standalone"
                    maxFiles={10}
                    onUploadComplete={handleUploadComplete}
                  />
                </DialogContent>
              </Dialog>
              <CyberButton variant="primary" size="sm" onClick={() => router.push("/notes/new")}>
                New Note
              </CyberButton>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative max-w-2xl flex-1">
              <Search className="text-text-dim absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <CyberInput
                placeholder="Search notes by title or content..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View Toggle */}
            <div className="border-glass-border flex items-center gap-1 border-l pl-4">
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
        <div className="border-glass-border flex items-center gap-2 border-b px-6 py-3">
          <Filter className="text-text-dim mr-2 h-4 w-4" />
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
            <div className="flex h-full items-center justify-center">
              <LoadingOrb />
            </div>
          ) : error ? (
            <div className="text-text-dim flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-neon-pink text-lg font-medium">Error</p>
                <p className="mt-1 text-sm">{error}</p>
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
            <div className="text-text-dim flex h-full items-center justify-center">
              <div className="text-center">
                <Search className="text-glass-border mx-auto mb-2 h-12 w-12" />
                <p className="text-lg font-medium">
                  {allNotes.length === 0 ? "No notes yet" : "No notes found"}
                </p>
                <p className="mt-1 text-sm">
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
