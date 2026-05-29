# Task 12: Tag Manager

## Status

complete

## Wave

6

## Description

Create a tag manager component that allows users to create, edit, delete, and organize tags. The manager displays all tags with usage counts, allows filtering and searching, and provides bulk actions. Uses cyberpunk styling with neon badges and glassmorphism panels. Tags can be organized by frequency and filtered by search.

## Dependencies

**Depends on:** task-01-foundation, task-14-shared-ui
**Blocks:** None

**Context from dependencies:** task-01 provides design tokens. task-14 provides CyberButton, CyberInput, CyberCard, NeonBadge components.

## Files to Create

- `src/components/tags/tag-manager.tsx` — Tag manager component
- `src/components/tags/tag-editor-modal.tsx` — Modal for creating/editing tags

## Files to Modify

- `src/app/settings/page.tsx` — Integrate tag manager in settings page

## Technical Details

### Implementation Steps

1. Create src/components/tags/tag-editor-modal.tsx:

```typescript
"use client";

import { useState, useEffect } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { CyberCard, CardHeader, CardTitle, CardContent } from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { NeonBadge } from "@/components/ui/neon-badge";

interface Tag {
  id: string;
  name: string;
  color?: "purple" | "cyan" | "blue" | "pink" | "green" | "orange";
}

interface TagEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tag: Tag) => void;
  onDelete?: () => void;
  initialTag?: Tag;
}

export function TagEditorModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialTag,
}: TagEditorModalProps) {
  const [name, setName] = useState(initialTag?.name || "");
  const [color, setColor] = useState<Tag["color"]>(initialTag?.color || "cyan");

  useEffect(() => {
    if (initialTag) {
      setName(initialTag.name);
      setColor(initialTag.color);
    } else {
      setName("");
      setColor("cyan");
    }
  }, [initialTag]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        id: initialTag?.id || Date.now().toString(),
        name: name.trim(),
        color,
      });
    }
  };

  const colorOptions: Tag["color"][] = ["purple", "cyan", "blue", "pink", "green", "orange"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-black/80 backdrop-blur-sm">
      <CyberCard className="w-full max-w-md animate-scale-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {initialTag ? "Edit Tag" : "Create Tag"}
            </CardTitle>
            <CyberButton variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </CyberButton>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tag Name */}
          <div>
            <label className="micro-label block mb-2">NAME</label>
            <CyberInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tag name..."
              autoFocus
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="micro-label block mb-2">COLOR</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setColor(option)}
                  className={`
                    px-3 py-1.5 rounded-lg font-tech text-sm uppercase
                    transition-all duration-200
                    ${color === option
                      ? "ring-2 ring-neon-cyan scale-105"
                      : "opacity-60 hover:opacity-100"
                    }
                  `}
                >
                  <NeonBadge variant={option}>{option}</NeonBadge>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {name && (
            <div>
              <label className="micro-label block mb-2">PREVIEW</label>
              <div className="flex items-center gap-2">
                <NeonBadge variant={color}>{name}</NeonBadge>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-glass-border">
            {onDelete && initialTag && (
              <CyberButton variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </CyberButton>
            )}
            <div className="flex gap-2 ml-auto">
              <CyberButton variant="secondary" onClick={onClose}>
                Cancel
              </CyberButton>
              <CyberButton variant="primary" onClick={handleSave} disabled={!name.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </CyberButton>
            </div>
          </div>
        </CardContent>
      </CyberCard>
    </div>
  );
}
```

2. Create src/components/tags/tag-manager.tsx:

