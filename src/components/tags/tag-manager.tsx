"use client";

import * as React from "react";
import {
  Plus,
  Search,
  SortAsc,
  Tag as TagIcon,
  Hash,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";
import { CyberButton as Button } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { NeonBadge } from "@/components/ui/neon-badge";
import type { Tag, TagColor, TagEditorModal } from "./tag-editor-modal";

const mockTags: Tag[] = [
  {
    id: "1",
    name: "AI",
    color: "cyan",
    usageCount: 42,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "ML",
    color: "purple",
    usageCount: 38,
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "NLP",
    color: "blue",
    usageCount: 25,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    name: "Project",
    color: "pink",
    usageCount: 19,
    createdAt: new Date("2024-04-05"),
  },
  {
    id: "5",
    name: "Research",
    color: "green",
    usageCount: 15,
    createdAt: new Date("2024-05-01"),
  },
];

type SortBy = "name" | "usage" | "date";

interface TagManagerProps {
  TagEditorModalComponent: typeof TagEditorModal;
}

export function TagManager({ TagEditorModalComponent }: TagManagerProps) {
  const [tags, setTags] = React.useState<Tag[]>(mockTags);
  const [query, setQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortBy>("name");
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTag, setEditingTag] = React.useState<Tag | null>(null);

  const filteredTags = React.useMemo(() => {
    const result = tags.filter((tag) =>
      tag.name.toLowerCase().includes(query.toLowerCase())
    );

    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "usage":
        result.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case "date":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return result;
  }, [tags, query, sortBy]);

  const handleCreateTag = () => {
    setEditingTag(null);
    setIsModalOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  const handleSaveTag = (tagData: { name: string; color: TagColor }) => {
    if (editingTag) {
      setTags(
        tags.map((t) =>
          t.id === editingTag.id
            ? { ...t, name: tagData.name, color: tagData.color }
            : t
        )
      );
    } else {
      const newTag: Tag = {
        id: Math.random().toString(36).substr(2, 9),
        name: tagData.name,
        color: tagData.color,
        usageCount: 0,
        createdAt: new Date(),
      };
      setTags([...tags, newTag]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTag = (tagId: string) => {
    setTags(tags.filter((t) => t.id !== tagId));
  };

  const handleBulkDelete = () => {
    setTags(tags.filter((t) => !selectedTags.has(t.id)));
    setSelectedTags(new Set());
  };

  const handleSelectAll = () => {
    if (selectedTags.size === filteredTags.length) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(filteredTags.map((t) => t.id)));
    }
  };

  const toggleTagSelection = (tagId: string) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tagId)) {
      newSelected.delete(tagId);
    } else {
      newSelected.add(tagId);
    }
    setSelectedTags(newSelected);
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold glow-text mb-1">
            Tag Manager
          </h2>
          <p className="text-text-secondary text-sm">
            {tags.length} tag{tags.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button variant="primary" onClick={handleCreateTag}>
          <Plus className="h-4 w-4 mr-2" />
          New Tag
        </Button>
      </div>

      {/* Search and Sort */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
          <CyberInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tags..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "name" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSortBy("name")}
          >
            <SortAsc className="h-4 w-4 mr-2" />
            Name
          </Button>
          <Button
            variant={sortBy === "usage" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSortBy("usage")}
          >
            <Hash className="h-4 w-4 mr-2" />
            Usage
          </Button>
          <Button
            variant={sortBy === "date" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSortBy("date")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Date
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTags.size > 0 && (
        <div className="glass-panel rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedTags.size === filteredTags.length
                ? "Deselect All"
                : "Select All"}
            </Button>
            <span className="text-text-secondary text-sm">
              {selectedTags.size} selected
            </span>
          </div>
          <Button
            variant="secondary"
            onClick={handleBulkDelete}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Tags List */}
      {filteredTags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <TagIcon className="h-12 w-12 text-glass-border mb-4" />
          <p className="text-text-secondary mb-2">
            {query
              ? "No tags found matching your search"
              : "No tags yet"}
          </p>
          <p className="text-text-dim text-sm">
            {query
              ? "Try a different search term"
              : "Create your first tag to get started"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="glass-panel rounded-lg p-4 flex items-center justify-between hover-lift hover-glow-border transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedTags.has(tag.id)}
                  onChange={() => toggleTagSelection(tag.id)}
                  className="h-4 w-4 accent-neon-cyan cursor-pointer"
                />

                {/* Tag Badge */}
                <NeonBadge variant={tag.color}>{tag.name}</NeonBadge>

                {/* Stats */}
                <div className="flex items-center gap-4 text-text-secondary text-sm">
                  <div className="flex items-center gap-1">
                    <Hash className="h-3.5 w-3.5" />
                    <span>{tag.usageCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{tag.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditTag(tag)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <TagEditorModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTag}
        onDelete={
          editingTag ? () => handleDeleteTag(editingTag.id) : undefined
        }
        initialTag={editingTag ?? null}
      />
    </div>
  );
}