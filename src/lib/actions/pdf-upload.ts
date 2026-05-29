"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractTextFromPDF, validatePDFFile } from "@/lib/pdf-parser";
import { upload, deleteFile } from "@/lib/storage";
import { notes, noteAttachments } from "@/lib/schema";
import { createNote, updateNote } from "./notes";

/**
 * Get authenticated session
 */
async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/**
 * Upload a PDF file and create a new note with the extracted content
 *
 * @param formData - FormData containing the file
 * @returns Promise with success status, note ID, or error message
 */
export async function uploadPDFAsNote(
  formData: FormData
): Promise<{ success: boolean; noteId?: string; error?: string }> {
  try {
    await getSession();
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate PDF file
    const validation = validatePDFFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error || "Invalid PDF file" };
    }

    // Convert to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text from PDF
    const extracted = await extractTextFromPDF(buffer);

    // Use PDF title or filename as note title
    const title =
      extracted.title || file.name.replace(/\.pdf$/i, "").replace(/_/g, " ") || "Untitled PDF";

    // Upload file to storage
    const storageResult = await upload(buffer, file.name, "pdfs");

    // Create note with extracted text
    const note = await createNote({
      title,
      content: extracted.text,
      importance: 3,
    });

    if (!note) {
      return { success: false, error: "Failed to create note" };
    }

    // Insert into noteAttachments table
    await db.insert(noteAttachments).values({
      noteId: note.id,
      fileName: file.name,
      fileUrl: storageResult.url,
      fileType: "application/pdf",
      fileSize: file.size,
      extractedText: extracted.text,
      pageCount: extracted.pageCount,
      pdfMetadata: extracted.title || extracted.author ? {
        ...(extracted.title && { title: extracted.title }),
        ...(extracted.author && { author: extracted.author }),
      } : undefined,
    });

    return { success: true, noteId: note.id };
  } catch (error) {
    console.error("Error uploading PDF as note:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload PDF",
    };
  }
}

/**
 * Upload multiple PDF files and create notes for each one
 *
 * @param formData - FormData containing the files
 * @returns Promise with array of results for each file
 */
export async function uploadPDFsBatch(
  formData: FormData
): Promise<{
  results: Array<{ success: boolean; noteId?: string; fileName: string; error?: string }>;
}> {
  try {
    await getSession();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return { results: [] };
    }

    // Process each file
    const results = await Promise.all(
      files.map(async (file) => {
        try {
          // Validate PDF file
          const validation = validatePDFFile(file);
          if (!validation.valid) {
            return {
              success: false,
              fileName: file.name,
              error: validation.error || "Invalid PDF file",
            };
          }

          // Convert to Buffer
          const buffer = Buffer.from(await file.arrayBuffer());

          // Extract text from PDF
          const extracted = await extractTextFromPDF(buffer);

          // Use PDF title or filename as note title
          const title =
            extracted.title ||
            file.name.replace(/\.pdf$/i, "").replace(/_/g, " ") ||
            "Untitled PDF";

          // Upload file to storage
          const storageResult = await upload(buffer, file.name, "pdfs");

          // Create note with extracted text
          const note = await createNote({
            title,
            content: extracted.text,
            importance: 3,
          });

          if (!note) {
            return {
              success: false,
              fileName: file.name,
              error: "Failed to create note",
            };
          }

          // Insert into noteAttachments table
          await db.insert(noteAttachments).values({
            noteId: note.id,
            fileName: file.name,
            fileUrl: storageResult.url,
            fileType: "application/pdf",
            fileSize: file.size,
            extractedText: extracted.text,
            pageCount: extracted.pageCount,
            pdfMetadata: extracted.title || extracted.author ? {
              ...(extracted.title && { title: extracted.title }),
              ...(extracted.author && { author: extracted.author }),
            } : undefined,
          });

          return {
            success: true,
            fileName: file.name,
            noteId: note.id,
          };
        } catch (error) {
          console.error(`Error uploading PDF ${file.name}:`, error);
          return {
            success: false,
            fileName: file.name,
            error: error instanceof Error ? error.message : "Failed to upload PDF",
          };
        }
      })
    );

    return { results };
  } catch (error) {
    console.error("Error in batch PDF upload:", error);
    return {
      results: [],
    };
  }
}

