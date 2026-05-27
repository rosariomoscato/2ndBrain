import Link from "next/link";
import { Terminal } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";

export function SiteHeader() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-neon focus:text-primary-foreground focus:border-2 focus:border-brutal-border focus:font-bold focus:uppercase focus:tracking-wider focus:font-[family-name:var(--font-display)] focus:shadow-[3px_3px_0px_0px_var(--brutal-shadow)]"
      >
        Vai al contenuto principale
      </a>
      <header className="border-b-2 border-brutal-border bg-card/80 backdrop-blur-sm sticky top-0 z-50" role="banner">
        <nav
          className="container mx-auto px-4 py-0 flex justify-between items-center h-14"
          aria-label="Navigazione principale"
        >
          <h1 className="text-lg font-bold uppercase tracking-widest font-[family-name:var(--font-display)]">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:text-neon transition-colors group"
              aria-label="Starter Kit - Vai alla homepage"
            >
              <div
                className="flex items-center justify-center w-8 h-8 border-2 border-brutal-border bg-neon text-primary-foreground group-hover:shadow-[0_0_10px_0px_#00ffc840] transition-all"
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
