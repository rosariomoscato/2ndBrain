"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Clock,
  FileText,
  Network,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import { MainViewport } from "@/components/layout/main-viewport";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberCard, CardContent, CardHeader, CardTitle } from "@/components/ui/cyber-card";
import { NeonBadge } from "@/components/ui/neon-badge";
import { getNodeCount, getEdgeCount } from "@/lib/actions/graph";
import { getNoteCount, getNotes } from "@/lib/actions/notes";
import { useSession } from "@/lib/auth-client";
import type { RecentActivity } from "@/lib/types";

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const quickActions = [
    { icon: Plus, label: "New Note", href: "/notes/new", variant: "primary" as const },
    { icon: Search, label: "Search", href: "/notes", variant: "secondary" as const },
    { icon: Zap, label: "AI Query", href: "/ai", variant: "neon" as const },
  ];

  useEffect(() => {
    if (!isPending) {
      setIsAuthChecked(true);
      if (!session?.user) {
        router.push("/login");
      }
    }
  }, [isPending, session, router]);

  const [stats, setStats] = useState<StatItem[]>([
    {
      label: "Total Notes",
      value: "...",
      change: "Loading...",
      icon: FileText,
      color: "neon-cyan",
    },
    {
      label: "Knowledge Nodes",
      value: "...",
      change: "Loading...",
      icon: Network,
      color: "neon-purple",
    },
    {
      label: "Connections",
      value: "...",
      change: "Loading...",
      icon: Activity,
      color: "neon-blue",
    },
  ]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemStatus, setSystemStatus] = useState<"loading" | "online" | "offline">("loading");

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      if (!session?.user) return;

      try {
        const [noteCount, nodeCount, edgeCount, recentNotes] = await Promise.all([
          getNoteCount(),
          getNodeCount(),
          getEdgeCount(),
          getNotes({ limit: 4 }),
        ]);

        setStats([
          {
            label: "Total Notes",
            value: String(noteCount),
            change: `${noteCount} total`,
            icon: FileText,
            color: "neon-cyan",
          },
          {
            label: "Knowledge Nodes",
            value: String(nodeCount),
            change: `${nodeCount} total`,
            icon: Network,
            color: "neon-purple",
          },
          {
            label: "Connections",
            value: String(edgeCount),
            change: `${edgeCount} total`,
            icon: Activity,
            color: "neon-blue",
          },
        ]);

        setRecentActivity(
          recentNotes.map((note, i) => ({
            id: note.id,
            action: i === 0 ? "Created new note" : "Updated note",
            target: note.title,
            time: note.updatedAt,
            type: i === 0 ? ("create" as const) : ("update" as const),
          }))
        );

        setSystemStatus("online");
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setSystemStatus("offline");
      }
    }
    loadData();
  }, [session?.user]);

  if (isPending || !session) {
    return (
      <MainViewport>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <RefreshCw className="text-neon-cyan mx-auto mb-4 h-8 w-8 animate-spin" />
            <p className="text-text-secondary">Loading...</p>
          </div>
        </div>
      </MainViewport>
    );
  }

  return (
    <MainViewport>
      <div className="flex h-full flex-col">
        {/* Page Header */}
        <div className="glass-panel border-glass-border border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-text-primary glow-text text-3xl font-bold tracking-tight">
                COMMAND CENTER
              </h1>
              <p className="text-text-secondary mt-1">Your Second Brain at a glance</p>
            </div>
            <div className="flex items-center gap-3">
              <CyberButton variant="secondary" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </CyberButton>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Left Column: Graph (3 columns) */}
            <div className="flex flex-col gap-6 lg:col-span-3">
              {/* Knowledge Graph */}
              <div className="min-h-[500px] flex-1">
                <div className="glass-panel relative h-full overflow-hidden rounded-2xl p-1">
                  <div className="absolute top-4 left-4 z-10">
                    <NeonBadge variant="purple">KNOWLEDGE GRAPH</NeonBadge>
                  </div>
                  <GraphCanvas />
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                  <CyberCard key={stat.label} className="hover-lift">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="bg-glass-surface border-glass-border flex h-10 w-10 items-center justify-center rounded-lg border">
                          <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                        </div>
                        <TrendingUp className="text-neon-green h-4 w-4" />
                      </div>
                      <div className="font-display text-text-primary text-2xl font-bold">
                        {stat.value}
                      </div>
                      <div className="text-text-secondary mt-1 text-sm">{stat.label}</div>
                      <div className="text-neon-green mt-2 flex items-center gap-1 text-xs">
                        <TrendingUp className="h-3 w-3" />
                        {stat.change}
                      </div>
                    </CardContent>
                  </CyberCard>
                ))}
              </div>
            </div>

            {/* Right Column: Widgets (1 column) */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              {/* Quick Actions */}
              <CyberCard>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action) => (
                    <Link key={action.label} href={action.href} className="block">
                      <CyberButton variant={action.variant} className="w-full justify-start gap-3">
                        <action.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{action.label}</span>
                      </CyberButton>
                    </Link>
                  ))}
                </CardContent>
              </CyberCard>

              {/* Recent Activity */}
              <CyberCard className="flex-1">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <Link key={activity.id} href={`/notes/${activity.id}`} className="block">
                        <div className="glass-panel hover-lift cursor-pointer rounded-lg p-3">
                          <div className="flex items-start gap-3">
                            <div className="bg-glass-surface border-glass-border flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border">
                              {activity.type === "create" && (
                                <Plus className="text-neon-green h-4 w-4" />
                              )}
                              {activity.type === "connect" && (
                                <RefreshCw className="text-neon-cyan h-4 w-4" />
                              )}
                              {activity.type === "query" && (
                                <Zap className="text-neon-purple h-4 w-4" />
                              )}
                              {activity.type === "update" && (
                                <RefreshCw className="text-neon-blue h-4 w-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-text-primary text-sm font-medium">
                                {activity.action}
                              </div>
                              <div className="text-neon-cyan mt-0.5 line-clamp-1 text-xs">
                                {activity.target}
                              </div>
                              <div className="text-text-dim mt-1 flex items-center gap-1 text-xs">
                                <Clock className="h-3 w-3" />
                                {activity.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </CyberCard>

              {/* System Status */}
              <CyberCard>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm">Database</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${systemStatus === "online" ? "bg-neon-green animate-pulse" : systemStatus === "loading" ? "bg-neon-cyan animate-pulse" : "bg-neon-red"}`}
                      />
                      <span
                        className={`text-sm ${systemStatus === "online" ? "text-neon-green" : systemStatus === "loading" ? "text-neon-cyan" : "text-neon-red"}`}
                      >
                        {systemStatus === "online"
                          ? "Connected"
                          : systemStatus === "loading"
                            ? "Connecting..."
                            : "Offline"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm">AI Service</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-neon-green h-2 w-2 animate-pulse rounded-full" />
                      <span className="text-neon-green text-sm">Ready</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm">Knowledge Graph</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-neon-cyan h-2 w-2 animate-pulse rounded-full" />
                      <span className="text-neon-cyan text-sm">Synced</span>
                    </div>
                  </div>
                </CardContent>
              </CyberCard>
            </div>
          </div>
        </div>
      </div>
    </MainViewport>
  );
}