/**
 * Attach a PDF file to an existing note
 *
 * @param noteId - ID of the note to attach the PDF to
 * @param formData - FormData containing the file
 * @returns Promise with success status or error message
 */
export async function attachPDFToNote(
  noteId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();

    // Verify note ownership
    const existingNote = await db
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    if (existingNote.length === 0 || existingNote[0]?.userId !== session.user.id) {
      return { success: false, error: "Note not found or unauthorized" };
    }

    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate PDF file
    const validation = validatePDFFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error || "Invalid PDF file" };
    }

    // Convert to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text from PDF
    const extracted = await extractTextFromPDF(buffer);

    // Upload file to storage
    const storageResult = await upload(buffer, file.name, "pdfs");

    // Append text to existing note content
    const currentNote = existingNote[0];
    const updatedContent =
      currentNote.content + (currentNote.content ? "\n\n" : "") + extracted.text;

    // Update note
    await updateNote({
      id: noteId,
      content: updatedContent,
    });

    // Insert into noteAttachments table
    await db.insert(noteAttachments).values({
      noteId,
      fileName: file.name,
      fileUrl: storageResult.url,
      fileType: "application/pdf",
      fileSize: file.size,
      extractedText: extracted.text,
      pageCount: extracted.pageCount,
      pdfMetadata: extracted.title || extracted.author ? {
        ...(extracted.title && { title: extracted.title }),
        ...(extracted.author && { author: extracted.author }),
      } : undefined,
    });

    return { success: true };
  } catch (error) {
    console.error("Error attaching PDF to note:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to attach PDF",
    };
  }
}

/**
 * Get attachment metadata for a note
 *
 * @param noteId - ID of the note
 * @returns Promise with attachment data or null if not found
 */
export async function getNoteAttachment(noteId: string): Promise<
  | {
      id: string;
      noteId: string;
      fileName: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
      extractedText?: string | null;
      pageCount?: number | null;
      pdfMetadata?: { title?: string; author?: string } | null;
      createdAt: Date;
    }
  | null
> {
  try {
    const session = await getSession();

    // Verify note ownership first
    const note = await db
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    if (note.length === 0 || note[0]?.userId !== session.user.id) {
      return null;
    }

    // Get attachment
    const attachments = await db
      .select()
      .from(noteAttachments)
      .where(eq(noteAttachments.noteId, noteId))
      .limit(1);

    if (attachments.length === 0) {
      return null;
    }

    const attachment = attachments[0];
    if (!attachment) {
      return null;
    }

    return {
      id: attachment.id,
      noteId: attachment.noteId,
      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl,
      fileType: attachment.fileType,
      fileSize: attachment.fileSize,
      extractedText: attachment.extractedText,
      pageCount: attachment.pageCount,
      pdfMetadata: attachment.pdfMetadata,
      createdAt: attachment.createdAt,
    };
  } catch (error) {
    console.error("Error getting note attachment:", error);
    return null;
  }
}

/**
 * Delete a PDF attachment from a note
 *
 * @param noteId - ID of the note
 * @returns Promise with success status
 */
export async function deletePDFAttachment(noteId: string): Promise<{ success: boolean }> {
  try {
    const session = await getSession();

    // Verify note ownership
    const note = await db
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    if (note.length === 0 || note[0]?.userId !== session.user.id) {
      return { success: false };
    }

    // Get attachment metadata
    const attachments = await db
      .select()
      .from(noteAttachments)
      .where(eq(noteAttachments.noteId, noteId))
      .limit(1);

    if (attachments.length === 0) {
      return { success: true }; // No attachment to delete
    }

    const attachment = attachments[0];
    if (attachment) {
      // Delete file from storage
      await deleteFile(attachment.fileUrl);
    }

    // Delete attachment row from DB
    await db.delete(noteAttachments).where(eq(noteAttachments.noteId, noteId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting PDF attachment:", error);
    return { success: false };
  }
}