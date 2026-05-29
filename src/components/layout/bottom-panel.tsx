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
    <div className="glass-panel border-neon-cyan/20 flex h-80 flex-col border-t">
      {/* Tabs */}
      <div className="border-glass-border flex items-center gap-1 border-b p-2">
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
          <div className="text-text-dim flex h-full items-center justify-center">
            <div className="text-center">
              <MessageSquare className="text-neon-cyan/50 mx-auto mb-2 h-12 w-12" />
              <p>AI chat panel content</p>
              <p className="mt-1 text-sm">Ask questions about your notes</p>
            </div>
          </div>
        )}
        {activeTab === "related" && (
          <div className="text-text-dim flex h-full items-center justify-center">
            <div className="text-center">
              <Network className="text-neon-purple/50 mx-auto mb-2 h-12 w-12" />
              <p>Related notes content</p>
              <p className="mt-1 text-sm">Connected nodes from knowledge graph</p>
            </div>
          </div>
        )}
        {activeTab === "details" && (
          <div className="text-text-dim flex h-full items-center justify-center">
            <div className="text-center">
              <Info className="text-neon-blue/50 mx-auto mb-2 h-12 w-12" />
              <p>Node details content</p>
              <p className="mt-1 text-sm">Metadata and connections</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
