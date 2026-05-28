"use client";

import { useState, useEffect } from "react";
import { Sparkles, Clock, FileText, ExternalLink, ChevronRight, History, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { queryWithRAG, getQueryHistory, clearQueryHistory } from "@/lib/actions/ai-query";
import type { Citation, QueryHistoryItem } from "@/lib/types";
import { CyberCard } from "@/components/ui/cyber-card";

export default function AIQueryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<{
    query: string;
    answer: string;
    citations: Citation[];
    timestamp: string;
  } | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [queryText, setQueryText] = useState("");

  useEffect(() => {
    getQueryHistory()
      .then((items) =>
        setQueryHistory(
          items.map((item) => ({
            ...item,
            timestamp: new Date(item.timestamp).toLocaleTimeString(),
          }))
        )
      )
      .catch(console.error);
  }, []);

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentResponse(null);

    try {
      const result = await queryWithRAG(query);
      setCurrentResponse({
        query: result.query,
        answer: result.answer,
        citations: result.citations.map((c: Citation) => ({
          noteId: c.noteId,
          noteTitle: c.noteTitle,
          excerpt: c.excerpt,
          relevance: c.relevance,
        })),
        timestamp: new Date(result.timestamp).toLocaleTimeString(),
      });

      const updatedHistory = await getQueryHistory();
      setQueryHistory(
        updatedHistory.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp).toLocaleTimeString(),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI query failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) handleQuery(queryText.trim());
  };

  const handleClearHistory = async () => {
    await clearQueryHistory();
    setQueryHistory([]);
  };

  const examples = [
    "Quali tecnologie uso per il frontend?",
    "Trova connessioni tra le mie note",
    "Quali sono i concetti principali del mio knowledge base?",
  ];

  return (
    <div className="flex flex-col h-screen bg-space-black">
      {/* Header */}
      <div className="glass-panel border-b border-glass-border h-14 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-neon-cyan" />
          <h1 className="text-xl font-bold font-display text-text-primary uppercase tracking-wider">
            AI Query
          </h1>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">{queryHistory.length} queries</span>
          <ChevronRight className={`h-4 w-4 transition-transform ${showHistory ? "rotate-90" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Response Area */}
          <div className="flex-1 overflow-auto p-6">
            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-neon-cyan animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-t-2 border-neon-purple animate-spin" />
                  <div className="absolute inset-2 rounded-full bg-neon-cyan animate-pulse glow-text" />
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !currentResponse && !error && (
              <div className="flex flex-col items-center justify-center h-full space-y-8">
                <Sparkles className="h-16 w-16 text-neon-cyan glow-text" />
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold font-display text-text-primary">
                    Ask Your Second Brain
                  </h2>
                  <p className="text-text-secondary">
                    Cerca nelle tue note usando il linguaggio naturale
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-lg">
                  {examples.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => handleQuery(ex)}
                      className="glass-panel rounded-lg p-4 text-left hover:-translate-y-0.5 hover-glow-border transition-all text-sm text-text-primary"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center justify-center h-full">
                <p className="text-neon-pink text-sm">{error}</p>
              </div>
            )}

            {/* Response */}
            {!isLoading && currentResponse && (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Query */}
                <div className="glass-panel rounded-lg p-4">
                  <p className="text-xs text-text-dim font-tech uppercase tracking-wider mb-1">Query</p>
                  <p className="text-text-primary font-medium">{currentResponse.query}</p>
                </div>

                {/* Answer */}
                <div className="glass-panel rounded-xl p-8">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-glass-border">
                    <Sparkles className="h-5 w-5 text-neon-cyan" />
                    <span className="text-xs text-text-dim font-tech uppercase tracking-wider">Answer</span>
                    <span className="ml-auto flex items-center gap-1 text-xs text-text-dim">
                      <Clock className="h-3 w-3" />
                      {currentResponse.timestamp}
                    </span>
                  </div>
                  <div className="prose prose-invert prose-neon max-w-none text-text-primary leading-relaxed">
                    <ReactMarkdown>{currentResponse.answer}</ReactMarkdown>
                  </div>
                </div>

                {/* Citations */}
                {currentResponse.citations.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-text-dim font-tech uppercase tracking-wider">
                      Citations ({currentResponse.citations.length})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentResponse.citations.map((citation, i) => (
                        <a
                          key={i}
                          href={`/notes/${citation.noteId}`}
                          className="block"
                        >
                          <CyberCard className="hover-lift p-4 cursor-pointer h-full">
                            <div className="flex items-start gap-3">
                              <FileText className="h-5 w-5 text-neon-cyan mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold font-display text-text-primary line-clamp-1 mb-1">
                                  {citation.noteTitle}
                                </h4>
                                <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                                  {citation.excerpt}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-tech uppercase tracking-wider border border-neon-cyan/50 text-neon-cyan">
                                    {Math.round(citation.relevance * 100)}%
                                  </span>
                                  <span className="flex items-center gap-1 text-xs text-neon-cyan">
                                    View <ExternalLink className="h-3 w-3" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CyberCard>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="shrink-0 border-t border-glass-border p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Ask anything about your notes..."
                disabled={isLoading}
                className="flex-1 h-12 rounded-xl bg-glass-surface border-2 border-glass-border px-4 text-text-primary placeholder:text-text-dim focus:outline-none focus:border-neon-cyan/50 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !queryText.trim()}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-space-black font-bold font-display text-sm uppercase tracking-wider disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                Ask
              </button>
            </form>
          </div>
        </div>

        {/* History Sidebar - Collapsible */}
        {showHistory && (
          <div className="w-72 border-l border-glass-border flex flex-col shrink-0">
            <div className="flex items-center justify-between p-4 border-b border-glass-border">
              <span className="text-xs text-text-dim font-tech uppercase tracking-wider">Recent Queries</span>
              {queryHistory.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-text-dim hover:text-neon-pink transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {queryHistory.length === 0 ? (
                <p className="text-xs text-text-dim text-center mt-8">No queries yet</p>
              ) : (
                queryHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleQuery(item.query)}
                    className="w-full text-left glass-panel rounded-lg p-3 hover-lift cursor-pointer"
                  >
                    <p className="text-sm text-text-primary line-clamp-2">{item.query}</p>
                    <p className="text-xs text-text-dim mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.timestamp}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
