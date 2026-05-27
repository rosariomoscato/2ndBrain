"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, useSession } from "@/lib/auth-client"

export function SignInButton() {
  const { data: session, isPending: sessionPending } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isPending, setIsPending] = useState(false)

  if (sessionPending) {
    return (
      <div className="flex items-center justify-center gap-3 text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider text-sm">
        <div className="w-2 h-2 bg-neon rounded-full animate-pulse" />
        Caricamento...
      </div>
    )
  }

  if (session) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsPending(true)

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      })

      if (result.error) {
        setError(result.error.message || "Accesso non riuscito")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("Si è verificato un errore imprevisto")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
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
        <div className="p-3 border-2 border-destructive bg-destructive/5 text-destructive text-sm font-[family-name:var(--font-display)] uppercase tracking-wider">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Accesso in corso..." : "Accedi"}
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        <Link href="/forgot-password" className="hover:text-neon transition-colors">
          Password dimenticata?
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-[1px] bg-border" />
        <span className="text-xs text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider">oppure</span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Non hai un account?{" "}
        <Link href="/register" className="text-neon hover:underline font-[family-name:var(--font-display)] uppercase tracking-wider text-xs">
          Registrati
        </Link>
      </div>
    </form>
  )
}
