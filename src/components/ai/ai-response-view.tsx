import { Clock, FileText, ExternalLink, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { CyberCard } from "@/components/ui/cyber-card";

export interface Citation {
  noteId: string;
  noteTitle: string;
  excerpt: string;
  relevance: number;
}

export interface AIResponse {
  query: string;
  answer: string;
  citations: Citation[];
  timestamp: string;
}

interface AIResponseViewProps {
  response: AIResponse | null;
  isLoading: boolean;
}

export function AIResponseView({ response, isLoading }: AIResponseViewProps) {
  // Loading State: Animated 3-ring orb
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-64">
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-neon-cyan animate-pulse" />
          {/* Middle ring */}
          <div className="absolute inset-0 rounded-full border-t-2 border-neon-purple animate-spin" />
          {/* Inner core */}
          <div className="absolute inset-2 rounded-full bg-neon-cyan animate-pulse glow-text" />
        </div>
      </div>
    );
  }

  // Empty State: Example questions
  if (!response) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-64 space-y-6">
        <Sparkles className="h-12 w-12 text-neon-cyan glow-text" />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold font-display text-text-primary glow-text">
            Start Exploring
          </h3>
          <p className="text-sm text-text-secondary">
            Ask anything about your second brain
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 w-full max-w-md">
          <button
            className="glass-panel rounded-lg p-4 text-left hover:-translate-y-0.5 hover-glow-border transition-all duration-200 cursor-pointer"
            onClick={() => {/* Handle example query */}}
          >
            <p className="text-sm text-text-primary">
              What are my key insights on productivity?
            </p>
          </button>
          <button
            className="glass-panel rounded-lg p-4 text-left hover:-translate-y-0.5 hover-glow-border transition-all duration-200 cursor-pointer"
            onClick={() => {/* Handle example query */}}
          >
            <p className="text-sm text-text-primary">
              Show me notes related to learning habits
            </p>
          </button>
          <button
            className="glass-panel rounded-lg p-4 text-left hover:-translate-y-0.5 hover-glow-border transition-all duration-200 cursor-pointer"
            onClick={() => {/* Handle example query */}}
          >
            <p className="text-sm text-text-primary">
              What connections exist between my recent notes?
            </p>
          </button>
        </div>
      </div>
    );
  }

  // Response State: Query, Answer, Citations
  return (
    <div className="flex-1 flex flex-col space-y-4 overflow-auto">
      {/* Query Panel */}
      <div className="glass-panel rounded-xl p-4">
        <p className="text-sm text-text-dim font-tech uppercase tracking-wider mb-2">Query</p>
        <p className="text-base text-text-primary font-medium">
          {response.query}
        </p>
      </div>

      {/* Answer Panel */}
      <div className="glass-panel rounded-xl p-6 flex-1 overflow-auto">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-glass-border">
          <Sparkles className="h-5 w-5 text-neon-cyan" />
          <span className="text-sm text-text-dim font-tech uppercase tracking-wider">Answer</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-text-dim">
            <Clock className="h-3 w-3" />
            {response.timestamp}
          </span>
        </div>
        <div className="prose prose-invert prose-neon max-w-none">
          <ReactMarkdown>{response.answer}</ReactMarkdown>
        </div>
      </div>

      {/* Citations Grid */}
      {response.citations.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-text-dim font-tech uppercase tracking-wider">
            Citations ({response.citations.length})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {response.citations.map((citation, index) => (
              <CyberCard key={index} className="hover-lift p-4 cursor-pointer">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-neon-cyan mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold font-display text-text-primary line-clamp-1 mb-1">
                      {citation.noteTitle}
                    </h4>
                    <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                      {citation.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-tech uppercase tracking-wider border-2 border-neon-cyan text-neon-cyan glow-text">
                        {Math.round(citation.relevance * 100)}% relevant
                      </span>
                      <a
                        href={`/notes/${citation.noteId}`}
                        className="flex items-center gap-1 text-xs text-neon-cyan hover:text-neon-purple transition-colors"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </CyberCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}