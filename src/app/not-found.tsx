import Link from "next/link";
import { Terminal } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-space-black">
      <div className="glass-panel rounded-2xl p-8 text-center max-w-lg border border-neon-purple/30">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Terminal className="h-20 w-20 text-neon-purple glow-text" />
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-pink animate-pulse" />
          </div>
        </div>
        <h1 className="text-8xl font-display font-bold glow-text mb-4 text-neon-cyan">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-text-primary">Node Not Found</h2>
        <p className="text-text-secondary mb-8">
          The requested node does not exist in your knowledge graph.
        </p>
        <div className="flex gap-4 justify-center">
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