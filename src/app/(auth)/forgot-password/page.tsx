import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { auth } from "@/lib/auth";

export default async function ForgotPasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full max-w-md">
      <div className="brutal-card p-8">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wider uppercase">
            Password dimenticata
          </h1>
          <p className="text-muted-foreground font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
            Ti invieremo un link di reimpostazione
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="bg-border h-[2px] w-8" />
            <span className="border-neon h-2 w-2 rotate-45 border-2" />
            <span className="bg-border h-[2px] w-8" />
          </div>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
