# Task 08: Note Editor Split View

## Status

complete

## Wave

4

## Description

Create a split-view note editor with Monaco Editor on the left and live markdown preview on the right. The editor includes a toolbar with formatting options, and the preview renders markdown with syntax highlighting. This editor provides a comfortable writing experience with instant preview of formatted content. Layout is responsive with stacked view on mobile.

## Dependencies

**Depends on:** task-01-foundation, task-02-layout
**Blocks:** task-09-ai-panels, task-12-tags-manager

**Context from dependencies:** task-01 provides design tokens and Monaco Editor. task-02 provides layout components (CyberHeader, CyberSidebar, MainViewport, BottomPanel).

## Files to Create

- `src/components/notes/note-editor.tsx` — Split view note editor component
- `src/components/notes/toolbar.tsx` — Formatting toolbar component
- `src/components/notes/note-preview.tsx` — Markdown preview component

## Files to Modify

- `src/app/notes/new/page.tsx` — New note page (create)
- `src/app/notes/[id]/page.tsx` — Existing note editor page (create)

## Technical Details

### Implementation Steps

1. Create src/components/notes/toolbar.tsx:

```typescript
import { Bold, Italic, Code, Link, List, Quote, Check } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

interface ToolbarProps {
  onBold?: () => void;
  onItalic?: () => void;
  onCode?: () => void;
  onLink?: () => void;
  onList?: () => void;
  onQuote?: () => void;
  onCheck?: () => void;
}

export function Toolbar({
  onBold,
  onItalic,
  onCode,
  onLink,
  onList,
  onQuote,
  onCheck,
}: ToolbarProps) {
  const buttons = [
    { icon: Bold, onClick: onBold, title: "Bold (Ctrl+B)" },
    { icon: Italic, onClick: onItalic, title: "Italic (Ctrl+I)" },
    { icon: Code, onClick: onCode, title: "Code (Ctrl+`)" },
    { icon: Link, onClick: onLink, title: "Link (Ctrl+K)" },
    { icon: List, onClick: onList, title: "List" },
    { icon: Quote, onClick: onQuote, title: "Quote" },
    { icon: Check, onClick: onCheck, title: "Checkbox" },
  ];

  return (
    <div className="glass-panel rounded-t-xl border-b border-glass-border px-4 py-2 flex items-center gap-1">
      {buttons.map((btn, index) => (
        <CyberButton
          key={index}
          variant="ghost"
          size="sm"
          onClick={btn.onClick}
          className="h-8 w-8 p-0 justify-center"
          title={btn.title}
        >
          <btn.icon className="h-4 w-4" />
        </CyberButton>
      ))}
    </div>
  );
}
```

2. Create src/components/notes/note-preview.tsx:

```typescript
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface NotePreviewProps {
  content: string;
}

