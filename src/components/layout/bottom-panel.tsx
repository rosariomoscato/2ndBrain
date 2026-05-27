import { useState } from "react";
import { MessageSquare, Network, Info } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

type Tab = "ai" | "related" | "details";

export function BottomPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("ai");

  const tabs = [
    { id: "ai" as Tab, icon: MessageSquare, label: "AI Chat" },
    { id: "related" as Tab, icon: Network, label: "Related Notes" },
    { id: "details" as Tab, icon: Info, label: "Details" },
  ];

  return (
    <div className="glass-panel border-t border-neon-cyan/20 h-80 flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-glass-border">
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

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "ai" && (
          <div className="h-full flex items-center justify-center text-text-dim">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-neon-cyan/50" />
              <p>AI chat panel content</p>
              <p className="text-sm mt-1">Ask questions about your notes</p>
            </div>
          </div>
        )}
        {activeTab === "related" && (
          <div className="h-full flex items-center justify-center text-text-dim">
            <div className="text-center">
              <Network className="h-12 w-12 mx-auto mb-2 text-neon-purple/50" />
              <p>Related notes content</p>
              <p className="text-sm mt-1">Connected nodes from knowledge graph</p>
            </div>
          </div>
        )}
        {activeTab === "details" && (
          <div className="h-full flex items-center justify-center text-text-dim">
            <div className="text-center">
              <Info className="h-12 w-12 mx-auto mb-2 text-neon-blue/50" />
              <p>Node details content</p>
              <p className="text-sm mt-1">Metadata and connections</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}