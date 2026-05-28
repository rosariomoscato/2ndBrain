"use client";

import { useRouter } from "next/navigation";
import { Search, Sparkles, User, Terminal, LogOut, Settings, ChevronDown } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { useSession, signOut } from "@/lib/auth-client";
import { useState, useEffect } from "react";

export function CyberHeader() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    setShowUserMenu(false);
  };

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
        <CyberButton
          variant="neon"
          size="sm"
          className="gap-2"
          onClick={() => router.push("/ai")}
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Query</span>
        </CyberButton>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 border-l border-glass-border pl-3 pr-2 py-1 hover:bg-glass-surface/50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <User className="h-5 w-5 text-space-black" />
            </div>
            {mounted && session && (
              <>
                <span className="hidden md:inline text-sm text-text-secondary">
                  {session.user?.email?.split("@")[0]}
                </span>
                <ChevronDown className="h-4 w-4 text-text-dim" />
              </>
            )}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-panel border border-glass-border rounded-lg shadow-xl z-50">
              <div className="p-2">
                <button
                  onClick={() => {
                    router.push("/profile");
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-glass-surface/50 rounded-lg transition-colors text-left"
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neon-red hover:bg-neon-red/10 rounded-lg transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}