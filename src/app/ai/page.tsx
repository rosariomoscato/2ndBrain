"use client";

import { useState, useEffect } from "react";
import { AIQueryInput } from "@/components/ai/ai-query-input";
import { AIResponseView, AIResponse } from "@/components/ai/ai-response-view";
import { QueryHistory, QueryHistoryItem } from "@/components/ai/query-history";
import { queryWithRAG, getQueryHistory, clearQueryHistory } from "@/lib/actions/ai-query";
import type { Citation } from "@/lib/types";

export default function AIQueryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load query history on mount
  useEffect(() => {
    getQueryHistory()
      .then(setHistory)
      .catch((err) => {
        console.error("Failed to load query history:", err);
        setError("Failed to load query history");
      });
  }, []);

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentResponse(null);

    try {
      const result = await queryWithRAG(query);
      
      // Transform the AIResponse to match the component's expected format
      const transformedResponse: AIResponse = {
        query: result.query,
        answer: result.answer,
        citations: result.citations.map((c: Citation) => ({
          noteId: c.noteId,
          noteTitle: c.noteTitle,
          excerpt: c.excerpt,
          relevance: c.relevance,
        })),
        timestamp: new Date(result.timestamp).toLocaleTimeString(),
      };

      setCurrentResponse(transformedResponse);
      
      // Reload history after query
      const updatedHistory = await getQueryHistory();
      setHistory(updatedHistory);
    } catch (err) {
      console.error("AI query failed:", err);
      setError(err instanceof Error ? err.message : "AI query failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryQuery = (query: string) => {
    handleQuery(query);
  };

  const handleClearHistory = async () => {
    try {
      await clearQueryHistory();
      setHistory([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
      setError("Failed to clear history");
    }
  };

  // Helper to set history with proper timestamp formatting
  const setHistory = (items: QueryHistoryItem[]) => {
    setQueryHistory(
      items.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp).toLocaleTimeString(),
      }))
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-space-black">
      {/* Page Header */}
      <div className="glass-panel border-b border-glass-border h-16 flex items-center px-6">
        <h1 className="text-2xl font-bold font-display text-text-primary glow-text uppercase tracking-wider">
          AI Query
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Query Area - 75% width */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 rounded-lg border-2 border-red-500/50 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}
          <AIResponseView response={currentResponse} isLoading={isLoading} onExampleQuery={handleQuery} />
          <div className="mt-4">
            <AIQueryInput onQuery={handleQuery} isLoading={isLoading} />
          </div>
        </div>

        {/* History Sidebar - 25% width */}
        <div className="lg:w-80 border-l border-glass-border p-4 overflow-hidden">
          <QueryHistory
            history={queryHistory}
            onQueryClick={handleHistoryQuery}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>
    </div>
  );
}