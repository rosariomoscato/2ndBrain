"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { CyberButton } from "@/components/ui/cyber-button";
import { cn } from "@/lib/utils";
import { uploadPDFsBatch, attachPDFToNote } from "@/lib/actions/pdf-upload";
import { UploadProgress } from "./upload-progress";

interface PDFUploadZoneProps {
  mode: "standalone" | "attachment";
  noteId?: string; // Required for attachment mode
  onUploadComplete?: (results: Array<{ noteId?: string; fileName: string }>) => void;
  maxFiles?: number;
}

interface FileWithStatus {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  error: string | undefined;
}

export function PDFUploadZone({
  mode,
  noteId,
  onUploadComplete,
  maxFiles: propMaxFiles,
}: PDFUploadZoneProps) {
  const maxFiles = propMaxFiles ?? (mode === "standalone" ? 10 : 1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    // Validate type
    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed";
    }
    // Validate size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const filesArray = Array.from(newFiles);
      
      // Check max files limit
      if (files.length + filesArray.length > maxFiles) {
        toast.error(
          `Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`
        );
        return;
      }

      const validFiles: FileWithStatus[] = [];
      let hasErrors = false;

      filesArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          toast.error(`${file.name}: ${error}`);
          hasErrors = true;
        } else {
          validFiles.push({
            file,
            id: crypto.randomUUID(),
            status: "pending",
            error: undefined,
          });
        }
      });

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
      }

      if (hasErrors) {
        // Focus back on input to allow re-selection
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [files.length, maxFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // Reset input so same file can be selected again if needed
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    if (isUploading) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    if (mode === "attachment" && !noteId) {
      toast.error("Note ID is required for attachment mode");
      return;
    }

    setIsUploading(true);
    // Mark all as uploading
    setFiles((prev) => prev.map((f) => ({ ...f, status: "uploading" as const })));

    try {
      let results: Array<{ noteId: string | undefined; fileName: string; success: boolean }> = [];

      if (mode === "standalone") {
        // Batch upload
        const formData = new FormData();
        files.forEach((fw) => {
          formData.append("files", fw.file);
        });

        const response = await uploadPDFsBatch(formData);
        results = response.results.map((r) => ({
          fileName: r.fileName,
          success: r.success,
          noteId: r.noteId,
        }));

        // Update file statuses based on results
        setFiles((prev) =>
          prev.map((fw) => {
            const result = results.find((r) => r.fileName === fw.file.name);
            if (result) {
              return {
                ...fw,
                status: result.success ? ("success" as const) : ("error" as const),
                error: result.success ? undefined : "Upload failed",
              };
            }
            return fw;
          })
        );

        const successCount = results.filter((r) => r.success).length;
        const failCount = results.length - successCount;

        if (failCount === 0) {
          toast.success(`Successfully uploaded ${successCount} file${successCount > 1 ? "s" : ""}`);
        } else if (successCount === 0) {
          toast.error("Failed to upload files");
        } else {
          toast.warning(`Uploaded ${successCount}, failed ${failCount}`);
        }

        if (successCount > 0 && onUploadComplete) {
          const successResults = results.filter((r) => r.success);
          const callbackResults = successResults.map((r) => {
            const res: { noteId?: string; fileName: string } = { fileName: r.fileName };
            if (r.noteId) res.noteId = r.noteId;
            return res;
          });
          onUploadComplete(callbackResults);
        }

      } else {
        // Attachment mode (single file)
        const fileWrapper = files[0];
        if (!fileWrapper) return; // Should not happen given check at start

        const formData = new FormData();
        formData.append("file", fileWrapper.file);

        const response = await attachPDFToNote(noteId!, formData);

        if (response.success) {
          setFiles((prev) =>
            prev.map((fw) =>
              fw.id === fileWrapper.id
                ? { ...fw, status: "success" as const, error: undefined }
                : fw
            )
          );
          toast.success("PDF attached successfully");
          if (onUploadComplete) {
            onUploadComplete([{ fileName: fileWrapper.file.name }]);
          }
        } else {
          setFiles((prev) =>
            prev.map((fw) =>
              fw.id === fileWrapper.id
                ? { ...fw, status: "error" as const, error: response.error ?? "Unknown error" }
                : fw
            )
          );
          toast.error(response.error || "Failed to attach PDF");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setFiles((prev) =>
        prev.map((fw) => ({
          ...fw,
          status: "error" as const,
          error: error instanceof Error ? error.message : "An unknown error occurred",
        }))
      );
      toast.error("An unexpected error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  // Convert file wrapper to progress props
  const progressFiles = files.map((fw) => ({
    name: fw.file.name,
    size: fw.file.size,
    status: fw.status,
    ...(fw.error ? { error: fw.error } : {}),
  }));

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        className={cn(
          "glass-panel border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
          "hover:bg-glass-highlight",
          isDragging ? "border-neon-cyan bg-glass-highlight" : "border-neon-cyan/50",
          isUploading && "opacity-60 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-glass-surface border border-neon-cyan/30">
            <Upload className="w-8 h-8 text-neon-cyan" />
          </div>
          <div>
            <p className="text-lg font-medium text-text-primary mb-1">
              Drop PDF files here or click to browse
            </p>
            <p className="text-sm text-text-dim">
              Maximum file size: 5MB • Max {maxFiles} file{maxFiles > 1 ? "s" : ""}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple={maxFiles > 1}
            onChange={handleInputChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </div>

      {/* Selected Files List (Before Upload) */}
      {files.length > 0 && !isUploading && (
        <div className="mt-4 space-y-2">
          {files.map((fw) => (
            <div
              key={fw.id}
              className="glass-panel flex items-center gap-3 p-3 rounded-lg"
            >
              <FileText className="w-5 h-5 text-neon-cyan flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {fw.file.name}
                </p>
                <p className="text-xs text-text-dim">
                  {(fw.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <CyberButton
                variant="ghost"
                size="icon"
                onClick={() => removeFile(fw.id)}
                className="text-neon-pink hover:text-neon-pink hover:bg-neon-pink/10"
              >
                <X className="w-4 h-4" />
              </CyberButton>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <UploadProgress files={progressFiles} />
      )}

      {/* Upload Button */}
      {files.length > 0 && !isUploading && (
        <div className="mt-4 flex justify-end">
          <CyberButton
            variant="neon"
            onClick={handleUpload}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {mode === "standalone" ? "Upload Files" : "Attach to Note"}
          </CyberButton>
        </div>
      )}
    </div>
  );
}