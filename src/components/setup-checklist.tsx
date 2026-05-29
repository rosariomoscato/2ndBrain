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
    <div className="border-neon bg-neon/10 flex h-5 w-5 items-center justify-center border">
      <CheckCircle2 className="text-neon h-3 w-3" aria-label="ok" />
    </div>
  ) : (
    <div className="border-destructive bg-destructive/10 flex h-5 w-5 items-center justify-center border">
      <XCircle className="text-destructive h-3 w-3" aria-label="not-ok" />
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

  useEffect(() => {
    load();
  }, [load]);

  const steps = [
    {
      key: "env",
      label: "Variabili d'ambiente",
      ok: !!data?.env.POSTGRES_URL && !!data?.env.BETTER_AUTH_SECRET,
      detail: "POSTGRES_URL, BETTER_AUTH_SECRET",
    },
    {
      key: "db",
      label: "Database connesso",
      ok: !!data?.database.connected && !!data?.database.schemaApplied,
      detail: data?.database.error ? `Errore: ${data.database.error}` : undefined,
    },
    {
      key: "auth",
      label: "Autenticazione",
      ok: !!data?.auth.configured,
      detail: data?.auth.routeResponding === false ? "Route non rispondente" : undefined,
    },
    {
      key: "ai",
      label: "Integrazione AI",
      ok: !!data?.ai.configured,
      detail: !data?.ai.configured ? "Imposta OPENROUTER_API_KEY" : undefined,
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
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-sm font-bold tracking-wider uppercase">
            Elenco di configurazione
          </h3>
          <p className="text-muted-foreground mt-1 font-[family-name:var(--font-display)] text-xs tracking-wider uppercase">
            {completed}/{steps.length} completati
          </p>
        </div>
        <Button size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Ricontrolla
        </Button>
      </div>

      {error ? (
        <div className="border-destructive bg-destructive/5 text-destructive mb-4 border-2 p-3 font-[family-name:var(--font-display)] text-xs tracking-wider uppercase">
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
                  <span className="text-neon font-[family-name:var(--font-display)] text-xs tracking-wider uppercase">
                    OK
                  </span>
                )}
              </div>
              {s.detail ? <p className="text-muted-foreground mt-0.5 text-xs">{s.detail}</p> : null}
            </div>
          </li>
        ))}
      </ul>

      {data ? (
        <div className="border-brutal-border text-muted-foreground/60 mt-4 border-t pt-4 font-[family-name:var(--font-display)] text-xs tracking-wider uppercase">
          Ultimo controllo: {new Date(data.timestamp).toLocaleString("it-IT")}
        </div>
      ) : null}
    </div>
  );
}
