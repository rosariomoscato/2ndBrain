"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MainViewport } from "@/components/layout/main-viewport";
import { NoteEditor } from "@/components/notes/note-editor";
import { LoadingOrb } from "@/components/ui/loading-orb";
import { getNoteById, updateNote } from "@/lib/actions/notes";

interface NotePageProps {
  params: {
    id: string;
  };
}

export default function NotePage({ params }: NotePageProps) {
  const router = useRouter();
  const [note, setNote] = useState<{ title: string; content: string; tags: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNoteById(params.id);
        if (!data) {
          router.push("/notes");
          return;
        }
        setNote({
          title: data.title,
          content: data.content ?? "",
          tags: data.tags.map(t => t.name),
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load note");
        console.error(err);
        setLoading(false);
      }
    }
    load();
  }, [params.id, router]);

  const onSave = async (updatedNote: { title: string; content: string; tags: string[] }) => {
    try {
      await updateNote({
        id: params.id,
        title: updatedNote.title,
        content: updatedNote.content,
        tags: updatedNote.tags,
      });
      toast.success("Note saved");
    } catch (error) {
      toast.error("Failed to save note");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <MainViewport>
        <div className="flex items-center justify-center h-full">
          <LoadingOrb />
        </div>
      </MainViewport>
    );
  }

  if (error || !note) {
    return (
      <MainViewport>
        <div className="flex items-center justify-center h-full text-text-dim">
          <div className="text-center">
            <p className="text-lg font-medium text-neon-pink">
              {error || "Note not found"}
            </p>
          </div>
        </div>
      </MainViewport>
    );
  }

  return (
    <MainViewport>
      <NoteEditor
        initialTitle={note.title}
        initialContent={note.content}
        initialTags={note.tags}
        onSave={onSave}
        isReadOnly={false}
      />
    </MainViewport>
  );
}