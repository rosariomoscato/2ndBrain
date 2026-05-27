# Task 13: AI Query Interface

## Status

complete

## Wave

4

## Description

Create the AI query interface page for natural language semantic searches across notes. Users can ask questions in plain English and receive AI-powered answers with citations to relevant notes. The interface includes a prominent input field, response display with markdown rendering, citation links, and query history. Uses cyberpunk styling with neon accents and glassmorphism panels.

## Dependencies

**Depends on:** task-01-foundation, task-02-layout
**Blocks:** task-09-ai-panels

**Context from dependencies:** task-01 provides design tokens and markdown rendering. task-02 provides layout components (CyberHeader, CyberSidebar, MainViewport, BottomPanel).

## Files to Create

- `src/app/ai/page.tsx` — AI query page with input, response, history
- `src/components/ai/ai-query-input.tsx` — Query input component
- `src/components/ai/ai-response-view.tsx` — Response display with citations
- `src/components/ai/query-history.tsx` — Query history sidebar component

## Files to Modify

- None (create new pages and components)

## Technical Details

### Implementation Steps

1. Create src/components/ai/ai-query-input.tsx:

```typescript
"use client";

import { useState } from "react";
import { Sparkles, Send, Paperclip } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";

interface AIQueryInputProps {
  onQuery: (query: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function AIQueryInput({ onQuery, isLoading = false, disabled = false }: AIQueryInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onQuery(query);
      setQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-neon-cyan/30 p-2">
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <CyberButton variant="ghost" size="sm" className="h-12 w-12 p-0 flex-shrink-0" disabled={disabled}>
          <Paperclip className="h-5 w-5" />
        </CyberButton>

        {/* Input Field */}
        <div className="flex-1 relative">
          <CyberInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your Second Brain anything... (e.g., 'What are the key principles of transformers?')"
            className="h-12 resize-none"
            disabled={disabled || isLoading}
            multiline
          />
        </div>

        {/* Send Button */}
        <CyberButton
          variant="neon"
          size="lg"
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading || disabled}
          className="h-12 px-6 gap-2 flex-shrink-0"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-space-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          {isLoading ? "Thinking..." : "Send"}
        </CyberButton>
      </div>

      {/* Hint Text */}
      <div className="text-xs text-text-dim mt-2 flex items-center gap-2">
        <Sparkles className="h-3 w-3 text-neon-cyan" />
        <span>Press Enter to send, Shift+Enter for new line</span>
      </div>
    </div>
  );
}
```

2. Create src/components/ai/ai-response-view.tsx:

```typescript
import { Clock, FileText, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { NeonBadge } from "@/components/ui/neon-badge";
import { CyberCard, CardContent } from "@/components/ui/cyber-card";

interface Citation {
  noteId: string;
  noteTitle: string;
  excerpt: string;
  relevance: number;
}

interface AIResponse {
  query: string;
  answer: string;
  citations: Citation[];
  timestamp: string;
}

interface AIResponseViewProps {
  response: AIResponse | null;
  isLoading?: boolean;
}

export function AIResponseView({ response, isLoading }: AIResponseViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-2 border-neon-cyan animate-pulse" />
            <div className="absolute inset-2 rounded-full border-t-2 border-neon-purple animate-spin" />
            <div className="absolute inset-4 rounded-full bg-neon-cyan animate-pulse" />
          </div>
          <p className="text-text-secondary">Searching your knowledge base...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-full text-text-dim">
        <div className="text-center max-w-md">
          <Sparkles className="h-12 w-12 mx-auto mb-3 text-glass-border" />
          <p className="text-lg font-medium text-text-primary mb-2">
            Ask your Second Brain
          </p>
          <p className="text-sm">
            Search through your notes using natural language. Try questions like:
          </p>
          <div className="mt-4 space-y-2 text-left">
            <div className="glass-panel rounded-lg p-3 text-xs">
              "What are the key principles of transformers?"
            </div>
            <div className="glass-panel rounded-lg p-3 text-xs">
              "How do I implement attention mechanisms?"
            </div>
            <div className="glass-panel rounded-lg p-3 text-xs">
              "What notes relate to project Alpha?"
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full overflow-auto">
      {/* Query */}
      <div className="glass-panel rounded-xl p-4">
        <p className="micro-label mb-2">QUERY</p>
        <p className="text-text-primary">{response.query}</p>
      </div>

      {/* Answer */}
      <div className="glass-panel rounded-xl p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <p className="micro-label">ANSWER</p>
          <div className="flex items-center gap-2 text-xs text-text-dim">
            <Clock className="h-3 w-3" />
            {response.timestamp}
          </div>
        </div>
        <div className="prose prose-invert prose-neon max-w-none">
          <ReactMarkdown>
            {response.answer}
          </ReactMarkdown>
        </div>
      </div>

      {/* Citations */}
      {response.citations.length > 0 && (
        <div>
          <p className="micro-label mb-3">SOURCES</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {response.citations.map((citation) => (
              <CyberCard key={citation.noteId} className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-neon-cyan" />
                      <h4 className="font-semibold text-sm text-text-primary line-clamp-1">
                        {citation.noteTitle}
                      </h4>
                    </div>
                    <NeonBadge variant="cyan" className="text-[10px]">
                      {Math.round(citation.relevance * 100)}%
                    </NeonBadge>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                    {citation.excerpt}
                  </p>
                  <a
                    href={`/notes/${citation.noteId}`}
                    className="text-xs text-neon-cyan hover:text-neon-purple flex items-center gap-1"
                  >
                    View note <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </CyberCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

3. Create src/components/ai/query-history.tsx:

```typescript
import { Clock, Trash2 } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: string;
}

