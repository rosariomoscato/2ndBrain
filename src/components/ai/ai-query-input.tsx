"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Paperclip } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

interface AIQueryInputProps {
  onQuery: (query: string) => void;
  isLoading: boolean;
}

export function AIQueryInput({ onQuery, isLoading }: AIQueryInputProps) {
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onQuery(query.trim());
      setQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="glass-panel rounded-xl p-4 border-2 border-neon-cyan/50 hover:border-neon-cyan transition-all duration-200">
      <div className="flex gap-3">
        {/* Attachment Button (Placeholder) */}
        <CyberButton
          variant="ghost"
          size="icon"
          disabled
          className="mt-1"
        >
          <Paperclip className="h-5 w-5" />
        </CyberButton>

        {/* Textarea Input */}
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="What do you want to explore in your second brain?"
          disabled={isLoading}
          className="flex-1 min-h-12 max-h-48 bg-transparent text-text-primary placeholder:text-text-dim resize-none focus:outline-none text-sm leading-relaxed"
          style={{ height: "48px" }}
        />

        {/* Send Button */}
        <CyberButton
          variant="neon"
          size="lg"
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          className="mt-1 h-12 px-4"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-space-black border-t-transparent rounded-full animate-spin mr-2" />
              Thinking...
            </>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </CyberButton>
      </div>

      {/* Hint Text */}
      <div className="flex items-center gap-2 mt-2">
        <Sparkles className="h-3 w-3 text-neon-cyan" />
        <span className="text-xs text-text-dim font-tech">
          Press <kbd className="px-1.5 py-0.5 rounded bg-glass-surface border border-glass-border">Enter</kbd> to send,{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-glass-surface border border-glass-border">Shift + Enter</kbd> for new line
        </span>
      </div>
    </div>
  );
}