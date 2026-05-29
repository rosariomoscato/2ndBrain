import { GitHubStars } from "./ui/github-stars";

export function SiteFooter() {
  return (
    <footer className="border-brutal-border bg-card/50 border-t-2 py-6" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <GitHubStars repo="rosariomoscato/agentic-coding-boilerplate" />
          <div className="text-muted-foreground flex items-center gap-2 font-[family-name:var(--font-display)] text-xs tracking-widest uppercase">
            <span className="bg-muted-foreground/30 inline-block h-[1px] w-8" />
            <p>Creato con Agentic Coding Boilerplate</p>
            <span className="bg-muted-foreground/30 inline-block h-[1px] w-8" />
          </div>
          <p className="text-muted-foreground/60 font-[family-name:var(--font-display)] text-xs tracking-wider">
            &copy; {new Date().getFullYear()} &mdash; Tutti i diritti riservati
          </p>
        </div>
      </div>
    </footer>
  );
}
