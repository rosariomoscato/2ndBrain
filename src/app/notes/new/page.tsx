"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MainViewport } from "@/components/layout/main-viewport";
import { NoteEditor } from "@/components/notes/note-editor";
import { createNote } from "@/lib/actions/notes";

export default function NewNotePage() {
  const router = useRouter();

  const onSave = async (note: { title: string; content: string; tags: string[] }) => {
    try {
      const created = await createNote({
        title: note.title,
        content: note.content,
        tags: note.tags,
      });
      if (created) {
        toast.success("Note created");
        router.push(`/notes/${created.id}`);
      }
    } catch (error) {
      toast.error("Failed to save note");
      console.error(error);
    }
  };

  return (
    <MainViewport>
      <NoteEditor
        initialTitle=""
        initialContent=""
        initialTags={[]}
        onSave={onSave}
        isReadOnly={false}
      />
    </MainViewport>
  );
}