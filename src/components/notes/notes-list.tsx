import { Clock, Link2 } from "lucide-react";
import { NeonBadge } from "@/components/ui/neon-badge";
import type { Note } from "@/lib/types";

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
                  <NeonBadge key={tag.id} variant={tag.color} className="text-[10px] px-1.5 py-0.5">
                    {tag.name}
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
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}