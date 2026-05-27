import { GitHubStars } from "./ui/github-stars";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-brutal-border bg-card/50 py-6" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <GitHubStars repo="rosariomoscato/agentic-coding-boilerplate" />
          <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-display)] uppercase tracking-widest text-muted-foreground">
            <span className="inline-block w-8 h-[1px] bg-muted-foreground/30" />
            <p>Creato con Agentic Coding Boilerplate</p>
            <span className="inline-block w-8 h-[1px] bg-muted-foreground/30" />
          </div>
          <p className="text-xs text-muted-foreground/60 font-[family-name:var(--font-display)] tracking-wider">
            &copy; {new Date().getFullYear()} &mdash; Tutti i diritti riservati
          </p>
        </div>
      </div>
    </footer>
  );
}
