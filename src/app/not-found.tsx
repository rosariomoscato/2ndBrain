import Link from "next/link";
import { Terminal } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

export default function NotFound() {
  return (
    <div className="bg-space-black flex min-h-screen items-center justify-center">
      <div className="glass-panel border-neon-purple/30 max-w-lg rounded-2xl border p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Terminal className="text-neon-purple glow-text h-20 w-20" />
            <div className="bg-neon-pink absolute -top-2 -right-2 h-6 w-6 animate-pulse rounded-full" />
          </div>
        </div>
        <h1 className="font-display glow-text text-neon-cyan mb-4 text-8xl font-bold">404</h1>
        <h2 className="text-text-primary mb-4 text-2xl font-semibold">Node Not Found</h2>
        <p className="text-text-secondary mb-8">
          The requested node does not exist in your knowledge graph.
        </p>
        <div className="flex justify-center gap-4">
          <CyberButton variant="primary" asChild>
            <Link href="/">Return to Command Center</Link>
          </CyberButton>
          <CyberButton variant="secondary" asChild>
            <Link href="/notes">Browse Notes</Link>
          </CyberButton>
        </div>
      </div>
    </div>
  );
}