export function NotePreview({ content }: NotePreviewProps) {
  return (
    <div className="h-full overflow-auto p-6 prose prose-invert prose-neon">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg !bg-glass-surface border border-glass-border"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                {...props}
                className={`
                  ${className || ""}
                  bg-glass-surface border border-glass-border rounded px-1.5 py-0.5 text-neon-cyan font-tech
                `}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-4xl font-display font-bold text-text-primary glow-text mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-display font-bold text-text-primary mb-3 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-display font-bold text-text-primary mb-2 mt-4">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-text-secondary leading-7 mb-4">{children}</p>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-neon-cyan hover:text-neon-purple hover-glow-text transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-text-secondary mb-4 ml-4 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-text-secondary mb-4 ml-4 space-y-1">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-neon-purple pl-4 py-2 bg-glass-surface rounded-r-lg mb-4">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

3. Create src/components/notes/note-editor.tsx:

```typescript
"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Save, Sparkles } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { NeonBadge } from "@/components/ui/neon-badge";
import { Toolbar } from "./toolbar";
import { NotePreview } from "./note-preview";

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

  useEffect(() => {
    setHasUnsavedChanges(
      title !== initialTitle ||
      content !== initialContent ||
      JSON.stringify(tags) !== JSON.stringify(initialTags)
    );
  }, [title, content, tags, initialTitle, initialContent, initialTags]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleToolbarAction = (action: string) => {
    // Implement toolbar actions (will use Monaco editor API)
    console.log("Toolbar action:", action);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ title, content, tags });
      setHasUnsavedChanges(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setContent(value || "");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass-panel border-b border-glass-border px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <CyberInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-2xl font-display font-bold h-12 px-4"
            disabled={isReadOnly}
          />
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <NeonBadge variant="pink" className="animate-pulse">
                Unsaved
              </NeonBadge>
            )}
            <CyberButton variant="primary" onClick={handleSave} disabled={isReadOnly}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </CyberButton>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1 flex-1">
            {tags.map((tag) => (
              <NeonBadge key={tag} variant="cyan" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                {tag} ×
              </NeonBadge>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <CyberInput
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              className="h-8 w-40"
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              disabled={isReadOnly}
            />
            <CyberButton variant="secondary" size="sm" onClick={handleAddTag} disabled={isReadOnly}>
              Add
            </CyberButton>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col border-r border-glass-border">
          {!isReadOnly && (
            <Toolbar
              onBold={() => handleToolbarAction("bold")}
              onItalic={() => handleToolbarAction("italic")}
              onCode={() => handleToolbarAction("code")}
              onLink={() => handleToolbarAction("link")}
              onList={() => handleToolbarAction("list")}
              onQuote={() => handleToolbarAction("quote")}
              onCheck={() => handleToolbarAction("check")}
            />
          )}

          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="markdown"
              value={content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
                tabSize: 2,
                readOnly: isReadOnly,
              }}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 overflow-hidden lg:border-l border-glass-border">
          <div className="glass-panel border-b border-glass-border px-4 py-2 flex items-center justify-between">
            <span className="micro-label">PREVIEW</span>
            <CyberButton variant="ghost" size="sm">
              <Sparkles className="h-4 w-4 mr-1" />
              AI Assist
            </CyberButton>
          </div>
          <NotePreview content={content} />
        </div>
      </div>
    </div>
  );
}
```

4. Create src/app/notes/new/page.tsx:

```typescript
import { NoteEditor } from "@/components/notes/note-editor";

export default function NewNotePage() {
  const handleSave = (note: { title: string; content: string; tags: string[] }) => {
    // Save note to backend (will be implemented later)
    console.log("Saving note:", note);
    alert("Note saved! (Backend integration coming soon)");
  };

  return <NoteEditor onSave={handleSave} />;
}
```

5. Create src/app/notes/[id]/page.tsx:

```typescript
import { NoteEditor } from "@/components/notes/note-editor";
import { notFound } from "next/navigation";

// Mock data - will be replaced with backend call
const mockNotes: Record<string, { title: string; content: string; tags: string[] }> = {
  "1": {
    title: "Transformers Architecture Explained",
    content: "# Transformers Architecture\n\nDeep dive into transformer architecture and attention mechanisms...",
    tags: ["AI", "ML", "NLP"],
  },
};

export default function NoteEditorPage({ params }: { params: { id: string } }) {
  const note = mockNotes[params.id];

  if (!note) {
    notFound();
  }

  const handleSave = (noteData: { title: string; content: string; tags: string[] }) => {
    console.log("Updating note:", noteData);
    alert("Note updated! (Backend integration coming soon)");
  };

  return (
    <NoteEditor
      initialTitle={note.title}
      initialContent={note.content}
      initialTags={note.tags}
      onSave={handleSave}
    />
  );
}
```

### Code Snippets

Monaco Editor options:

```typescript
const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  wordWrap: "on",
  automaticLayout: true,
  tabSize: 2,
  readOnly: false,
};
```

Markdown styling with prose classes:

```css
.prose-neon {
  --prose-body: var(--color-text-secondary);
  --prose-headings: var(--color-text-primary);
  --prose-links: var(--color-neon-cyan);
  --prose-strong: var(--color-neon-purple);
  --prose-code: var(--color-neon-cyan);
}
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] NoteEditor component created with split view
- [ ] Editor uses Monaco Editor with markdown language
- [ ] Preview uses react-markdown with syntax highlighting
- [ ] Toolbar created with 7 formatting buttons
- [ ] Toolbar includes Bold, Italic, Code, Link, List, Quote, Checkbox
- [ ] Editor displays title input with large font
- [ ] Editor displays tags section with add/remove functionality
- [ ] Tags displayed as NeonBadge components
- [ ] "Add" button creates new tags
- [ ] Tag badges click to remove
- [ ] Unsaved changes indicator shows "Unsaved" badge
- [ ] Save button triggers onSave callback
- [ ] Save button disabled in read-only mode
- [ ] Split view responsive (stacked on mobile, side-by-side on desktop)
- [ ] Editor options configured (no minimap, word wrap on, tab size 2)
- [ ] Monaco Editor theme set to vs-dark
- [ ] Preview panel has "PREVIEW" header
- [ ] Preview panel has "AI Assist" button
- [ ] Markdown rendering with custom styling
- [ ] Code blocks syntax highlighted
- [ ] Headings use display font with glow effect
- [ ] Links use neon cyan color
- [ ] Blockquotes have purple left border
- [ ] Lists use proper indentation
- [ ] New note page created at /notes/new
- [ ] Existing note page created at /notes/[id]
- [ ] Mock data for existing notes
- [ ] notFound() for non-existent notes
- [ ] All components use cyberpunk styling
- [ ] Glass-panel styling for headers and panels
- [ ] Hover effects on buttons and tags

## Notes

- Split view uses flexbox with direction column on mobile, row on desktop
- Editor takes 50% width on desktop, 100% on mobile
- Preview takes 50% width on desktop, 100% on mobile
- Monaco Editor uses vs-dark theme for cyberpunk aesthetic
- Syntax highlighting uses vscDarkPlus theme
- Custom markdown components for consistent styling
- Headings use font-display with glow-text class
- Links have hover effect with color change and glow
- Code blocks use glass-panel background and border
- Inline code uses monospace font with neon cyan
- Blockquote uses purple left border (4px)
- Lists have proper indentation with bullets/numbers
- Toolbar buttons use ghost variant with hover effects
- Toolbar positioned at top of editor panel
- Preview panel has header with label and AI button
- Tags limited to prevent overflow (flex-wrap)
- New tag input limited to 40 characters width
- Tags stored in array state
- Unsaved changes tracked via useEffect
- Badge animates when there are unsaved changes
- Save button triggers alert (backend coming later)
- Title input uses large font (text-2xl)
- Monaco Editor auto-resizes with container
- Editor height 100% of parent container
- Preview uses prose classes for markdown styling
- Custom prose variant (prose-neon) for cyberpunk colors
- Code blocks use rounded-lg corners
- Code block background matches glass-surface
- Inline code uses px-1.5 py-0.5 padding
- New note page uses NoteEditor without initial data
- Existing note page loads from mock data
- notFound() page for invalid note IDs
- onSave callback receives title, content, tags
- isReadOnly prop disables editing features
- Read-only mode hides toolbar and disables inputs
- Read-only mode hides save button
- AI Assist button placeholder for task-09
- Title input disabled in read-only mode
- Tag input disabled in read-only mode
- Add button disabled in read-only mode
- Editor readOnly set based on isReadOnly prop
- Toolbar only visible when not read-only
- Components modular and reusable
- Type safety with TypeScript interfaces
