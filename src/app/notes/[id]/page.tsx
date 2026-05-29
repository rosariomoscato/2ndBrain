"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MainViewport } from "@/components/layout/main-viewport";
import { NoteEditor } from "@/components/notes/note-editor";
import { useSystemSettings } from "@/components/shared/system-settings-provider";
import { LoadingOrb } from "@/components/ui/loading-orb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PDFUploadZone } from "@/components/pdf/pdf-upload-zone";
import { CyberButton } from "@/components/ui/cyber-button";
import { getNoteById, updateNote, deleteNote } from "@/lib/actions/notes";
import { getNoteAttachment, deletePDFAttachment } from "@/lib/actions/pdf-upload";
import { playSuccessSound, playErrorSound } from "@/lib/sounds";
import type { NoteAttachment } from "@/lib/types";

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NotePage({ params }: NotePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { soundEffects } = useSystemSettings();
  const [note, setNote] = useState<{ title: string; content: string; tags: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<NoteAttachment | undefined>(undefined);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNoteById(id);
        if (!data) {
          router.push("/notes");
          return;
        }
        setNote({
          title: data.title,
          content: data.content ?? "",
          tags: data.tags.map(t => t.name),
        });

        // Load attachment data
        if (data.hasPdf) {
          const attachmentData = await getNoteAttachment(id);
          if (attachmentData) {
            const noteAttachment: NoteAttachment = {
              id: attachmentData.id,
              fileName: attachmentData.fileName,
              fileUrl: attachmentData.fileUrl,
              fileType: attachmentData.fileType,
              fileSize: attachmentData.fileSize,
              createdAt: attachmentData.createdAt.toISOString(),
              ...(attachmentData.pageCount !== null && { pageCount: attachmentData.pageCount }),
            };
            setAttachment(noteAttachment);
          }
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load note");
        console.error(err);
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const onSave = async (updatedNote: { title: string; content: string; tags: string[] }) => {
    try {
      await updateNote({
        id: id,
        title: updatedNote.title,
        content: updatedNote.content,
        tags: updatedNote.tags,
      });
      
      // Reload note data after successful save
      const data = await getNoteById(id);
      if (data) {
        setNote({
          title: data.title,
          content: data.content ?? "",
          tags: data.tags.map(t => t.name),
        });
      }
      
      if (soundEffects) playSuccessSound();
      toast.success("Note saved");
    } catch (error) {
      if (soundEffects) playErrorSound();
      toast.error("Failed to save note");
      console.error(error);
    }
  };

  const handleAttachPDF = () => {
    setUploadDialogOpen(true);
  };

  const handleRemovePDF = async () => {
    try {
      await deletePDFAttachment(id);
      setAttachment(undefined);
      if (soundEffects) playSuccessSound();
      toast.success("PDF removed");
    } catch (error) {
      if (soundEffects) playErrorSound();
      toast.error("Failed to remove PDF");
      console.error(error);
    }
  };

  const handleDeleteNote = async () => {
    try {
      await deleteNote(id);
      if (soundEffects) playSuccessSound();
      toast.success("Note deleted");
      router.push("/notes");
    } catch (error) {
      if (soundEffects) playErrorSound();
      toast.error("Failed to delete note");
      console.error(error);
    }
  };

  const handleUploadComplete = async () => {
    setUploadDialogOpen(false);
    // Reload attachment data
    const attachmentData = await getNoteAttachment(id);
    if (attachmentData) {
      const noteAttachment: NoteAttachment = {
        id: attachmentData.id,
        fileName: attachmentData.fileName,
        fileUrl: attachmentData.fileUrl,
        fileType: attachmentData.fileType,
        fileSize: attachmentData.fileSize,
        createdAt: attachmentData.createdAt.toISOString(),
        ...(attachmentData.pageCount !== null && { pageCount: attachmentData.pageCount }),
      };
      setAttachment(noteAttachment);
      if (soundEffects) playSuccessSound();
      toast.success("PDF attached successfully");
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
        onDelete={handleDeleteNote}
        {...(attachment && { attachment })}
        onAttachPDF={handleAttachPDF}
        onRemovePDF={handleRemovePDF}
      />
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach PDF</DialogTitle>
          </DialogHeader>
          <PDFUploadZone
            mode="attachment"
            noteId={id}
            onUploadComplete={handleUploadComplete}
            maxFiles={1}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <CyberButton variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </CyberButton>
            <CyberButton variant="neon" onClick={handleDeleteNote} className="text-neon-pink border-neon-pink/50 hover:bg-neon-pink/10">
              Delete
            </CyberButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainViewport>
  );
}
