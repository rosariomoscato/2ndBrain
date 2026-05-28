"use client";

import * as React from "react";
import { X, Save, Trash2 } from "lucide-react";
import { CyberButton as Button } from "@/components/ui/cyber-button";
import { CyberCard, CardHeader, CardTitle, CardContent } from "@/components/ui/cyber-card";
import { CyberInput } from "@/components/ui/cyber-input";
import { LoadingOrb } from "@/components/ui/loading-orb";
import { NeonBadge } from "@/components/ui/neon-badge";
import { cn } from "@/lib/utils";

export type TagColor = "purple" | "cyan" | "blue" | "pink" | "green" | "orange";

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
  usageCount: number;
  createdAt: Date;
}

interface TagEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tag: Omit<Tag, "id" | "usageCount" | "createdAt">) => void;
  onDelete?: (() => void) | undefined;
  initialTag?: Tag | null | undefined;
  isSaving?: boolean;
}

const COLOR_OPTIONS: TagColor[] = ["purple", "cyan", "blue", "pink", "green", "orange"];

export function TagEditorModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialTag,
  isSaving = false,
}: TagEditorModalProps) {
  const [name, setName] = React.useState(initialTag?.name ?? "");
  const [color, setColor] = React.useState<TagColor>(initialTag?.color ?? "cyan");

  // Update state when initialTag changes
  const nameRef = React.useRef(name);
  const colorRef = React.useRef(color);

  React.useEffect(() => {
    nameRef.current = name;
    colorRef.current = color;
  });

  React.useEffect(() => {
    if (initialTag) {
      const newName = initialTag.name;
      const newColor = initialTag.color;
      if (nameRef.current !== newName || colorRef.current !== newColor) {
        setName(newName);
        setColor(newColor);
      }
    } else {
      if (nameRef.current !== "" || colorRef.current !== "cyan") {
        setName("");
        setColor("cyan");
      }
    }
  }, [initialTag]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name: name.trim(), color });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-black/80 backdrop-blur-sm">
      <CyberCard className="w-full max-w-md animate-scale-in">
        <CardHeader className="relative">
          <CardTitle className="pr-8">
            {initialTag ? "Edit Tag" : "Create New Tag"}
          </CardTitle>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 h-6 w-6 p-0 flex items-center justify-center rounded-full hover:bg-glass-highlight transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="micro-label">Tag Name</label>
            <CyberInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tag name"
              autoFocus
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="micro-label">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={cn(
                    "h-10 w-10 rounded-full border-2 transition-all duration-200",
                    color === colorOption
                      ? `ring-2 ring-neon-cyan scale-105 border-${colorOption}-500`
                      : `opacity-60 hover:opacity-100 border-${colorOption}-500`,
                    `bg-${colorOption}-500`
                  )}
                  style={
                    color === colorOption
                      ? {
                          backgroundColor: getComputedStyle(document.documentElement)
                            .getPropertyValue(`--color-neon-${colorOption}`),
                          borderColor: getComputedStyle(document.documentElement)
                            .getPropertyValue(`--color-neon-${colorOption}`),
                        }
                      : {
                          backgroundColor: getComputedStyle(document.documentElement)
                            .getPropertyValue(`--color-neon-${colorOption}`),
                          borderColor: getComputedStyle(document.documentElement)
                            .getPropertyValue(`--color-neon-${colorOption}`),
                        }
                  }
                  aria-label={`Select ${colorOption} color`}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {name.trim() && (
            <div className="space-y-2">
              <label className="micro-label">Preview</label>
              <NeonBadge variant={color}>{name}</NeonBadge>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-glass-border">
            {onDelete && initialTag && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="text-destructive"
                disabled={isSaving}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSave}
                disabled={!name.trim() || isSaving}
                className="min-w-[100px]"
              >
                {isSaving ? (
                  <LoadingOrb size="sm" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </CyberCard>
    </div>
  );
}