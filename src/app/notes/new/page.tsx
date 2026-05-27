import { MainViewport } from "@/components/layout/main-viewport";
import { NoteEditor } from "@/components/notes/note-editor";

export default function NewNotePage() {
  return (
    <MainViewport>
      <NoteEditor
        initialTitle=""
        initialContent=""
        initialTags={[]}
        onSave={(note) => {
          // eslint-disable-next-line no-console
          console.log("New note saved:", note);
        }}
        isReadOnly={false}
      />
    </MainViewport>
  );
}