"use client";

import { useState } from "react";
import { Settings, Palette, Monitor, Sparkles } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { AISettings } from "./ai-settings";
import { SystemSettings } from "./system-settings";
import { ThemeSettings } from "./theme-settings";

type Tab = "theme" | "system" | "ai";

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("theme");

  const tabs = [
    { id: "theme" as Tab, label: "Theme", icon: Palette },
    { id: "system" as Tab, label: "System", icon: Monitor },
    { id: "ai" as Tab, label: "AI", icon: Sparkles },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-neon-cyan" />
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary glow-text">
            SETTINGS
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-glass-border mb-6">
        {tabs.map((tab) => (
          <CyberButton
            key={tab.id}
            variant={activeTab === tab.id ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </CyberButton>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "theme" && <ThemeSettings />}
        {activeTab === "system" && <SystemSettings />}
        {activeTab === "ai" && <AISettings />}
      </div>
    </div>
  );
}