interface QueryHistoryProps {
  history: QueryHistoryItem[];
  onSelectQuery: (query: string) => void;
  onClearHistory?: () => void;
}

export function QueryHistory({ history, onSelectQuery, onClearHistory }: QueryHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center text-text-dim text-sm py-8">
        <Clock className="h-8 w-8 mx-auto mb-2 text-glass-border" />
        <p>No queries yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 px-2">
        <p className="micro-label">HISTORY</p>
        {onClearHistory && (
          <CyberButton variant="ghost" size="sm" onClick={onClearHistory} className="h-6 p-0">
            <Trash2 className="h-3 w-3" />
          </CyberButton>
        )}
      </div>
      <div className="flex-1 overflow-auto space-y-1 px-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectQuery(item.query)}
            className="w-full text-left glass-panel rounded-lg p-3 hover-lift hover-glow-border transition-all duration-200 group"
          >
            <p className="text-sm text-text-primary line-clamp-2 group-hover:text-neon-cyan transition-colors">
              {item.query}
            </p>
            <div className="flex items-center gap-1 text-xs text-text-dim mt-1">
              <Clock className="h-3 w-3" />
              {item.timestamp}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

4. Create src/app/ai/page.tsx:

```typescript
"use client";

import { useState } from "react";
import { AIQueryInput } from "@/components/ai/ai-query-input";
import { AIResponseView } from "@/components/ai/ai-response-view";
import { QueryHistory } from "@/components/ai/query-history";

interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: string;
}

interface Citation {
  noteId: string;
  noteTitle: string;
  excerpt: string;
  relevance: number;
}

interface AIResponse {
  query: string;
  answer: string;
  citations: Citation[];
  timestamp: string;
}

export default function AIQueryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);

  const handleQuery = async (query: string) => {
    setIsLoading(true);

    // Simulate AI response (will be replaced with backend call)
    setTimeout(() => {
      const mockResponse: AIResponse = {
        query,
        answer: `Based on your notes, here's what I found about "${query}":\n\nThe **transformer architecture** is a neural network architecture that relies entirely on self-attention mechanisms to compute representations of its input and output without using sequence-aligned RNNs or convolution.\n\n### Key Principles:\n\n1. **Self-Attention**: Each word attends to all other words in the sequence, capturing dependencies regardless of distance.\n\n2. **Positional Encoding**: Since the architecture has no recurrence, positional encodings are added to input embeddings to give the model information about token order.\n\n3. **Multi-Head Attention**: Multiple attention heads allow the model to jointly attend to information from different representation subspaces at different positions.\n\n4. **Feed-Forward Networks**: Each attention sub-layer is followed by a position-wise fully connected feed-forward network.\n\nThis architecture has become the foundation for modern NLP models like GPT and BERT.`,
        citations: [
          {
            noteId: "2",
            noteTitle: "Transformers Architecture Explained",
            excerpt: "Deep dive into transformer architecture and attention mechanisms. Covers self-attention, positional encoding, and multi-head attention.",
            relevance: 0.95,
          },
          {
            noteId: "4",
            noteTitle: "AI System Design Document",
            excerpt: "High-level architecture design for AI-powered knowledge management system with transformer-based components.",
            relevance: 0.82,
          },
        ],
        timestamp: new Date().toLocaleTimeString(),
      };

      setCurrentResponse(mockResponse);
      setQueryHistory((prev) => [
        {
          id: Date.now().toString(),
          query,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 9), // Keep last 10 queries
      ]);
      setIsLoading(false);
    }, 2000);
  };

  const handleSelectHistoryQuery = (query: string) => {
    handleQuery(query);
  };

  const handleClearHistory = () => {
    setQueryHistory([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="glass-panel border-b border-neon-cyan/20 px-6 py-4">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary glow-text">
          AI QUERY
        </h1>
        <p className="text-text-secondary mt-1">
          Search your knowledge base using natural language
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Query Area */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Query Input */}
          <div className="mb-6">
            <AIQueryInput onQuery={handleQuery} isLoading={isLoading} />
          </div>

          {/* Response View */}
          <div className="flex-1 overflow-hidden">
            <AIResponseView response={currentResponse} isLoading={isLoading} />
          </div>
        </div>

        {/* Query History Sidebar */}
        <div className="lg:w-80 border-l border-glass-border p-4 overflow-auto">
          <QueryHistory
            history={queryHistory}
            onSelectQuery={handleSelectHistoryQuery}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>
    </div>
  );
}
```

### Code Snippets

Mock AI response structure:
```typescript
interface AIResponse {
  query: string;
  answer: string;
  citations: Citation[];
  timestamp: string;
}

