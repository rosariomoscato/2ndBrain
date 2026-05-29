import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/auth/sign-in-button";
import { auth } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/");
  }

  const { reset } = await searchParams;

  return (
    <div className="w-full max-w-md">
      <div className="brutal-card p-8">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wider uppercase">
            SECOND<span className="text-neon-cyan">BRAIN</span>
          </h1>
          <p className="text-muted-foreground font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
            Accedi al tuo account
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="bg-border h-[2px] w-8" />
            <span className="border-neon h-2 w-2 rotate-45 border-2" />
            <span className="bg-border h-[2px] w-8" />
          </div>
        </div>

        {reset === "success" && (
          <div className="border-neon bg-neon/5 text-neon mb-4 border-2 p-3 font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
            Password reimpostata con successo.
          </div>
        )}

        <SignInButton />
      </div>
    </div>
  );
}
