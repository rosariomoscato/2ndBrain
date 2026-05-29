"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { useSystemSettings } from "@/components/shared/system-settings-provider";
import { CyberButton } from "@/components/ui/cyber-button";
import { getNodeCount, getEdgeCount } from "@/lib/actions/graph";
import { getNoteCount, getNotes } from "@/lib/actions/notes";
import { playNavigateSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

interface QuickStat {
  label: string;
  value: string;
  trend: string;
}

interface RecentNote {
  id: string;
  title: string;
  time: string;
}

export function CyberSidebar() {
  const pathname = usePathname();
  const { soundEffects } = useSystemSettings();

  const navItems: NavItem[] = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: FileText, label: "Notes", href: "/notes" },
    { icon: Network, label: "Knowledge Graph", href: "/graph" },
    { icon: MessageSquare, label: "AI Query", href: "/ai" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const [quickStats, setQuickStats] = useState<QuickStat[]>([
    { label: "Notes", value: "...", trend: "-" },
    { label: "Nodes", value: "...", trend: "-" },
    { label: "Connections", value: "...", trend: "-" },
  ]);

  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [noteCount, nodeCount, edgeCount, recent] = await Promise.all([
          getNoteCount(),
          getNodeCount(),
          getEdgeCount(),
          getNotes({ limit: 3 }),
        ]);

        setQuickStats([
          { label: "Notes", value: String(noteCount), trend: String(noteCount) },
          { label: "Nodes", value: String(nodeCount), trend: String(nodeCount) },
          { label: "Connections", value: String(edgeCount), trend: String(edgeCount) },
        ]);

        setRecentNotes(
          recent.map((note) => ({
            id: note.id,
            title: note.title,
            time: note.updatedAt,
          }))
        );
      } catch (error) {
        console.error("Failed to load sidebar data:", error);
      }
    }
    load();
  }, []);

  return (
    <aside className="glass-panel border-neon-purple/30 sticky top-16 flex h-[calc(100vh-4rem)] w-72 flex-col border-r">
      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (soundEffects) playNavigateSound();
              }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                "hover:bg-glass-highlight hover:-translate-x-1",
                pathname === item.href
                  ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan glow-text border"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="pt-6 pb-2">
          <p className="micro-label mb-3">QUICK STATS</p>
          <div className="grid grid-cols-3 gap-2">
            {quickStats.map((stat) => (
              <div key={stat.label} className="glass-panel hover-lift rounded-xl p-3 text-center">
                <div className="font-display text-neon-cyan text-lg font-bold">{stat.value}</div>
                <div className="text-text-dim mt-1 text-xs">{stat.label}</div>
                <div className="text-neon-green mt-0.5 flex items-center justify-center gap-0.5 text-xs">
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
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="glass-panel hover-lift hover-glow-border flex cursor-pointer flex-col rounded-lg p-3"
              >
                <div className="text-text-primary line-clamp-2 text-sm font-medium">
                  {note.title}
                </div>
                <div className="text-text-dim mt-1 flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {note.time}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="border-glass-border border-t p-4">
        <Link href="/notes/new" className="block">
          <CyberButton variant="primary" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New Note
          </CyberButton>
        </Link>
      </div>

      {/* Footer */}
      <div className="border-glass-border shrink-0 border-t p-4 text-center">
        <a
          href="mailto:ros.moscato@gmail.com"
          className="text-text-dim hover:text-neon-cyan text-xs transition-colors"
        >
          Rosario Moscato
        </a>
        <p className="text-text-dim mt-1 text-[10px]">
          &copy; {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </aside>
  );
}
