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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-neon-cyan" />
          <h3 className="text-sm font-bold font-display text-text-primary uppercase tracking-wider">
            Recent Queries
          </h3>
        </div>
        {history.length > 0 && (
          <CyberButton
            variant="ghost"
            size="icon"
            onClick={onClearHistory}
            className="h-6 w-6 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </CyberButton>
        )}
      </div>

      {/* History List */}
      <div className="flex-1 overflow-auto space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Clock className="h-8 w-8 text-text-dim mb-2" />
            <p className="text-xs text-text-dim">No recent queries</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onQueryClick(item.query)}
              className="w-full glass-panel rounded-lg p-3 text-left hover:-translate-y-0.5 hover-glow-border transition-all duration-200 cursor-pointer group"
            >
              <p className="text-sm text-text-primary line-clamp-2 group-hover:text-neon-cyan transition-colors">
                {item.query}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-text-dim">
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