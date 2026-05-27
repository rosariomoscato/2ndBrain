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