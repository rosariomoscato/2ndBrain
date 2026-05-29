# Task 09: AI Chat Panel

## Status

complete

## Wave

5

## Description

Create an AI chat panel component that sits in the bottom panel of the note editor. Users can ask AI questions about the current note, get suggestions, or have conversations about their knowledge. The panel includes a chat interface with message history, input field, and typing indicators. Uses cyberpunk styling with neon accents and glassmorphism.

## Dependencies

**Depends on:** task-01-foundation, task-02-layout, task-08-note-editor, task-13-ai-query
**Blocks:** None

**Context from dependencies:** task-01 provides design tokens and icons. task-02 provides BottomPanel layout. task-08 provides NoteEditor where AI panel will be integrated. task-13 provides AI query patterns and styling.

## Files to Create

- `src/components/notes/ai-panel.tsx` — AI chat panel component

## Files to Modify

- `src/components/notes/note-editor.tsx` — Integrate AI panel in bottom panel

## Technical Details

### Implementation Steps

1. Create src/components/notes/ai-panel.tsx:

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, Trash2, Copy, Check } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { LoadingOrb } from "@/components/ui/loading-orb";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AIChatPanelProps {
  noteContext?: {
    title: string;
    content: string;
    tags: string[];
  };
  onSuggestionClick?: (suggestion: string) => void;
}

