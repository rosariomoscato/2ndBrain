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
  <h1
    className="text-foreground mt-2 mb-3 font-[family-name:var(--font-display)] text-xl font-bold tracking-wider uppercase"
    {...props}
  />
);
const H2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h2
    className="text-foreground mt-2 mb-2 font-[family-name:var(--font-display)] text-lg font-bold tracking-wider uppercase"
    {...props}
  />
);
const H3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h3
    className="text-foreground mt-2 mb-2 font-[family-name:var(--font-display)] text-base font-bold tracking-wider uppercase"
    {...props}
  />
);
const Paragraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (props) => (
  <p className="mb-3 text-sm leading-7" {...props} />
);
const UL: React.FC<React.HTMLAttributes<HTMLUListElement>> = (props) => (
  <ul
    className="mb-3 ml-5 list-none space-y-1 text-sm [&>li]:flex [&>li]:items-start [&>li]:gap-2"
    {...props}
  >
    {(props as React.HTMLAttributes<HTMLUListElement> & { children: ReactNode }).children}
  </ul>
);
const OL: React.FC<React.OlHTMLAttributes<HTMLOListElement>> = (props) => (
  <ol className="mb-3 ml-5 list-none space-y-1 text-sm" {...props} />
);
const LI: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = (props) => (
  <li className="flex items-start gap-2 leading-6">
    <span className="bg-neon mt-2 h-1 w-1 shrink-0" />
    <span>{props.children}</span>
  </li>
);
const Anchor: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  <a
    className="text-neon decoration-neon/30 hover:decoration-neon underline underline-offset-2 transition-colors"
    target="_blank"
    rel="noreferrer noopener"
    {...props}
  />
);
const Blockquote: React.FC<React.BlockquoteHTMLAttributes<HTMLElement>> = (props) => (
  <blockquote
    className="border-neon text-muted-foreground mb-3 border-l-2 pl-4 italic"
    {...props}
  />
);
const Code: Components["code"] = ({ children, className, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  const isInline = !match;

  if (isInline) {
    return (
      <code
        className="bg-surface border-brutal-border text-neon border px-1.5 py-0.5 font-[family-name:var(--font-display)] text-xs"
        {...props}
      >
        {children}
      </code>
    );
  }
  return (
    <pre className="border-brutal-border mb-3 w-full overflow-x-auto border-2 bg-[#0d0d14] p-4">
      <code
        className="text-foreground/90 font-[family-name:var(--font-display)] text-xs leading-5"
        {...props}
      >
        {children}
      </code>
    </pre>
  );
};
const HR: React.FC<React.HTMLAttributes<HTMLHRElement>> = (props) => (
  <hr className="bg-border my-4 h-[2px]" {...props} />
);
const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = (props) => (
  <div className="mb-3 overflow-x-auto">
    <table className="border-brutal-border w-full border-collapse border-2 text-sm" {...props} />
  </div>
);
const TH: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = (props) => (
  <th
    className="border-brutal-border bg-surface border px-3 py-2 text-left font-[family-name:var(--font-display)] text-xs font-bold tracking-wider uppercase"
    {...props}
  />
);
const TD: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = (props) => (
  <td className="border-brutal-border border px-3 py-2" {...props} />
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
      className="border-brutal-border bg-surface hover:bg-neon hover:text-primary-foreground rounded-none border p-1 transition-all"
      title="Copia negli appunti"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="text-muted-foreground h-3 w-3" />}
    </button>
  );
}

function ThinkingIndicator() {
  return (
    <div className="border-neon/30 bg-neon/5 ml-0 flex max-w-[80%] items-center gap-3 border-2 p-4">
      <div className="flex gap-1">
        <span className="bg-neon h-2 w-2 animate-bounce rounded-full [animation-delay:0ms]" />
        <span className="bg-neon h-2 w-2 animate-bounce rounded-full [animation-delay:150ms]" />
        <span className="bg-neon h-2 w-2 animate-bounce rounded-full [animation-delay:300ms]" />
      </div>
      <span className="text-neon font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-3 font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
          <Loader2 className="h-5 w-5 animate-spin" />
          Caricamento...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <UserProfile />
        </div>
      </div>
    );
  }

  const isStreaming = status === "streaming";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mx-auto max-w-4xl">
        {/* Chat Header */}
        <div className="border-brutal-border mb-6 flex items-center justify-between border-b-2 pb-4">
          <div className="flex items-center gap-3">
            <div className="border-neon bg-neon/10 flex h-8 w-8 items-center justify-center border-2">
              <Terminal className="text-neon h-4 w-4" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-wider uppercase">
                Chat AI
              </h1>
              <p className="text-muted-foreground font-[family-name:var(--font-display)] text-xs tracking-wider uppercase">
                Sessione attiva
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="tag-terminal hidden sm:inline-flex">{session.user.name}</span>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearMessages}>
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Cancella
              </Button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="border-destructive bg-destructive/5 brutal-card mb-4 border-2 p-4">
            <p className="text-destructive font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
              Errore: {error.message || "Qualcosa è andato storto"}
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="mb-6 min-h-[50vh] space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="space-y-4 py-20 text-center">
              <div className="border-neon/30 bg-neon/5 mx-auto flex h-16 w-16 items-center justify-center border-2">
                <Terminal className="text-neon/50 h-8 w-8" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
                  Inizia una conversazione
                </p>
                <p className="text-muted-foreground/60 font-[family-name:var(--font-display)] text-xs tracking-wider uppercase">
                  Scrivi un messaggio qui sotto per iniziare
                </p>
              </div>
            </div>
          )}
          {messages.map((message) => {
            const messageText = getMessageText(message as MaybePartsMessage);
            const createdAt = (message as { createdAt?: Date }).createdAt;
            const timestamp = createdAt ? formatTimestamp(new Date(createdAt)) : null;

            return (
              <div
                key={message.id}
                className={`group animate-fade-up ${
                  message.role === "user" ? "ml-auto max-w-[80%]" : "mr-auto max-w-[80%]"
                }`}
              >
                <div
                  className={`border-2 p-4 ${
                    message.role === "user"
                      ? "border-neon bg-neon/5 text-foreground"
                      : "border-brutal-border bg-surface text-foreground"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {message.role === "user" ? (
                        <User className="text-neon h-3.5 w-3.5" />
                      ) : (
                        <Terminal className="text-neon h-3.5 w-3.5" />
                      )}
                      <span className="font-[family-name:var(--font-display)] text-xs font-bold tracking-wider uppercase">
                        {message.role === "user" ? "Tu" : "AI"}
                      </span>
                      {timestamp && (
                        <span className="text-muted-foreground/60 font-[family-name:var(--font-display)] text-xs">
                          {timestamp}
                        </span>
                      )}
                    </div>
                    {message.role === "assistant" && messageText && (
                      <div className="opacity-0 transition-opacity group-hover:opacity-100">
                        <CopyButton text={messageText} />
                      </div>
                    )}
                  </div>
                  <div>{renderMessageContent(message as MaybePartsMessage)}</div>
                </div>
              </div>
            );
          })}
          {isStreaming && messages[messages.length - 1]?.role === "user" && <ThinkingIndicator />}
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
            className="brutal-input flex-1"
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
