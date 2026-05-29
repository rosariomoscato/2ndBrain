"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, User, Terminal, LogOut, Settings, ChevronDown } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { useSession, signOut } from "@/lib/auth-client";

export function CyberHeader() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    setShowUserMenu(false);
  };

  return (
    <header className="glass-panel border-neon-cyan/30 sticky top-0 z-50 flex h-16 items-center justify-between border-b px-4 lg:px-6">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="text-neon-cyan glow-text h-6 w-6" />
          <h1 className="font-display text-text-primary text-xl font-bold tracking-tight">
            SECOND<span className="text-neon-cyan">BRAIN</span>
          </h1>
        </div>
      </div>

      {/* Center: Search */}
      <div className="mx-4 max-w-2xl flex-1 lg:mx-8">
        <div className="relative">
          <Search className="text-text-dim absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <CyberInput placeholder="Search notes, query knowledge graph..." className="h-10 pl-10" />
        </div>
      </div>

      {/* Right: AI Query & User */}
      <div className="flex items-center gap-3">
        <CyberButton variant="neon" size="sm" className="gap-2" onClick={() => router.push("/ai")}>
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Query</span>
        </CyberButton>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="border-glass-border hover:bg-glass-surface/50 flex items-center gap-2 rounded-lg border-l py-1 pr-2 pl-3 transition-colors"
          >
            <div className="from-neon-cyan to-neon-purple flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br">
              <User className="text-space-black h-5 w-5" />
            </div>
            {mounted && session && (
              <>
                <span className="text-text-secondary hidden text-sm md:inline">
                  {session.user?.email?.split("@")[0]}
                </span>
                <ChevronDown className="text-text-dim h-4 w-4" />
              </>
            )}
          </button>

          {showUserMenu && (
            <div className="glass-panel border-glass-border absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border shadow-xl">
              <div className="p-2">
                <button
                  onClick={() => {
                    router.push("/profile");
                    setShowUserMenu(false);
                  }}
                  className="text-text-secondary hover:text-text-primary hover:bg-glass-surface/50 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="text-neon-red hover:bg-neon-red/10 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors"
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
