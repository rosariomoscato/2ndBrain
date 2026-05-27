"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type DiagnosticsResponse = {
  timestamp: string;
  env: {
    POSTGRES_URL: boolean;
    BETTER_AUTH_SECRET: boolean;
    OPENROUTER_API_KEY: boolean;
    NEXT_PUBLIC_APP_URL: boolean;
  };
  database: {
    connected: boolean;
    schemaApplied: boolean;
    error?: string;
  };
  auth: {
    configured: boolean;
    routeResponding: boolean | null;
  };
  ai: {
    configured: boolean;
  };
  storage: {
    configured: boolean;
    type: "local" | "remote";
  };
  overallStatus: "ok" | "warn" | "error";
};

function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <div className="w-5 h-5 border border-neon bg-neon/10 flex items-center justify-center">
      <CheckCircle2 className="h-3 w-3 text-neon" aria-label="ok" />
    </div>
  ) : (
    <div className="w-5 h-5 border border-destructive bg-destructive/10 flex items-center justify-center">
      <XCircle className="h-3 w-3 text-destructive" aria-label="not-ok" />
    </div>
  );
}

export function SetupChecklist() {
  const [data, setData] = useState<DiagnosticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnostics", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as DiagnosticsResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Caricamento diagnostica non riuscito");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    load();  
  }, [load]);

  const steps = [
    {
      key: "env",
      label: "Variabili d'ambiente",
      ok:
        !!data?.env.POSTGRES_URL &&
        !!data?.env.BETTER_AUTH_SECRET,
      detail:
        "POSTGRES_URL, BETTER_AUTH_SECRET",
    },
    {
      key: "db",
      label: "Database connesso",
      ok: !!data?.database.connected && !!data?.database.schemaApplied,
      detail: data?.database.error
        ? `Errore: ${data.database.error}`
        : undefined,
    },
    {
      key: "auth",
      label: "Autenticazione",
      ok: !!data?.auth.configured,
      detail:
        data?.auth.routeResponding === false
          ? "Route non rispondente"
          : undefined,
    },
    {
      key: "ai",
      label: "Integrazione AI",
      ok: !!data?.ai.configured,
      detail: !data?.ai.configured
        ? "Imposta OPENROUTER_API_KEY"
        : undefined,
    },
    {
      key: "storage",
      label: "Storage file",
      ok: true,
      detail: data?.storage
        ? data.storage.type === "remote"
          ? "Vercel Blob"
          : "Storage locale"
        : undefined,
    },
  ] as const;

  const completed = steps.filter((s) => s.ok).length;

  return (
    <div className="brutal-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold uppercase tracking-wider font-[family-name:var(--font-display)] text-sm">
            Elenco di configurazione
          </h3>
          <p className="text-xs text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider mt-1">
            {completed}/{steps.length} completati
          </p>
        </div>
        <Button size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Ricontrolla
        </Button>
      </div>

      {error ? (
        <div className="p-3 border-2 border-destructive bg-destructive/5 text-destructive text-xs font-[family-name:var(--font-display)] uppercase tracking-wider mb-4">
          {error}
        </div>
      ) : null}

      <ul className="space-y-3">
        {steps.map((s) => (
          <li key={s.key} className="flex items-start gap-3">
            <div className="mt-0.5">
              <StatusIcon ok={Boolean(s.ok)} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{s.label}</span>
                {s.ok && (
                  <span className="text-xs text-neon font-[family-name:var(--font-display)] uppercase tracking-wider">OK</span>
                )}
              </div>
              {s.detail ? (
                <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {data ? (
        <div className="mt-4 pt-4 border-t border-brutal-border text-xs text-muted-foreground/60 font-[family-name:var(--font-display)] uppercase tracking-wider">
          Ultimo controllo: {new Date(data.timestamp).toLocaleString("it-IT")}
        </div>
      ) : null}
    </div>
  );
}
