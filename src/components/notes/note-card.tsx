import { Clock, Link2, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/cyber-card";
import { NeonBadge } from "@/components/ui/neon-badge";
import type { Note } from "@/lib/types";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <Card
      onClick={onClick}
      className="glass-panel group note-card cursor-pointer rounded-xl border-2 transition-all duration-300"
    >
      <CardContent className="p-4">
        {/* Title Section with Importance */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-2">
            <h3 className="font-display text-text-primary group-hover:text-neon-cyan line-clamp-2 text-base font-bold transition-colors">
              {note.title}
            </h3>
            {note.hasPdf && (
              <NeonBadge variant="cyan" className="flex-shrink-0 gap-1">
                <FileText className="h-3 w-3" />
                PDF
              </NeonBadge>
            )}
          </div>
          <div className="flex flex-shrink-0 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`importance-bar h-4 w-1 rounded-full transition-all duration-200 ${
                  i < note.importance ? "bg-neon-purple" : "bg-glass-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-text-secondary mb-3 line-clamp-3 text-sm leading-relaxed">
          {note.excerpt}
        </p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag) => (
              <NeonBadge key={tag.id} variant={tag.color} className="text-[10px]">
                {tag.name}
              </NeonBadge>
            ))}
            {note.tags.length > 3 && (
              <span className="text-text-dim text-[10px]">+{note.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-glass-border flex items-center justify-between border-t pt-3">
          <div className="text-text-dim flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Link2 className="h-3 w-3" />
              {note.connections}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(note.updatedAt).toLocaleDateString()}
            </div>
          </div>
          <ArrowRight className="text-neon-cyan arrow-icon h-4 w-4 -translate-x-2 opacity-0 transition-opacity duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
        </div>
      </CardContent>
    </Card>
  );
}
