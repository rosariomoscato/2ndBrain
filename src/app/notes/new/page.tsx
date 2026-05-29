"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MainViewport } from "@/components/layout/main-viewport";
import { NoteEditor } from "@/components/notes/note-editor";
import { createNote } from "@/lib/actions/notes";
import { useSystemSettings } from "@/components/shared/system-settings-provider";
import { playSuccessSound, playErrorSound } from "@/lib/sounds";
import { showNotification } from "@/lib/notifications";

export default function NewNotePage() {
  const router = useRouter();
  const { soundEffects, notifications } = useSystemSettings();

  const onSave = async (note: { title: string; content: string; tags: string[] }) => {
    try {
      const created = await createNote({
        title: note.title,
        content: note.content,
        tags: note.tags,
      });
      if (created) {
        if (soundEffects) playSuccessSound();
        toast.success("Note created");
        if (notifications) showNotification("Note Created", { body: note.title });
        router.push(`/notes/${created.id}`);
      }
    } catch (error) {
      if (soundEffects) playErrorSound();
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