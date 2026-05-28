import { Clock, Link2, ArrowRight } from "lucide-react";
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
      className="glass-panel border-2 rounded-xl cursor-pointer group note-card transition-all duration-300"
    >
      <CardContent className="p-4">
        {/* Title Section with Importance */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-base font-bold font-display text-text-primary group-hover:text-neon-cyan transition-colors line-clamp-2 flex-1">
            {note.title}
          </h3>
          <div className="flex gap-0.5 flex-shrink-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`importance-bar w-1 h-4 rounded-full transition-all duration-200 ${
                  i < note.importance ? "bg-neon-purple" : "bg-glass-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-sm text-text-secondary line-clamp-3 mb-3 leading-relaxed">
          {note.excerpt}
        </p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map((tag) => (
              <NeonBadge key={tag.id} variant={tag.color} className="text-[10px]">
                {tag.name}
              </NeonBadge>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-text-dim">+{note.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-glass-border">
          <div className="flex items-center gap-3 text-xs text-text-dim">
            <div className="flex items-center gap-1">
              <Link2 className="h-3 w-3" />
              {note.connections}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(note.updatedAt).toLocaleDateString()}
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-neon-cyan arrow-icon opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-2 group-hover:translate-x-0" />
        </div>
      </CardContent>
    </Card>
  );
}