interface Citation {
  noteId: string;
  noteTitle: string;
  excerpt: string;
  relevance: number; // 0-1
}
```

Query history management:
```typescript
const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);

// Add new query to start of array
setQueryHistory((prev) => [
  {
    id: Date.now().toString(),
    query,
    timestamp: new Date().toLocaleTimeString(),
  },
  ...prev.slice(0, 9), // Keep last 10
]);
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] AIQueryInput component created
- [ ] Input has placeholder with example question
- [ ] Input supports multi-line (Shift+Enter)
- [ ] Send button disabled when input empty
- [ ] Send button shows loading state
- [ ] Attachment button included (placeholder)
- [ ] Hint text shows keyboard shortcuts
- [ ] AIResponseView component created
- [ ] Loading state shows animated orb
- [ ] Empty state shows example questions
- [ ] Query displayed in glass panel
- [ ] Answer rendered with markdown
- [ ] Answer uses prose-neon styling
- [ ] Answer shows timestamp
- [ ] Citations displayed as cards
- [ ] Citations show note title, excerpt, relevance
- [ ] Citations link to note pages
- [ ] Citations show relevance percentage
- [ ] QueryHistory component created
- [ ] History shows last 10 queries
- [ ] History items show query and timestamp
- [ ] History items clickable to re-run query
- [ ] Clear history button included
- [ ] History empty state displays message
- [ ] AI query page created at /ai route
- [ ] Page header displays "AI QUERY" title
- [ ] Main query area takes 75% width
- [ ] History sidebar takes 25% width
- [ ] Responsive layout (stacked on mobile)
- [ ] Mock AI response with markdown formatting
- [ ] Mock citations with relevance scores
- [ ] 2-second delay for simulated AI response
- [ ] Query added to history after response
- [ ] All components use cyberpunk styling
- [ ] Glass-panel styling for containers
- [ ] Hover effects on interactive elements

## Notes

- Query input uses textarea for multi-line support
- Shift+Enter adds new line, Enter sends query
- Send button shows spinner during loading
- Loading spinner uses CSS animations
- Attachment button placeholder for future file upload
- Hint text uses small font and text-dim color
- Response view flexes to fill available space
- Loading orb has 3 animated rings (pulse, spin, pulse)
- Empty state uses 3 example questions in cards
- Query displayed in glass panel with micro-label
- Answer uses react-markdown with custom components
- Answer uses prose-neon styling for cyberpunk colors
- Timestamp displayed in header with clock icon
- Citations grid: 1 col mobile, 2 col desktop
- Citation cards use NoteCard component styling
- Relevance displayed as percentage badge
- Relevance calculated as 0-1, displayed as 0-100%
- Citation links use ExternalLink icon
- History sidebar uses fixed width on desktop (320px)
- History items sorted newest first
- History limited to 10 items (slice)
- History items use line-clamp-2 for query text
- Clear button uses Trash2 icon
- History empty state uses Clock icon
- Page header uses glow-text on title
- Main query area uses flex-1 for remaining space
- History sidebar uses border-l for separation
- Mobile layout stacks vertically
- Mock response includes proper markdown formatting
- Mock citations include noteId for linking
- Simulated 2s delay for AI response
- React state for loading, response, history
- Query string passed to onQuery callback
- Query string cleared after submission
- Input disabled during loading
- Send button disabled during loading
- Citation links open in new tab (target="_blank")
- All timestamps use localeTimeString()
- History persists in session (no localStorage yet)
- Components modular and reusable
- Type safety with TypeScript interfaces
- Response answer uses markdown headers, lists, bold, code
- Citations use rounded-lg corners
- Relevance badge uses cyan variant
- History items use hover-lift effect
- Clear button only visible when history has items
- Empty state in history shows centered message
- Example questions use glass-panel styling
- AI Assist button in response view placeholder
- Can be extended with backend API integration later
- Can be extended with export options later
- Can be extended with search filters later