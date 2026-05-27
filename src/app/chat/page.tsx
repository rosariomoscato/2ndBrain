"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useChat } from "@ai-sdk/react";
import { Copy, Check, Loader2, Send, Trash2, Terminal, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import type { Components } from "react-markdown";

const H1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h1 className="mt-2 mb-3 text-xl font-bold text-foreground font-[family-name:var(--font-display)] uppercase tracking-wider" {...props} />
);
const H2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h2 className="mt-2 mb-2 text-lg font-bold text-foreground font-[family-name:var(--font-display)] uppercase tracking-wider" {...props} />
);
const H3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h3 className="mt-2 mb-2 text-base font-bold text-foreground font-[family-name:var(--font-display)] uppercase tracking-wider" {...props} />
);
const Paragraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props
) => <p className="mb-3 leading-7 text-sm" {...props} />;
const UL: React.FC<React.HTMLAttributes<HTMLUListElement>> = (props) => (
  <ul className="mb-3 ml-5 list-none space-y-1 text-sm [&>li]:flex [&>li]:items-start [&>li]:gap-2" {...props}>
    {(props as React.HTMLAttributes<HTMLUListElement> & { children: ReactNode }).children}
  </ul>
);
const OL: React.FC<React.OlHTMLAttributes<HTMLOListElement>> = (props) => (
  <ol className="mb-3 ml-5 list-none space-y-1 text-sm" {...props} />
);
const LI: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = (props) => (
  <li className="leading-6 flex items-start gap-2">
    <span className="w-1 h-1 bg-neon mt-2 shrink-0" />
    <span>{props.children}</span>
  </li>
);
const Anchor: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (
  props
) => (
  <a
    className="text-neon underline underline-offset-2 decoration-neon/30 hover:decoration-neon transition-colors"
    target="_blank"
    rel="noreferrer noopener"
    {...props}
  />
);
const Blockquote: React.FC<React.BlockquoteHTMLAttributes<HTMLElement>> = (
  props
) => (
  <blockquote
    className="mb-3 border-l-2 border-neon pl-4 text-muted-foreground italic"
    {...props}
  />
);
const Code: Components["code"] = ({ children, className, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  const isInline = !match;

  if (isInline) {
    return (
      <code className="px-1.5 py-0.5 bg-surface border border-brutal-border text-neon text-xs font-[family-name:var(--font-display)]" {...props}>
        {children}
      </code>
    );
  }
  return (
    <pre className="mb-3 w-full overflow-x-auto border-2 border-brutal-border bg-[#0d0d14] p-4">
      <code className="text-xs leading-5 font-[family-name:var(--font-display)] text-foreground/90" {...props}>
        {children}
      </code>
    </pre>
  );
};
const HR: React.FC<React.HTMLAttributes<HTMLHRElement>> = (props) => (
  <hr className="my-4 h-[2px] bg-border" {...props} />
);
const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = (
  props
) => (
  <div className="mb-3 overflow-x-auto">
    <table className="w-full border-collapse text-sm border-2 border-brutal-border" {...props} />
  </div>
);
const TH: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = (props) => (
  <th
    className="border border-brutal-border bg-surface px-3 py-2 text-left font-bold uppercase tracking-wider text-xs font-[family-name:var(--font-display)]"
    {...props}
  />
);
const TD: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = (props) => (
  <td className="border border-brutal-border px-3 py-2" {...props} />
);

const markdownComponents: Components = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: Paragraph,
  ul: UL,
  ol: OL,
  li: LI,
  a: Anchor,
  blockquote: Blockquote,
  code: Code,
  hr: HR,
  table: Table,
  th: TH,
  td: TD,
};

type TextPart = { type?: string; text?: string };
type MaybePartsMessage = {
  display?: ReactNode;
  parts?: TextPart[];
  content?: TextPart[];
};

function getMessageText(message: MaybePartsMessage): string {
  const parts = Array.isArray(message.parts)
    ? message.parts
    : Array.isArray(message.content)
    ? message.content
    : [];
  return parts
    .filter((p) => p?.type === "text" && p.text)
    .map((p) => p.text)
    .join("\n");
}

function renderMessageContent(message: MaybePartsMessage): ReactNode {
  if (message.display) return message.display;
  const parts = Array.isArray(message.parts)
    ? message.parts
    : Array.isArray(message.content)
    ? message.content
    : [];
  return parts.map((p, idx) =>
    p?.type === "text" && p.text ? (
      <ReactMarkdown key={idx} components={markdownComponents}>
        {p.text}
      </ReactMarkdown>
    ) : null
  );
}

