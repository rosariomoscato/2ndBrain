"use client";

import {
  Activity,
  Clock,
  FileText,
  Link,
  Network,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import { MainViewport } from "@/components/layout/main-viewport";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberCard, CardContent, CardHeader, CardTitle } from "@/components/ui/cyber-card";
import { NeonBadge } from "@/components/ui/neon-badge";
import { getNoteCount, getNotes } from "@/lib/actions/notes";
import { getNodeCount, getEdgeCount } from "@/lib/actions/graph";
import type { RecentActivity } from "@/lib/types";

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

export default function DashboardPage() {
  const quickActions = [
    { icon: Plus, label: "New Note", href: "/notes/new", variant: "primary" as const },
    { icon: Search, label: "Search", href: "/notes", variant: "secondary" as const },
    { icon: Zap, label: "AI Query", href: "/ai", variant: "neon" as const },
  ];

  const [stats, setStats] = useState<StatItem[]>([
    { label: "Total Notes", value: "...", change: "Loading...", icon: FileText, color: "neon-cyan" },
    { label: "Knowledge Nodes", value: "...", change: "Loading...", icon: Network, color: "neon-purple" },
    { label: "Connections", value: "...", change: "Loading...", icon: Activity, color: "neon-blue" },
  ]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemStatus, setSystemStatus] = useState<"loading" | "online" | "offline">("loading");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    async function loadData() {
      try {
        const [noteCount, nodeCount, edgeCount, recentNotes] = await Promise.all([
          getNoteCount(),
          getNodeCount(),
          getEdgeCount(),
          getNotes({ limit: 4 }),
        ]);

        setStats([
          { label: "Total Notes", value: String(noteCount), change: `${noteCount} total`, icon: FileText, color: "neon-cyan" },
          { label: "Knowledge Nodes", value: String(nodeCount), change: `${nodeCount} total`, icon: Network, color: "neon-purple" },
          { label: "Connections", value: String(edgeCount), change: `${edgeCount} total`, icon: Activity, color: "neon-blue" },
        ]);

        setRecentActivity(recentNotes.map((note, i) => ({
          id: note.id,
          action: i === 0 ? "Created new note" : "Updated note",
          target: note.title,
          time: note.updatedAt,
          type: i === 0 ? ("create" as const) : ("update" as const),
        })));

        setSystemStatus("online");
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setSystemStatus("offline");
      }
    }
    loadData();
  }, []);

  return (
    <MainViewport>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="glass-panel border-b border-glass-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary glow-text">
                COMMAND CENTER
              </h1>
              <p className="text-text-secondary mt-1">
              Your Second Brain at a glance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CyberButton variant="secondary" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </CyberButton>
            <CyberButton variant="primary" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </CyberButton>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Left Column: Graph (3 columns) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Knowledge Graph */}
            <div className="flex-1 min-h-[500px]">
              <div className="glass-panel rounded-2xl p-1 h-full overflow-hidden relative">
                <div className="absolute top-4 left-4 z-10">
                  <NeonBadge variant="purple">KNOWLEDGE GRAPH</NeonBadge>
                </div>
                <GraphCanvas />
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <CyberCard key={stat.label} className="hover-lift">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-glass-surface border border-glass-border flex items-center justify-center">
                        <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                      </div>
                      <TrendingUp className="h-4 w-4 text-neon-green" />
                    </div>
                    <div className="text-2xl font-bold font-display text-text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-text-secondary mt-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-neon-green mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </div>
                  </CardContent>
                </CyberCard>
              ))}
            </div>
          </div>

          {/* Right Column: Widgets (1 column) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Quick Actions */}
            <CyberCard>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => (
                  <CyberButton
                    key={action.label}
                    variant={action.variant}
                    className="w-full justify-start gap-3"
                    asChild
                  >
                    <a href={action.href}>
                      <action.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{action.label}</span>
                    </a>
                  </CyberButton>
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
                    <div
                      key={activity.id}
                      className="glass-panel rounded-lg p-3 hover-lift cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-glass-surface border border-glass-border flex items-center justify-center flex-shrink-0">
                          {activity.type === "create" && <Plus className="h-4 w-4 text-neon-green" />}
                          {activity.type === "connect" && <Link className="h-4 w-4 text-neon-cyan" />}
                          {activity.type === "query" && <Zap className="h-4 w-4 text-neon-purple" />}
                          {activity.type === "update" && <RefreshCw className="h-4 w-4 text-neon-blue" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-text-primary">
                            {activity.action}
                          </div>
                          <div className="text-xs text-neon-cyan mt-0.5 line-clamp-1">
                            {activity.target}
                          </div>
                          <div className="text-xs text-text-dim mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
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
                  <span className="text-sm text-text-secondary">Database</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${systemStatus === "online" ? "bg-neon-green animate-pulse" : systemStatus === "loading" ? "bg-neon-cyan animate-pulse" : "bg-neon-red"}`} />
                    <span className={`text-sm ${systemStatus === "online" ? "text-neon-green" : systemStatus === "loading" ? "text-neon-cyan" : "text-neon-red"}`}>
                      {systemStatus === "online" ? "Connected" : systemStatus === "loading" ? "Connecting..." : "Offline"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">AI Service</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-sm text-neon-green">Ready</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Knowledge Graph</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                    <span className="text-sm text-neon-cyan">Synced</span>
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