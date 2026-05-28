"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { NeonBadge } from "@/components/ui/neon-badge";
import { NotePreview } from "./note-preview";
import { Toolbar } from "./toolbar";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  onSave?: (note: { title: string; content: string; tags: string[] }) => void;
  isReadOnly?: boolean;
}

export function NoteEditor({
  initialTitle = "",
  initialContent = "",
  initialTags = [],
  onSave,
  isReadOnly = false,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState("");

  const hasUnsavedChanges =
    title !== initialTitle ||
    content !== initialContent ||
    tags.join(",") !== initialTags.join(",");

  const handleToolbarAction = (action: string) => {
    const textarea = document.querySelector(
      ".note-content-textarea"
    ) as HTMLTextAreaElement;
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass-panel border-b border-glass-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 mr-6">
            <CyberInput
              placeholder="Note Title..."
              className="h-12 text-2xl font-bold font-display mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isReadOnly}
            />

            {!isReadOnly && (
              <div className="flex items-center gap-2 flex-wrap">
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

      {/* Split View: Editor and Preview */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col border-r border-glass-border lg:w-1/2 min-h-0">
          <div className="glass-panel border-b border-glass-border px-4 py-2">
            <span className="micro-label">EDITOR</span>
          </div>
          <div className="flex-1 overflow-hidden p-0 min-h-0">
            <textarea
              className="note-content-textarea w-full h-full bg-glass-surface/30 text-text-primary font-mono text-sm p-4 resize-none outline-none border-0 focus:ring-0"
              placeholder="Write your note in Markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              readOnly={isReadOnly}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col border-l border-glass-border lg:w-1/2 min-h-0">
          <div className="glass-panel border-b border-glass-border px-4 py-2">
            <span className="micro-label">PREVIEW</span>
          </div>
          <div className="flex-1 overflow-auto p-6 bg-glass-surface/30">
            <NotePreview content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}