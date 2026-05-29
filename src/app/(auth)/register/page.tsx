import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { auth } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/");
  }

  return (
    <div className="w-full max-w-md">
      <div className="brutal-card p-8">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wider uppercase">
            Crea un account
          </h1>
          <p className="text-muted-foreground font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
            Inizia con il tuo nuovo account
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="bg-border h-[2px] w-8" />
            <span className="border-neon h-2 w-2 rotate-45 border-2" />
            <span className="bg-border h-[2px] w-8" />
          </div>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
