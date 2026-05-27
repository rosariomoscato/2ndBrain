import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { auth } from "@/lib/auth"

export default async function ResetPasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="w-full max-w-md">
      <div className="brutal-card p-8">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wider font-[family-name:var(--font-display)]">
            Reimposta password
          </h1>
          <p className="text-sm text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider">
            Inserisci la tua nuova password
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="h-[2px] w-8 bg-border" />
            <span className="w-2 h-2 border-2 border-neon rotate-45" />
            <span className="h-[2px] w-8 bg-border" />
          </div>
        </div>
        <Suspense fallback={
          <div className="flex items-center justify-center gap-3 text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider text-sm">
            <div className="w-2 h-2 bg-neon rounded-full animate-pulse" />
            Caricamento...
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
