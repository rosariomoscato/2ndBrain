import { Search, Sparkles, User, Terminal } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";

export function CyberHeader() {
  return (
    <header className="glass-panel border-b border-neon-cyan/30 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-6 w-6 text-neon-cyan glow-text" />
          <h1 className="text-xl font-display font-bold tracking-tight text-text-primary">
            SECOND<span className="text-neon-cyan">BRAIN</span>
          </h1>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
          <CyberInput
            placeholder="Search notes, query knowledge graph..."
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Right: AI Query & User */}
      <div className="flex items-center gap-3">
        <CyberButton variant="neon" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Query</span>
        </CyberButton>
        <div className="flex items-center gap-2 border-l border-glass-border pl-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
            <User className="h-5 w-5 text-space-black" />
          </div>
        </div>
      </div>
    </header>
  );
}