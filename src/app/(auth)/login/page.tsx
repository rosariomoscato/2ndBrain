import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SignInButton } from "@/components/auth/sign-in-button"
import { auth } from "@/lib/auth"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    redirect("/dashboard")
  }

  const { reset } = await searchParams

  return (
    <div className="w-full max-w-md">
      <div className="brutal-card p-8">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wider font-[family-name:var(--font-display)]">
            Bentornato
          </h1>
          <p className="text-sm text-muted-foreground font-[family-name:var(--font-display)] uppercase tracking-wider">
            Accedi al tuo account
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="h-[2px] w-8 bg-border" />
            <span className="w-2 h-2 border-2 border-neon rotate-45" />
            <span className="h-[2px] w-8 bg-border" />
          </div>
        </div>

        {reset === "success" && (
          <div className="mb-4 p-3 border-2 border-neon bg-neon/5 text-neon text-sm font-[family-name:var(--font-display)] uppercase tracking-wider">
            Password reimpostata con successo.
          </div>
        )}

        <SignInButton />
      </div>
    </div>
  )
}
