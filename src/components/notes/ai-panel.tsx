"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Clock,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { LoadingOrb } from "@/components/ui/loading-orb";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface NoteContext {
  title?: string;
  content?: string;
  tags?: string[];
}

interface AIChatPanelProps {
  noteContext?: NoteContext;
  onSuggestionClick?: (suggestion: string) => void;
}

export function AIChatPanel({
  noteContext,
  onSuggestionClick,
}: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle copy to clipboard
  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Handle send message
  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `I'm analyzing your note and here are my thoughts:

## Key Points

1. **Understanding**: Your note focuses on "${noteContext?.title || "this topic"}"
2. **Connection**: This relates to several concepts in your knowledge graph
3. **Suggestion**: Consider adding more details to strengthen the argument

## Recommendations

- Add examples to illustrate your points
- Create connections to related notes
- Consider using tags for better organization

Would you like me to elaborate on any of these points?`,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    onSuggestionClick?.(suggestion);
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([]);
  };

  // Get suggestions based on note context
  const getSuggestions = (): string[] => {
    const hasContext = noteContext?.title || noteContext?.content;

    if (hasContext) {
      return [
        `Summarize "${noteContext?.title || "this note"}"`,
        "What are the key points in this note?",
        "How can I improve this note?",
        `Find related notes to "${noteContext?.title || "this note"}"`,
        "Generate tags for this note",
      ];
    }

    return [
      "What's in my Second Brain?",
      "Help me brainstorm ideas",
      "Find connections between notes",
      "Summarize my recent notes",
    ];
  };

  const suggestions = getSuggestions().slice(0, 3);

  return (
    <div className="flex flex-col h-full glass-panel border-t border-neon-cyan/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-neon-purple" />
          <span className="font-tech text-xs text-neon-cyan">AI ASSISTANT</span>
        </div>
        {messages.length > 0 && (
          <CyberButton
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </CyberButton>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center">
            {/* Animated Orb */}
            <div className="w-12 h-12 relative mb-6">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-neon-cyan animate-pulse" />
              {/* Middle ring */}
              <div className="absolute inset-0 rounded-full border-t-2 border-neon-purple animate-spin" />
              {/* Inner core */}
              <div className="absolute inset-2 rounded-full bg-neon-cyan animate-pulse glow-text" />
            </div>

            {/* Welcome Message */}
            <div className="mb-8">
              <h3 className="text-lg font-display font-bold text-neon-cyan mb-2">
                AI Assistant Ready
              </h3>
              <p className="text-sm text-text-dim">
                Ask me anything about your notes or get AI-powered insights
              </p>
            </div>

            {/* Suggestions */}
            <div className="flex flex-col gap-2 w-full max-w-md">
              {suggestions.map((suggestion, index) => (
                <CyberButton
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left justify-start hover:border-neon-purple hover:text-neon-purple"
                >
                  {suggestion}
                </CyberButton>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
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
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === "user"
                      ? "bg-neon-cyan text-space-black"
                      : "bg-neon-purple text-text-primary"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`glass-panel rounded-xl p-3 max-w-[70%] relative group ${
                    message.role === "user"
                      ? "bg-neon-cyan/10 border-neon-cyan/30"
                      : "bg-glass-surface border-glass-border"
                  }`}
                >
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(message.id, message.content)}
                    className="absolute top-2 right-2 h-6 w-6 rounded-lg bg-glass-surface border border-glass-border opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-glass-highlight"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="h-3 w-3 text-neon-green" />
                    ) : (
                      <Copy className="h-3 w-3 text-text-dim" />
                    )}
                  </button>

                  {/* Message Content */}
                  <div className="prose prose-invert prose-neon max-w-none text-sm mb-2">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-[10px] text-text-dim">
                    <Clock className="h-3 w-3" />
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon-purple text-text-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="glass-panel rounded-xl p-3 border-glass-border">
                  <div className="flex items-center gap-2">
                    <LoadingOrb size="sm" />
                    <span className="text-sm text-text-primary">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-2 p-3 border-t border-glass-border">
        <CyberInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask AI something..."
          className="flex-1 h-10 text-sm"
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
  );
}