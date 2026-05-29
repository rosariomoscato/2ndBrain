"use client";

import { Clock, Trash2 } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: string;
}

interface QueryHistoryProps {
  history: QueryHistoryItem[];
  onQueryClick: (query: string) => void;
  onClearHistory: () => void;
}

export function QueryHistory({ history, onQueryClick, onClearHistory }: QueryHistoryProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="text-neon-cyan h-4 w-4" />
          <h3 className="font-display text-text-primary text-sm font-bold tracking-wider uppercase">
            Recent Queries
          </h3>
        </div>
        {history.length > 0 && (
          <CyberButton variant="ghost" size="icon" onClick={onClearHistory} className="h-6 w-6 p-0">
            <Trash2 className="h-3 w-3" />
          </CyberButton>
        )}
      </div>

      {/* History List */}
      <div className="flex-1 space-y-2 overflow-auto">
        {history.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <Clock className="text-text-dim mb-2 h-8 w-8" />
            <p className="text-text-dim text-xs">No recent queries</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onQueryClick(item.query)}
              className="glass-panel hover-glow-border group w-full cursor-pointer rounded-lg p-3 text-left transition-all duration-200 hover:-translate-y-0.5"
            >
              <p className="text-text-primary group-hover:text-neon-cyan line-clamp-2 text-sm transition-colors">
                {item.query}
              </p>
              <div className="text-text-dim mt-1 flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                {item.timestamp}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
