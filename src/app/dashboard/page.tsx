"use client";

import Link from "next/link";
import { Lock, Bot, User, ArrowRight, Cpu, Terminal } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { useDiagnostics } from "@/hooks/use-diagnostics";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const { isAiReady, loading: diagnosticsLoading } = useDiagnostics();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider text-sm">
          <div className="w-2 h-2 bg-neon rounded-full animate-pulse" />
          Caricamento...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <div className="brutal-card p-8 space-y-6">
            <div className="w-16 h-16 border-2 border-brutal-border bg-surface flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold uppercase tracking-wider font-[family-name:var(--font-display)]">
                Accesso Negato
              </h1>
              <p className="text-sm text-muted-foreground">
                Devi accedere per visualizzare la dashboard
              </p>
            </div>
            <UserProfile />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Dashboard Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-neon bg-neon/10 flex items-center justify-center">
            <Terminal className="h-5 w-5 text-neon" />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider font-[family-name:var(--font-display)]">
              Dashboard
            </h1>
            <p className="text-xs text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider">
              Benvenuto, {session.user.name}
            </p>
          </div>
        </div>
        <div className="h-[2px] bg-border" />
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chat AI Card */}
        <div className="brutal-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-brutal-border bg-surface flex items-center justify-center">
                <Bot className="h-5 w-5 text-neon" />
              </div>
              <div>
                <h2 className="font-bold uppercase tracking-wider font-[family-name:var(--font-display)] text-sm">
                  Chat AI
                </h2>
                <p className="text-xs text-muted-foreground font-[family-name:var(--font-display)]">
                  Conversa con l&apos;intelligenza artificiale
                </p>
              </div>
            </div>
            <span className="tag-terminal">AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Inizia una conversazione con l&apos;AI usando Vercel AI SDK e OpenRouter
          </p>
          {(diagnosticsLoading || !isAiReady) ? (
            <Button disabled size="sm">
              <Cpu className="h-3.5 w-3.5 mr-1.5" />
              Non configurato
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link href="/chat">
                Vai alla Chat
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <div className="brutal-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-brutal-border bg-surface flex items-center justify-center">
                <User className="h-5 w-5 text-neon" />
              </div>
              <div>
                <h2 className="font-bold uppercase tracking-wider font-[family-name:var(--font-display)] text-sm">
                  Profilo
                </h2>
                <p className="text-xs text-muted-foreground font-[family-name:var(--font-display)]">
                  Informazioni account
                </p>
              </div>
            </div>
            <span className="tag-terminal">User</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-brutal-border bg-surface">
              <span className="text-xs text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider">Nome</span>
              <span className="text-sm font-medium">{session.user.name}</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-brutal-border bg-surface">
              <span className="text-xs text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider">Email</span>
              <span className="text-sm font-medium">{session.user.email}</span>
            </div>
          </div>
          <Button asChild variant="neon" size="sm">
            <Link href="/profile">
              Gestisci Profilo
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
