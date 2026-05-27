import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface NotePreviewProps {
  content: string;
}

export function NotePreview({ content }: NotePreviewProps) {
  return (
    <div className="prose-neon prose-invert prose-lg max-w-none">
      <ReactMarkdown
        components={{
          // Code blocks with syntax highlighting
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="!bg-glass-surface rounded-lg"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="px-1.5 py-0.5 bg-glass-surface rounded text-neon-cyan font-tech text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Headings with display font and glow effect
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold font-display text-text-primary glow-text mt-6 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold font-display text-text-primary glow-text mt-5 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold font-display text-text-primary glow-text mt-4 mb-2">
              {children}
            </h3>
          ),
          // Paragraphs with secondary color and leading
          p: ({ children }) => (
            <p className="text-text-secondary leading-7 mb-4">{children}</p>
          ),
          // Links with neon cyan and hover effect
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-neon-cyan hover:text-neon-purple transition-colors underline hover-glow"
            >
              {children}
            </a>
          ),
          // Lists with proper indentation
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-text-secondary leading-7">{children}</li>
          ),
          // Blockquotes with purple left border
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-neon-purple pl-4 py-2 my-4 bg-glass-surface rounded-r-lg">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}