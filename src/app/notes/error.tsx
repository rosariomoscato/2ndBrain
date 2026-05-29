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
    if (process.env.NODE_ENV === "development") {
      console.error("Notes error:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="glass-panel border-neon-pink/30 max-w-lg rounded-2xl border-2 p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <FileText className="text-neon-pink glow-text h-16 w-16" />
            <div className="bg-neon-pink absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full" />
          </div>
        </div>
        <h1 className="font-display text-neon-pink glow-text mb-4 text-5xl font-bold">
          NOTES ERROR
        </h1>
        <p className="text-text-secondary mb-6">
          {error.message || "Failed to load notes from the database"}
        </p>
        {error.digest && (
          <p className="text-text-dim mb-6 font-mono text-xs">Error ID: {error.digest}</p>
        )}
        <div className="flex justify-center gap-4">
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
