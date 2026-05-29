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
  onExampleQuery?: (query: string) => void;
}

export function AIResponseView({ response, isLoading, onExampleQuery }: AIResponseViewProps) {
  // Loading State: Animated 3-ring orb
  if (isLoading) {
    return (
      <div className="flex min-h-64 flex-1 items-center justify-center">
        <div className="relative h-16 w-16">
          {/* Outer ring */}
          <div className="border-neon-cyan absolute inset-0 animate-pulse rounded-full border-2" />
          {/* Middle ring */}
          <div className="border-neon-purple absolute inset-0 animate-spin rounded-full border-t-2" />
          {/* Inner core */}
          <div className="bg-neon-cyan glow-text absolute inset-2 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  // Empty State: Example questions
  if (!response) {
    return (
      <div className="flex min-h-64 flex-1 flex-col items-center justify-center space-y-6">
        <Sparkles className="text-neon-cyan glow-text h-12 w-12" />
        <div className="space-y-2 text-center">
          <h3 className="font-display text-text-primary glow-text text-xl font-bold">
            Start Exploring
          </h3>
          <p className="text-text-secondary text-sm">Ask anything about your second brain</p>
        </div>
        <div className="grid w-full max-w-md grid-cols-1 gap-3">
          <button
            className="glass-panel hover-glow-border cursor-pointer rounded-lg p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => onExampleQuery?.("What are my key insights on productivity?")}
          >
            <p className="text-text-primary text-sm">What are my key insights on productivity?</p>
          </button>
          <button
            className="glass-panel hover-glow-border cursor-pointer rounded-lg p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => onExampleQuery?.("Show me notes related to learning habits")}
          >
            <p className="text-text-primary text-sm">Show me notes related to learning habits</p>
          </button>
          <button
            className="glass-panel hover-glow-border cursor-pointer rounded-lg p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => onExampleQuery?.("What connections exist between my recent notes?")}
          >
            <p className="text-text-primary text-sm">
              What connections exist between my recent notes?
            </p>
          </button>
        </div>
      </div>
    );
  }

  // Response State: Query, Answer, Citations
  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-auto">
      {/* Query Panel */}
      <div className="glass-panel rounded-xl p-4">
        <p className="text-text-dim font-tech mb-2 text-sm tracking-wider uppercase">Query</p>
        <p className="text-text-primary text-base font-medium">{response.query}</p>
      </div>

      {/* Answer Panel */}
      <div className="glass-panel flex-1 overflow-auto rounded-xl p-6">
        <div className="border-glass-border mb-4 flex items-center gap-2 border-b pb-2">
          <Sparkles className="text-neon-cyan h-5 w-5" />
          <span className="text-text-dim font-tech text-sm tracking-wider uppercase">Answer</span>
          <span className="text-text-dim ml-auto flex items-center gap-1 text-xs">
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
          <p className="text-text-dim font-tech text-sm tracking-wider uppercase">
            Citations ({response.citations.length})
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {response.citations.map((citation, index) => (
              <CyberCard key={index} className="hover-lift cursor-pointer p-4">
                <div className="flex items-start gap-3">
                  <FileText className="text-neon-cyan mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-text-primary mb-1 line-clamp-1 text-sm font-semibold">
                      {citation.noteTitle}
                    </h4>
                    <p className="text-text-secondary mb-2 line-clamp-2 text-xs">
                      {citation.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-tech border-neon-cyan text-neon-cyan glow-text inline-flex items-center rounded border-2 px-2 py-0.5 text-xs font-bold tracking-wider uppercase">
                        {Math.round(citation.relevance * 100)}% relevant
                      </span>
                      <a
                        href={`/notes/${citation.noteId}`}
                        className="text-neon-cyan hover:text-neon-purple flex items-center gap-1 text-xs transition-colors"
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
