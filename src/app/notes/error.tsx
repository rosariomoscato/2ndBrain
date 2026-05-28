"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FileText, RefreshCw, Home } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

export default function NotesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error("Notes error:", error);
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="glass-panel rounded-2xl p-8 text-center max-w-lg border-2 border-neon-pink/30">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FileText className="h-16 w-16 text-neon-pink glow-text" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-pink animate-ping" />
          </div>
        </div>
        <h1 className="text-5xl font-display font-bold text-neon-pink mb-4 glow-text">
          NOTES ERROR
        </h1>
        <p className="text-text-secondary mb-6">
          {error.message || "Failed to load notes from the database"}
        </p>
        {error.digest && (
          <p className="text-xs text-text-dim mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <CyberButton variant="primary" onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </CyberButton>
          <CyberButton variant="secondary" asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Command Center
            </Link>
          </CyberButton>
        </div>
      </div>
    </div>
  );
}