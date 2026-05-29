import Link from "next/link";
import { Terminal } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";

export function SiteHeader() {
  return (
    <>
      <a
        href="#main-content"
        className="focus:bg-neon focus:text-primary-foreground focus:border-brutal-border sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:border-2 focus:px-4 focus:py-2 focus:font-[family-name:var(--font-display)] focus:font-bold focus:tracking-wider focus:uppercase focus:shadow-[3px_3px_0px_0px_var(--brutal-shadow)]"
      >
        Vai al contenuto principale
      </a>
      <header
        className="border-brutal-border bg-card/80 sticky top-0 z-50 border-b-2 backdrop-blur-sm"
        role="banner"
      >
        <nav
          className="container mx-auto flex h-14 items-center justify-between px-4 py-0"
          aria-label="Navigazione principale"
        >
          <h1 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-widest uppercase">
            <Link
              href="/"
              className="hover:text-neon group flex items-center gap-2.5 transition-colors"
              aria-label="Starter Kit - Vai alla homepage"
            >
              <div
                className="border-brutal-border bg-neon text-primary-foreground flex h-8 w-8 items-center justify-center border-2 transition-all group-hover:shadow-[0_0_10px_0px_#00ffc840]"
                aria-hidden="true"
              >
                <Terminal className="h-4 w-4" />
              </div>
              <span className="text-foreground">
                Starter<span className="text-neon">Kit</span>
              </span>
            </Link>
          </h1>
          <div className="flex items-center gap-2" role="group" aria-label="Azioni utente">
            <UserProfile />
            <ModeToggle />
          </div>
        </nav>
      </header>
    </>
  );
}
