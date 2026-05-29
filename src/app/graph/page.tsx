"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Network, FileText, Plus, AlertCircle, TrendingUp, RefreshCw, Filter } from "lucide-react";
import { toast } from "sonner";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import { MainViewport } from "@/components/layout/main-viewport";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberCard, CardContent, CardHeader, CardTitle } from "@/components/ui/cyber-card";
import { NeonBadge } from "@/components/ui/neon-badge";

export default function GraphPage() {
  const router = useRouter();
  const [noteCount, setNoteCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/notes/count');
        if (response.ok) {
          const data = await response.json();
          setNoteCount(data.count);
        } else {
          setNoteCount(0);
        }
      } catch (error) {
        console.error("Failed to load note count:", error);
        setNoteCount(0);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRegenerateEmbeddings = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch('/api/notes/regenerate-embeddings', { method: 'POST' });
      const data = await response.json();
      if (data.generated > 0) {
        toast.success(`Generated embeddings for ${data.generated} notes`);
      } else {
        toast.info("All notes already have embeddings");
      }
    } catch (error) {
      toast.error("Failed to regenerate embeddings");
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return (
      <MainViewport>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading knowledge graph...</p>
          </div>
        </div>
      </MainViewport>
    );
  }

  if (noteCount === 0) {
    return (
      <MainViewport>
        <div className="flex items-center justify-center h-full p-6">
          <div className="max-w-2xl w-full">
            {/* Empty State Card */}
            <CyberCard>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                      <Network className="h-6 w-6 text-neon-cyan" />
                    </div>
                    <div>
                      <CardTitle>Knowledge Graph Empty</CardTitle>
                      <NeonBadge variant="purple" className="mt-1">No Data</NeonBadge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Alert */}
                <div className="glass-panel rounded-lg p-4 border-l-4 border-neon-yellow">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-neon-yellow flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-text-primary">
                        No notes to visualize
                      </p>
                      <p className="text-sm text-text-secondary mt-1">
                        The knowledge graph will be available once you start creating notes. Each note becomes a node, and connections form automatically based on shared content.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                  <h3 className="font-medium text-text-primary flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Get Started in 3 Steps
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-neon-cyan">
                        1
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">Create Your First Note</p>
                        <p className="text-xs text-text-secondary mt-0.5">Add your first piece of knowledge to start building your second brain.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-neon-purple">
                        2
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">Add More Notes</p>
                        <p className="text-xs text-text-secondary mt-0.5">The more notes you create, the richer your knowledge graph becomes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-neon-green">
                        3
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">Explore Connections</p>
                        <p className="text-xs text-text-secondary mt-0.5">Watch as the graph automatically connects related notes and reveals insights.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="flex gap-3 pt-4">
                  <CyberButton
                    variant="primary"
                    className="flex-1 gap-2"
                    onClick={() => router.push("/notes/new")}
                  >
                    <Plus className="h-4 w-4" />
                    Create First Note
                  </CyberButton>
                  <CyberButton
                    variant="secondary"
                    className="flex-1 gap-2"
                    onClick={() => router.push("/notes")}
                  >
                    <FileText className="h-4 w-4" />
                    View All Notes
                  </CyberButton>
                </div>

                {/* Info Box */}
                <div className="glass-panel rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Automatic Processing
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        Notes are automatically analyzed for embeddings, connections, and importance. The knowledge graph updates in real-time as you add content.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CyberCard>
          </div>
        </div>
      </MainViewport>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="glass-panel border-b border-glass-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary glow-text">
                KNOWLEDGE GRAPH
              </h1>
              <CyberButton
                variant="ghost"
                size="icon"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="relative"
              >
                <Filter className="w-5 h-5" />
              </CyberButton>
            </div>
            <p className="text-text-secondary mt-1">
              Visualizing {noteCount} notes and their connections
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CyberButton
              variant="ghost"
              size="sm"
              onClick={handleRegenerateEmbeddings}
              disabled={isRegenerating}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
              {isRegenerating ? "Indexing..." : "Re-index Notes"}
            </CyberButton>
            <CyberButton
              variant="secondary"
              size="sm"
              onClick={() => router.push("/notes/new")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </CyberButton>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <GraphCanvas filtersOpen={filtersOpen} onFiltersToggle={() => setFiltersOpen(!filtersOpen)} />
      </div>
    </div>
  );
}