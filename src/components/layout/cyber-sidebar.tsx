import {
  Home,
  FileText,
  Network,
  MessageSquare,
  Settings,
  TrendingUp,
  Clock,
  Plus,
} from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

export function CyberSidebar() {
  const navItems: NavItem[] = [
    { icon: Home, label: "Dashboard", href: "/", active: true },
    { icon: FileText, label: "Notes", href: "/notes" },
    { icon: Network, label: "Knowledge Graph", href: "/graph" },
    { icon: MessageSquare, label: "AI Query", href: "/ai" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const quickStats = [
    { label: "Notes", value: "123", trend: "+5" },
    { label: "Nodes", value: "456", trend: "+12" },
    { label: "Connections", value: "789", trend: "+8" },
  ];

  const recentNotes = [
    { id: 1, title: "Project Alpha Research", time: "2h ago" },
    { id: 2, title: "Meeting Notes - Q4 Planning", time: "5h ago" },
    { id: 3, title: "AI Architecture Doc", time: "1d ago" },
  ];

  return (
    <aside className="glass-panel border-r border-neon-purple/30 w-72 flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                "hover:bg-glass-highlight hover:-translate-x-1",
                item.active
                  ? "bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan glow-text"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="pt-6 pb-2">
          <p className="micro-label mb-3">QUICK STATS</p>
          <div className="grid grid-cols-3 gap-2">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel rounded-xl p-3 text-center hover-lift"
              >
                <div className="text-lg font-bold font-display text-neon-cyan">
                  {stat.value}
                </div>
                <div className="text-xs text-text-dim mt-1">{stat.label}</div>
                <div className="text-xs text-neon-green mt-0.5 flex items-center justify-center gap-0.5">
                  <TrendingUp className="h-2.5 w-2.5" />
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notes */}
        <div className="pt-4">
          <p className="micro-label mb-3">RECENT NOTES</p>
          <div className="space-y-2">
            {recentNotes.map((note) => (
              <a
                key={note.id}
                href={`/notes/${note.id}`}
                className="flex flex-col glass-panel rounded-lg p-3 hover-lift hover-glow-border cursor-pointer"
              >
                <div className="text-sm font-medium text-text-primary line-clamp-2">
                  {note.title}
                </div>
                <div className="text-xs text-text-dim mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {note.time}
                </div>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-glass-border">
        <CyberButton variant="primary" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </CyberButton>
      </div>
    </aside>
  );
}