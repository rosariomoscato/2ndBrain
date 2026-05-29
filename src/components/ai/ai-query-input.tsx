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
    <div className="glass-panel border-neon-cyan/50 hover:border-neon-cyan rounded-xl border-2 p-4 transition-all duration-200">
      <div className="flex gap-3">
        {/* Attachment Button (Placeholder) */}
        <CyberButton variant="ghost" size="icon" disabled className="mt-1">
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
          className="text-text-primary placeholder:text-text-dim max-h-48 min-h-12 flex-1 resize-none bg-transparent text-sm leading-relaxed focus:outline-none"
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
              <div className="border-space-black mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              Thinking...
            </>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </CyberButton>
      </div>

      {/* Hint Text */}
      <div className="mt-2 flex items-center gap-2">
        <Sparkles className="text-neon-cyan h-3 w-3" />
        <span className="text-text-dim font-tech text-xs">
          Press{" "}
          <kbd className="bg-glass-surface border-glass-border rounded border px-1.5 py-0.5">
            Enter
          </kbd>{" "}
          to send,{" "}
          <kbd className="bg-glass-surface border-glass-border rounded border px-1.5 py-0.5">
            Shift + Enter
          </kbd>{" "}
          for new line
        </span>
      </div>
    </div>
  );
}