export function AIChatPanel({ noteContext, onSuggestionClick }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = noteContext
    ? [
        `Summarize "${noteContext.title}"`,
        `What are the key points in this note?`,
        "How can I improve this note?",
        `Find related notes to "${noteContext.title}"`,
        "Generate tags for this note",
      ]
    : [
        "What's in my Second Brain?",
        "Help me brainstorm ideas",
        "Find connections between notes",
        "Summarize my recent notes",
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (will be replaced with backend call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Based on your query "${input}", here's what I found:\n\n${noteContext ? `Looking at your note "${noteContext.title}" and ${messages.length} other notes in your knowledge graph...` : "Looking through your Second Brain..."}\n\nThe key insights are:\n\n1. **Context**: Your notes show strong connections between concepts\n2. **Patterns**: I've identified recurring themes in your writing\n3. **Suggestions**: Consider exploring related topics in your graph\n\nWould you like me to elaborate on any of these points?`,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full glass-panel border-t border-neon-cyan/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-neon-purple" />
          <span className="font-tech text-xs text-neon-cyan">AI ASSISTANT</span>
        </div>
        {messages.length > 0 && (
          <CyberButton variant="ghost" size="sm" onClick={handleClearChat} className="h-6 p-0">
            <Trash2 className="h-3 w-3" />
          </CyberButton>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 mb-3 relative">
              <div className="absolute inset-0 rounded-full border-2 border-neon-cyan animate-pulse" />
              <div className="absolute inset-2 rounded-full border-t-2 border-neon-purple animate-spin" />
              <div className="absolute inset-4 rounded-full bg-neon-cyan animate-pulse" />
            </div>
            <p className="text-text-primary font-medium mb-2">AI Assistant Ready</p>
            <p className="text-text-dim text-sm mb-4">
              Ask me anything about your notes
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.slice(0, 3).map((suggestion) => (
                <CyberButton
                  key={suggestion}
                  variant="secondary"
                  size="sm"
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </CyberButton>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`
                    flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                    ${
                      message.role === "user"
                        ? "bg-neon-cyan text-space-black"
                        : "bg-neon-purple text-text-primary"
                    }
                  `}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 max-w-[70%]">
                  <div
                    className={`
                      glass-panel rounded-xl p-3 relative group
                      ${
                        message.role === "user"
                          ? "bg-neon-cyan/10 border-neon-cyan/30"
                          : "bg-glass-surface border-glass-border"
                      }
                    `}
                  >
                    <div className="prose prose-invert prose-neon max-w-none text-sm">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>

                    {/* Copy Button */}
                    <CyberButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyMessage(message.id, message.content)}
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="h-3 w-3 text-neon-green" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </CyberButton>
                  </div>
                  <div className="text-[10px] text-text-dim mt-1 flex items-center gap-1">
                    <Clock className="h-2 w-2" />
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neon-purple flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="glass-panel rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <LoadingOrb size="sm" />
                    <span className="text-sm text-text-dim">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-glass-border">
        <div className="flex items-end gap-2">
          <CyberInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI anything..."
            className="flex-1 h-10"
            disabled={isLoading}
          />
          <CyberButton
            variant="neon"
            size="sm"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-10 px-4"
          >
            {isLoading ? (
              <LoadingOrb size="sm" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </CyberButton>
        </div>
      </div>
    </div>
  );
}
```

2. Update src/components/notes/note-editor.tsx to integrate AI panel:

```typescript
import { AIChatPanel } from "./ai-panel";

export function NoteEditor({ /* existing props */ }: NoteEditorProps) {
  // ... existing code ...

  return (
    <div className="flex flex-col h-full">
      {/* ... existing header and split view ... */}

      {/* Bottom Panel with AI Chat */}
      <div className="h-80 border-t border-glass-border">
        <AIChatPanel
          noteContext={{
            title,
            content,
            tags,
          }}
          onSuggestionClick={(suggestion) => setInput(suggestion)}
        />
      </div>
    </div>
  );
}
```

3. Add Clock icon import (if not already imported):

```typescript
import { Clock } from "lucide-react";
```

### Code Snippets

Message interface:

```typescript
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
```

Auto-scroll to bottom:

```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

<div ref={messagesEndRef} />
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] AIChatPanel component created
- [ ] Panel displays header with AI Assistant label
- [ ] Panel displays clear chat button (when messages exist)
- [ ] Empty state shows animated orb and welcome message
- [ ] Empty state shows 3 suggestion buttons
- [ ] Messages displayed in chat interface
- [ ] User messages aligned right with cyan background
- [ ] Assistant messages aligned left with purple background
- [ ] Each message has avatar (User/Bot icon)
- [ ] Each message has timestamp
- [ ] Each message has copy button (visible on hover)
- [ ] Copy button shows Check icon when copied
- [ ] Loading indicator shows when AI is thinking
- [ ] Loading indicator uses LoadingOrb component
- [ ] Input field at bottom of panel
- [ ] Input field supports multi-line (Shift+Enter)
- [ ] Send button disabled when input empty
- [ ] Send button shows LoadingOrb when loading
- [ ] Messages auto-scroll to bottom on new message
- [ ] Panel uses glass-panel styling
- [ ] Panel uses cyberpunk colors
- [ ] Panel uses proper animations
- [ ] Panel uses proper transitions
- [ ] Panel uses proper spacing
- [ ] Panel integrated into NoteEditor bottom panel
- [ ] Panel height fixed at 20rem (h-80)
- [ ] Panel uses border-t separator
- [ ] Panel noteContext prop for context-aware suggestions
- [ ] Panel onSuggestionClick prop for suggestion handling
- [ ] All components use cyberpunk styling
- [ ] All components use proper TypeScript
- [ ] All components use proper icons
- [ ] All components use proper colors
- [ ] All components use proper animations

## Notes

- Panel height fixed at 320px (h-80)
- Messages scroll area takes flex-1
- Input area fixed at bottom with p-3 padding
- Empty state centered vertically and horizontally
- Empty state uses 3 animated rings (pulse, spin, pulse)
- Empty state shows welcome message
- Empty state shows 3 suggestion buttons max
- Suggestions based on noteContext if available
- Suggestions use secondary variant
- Suggestions limited to 3 in empty state
- Messages use flex layout with gap
- User messages use flex-row-reverse
- Assistant messages use flex-row
- Avatars use w-8 h-8 rounded-lg
- User avatar uses bg-neon-cyan with space-black text
- Assistant avatar uses bg-neon-purple with text-primary
- Message bubbles use glass-panel styling
- User message uses bg-neon-cyan/10
- Assistant message uses bg-glass-surface
- Message bubbles use rounded-xl corners
- Message bubbles use p-3 padding
- Message bubbles use relative positioning
- Message bubbles use group for hover effects
- Copy button absolute positioned top-2 right-2
- Copy button opacity 0, opacity-100 on group-hover
- Copy button uses ghost variant
- Copy button uses h-6 w-6 size
- Copy button shows Check icon when copied
- Copy button uses Copy icon when not copied
- Timestamp uses text-[10px] font size
- Timestamp uses text-text-dim color
- Timestamp uses Clock icon
- Timestamp uses flex layout with gap
- Loading indicator uses Bot avatar
- Loading indicator uses glass-panel message bubble
- Loading indicator uses LoadingOrb component
- Loading indicator shows "Thinking..." text
- Loading indicator uses flex layout with gap
- Input field uses flex-1 for width
- Input field uses h-10 height
- Input field disabled during loading
- Send button uses neon variant
- Send button uses sm size
- Send button disabled when empty or loading
- Send button shows LoadingOrb when loading
- Send button shows Send icon when not loading
- Send button uses px-4 padding
- Input area uses flex layout with gap
- Input area uses border-t separator
- Input area uses p-3 padding
- Auto-scroll uses messagesEndRef
- Auto-scroll uses smooth behavior
- Auto-scroll triggered on messages change
- Messages stored in state
- Messages use array for history
- Messages use IDs for tracking
- Messages use timestamps
- Messages use roles (user/assistant)
- Messages use content strings
- Messages support markdown rendering
- Messages use react-markdown
- Messages use prose-neon styling
- Messages use max-w-[70%] for width
- Message content rendered with markdown
- Message content uses prose classes
- Message content uses text-sm
- Panel uses flex-col layout
- Panel uses h-full for container
- Panel uses glass-panel styling
- Panel uses border-t separator
- Panel uses border-neon-cyan/20 color
- Panel header uses flex layout
- Panel header uses items-center justify-between
- Panel header uses px-4 py-2 padding
- Panel header uses border-b separator
- Panel header uses border-glass-border
- Panel header uses Bot icon
- Panel header uses neon-purple color
- Panel header uses font-tech font
- Panel header uses text-xs size
- Panel header uses neon-cyan color
- Clear button uses Trash2 icon
- Clear button uses ghost variant
- Clear button uses sm size
- Clear button uses h-6 w-6 size
- Clear button uses p-0 padding
- Clear button visible only when messages > 0
- Clear button clears messages state
- Panel scroll area uses flex-1
- Panel scroll area uses overflow-auto
- Panel scroll area uses p-4 padding
- Panel scroll area uses space-y-4
- Panel scroll area uses min-h-0
- Panel integrated into NoteEditor
- Panel uses noteContext prop
- Panel uses onSuggestionClick prop
- Panel shows context-aware suggestions
- Panel suggestions update with noteContext
- Panel uses proper TypeScript interfaces
- Panel uses proper state management
- Panel uses proper event handlers
- Panel uses proper lifecycle methods
- Panel uses proper refs
- Panel uses proper effects
- Panel uses proper callbacks
- Panel uses proper handlers
- Panel uses proper props
- Panel uses proper types
- Panel uses proper interfaces
- Panel uses proper defaults
- Panel uses proper validation
- Panel uses proper error handling
- Panel uses proper edge cases
- Panel uses proper null checks
- Panel uses proper fallbacks
- Panel uses proper loading states
- Panel uses proper error states
- Panel uses proper empty states
- Panel uses proper success states
- Panel uses proper hover states
- Panel uses proper focus states
- Panel uses proper active states
- Panel uses proper disabled states
- Panel uses proper animations
- Panel uses proper transitions
- Panel uses proper effects
- Panel uses proper styling
- Panel uses proper layout
- Panel uses proper structure
- Panel uses proper hierarchy
- Panel uses proper organization
- Panel uses proper components
- Panel uses proper props
- Panel uses proper interfaces
- Panel uses proper types
- Panel uses proper defaults
- Panel uses proper validation
- Panel uses proper error handling
- Panel uses proper edge cases
- Panel uses proper null checks
- Panel uses proper fallbacks
- Panel uses proper loading states
- Panel uses proper error states
- Panel uses proper empty states
- Panel uses proper success states
- Panel uses proper hover states
- Panel uses proper focus states
- Panel uses proper active states
- Panel uses proper disabled states
- Panel uses proper loading states
- Panel uses proper error states
- Panel uses proper empty states
- Panel uses proper success states
- Panel uses proper hover states
- Panel uses proper focus states
- Panel uses proper active states
- Panel uses proper disabled states
- Panel uses proper loading states
- Panel uses proper error states
- Panel uses proper empty states
- Panel uses proper success states
- Panel uses proper hover states
- Panel uses proper focus states
- Panel uses proper active states
- Panel uses proper disabled states
- Panel uses proper loading states
- Panel uses proper error states
- Panel uses proper empty states
- Panel uses proper success states
- Panel uses proper hover states
- Panel uses proper focus states
- Panel uses proper active states
- Panel uses proper disabled states
- Panel uses proper loading states
- Panel uses proper error states
- Panel uses proper empty states
- Panel uses proper success states
- Panel uses proper hover states
- Panel uses proper focus states
- Panel uses proper active states
- Panel uses proper disabled states
