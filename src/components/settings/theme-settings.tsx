"use client";

import { useState } from "react";
import { Palette, Sun, Moon, Zap } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberCard, CardContent } from "@/components/ui/cyber-card";
import { NeonBadge } from "@/components/ui/neon-badge";

export function ThemeSettings() {
  const [neonIntensity, setNeonIntensity] = useState(75);
  const [gridVisibility, setGridVisibility] = useState(50);
  const [particleDensity, setParticleDensity] = useState(30);
  const [scanLineSpeed, setScanLineSpeed] = useState(3000);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="h-5 w-5 text-neon-cyan" />
        <h3 className="text-lg font-display font-bold text-text-primary">
          Theme Customization
        </h3>
      </div>

      {/* Neon Intensity */}
      <CyberCard>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-neon-cyan" />
              <span className="font-medium text-text-primary">Neon Intensity</span>
            </div>
            <NeonBadge variant="cyan">{neonIntensity}%</NeonBadge>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={neonIntensity}
            onChange={(e) => setNeonIntensity(Number(e.target.value))}
            className="w-full h-2 bg-glass-surface rounded-lg appearance-none cursor-pointer accent-neon-cyan"
          />
        </CardContent>
      </CyberCard>

      {/* Grid Visibility */}
      <CyberCard>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-neon-purple" />
              <span className="font-medium text-text-primary">Grid Visibility</span>
            </div>
            <NeonBadge variant="purple">{gridVisibility}%</NeonBadge>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={gridVisibility}
            onChange={(e) => setGridVisibility(Number(e.target.value))}
            className="w-full h-2 bg-glass-surface rounded-lg appearance-none cursor-pointer accent-neon-purple"
          />
        </CardContent>
      </CyberCard>

      {/* Particle Density */}
      <CyberCard>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-neon-blue" />
              <span className="font-medium text-text-primary">Particle Density</span>
            </div>
            <NeonBadge variant="blue">{particleDensity}</NeonBadge>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={particleDensity}
            onChange={(e) => setParticleDensity(Number(e.target.value))}
            className="w-full h-2 bg-glass-surface rounded-lg appearance-none cursor-pointer accent-neon-blue"
          />
        </CardContent>
      </CyberCard>

      {/* Scan Line Speed */}
      <CyberCard>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-neon-pink" />
              <span className="font-medium text-text-primary">Scan Line Speed</span>
            </div>
            <NeonBadge variant="pink">{(scanLineSpeed / 1000).toFixed(1)}s</NeonBadge>
          </div>
          <input
            type="range"
            min="1000"
            max="5000"
            step="100"
            value={scanLineSpeed}
            onChange={(e) => setScanLineSpeed(Number(e.target.value))}
            className="w-full h-2 bg-glass-surface rounded-lg appearance-none cursor-pointer accent-neon-pink"
          />
        </CardContent>
      </CyberCard>

      {/* Preset Buttons */}
      <div className="flex gap-2">
        <CyberButton variant="secondary" className="flex-1">
          Minimal
        </CyberButton>
        <CyberButton variant="primary" className="flex-1">
          Balanced
        </CyberButton>
        <CyberButton variant="neon" className="flex-1">
          Cyberpunk
        </CyberButton>
      </div>
    </div>
  );
}