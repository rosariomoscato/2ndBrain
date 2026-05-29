import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { auth } from "@/lib/auth";

export default async function ResetPasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full max-w-md">
      <div className="brutal-card p-8">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wider uppercase">
            Reimposta password
          </h1>
          <p className="text-muted-foreground font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
            Inserisci la tua nuova password
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="bg-border h-[2px] w-8" />
            <span className="border-neon h-2 w-2 rotate-45 border-2" />
            <span className="bg-border h-[2px] w-8" />
          </div>
        </div>
        <Suspense
          fallback={
            <div className="text-muted-foreground flex items-center justify-center gap-3 font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
              <div className="bg-neon h-2 w-2 animate-pulse rounded-full" />
              Caricamento...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
