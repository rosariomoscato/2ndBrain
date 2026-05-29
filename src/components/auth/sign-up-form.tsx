"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }

    if (password.length < 8) {
      setError("La password deve contenere almeno 8 caratteri");
      return;
    }

    setIsPending(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message || "Creazione account non riuscita");
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
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          type="text"
          placeholder="Il tuo nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPending}
        />
      </div>
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
          placeholder="Crea una password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Conferma Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Conferma la tua password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {isPending ? "Creazione account in corso..." : "Crea account"}
      </Button>
      <div className="flex items-center gap-2">
        <div className="bg-border h-[1px] flex-1" />
        <span className="text-muted-foreground font-[family-name:var(--font-display)] text-xs tracking-wider uppercase">
          oppure
        </span>
        <div className="bg-border h-[1px] flex-1" />
      </div>
      <div className="text-muted-foreground text-center text-sm">
        Hai gi&agrave; un account?{" "}
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