```typescript
"use client";

import { useState } from "react";
import { Plus, Search, SortAsc, Tag as TagIcon, Hash } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { NeonBadge } from "@/components/ui/neon-badge";
import { TagEditorModal } from "./tag-editor-modal";

interface Tag {
  id: string;
  name: string;
  color: "purple" | "cyan" | "blue" | "pink" | "green" | "orange";
  usageCount: number;
  createdAt: string;
}

export function TagManager() {
  const [tags, setTags] = useState<Tag[]>([
    {
      id: "1",
      name: "AI",
      color: "cyan",
      usageCount: 23,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "ML",
      color: "purple",
      usageCount: 18,
      createdAt: "2024-01-15",
    },
    {
      id: "3",
      name: "NLP",
      color: "blue",
      usageCount: 12,
      createdAt: "2024-01-20",
    },
    {
      id: "4",
      name: "Project",
      color: "pink",
      usageCount: 15,
      createdAt: "2024-01-10",
    },
    {
      id: "5",
      name: "Research",
      color: "green",
      usageCount: 9,
      createdAt: "2024-01-18",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "usage" | "date">("usage");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | undefined>(undefined);

  const filteredTags = tags
    .filter((tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "usage":
          return b.usageCount - a.usageCount;
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const handleCreateTag = () => {
    setEditingTag(undefined);
    setIsModalOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  const handleSaveTag = (tag: Tag) => {
    if (editingTag) {
      setTags(tags.map((t) => (t.id === tag.id ? tag : t)));
    } else {
      setTags([
        {
          ...tag,
          usageCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
        },
        ...tags,
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTag = () => {
    if (editingTag) {
      setTags(tags.filter((t) => t.id !== editingTag.id));
      setIsModalOpen(false);
    }
  };

  const handleBulkDelete = () => {
    setTags(tags.filter((t) => !selectedTags.includes(t.id)));
    setSelectedTags([]);
  };

  const handleSelectAll = () => {
    if (selectedTags.length === filteredTags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(filteredTags.map((t) => t.id));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary glow-text">
            TAG MANAGER
          </h2>
          <p className="text-text-secondary mt-1">
            {tags.length} {tags.length === 1 ? "tag" : "tags"} total
          </p>
        </div>
        <CyberButton variant="primary" onClick={handleCreateTag}>
          <Plus className="h-4 w-4 mr-2" />
          New Tag
        </CyberButton>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
          <CyberInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-1">
          <CyberButton
            variant={sortBy === "name" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSortBy("name")}
          >
            Name
          </CyberButton>
          <CyberButton
            variant={sortBy === "usage" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSortBy("usage")}
          >
            Usage
          </CyberButton>
          <CyberButton
            variant={sortBy === "date" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSortBy("date")}
          >
            Date
          </CyberButton>
        </div>

        {selectedTags.length > 0 && (
          <CyberButton
            variant="secondary"
            size="sm"
            onClick={handleBulkDelete}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete ({selectedTags.length})
          </CyberButton>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedTags.length > 0 && (
        <div className="glass-panel rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CyberButton variant="ghost" size="sm" onClick={handleSelectAll}>
              {selectedTags.length === filteredTags.length ? "Deselect All" : "Select All"}
            </CyberButton>
            <span className="text-sm text-text-secondary">
              {selectedTags.length} selected
            </span>
          </div>
        </div>
      )}

      {/* Tags List */}
      <div className="flex-1 overflow-auto space-y-2">
        {filteredTags.length === 0 ? (
          <div className="text-center text-text-dim py-12">
            <TagIcon className="h-12 w-12 mx-auto mb-3 text-glass-border" />
            <p>No tags found</p>
            <p className="text-sm mt-1">Try adjusting your search or create a new tag</p>
          </div>
        ) : (
          filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="glass-panel rounded-lg p-4 hover-lift hover-glow-border transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTags([...selectedTags, tag.id]);
                    } else {
                      setSelectedTags(selectedTags.filter((id) => id !== tag.id));
                    }
                  }}
                  className="w-4 h-4 rounded border-glass-border accent-neon-cyan"
                />

                {/* Tag Badge */}
                <NeonBadge variant={tag.color} className="text-sm">
                  {tag.name}
                </NeonBadge>

                {/* Stats */}
                <div className="flex items-center gap-3 text-sm text-text-dim flex-1">
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {tag.usageCount} notes
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {tag.createdAt}
                  </div>
                </div>

                {/* Actions */}
                <CyberButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditTag(tag)}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-4 w-4" />
                </CyberButton>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tag Editor Modal */}
      <TagEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTag}
        onDelete={handleDeleteTag}
        initialTag={editingTag}
      />
    </div>
  );
}
```

3. Update src/app/settings/page.tsx to integrate tag manager:

```typescript
import { TagManager } from "@/components/tags/tag-manager";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="glass-panel border-b border-neon-cyan/20 px-6 py-4">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary glow-text">
          SETTINGS
        </h1>
        <p className="text-text-secondary mt-1">
          Customize your Second Brain experience
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <TagManager />
      </div>
    </div>
  );
}
```

4. Add missing imports:

```typescript
import { Calendar, Edit2, Trash2 } from "lucide-react";
```

### Code Snippets

Tag sorting logic:

```typescript
const sortedTags = tags.sort((a, b) => {
  switch (sortBy) {
    case "name":
      return a.name.localeCompare(b.name);
    case "usage":
      return b.usageCount - a.usageCount;
    case "date":
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    default:
      return 0;
  }
});
```

Bulk selection:

```typescript
const handleSelectAll = () => {
  if (selectedTags.length === filteredTags.length) {
    setSelectedTags([]);
  } else {
    setSelectedTags(filteredTags.map((t) => t.id));
  }
};
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] TagManager component created
- [ ] TagEditorModal component created
- [ ] Modal allows creating new tags
- [ ] Modal allows editing existing tags
- [ ] Modal allows deleting tags
- [ ] Modal shows tag name input
- [ ] Modal shows color selection (6 options)
- [ ] Modal shows preview badge
- [ ] Modal has save and cancel buttons
- [ ] Modal has delete button for existing tags
- [ ] Tags list displays all tags with stats
- [ ] Tags list shows tag name with badge
- [ ] Tags list shows usage count
- [ ] Tags list shows creation date
- [ ] Tags list has edit button (visible on hover)
- [ ] Tags list has checkbox for bulk selection
- [ ] Tags list uses glass-panel styling
- [ ] Tags list uses hover-lift effect
- [ ] Tags list uses hover-glow-border effect
- [ ] Search input filters tags by name
- [ ] Sort buttons sort by name/usage/date
- [ ] Active sort button uses primary variant
- [ ] Select all button toggles selection
- [ ] Bulk delete button appears when tags selected
- [ ] Bulk delete shows count of selected tags
- [ ] New tag button in header
- [ ] Header shows total tag count
- [ ] Empty state shows message when no tags
- [ ] Empty state shows prompt to create tag
- [ ] All components use cyberpunk styling
- [ ] All components use neon colors
- [ ] All components use glassmorphism
- [ ] All components use proper animations
- [ ] All components use proper transitions
- [ ] All components use proper spacing
- [ ] All components use proper icons
- [ ] All components use proper typography
- [ ] All components use proper TypeScript

## Notes

- Tag color options: purple, cyan, blue, pink, green, orange
- Color selection uses button with ring highlight
- Color button scales 105% when selected
- Color button opacity 60% when not selected
- Preview shows badge with selected color
- Tags sorted based on sortBy state
- Default sort by usage (descending)
- Name sort uses localeCompare
- Date sort uses timestamp comparison
- Usage sort subtracts a - b
- Search query filters tags by name
- Search is case-insensitive
- Selected tags stored in array state
- Select all checks if all visible selected
- Checkbox uses accent-neon-cyan
- Edit button uses opacity 0, 100 on hover
- Edit button uses Edit2 icon
- Stats use Hash icon for usage
- Stats use Calendar icon for date
- Tag list uses space-y-2 for spacing
- Tag list uses glass-panel rounded-lg
- Tag list uses p-4 padding
- Tag list uses group for hover effects
- Tag list uses hover-lift and hover-glow-border
- Search input uses relative positioning
- Search icon absolute left-3
- Search input uses pl-10
- Sort buttons use gap-1 layout
- Sort buttons use secondary/primary variant
- Sort buttons use sm size
- Bulk delete uses destructive text color
- Bulk delete uses Trash2 icon
- Bulk delete shows count in button
- Bulk actions panel uses glass-panel
- Bulk actions panel uses rounded-lg
- Bulk actions panel uses p-3 padding
- Bulk actions panel uses flex justify-between
- Select all uses ghost variant
- Select all uses sm size
- Select all text changes based on state
- Selected count uses text-text-secondary
- Selected count uses text-sm
- Header uses text-2xl for title
- Header uses glow-text
- Header shows count of tags
- Header shows singular/plural
- New tag button uses primary variant
- New tag button uses Plus icon
- Empty state centered with py-12
- Empty state uses TagIcon
- Empty state uses h-12 w-12
- Empty state uses text-glass-border
- Empty state shows message
- Empty state shows prompt
- Modal uses fixed inset-0
- Modal uses z-50
- Modal uses flex center
- Modal uses bg-space-black/80
- Modal uses backdrop-blur-sm
- Modal uses CyberCard
- Modal uses max-w-md
- Modal uses animate-scale-in
- Modal header uses CardHeader
- Modal title uses CardTitle
- Modal title changes based on mode
- Modal close button uses X icon
- Modal content uses space-y-4
- Modal name input uses CyberInput
- Modal name input auto-focus
- Modal name label uses micro-label
- Modal color selection uses flex-wrap
- Modal color selection uses gap-2
- Modal preview uses conditional rendering
- Modal preview shows badge
- Modal preview shows when name not empty
- Modal actions uses flex justify-between
- Modal actions uses border-t separator
- Modal actions uses pt-4
- Modal cancel button uses secondary variant
- Modal save button uses primary variant
- Modal save button uses Save icon
- Modal save button disabled when empty
- Modal delete button uses ghost variant
- Modal delete button uses destructive
- Modal delete button uses Trash2 icon
- Modal delete button conditional on initialTag
- Modal onClose callback clears state
- Modal onSave callback updates tags
- Modal onDelete callback removes tag
- Modal useEffect resets state on initialTag change
- Manager integrated into Settings page
- Settings page uses header
- Settings page uses flex-1 p-6
- Manager takes full available space
- Manager uses flex-col h-full
- Components modular and reusable
- Type safety with TypeScript interfaces
- Tag interface for tag data
- Tag color union type
- Proper state management
- Proper event handling
- Proper callbacks
- Proper validation
- Proper error handling
- Proper edge cases
- Proper null checks
- Proper defaults
- Proper loading states
- Proper empty states
- Proper success states
- Proper hover states
- Proper focus states
- Proper active states
- Proper disabled states
- Proper animations
- Proper transitions
- Proper effects
- Proper styling
- Proper layout
- Proper structure
- Proper hierarchy
- Proper organization
