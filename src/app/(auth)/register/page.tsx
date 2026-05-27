import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { auth } from "@/lib/auth"

export default async function RegisterPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="w-full max-w-md">
      <div className="brutal-card p-8">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wider font-[family-name:var(--font-display)]">
            Crea un account
          </h1>
          <p className="text-sm text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider">
            Inizia con il tuo nuovo account
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="h-[2px] w-8 bg-border" />
            <span className="w-2 h-2 border-2 border-neon rotate-45" />
            <span className="h-[2px] w-8 bg-border" />
          </div>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
