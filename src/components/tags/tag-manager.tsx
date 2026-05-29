"use client";

import * as React from "react";
import { toast } from "sonner";
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
import { useSystemSettings } from "@/components/shared/system-settings-provider";
import { playSuccessSound, playDeleteSound, playErrorSound } from "@/lib/sounds";
import { CyberInput } from "@/components/ui/cyber-input";
import { LoadingOrb } from "@/components/ui/loading-orb";
import { NeonBadge } from "@/components/ui/neon-badge";
import { getTags, createTag, updateTag, deleteTag, bulkDeleteTags } from "@/lib/actions/tags";
import type { Tag, TagColor, TagEditorModal } from "./tag-editor-modal";

type SortBy = "name" | "usage" | "date";

interface TagManagerProps {
  TagEditorModalComponent: typeof TagEditorModal;
}

export function TagManager({ TagEditorModalComponent }: TagManagerProps) {
  const { soundEffects } = useSystemSettings();
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortBy>("name");
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTag, setEditingTag] = React.useState<Tag | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const loadTags = React.useCallback(async (sortByValue?: SortBy) => {
    setLoading(true);
    try {
      const data = await getTags({ sortBy: sortByValue ?? "name" });
      setTags(data);
    } catch (error) {
      console.error("Failed to load tags:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTags(sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const filteredTags = React.useMemo(() => {
    const result = tags.filter((tag) =>
      tag.name.toLowerCase().includes(query.toLowerCase())
    );
    return result;
  }, [tags, query]);

  const handleCreateTag = () => {
    setEditingTag(null);
    setIsModalOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  const handleSaveTag = async (tagData: { name: string; color: TagColor }) => {
    setIsSaving(true);
    try {
      if (editingTag) {
        // Optimistically update UI
        setTags(
          tags.map((t) =>
            t.id === editingTag.id
              ? { ...t, name: tagData.name, color: tagData.color }
              : t
          )
        );
        
        await updateTag({ id: editingTag.id, ...tagData });
        if (soundEffects) playSuccessSound();
        toast.success("Tag updated");
      } else {
        // Optimistically add new tag
        const newTag: Tag = {
          id: crypto.randomUUID(),
          name: tagData.name,
          color: tagData.color,
          usageCount: 0,
          createdAt: new Date(),
        };
        setTags([...tags, newTag]);
        
        await createTag(tagData);
        if (soundEffects) playSuccessSound();
        toast.success("Tag created");
      }
      
      // Reload to get fresh data from server
      await loadTags(sortBy);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save tag:", error);
      if (soundEffects) playErrorSound();
      toast.error("Failed to save tag");
      // Reload to revert optimistic update
      await loadTags(sortBy);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      // Optimistically remove tag
      setTags(tags.filter((t) => t.id !== tagId));
      await deleteTag(tagId);
      if (soundEffects) playDeleteSound();
      toast.success("Tag deleted");
    } catch (error) {
      console.error("Failed to delete tag:", error);
      if (soundEffects) playErrorSound();
      toast.error("Failed to delete tag");
      // Reload to revert optimistic update
      await loadTags(sortBy);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const tagIdsToDelete = Array.from(selectedTags);
      // Optimistically remove tags
      setTags(tags.filter((t) => !selectedTags.has(t.id)));
      setSelectedTags(new Set());
      
      await bulkDeleteTags(tagIdsToDelete);
      toast.success(`Deleted ${tagIdsToDelete.length} tag${tagIdsToDelete.length !== 1 ? 's' : ''}`);
    } catch (error) {
      console.error("Failed to bulk delete tags:", error);
      toast.error("Failed to delete tags");
      // Reload to revert optimistic update
      await loadTags(sortBy);
    }
  };

  const handleSortChange = async (newSortBy: SortBy) => {
    setSortBy(newSortBy);
    await loadTags(newSortBy);
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
            {loading ? "Loading..." : `${tags.length} tag${tags.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Button variant="primary" onClick={handleCreateTag} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          New Tag
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <LoadingOrb />
            <p className="text-text-secondary text-sm">Loading tags...</p>
          </div>
        </div>
      ) : (
        <>
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
                onClick={() => handleSortChange("name")}
              >
                <SortAsc className="h-4 w-4 mr-2" />
                Name
              </Button>
              <Button
                variant={sortBy === "usage" ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleSortChange("usage")}
              >
                <Hash className="h-4 w-4 mr-2" />
                Usage
              </Button>
              <Button
                variant={sortBy === "date" ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleSortChange("date")}
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
        isSaving={isSaving}
      />
        </>
      )}
    </div>
  );
}