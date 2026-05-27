"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/lib/auth-client"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const error = searchParams.get("error")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState("")
  const [isPending, setIsPending] = useState(false)

  if (error === "invalid_token" || !token) {
    return (
      <div className="space-y-4 w-full max-w-sm text-center">
        <div className="p-4 border-2 border-destructive bg-destructive/5">
          <p className="text-sm text-destructive font-[family-name:var(--font-display)] uppercase tracking-wider">
            {error === "invalid_token"
              ? "Link non valido o scaduto"
              : "Nessun token fornito"}
          </p>
        </div>
        <Link href="/forgot-password">
          <Button variant="outline" className="w-full">
            Richiedi un nuovo link
          </Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (password !== confirmPassword) {
      setFormError("Le password non corrispondono")
      return
    }

    if (password.length < 8) {
      setFormError("La password deve contenere almeno 8 caratteri")
      return
    }

    setIsPending(true)

    try {
      const result = await resetPassword({
        newPassword: password,
        token,
      })

      if (result.error) {
        setFormError(result.error.message || "Reimpostazione password non riuscita")
      } else {
        router.push("/login?reset=success")
      }
    } catch {
      setFormError("Si è verificato un errore imprevisto")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="password">Nuova Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Inserisci nuova password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Conferma Nuova Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Conferma nuova password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      {formError && (
        <div className="p-3 border-2 border-destructive bg-destructive/5 text-destructive text-sm font-[family-name:var(--font-display)] uppercase tracking-wider">
          {formError}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Reimpostazione in corso..." : "Reimposta password"}
      </Button>
    </form>
  )
}
