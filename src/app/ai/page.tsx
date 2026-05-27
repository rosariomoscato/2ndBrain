"use client";

import { useState } from "react";
import { AIQueryInput } from "@/components/ai/ai-query-input";
import { AIResponseView, AIResponse } from "@/components/ai/ai-response-view";
import { QueryHistory, QueryHistoryItem } from "@/components/ai/query-history";

export default function AIQueryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);

  const handleQuery = async (query: string) => {
    setIsLoading(true);

    // Simulate AI response with 2-second delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock response with markdown formatting and citations
    const mockResponse: AIResponse = {
      query,
      answer: `# Understanding Your Query

Based on your notes, here's what I found:

## Key Insights

Your **second brain** contains several important concepts related to your query. Here are the main points:

- First insight about productivity systems
- Second insight about knowledge management
- Third insight about learning patterns

## Connections

There are interesting connections between your notes:

\`\`\`
Note A → Note B → Note C
\`\`\`

This shows how your knowledge is interconnected and can lead to deeper understanding.

## Recommendations

Based on your notes, I suggest exploring these areas further:

1. Review the most recent notes on this topic
2. Look for patterns across different categories
3. Consider creating new connections between related concepts

Let me know if you'd like me to dive deeper into any specific aspect!`,
      citations: [
        {
          noteId: "1",
          noteTitle: "Productivity Systems Overview",
          excerpt: "An exploration of different productivity frameworks and how they can be combined...",
          relevance: 0.92,
        },
        {
          noteId: "2",
          noteTitle: "Learning Habits and Patterns",
          excerpt: "Analysis of personal learning patterns and effective study techniques...",
          relevance: 0.87,
        },
      ],
      timestamp: new Date().toLocaleTimeString(),
    };

    setCurrentResponse(mockResponse);

    // Add query to history
    const newItem: QueryHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setQueryHistory((prev) => {
      const newHistory = [newItem, ...prev];
      // Keep only last 10 items
      return newHistory.slice(0, 10);
    });

    setIsLoading(false);
  };

  const handleHistoryQuery = (query: string) => {
    handleQuery(query);
  };

  const handleClearHistory = () => {
    setQueryHistory([]);
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
          <AIResponseView response={currentResponse} isLoading={isLoading} />
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