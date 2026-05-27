"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Save } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { NeonBadge } from "@/components/ui/neon-badge";
import { AIChatPanel } from "./ai-panel";
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track unsaved changes
  
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const hasChanges =
      title !== initialTitle ||
      content !== initialContent ||
      tags.join(",") !== initialTags.join(",");

    setHasUnsavedChanges(hasChanges);
      
  }, [title, content, tags, initialTitle, initialContent, initialTags]);

  // Handle toolbar actions
  const handleToolbarAction = (action: string) => {
    const editor = document.querySelector(
      ".monaco-editor textarea"
    ) as HTMLTextAreaElement;
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
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

  // Handle adding new tag
  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  // Handle removing tag
  const handleRemoveTag = (tagToRemove: string) => {
    if (isReadOnly) return;
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle save
  const handleSave = () => {
    if (isReadOnly) return;
    // eslint-disable-next-line no-console
    console.log("Saving note:", { title, content, tags });
    alert(`Note saved!\nTitle: ${title}\nTags: ${tags.join(", ")}`);
    onSave?.({ title, content, tags });
  };

  // Handle enter key in tag input
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
          {/* Left side: Title and Tags */}
          <div className="flex-1 mr-6">
            {/* Title Input */}
            <CyberInput
              placeholder="Note Title..."
              className="h-12 text-2xl font-bold font-display mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isReadOnly}
            />

            {/* Tags Section */}
            {!isReadOnly && (
              <div className="flex items-center gap-2 flex-wrap">
                {/* Tags Display */}
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

                {/* Add Tag Input */}
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

          {/* Right side: Status and Actions */}
          <div className="flex items-center gap-3">
            {/* Unsaved Badge */}
            {hasUnsavedChanges && (
              <NeonBadge variant="pink" className="animate-pulse">
                Unsaved
              </NeonBadge>
            )}

            {/* Save Button */}
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

        {/* Toolbar */}
        <Toolbar onAction={handleToolbarAction} isReadOnly={isReadOnly} />
      </div>

      {/* Split View: Editor and Preview */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Monaco Editor Panel */}
        <div className="flex-1 flex flex-col border-r border-glass-border lg:w-1/2">
          <div className="glass-panel border-b border-glass-border px-4 py-2">
            <span className="micro-label">EDITOR</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="markdown"
              theme="vs-dark"
              value={content}
              onChange={(value) => setContent(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                tabSize: 2,
                readOnly: isReadOnly,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col border-l border-glass-border lg:w-1/2">
          <div className="glass-panel border-b border-glass-border px-4 py-2 flex items-center justify-between">
            <span className="micro-label">PREVIEW</span>
            <CyberButton variant="ghost" size="sm">
              AI Assist
            </CyberButton>
          </div>
          <div className="flex-1 overflow-auto p-6 bg-glass-surface/30">
            <NotePreview content={content} />
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      <div className="h-80 border-t border-glass-border">
        <AIChatPanel
          noteContext={{
            title,
            content,
            tags,
          }}
          onSuggestionClick={() => {
            // This callback allows the parent to handle suggestion clicks
            // The suggestion is already handled in the AIChatPanel component
          }}
        />
      </div>
    </div>
  );
}