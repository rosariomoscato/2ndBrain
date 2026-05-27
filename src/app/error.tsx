"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Errore dell'applicazione:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Qualcosa è andato storto</h1>
        <p className="text-muted-foreground mb-6">
          Si è verificato un errore imprevisto. Riprova o contatta il supporto se il problema persiste.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-4">
            ID Errore: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Riprova</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Vai alla home
          </Button>
        </div>
      </div>
    </div>
  );
}
