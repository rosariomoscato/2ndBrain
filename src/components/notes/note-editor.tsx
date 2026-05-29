"use client";

import { useState } from "react";
import { Save, Upload, X, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { NeonBadge } from "@/components/ui/neon-badge";
import { NotePreview } from "./note-preview";
import { Toolbar } from "./toolbar";
import { PDFViewer } from "@/components/pdf/pdf-viewer";
import type { NoteAttachment } from "@/lib/types";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  onSave?: (note: { title: string; content: string; tags: string[] }) => void;
  isReadOnly?: boolean;
  attachment?: NoteAttachment;
  onAttachPDF?: () => void;
  onRemovePDF?: () => void;
  onDelete?: () => void;
}

export function NoteEditor({
  initialTitle = "",
  initialContent = "",
  initialTags = [],
  onSave,
  isReadOnly = false,
  attachment,
  onAttachPDF,
  onRemovePDF,
  onDelete,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState("");
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

  const hasUnsavedChanges =
    title !== initialTitle ||
    content !== initialContent ||
    tags.join(",") !== initialTags.join(",");

  const handleToolbarAction = (action: string) => {
    const textarea = document.querySelector(".note-content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const before = content.substring(0, start);
    const after = content.substring(end);

    let newText = "";

    switch (action) {
      case "bold":
        newText = `${before}**${selectedText || "bold text"}**${after}`;
        break;
      case "italic":
        newText = `${before}*${selectedText || "italic text"}*${after}`;
        break;
      case "code":
        newText = `${before}\`\`${selectedText || "code"}\`\`${after}`;
        break;
      case "link":
        newText = `${before}[${selectedText || "link text"}](url)${after}`;
        break;
      case "list":
        newText = `${before}- ${selectedText || "list item"}${after}`;
        break;
      case "quote":
        newText = `${before}> ${selectedText || "quote"}${after}`;
        break;
      case "checkbox":
        newText = `${before}- [ ] ${selectedText || "checkbox item"}${after}`;
        break;
      default:
        return;
    }

    setContent(newText);
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (isReadOnly) return;
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (isReadOnly) return;
    onSave?.({ title, content, tags });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="glass-panel border-glass-border border-b px-6 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="mr-6 flex-1">
            <CyberInput
              placeholder="Note Title..."
              className="font-display mb-3 h-12 text-2xl font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isReadOnly}
            />

            {!isReadOnly && (
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <NeonBadge
                    key={tag}
                    variant="cyan"
                    className="cursor-pointer hover:scale-110"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </NeonBadge>
                ))}

                <div className="flex items-center gap-2">
                  <CyberInput
                    placeholder="Add tag..."
                    className="h-8 w-40 text-sm"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    disabled={isReadOnly}
                  />
                  <CyberButton
                    variant="ghost"
                    size="sm"
                    onClick={handleAddTag}
                    disabled={isReadOnly}
                  >
                    Add
                  </CyberButton>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <NeonBadge variant="pink" className="animate-pulse">
                Unsaved
              </NeonBadge>
            )}

            {onDelete && (
              <CyberButton
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="gap-2 text-neon-pink border-neon-pink/50 hover:bg-neon-pink/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </CyberButton>
            )}

            {attachment && (
              <CyberButton
                variant="secondary"
                size="sm"
                onClick={() => setPdfViewerOpen(!pdfViewerOpen)}
                className="gap-2"
              >
                {pdfViewerOpen ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide PDF
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show PDF
                  </>
                )}
              </CyberButton>
            )}

            {!isReadOnly && (
              <>
                {attachment ? (
                  <CyberButton
                    variant="outline"
                    size="sm"
                    onClick={onRemovePDF}
                    className="gap-2 text-neon-pink border-neon-pink/50 hover:bg-neon-pink/10"
                  >
                    <X className="h-4 w-4" />
                    Remove PDF
                  </CyberButton>
                ) : (
                  <CyberButton
                    variant="secondary"
                    size="sm"
                    onClick={onAttachPDF}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Attach PDF
                  </CyberButton>
                )}
              </>
            )}

            <CyberButton
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={isReadOnly}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </CyberButton>
          </div>
        </div>

        <Toolbar onAction={handleToolbarAction} isReadOnly={isReadOnly} />
      </div>

      {/* PDF Viewer Panel */}
      {attachment && pdfViewerOpen && (
        <div className="border-glass-border border-b">
          <PDFViewer
            fileUrl={attachment.fileUrl}
            fileName={attachment.fileName}
            fileSize={attachment.fileSize}
            {...(attachment.pageCount !== undefined && { pageCount: attachment.pageCount })}
          />
        </div>
      )}

      {/* Split View: Editor and Preview */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Editor Panel */}
        <div className="border-glass-border flex min-h-0 flex-1 flex-col border-r lg:w-1/2">
          <div className="glass-panel border-glass-border border-b px-4 py-2">
            <span className="micro-label">EDITOR</span>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden p-0">
            <textarea
              className="note-content-textarea bg-glass-surface/30 text-text-primary h-full w-full resize-none border-0 p-4 font-mono text-sm outline-none focus:ring-0"
              placeholder="Write your note in Markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              readOnly={isReadOnly}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="border-glass-border flex min-h-0 flex-1 flex-col border-l lg:w-1/2">
          <div className="glass-panel border-glass-border border-b px-4 py-2">
            <span className="micro-label">PREVIEW</span>
          </div>
          <div className="bg-glass-surface/30 flex-1 overflow-auto p-6">
            <NotePreview content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
