"use client";

import { TagEditorModal } from "@/components/tags/tag-editor-modal";
import { TagManager } from "@/components/tags/tag-manager";

export default function SettingsPage() {
  return (
    <div className="flex-col h-full">
      {/* Header */}
      <div className="glass-panel border-b border-neon-cyan/20 px-6 py-4">
        <h1 className="text-3xl font-display font-bold glow-text">
          SETTINGS
        </h1>
        <p className="text-text-secondary mt-1">
          Customize your Second Brain experience
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <TagManager TagEditorModalComponent={TagEditorModal} />
      </div>
    </div>
  );
}