function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("it-IT", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copiato negli appunti");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copia non riuscita");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 border border-brutal-border bg-surface hover:bg-neon hover:text-primary-foreground transition-all rounded-none"
      title="Copia negli appunti"
    >
      {copied ? (
        <Check className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 p-4 border-2 border-neon/30 bg-neon/5 max-w-[80%] ml-0">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-neon rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-neon rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-neon rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-sm text-neon font-[family-name:var(--font-display)] uppercase tracking-wider">
        AI sta elaborando...
      </span>
    </div>
  );
}

const STORAGE_KEY = "chat-messages";

export default function ChatPage() {
  const { data: session, isPending } = useSession();
  const { messages, sendMessage, status, error, setMessages } = useChat({
    onError: (err) => {
      toast.error(err.message || "Invio del messaggio non riuscito");
    },
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
  }, [setMessages]);

  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Chat cancellata");
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider text-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          Caricamento...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <UserProfile />
        </div>
      </div>
    );
  }

  const isStreaming = status === "streaming";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-brutal-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-neon bg-neon/10 flex items-center justify-center">
              <Terminal className="h-4 w-4 text-neon" />
            </div>
            <div>
              <h1 className="text-lg font-bold uppercase tracking-wider font-[family-name:var(--font-display)]">
                Chat AI
              </h1>
              <p className="text-xs text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider">
                Sessione attiva
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="tag-terminal hidden sm:inline-flex">
              {session.user.name}
            </span>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearMessages}>
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Cancella
              </Button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 border-2 border-destructive bg-destructive/5 brutal-card">
            <p className="text-sm text-destructive font-[family-name:var(--font-display)] uppercase tracking-wider">
              Errore: {error.message || "Qualcosa è andato storto"}
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="min-h-[50vh] overflow-y-auto space-y-4 mb-6">
          {messages.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 border-2 border-neon/30 bg-neon/5 flex items-center justify-center mx-auto">
                <Terminal className="h-8 w-8 text-neon/50" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider text-sm">
                  Inizia una conversazione
                </p>
                <p className="text-xs text-muted-foreground/60 font-[family-name:var(--font-display)] uppercase tracking-wider">
                  Scrivi un messaggio qui sotto per iniziare
                </p>
              </div>
            </div>
          )}
          {messages.map((message) => {
            const messageText = getMessageText(message as MaybePartsMessage);
            const createdAt = (message as { createdAt?: Date }).createdAt;
            const timestamp = createdAt
              ? formatTimestamp(new Date(createdAt))
              : null;

            return (
              <div
                key={message.id}
                className={`group animate-fade-up ${
                  message.role === "user"
                    ? "ml-auto max-w-[80%]"
                    : "mr-auto max-w-[80%]"
                }`}
              >
                <div className={`border-2 p-4 ${
                  message.role === "user"
                    ? "border-neon bg-neon/5 text-foreground"
                    : "border-brutal-border bg-surface text-foreground"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {message.role === "user" ? (
                        <User className="h-3.5 w-3.5 text-neon" />
                      ) : (
                        <Terminal className="h-3.5 w-3.5 text-neon" />
                      )}
                      <span className="text-xs font-bold uppercase tracking-wider font-[family-name:var(--font-display)]">
                        {message.role === "user" ? "Tu" : "AI"}
                      </span>
                      {timestamp && (
                        <span className="text-xs text-muted-foreground/60 font-[family-name:var(--font-display)]">
                          {timestamp}
                        </span>
                      )}
                    </div>
                    {message.role === "assistant" && messageText && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton text={messageText} />
                      </div>
                    )}
                  </div>
                  <div>{renderMessageContent(message as MaybePartsMessage)}</div>
                </div>
              </div>
            );
          })}
          {isStreaming && messages[messages.length - 1]?.role === "user" && (
            <ThinkingIndicator />
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const text = input.trim();
            if (!text) return;
            sendMessage({ role: "user", parts: [{ type: "text", text }] });
            setInput("");
          }}
          className="flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi il tuo messaggio..."
            className="flex-1 brutal-input"
            disabled={isStreaming}
          />
          <Button type="submit" disabled={!input.trim() || isStreaming} size="lg">
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
