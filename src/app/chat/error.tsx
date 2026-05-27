"use client";

import { useEffect } from "react";
import { MessageSquareWarning, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Errore chat:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <MessageSquareWarning className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Errore Chat</h1>
        <p className="text-muted-foreground mb-6">
          Si è verificato un problema con il servizio di chat. Potrebbe essere dovuto a un
          problema di connessione o al servizio AI temporaneamente non disponibile.
        </p>
        {error.message && (
          <p className="text-sm text-muted-foreground mb-4 p-2 bg-muted rounded">
            {error.message}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Riprova
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Vai alla home
          </Button>
        </div>
      </div>
    </div>
  );
}
