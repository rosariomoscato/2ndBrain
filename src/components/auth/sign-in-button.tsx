"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "@/lib/auth-client";

export function SignInButton() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  if (sessionPending) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-3 font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
        <div className="bg-neon h-2 w-2 animate-pulse rounded-full" />
        Caricamento...
      </div>
    );
  }

  if (session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message || "Accesso non riuscito");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Si è verificato un errore imprevisto");
    } finally {
      setIsPending(false);
    }
  };

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
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="La tua password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {isPending ? "Accesso in corso..." : "Accedi"}
      </Button>
      <div className="text-muted-foreground text-center text-sm">
        <Link href="/forgot-password" className="hover:text-neon transition-colors">
          Password dimenticata?
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-border h-[1px] flex-1" />
        <span className="text-muted-foreground font-[family-name:var(--font-display)] text-xs tracking-wider uppercase">
          oppure
        </span>
        <div className="bg-border h-[1px] flex-1" />
      </div>
      <div className="text-muted-foreground text-center text-sm">
        Non hai un account?{" "}
        <Link
          href="/register"
          className="text-neon font-[family-name:var(--font-display)] text-xs tracking-wider uppercase hover:underline"
        >
          Registrati
        </Link>
      </div>
    </form>
  );
}
