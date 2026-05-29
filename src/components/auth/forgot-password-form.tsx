"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const result = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (result.error) {
        setError(result.error.message || "Invio email di reset non riuscito");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Si è verificato un errore imprevisto");
    } finally {
      setIsPending(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="border-neon bg-neon/5 border-2 p-4">
          <p className="text-neon font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
            Email inviata con successo
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            Se esiste un account con questa email, riceverai un link di reset. Controlla il
            terminale per l&apos;URL.
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            Torna all&apos;accesso
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@esempio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      {error && (
        <div className="border-destructive bg-destructive/5 text-destructive border-2 p-3 font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Invio in corso..." : "Invia link di reset"}
      </Button>
      <div className="text-muted-foreground text-center text-sm">
        Ti ricordi la password?{" "}
        <Link
          href="/login"
          className="text-neon font-[family-name:var(--font-display)] text-xs tracking-wider uppercase hover:underline"
        >
          Accedi
        </Link>
      </div>
    </form>
  );
}
