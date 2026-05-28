# Task 12: Notes Pages Integration

## Status

pending

## Wave

5

## Description

Wire the notes list page, new note page, and note editor page to the real server actions. Replace all mock note arrays, console.log save handlers, and placeholder navigation with real CRUD operations. Notes list shows real notes from the database with search/filter, new note creates a real note, and note editor loads and saves real note content.

## Dependencies

**Depends on:** task-04-notes.md
**Blocks:** task-15-polish.md

**Context from dependencies:** task-04 provides `getNotes()`, `getNoteById()`, `createNote()`, `updateNote()`, `deleteNote()`. The notes list page (src/app/notes/page.tsx) has 5 mock notes. The note editor (src/components/notes/note-editor.tsx) has `console.log` save handler. The new note page (src/app/notes/new/page.tsx) has `console.log` save handler. The note [id] page (src/app/notes/[id]/page.tsx) has 1 mock note.

## Files to Modify

- `src/app/notes/page.tsx` — Replace mock notes with real data from getNotes()
- `src/app/notes/new/page.tsx` — Wire createNote() to save handler, add redirect after save
- `src/app/notes/[id]/page.tsx` — Wire getNoteById() and updateNote() to load/save
- `src/components/notes/note-editor.tsx` — Wire onSave prop to call server actions

## Technical Details

### Implementation Steps

1. **src/app/notes/page.tsx:**
- Replace `allNotes` hardcoded array with state loaded from `getNotes()`
- Add `useEffect` to load notes on mount
- Keep search and filter logic but operate on real data
- Wire `handleNoteClick` to navigate to `/notes/${noteId}` using `useRouter`
- Wire "New Note" button to navigate to `/notes/new`
- Add loading and empty states

2. **src/app/notes/new/page.tsx:**
- Replace `console.log("New note saved:", note)` with `createNote()` call
- After successful creation, redirect to `/notes/${newNote.id}` using `useRouter`
- Add error handling with toast notification (sonner)
- Import `createNote` from `@/lib/actions/notes`

```typescript
import { createNote } from "@/lib/actions/notes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
```

3. **src/app/notes/[id]/page.tsx:**
- Replace mockNotes with real data from `getNoteById(params.id)`
- Load note on mount using useEffect
- Show 404 or redirect if note not found
- Wire save handler to `updateNote()`
- Handle case where note doesn't exist (redirect to /notes)

```typescript
const [note, setNote] = useState<{ title: string; content: string; tags: string[] } | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function load() {
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
  }
  load();
}, [params.id]);

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
  }
};
```

4. **src/components/notes/note-editor.tsx:**
- The `onSave` prop already exists — no changes needed here, the parent pages handle it
- Remove `console.log("Saving note:", ...)` and `alert(...)` from the internal save handler
- The save handler should call the `onSave` prop directly

### Notes

- Notes pages already have `"use client"` directive
- Use `useRouter` from `next/navigation` for client-side navigation
- Use `toast` from `sonner` for success/error notifications (already installed)
- The Note interface from `@/lib/types` should be imported instead of the local duplicate

## Acceptance Criteria

- [ ] Notes list page shows real notes from database
- [ ] Search filters notes by title/content in real-time (client-side filtering on loaded data)
- [ ] Tag filters work with real tags
- [ ] Clicking a note navigates to /notes/[id]
- [ ] New Note page creates a real note and redirects to editor
- [ ] Note editor loads real note content
- [ ] Save persists changes to database
- [ ] Deleting a note (if implemented) removes it from list
- [ ] Loading states show while fetching data
- [ ] Error states handle failed operations
