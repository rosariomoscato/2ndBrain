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
        <Palette className="text-neon-cyan h-5 w-5" />
        <h3 className="font-display text-text-primary text-lg font-bold">Theme Customization</h3>
      </div>

      {/* Neon Intensity */}
      <CyberCard>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-neon-cyan h-4 w-4" />
              <span className="text-text-primary font-medium">Neon Intensity</span>
            </div>
            <NeonBadge variant="cyan">{neonIntensity}%</NeonBadge>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={neonIntensity}
            onChange={(e) => setNeonIntensity(Number(e.target.value))}
            className="bg-glass-surface accent-neon-cyan h-2 w-full cursor-pointer appearance-none rounded-lg"
          />
        </CardContent>
      </CyberCard>

      {/* Grid Visibility */}
      <CyberCard>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="text-neon-purple h-4 w-4" />
              <span className="text-text-primary font-medium">Grid Visibility</span>
            </div>
            <NeonBadge variant="purple">{gridVisibility}%</NeonBadge>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={gridVisibility}
            onChange={(e) => setGridVisibility(Number(e.target.value))}
            className="bg-glass-surface accent-neon-purple h-2 w-full cursor-pointer appearance-none rounded-lg"
          />
        </CardContent>
      </CyberCard>

      {/* Particle Density */}
      <CyberCard>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="text-neon-blue h-4 w-4" />
              <span className="text-text-primary font-medium">Particle Density</span>
            </div>
            <NeonBadge variant="blue">{particleDensity}</NeonBadge>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={particleDensity}
            onChange={(e) => setParticleDensity(Number(e.target.value))}
            className="bg-glass-surface accent-neon-blue h-2 w-full cursor-pointer appearance-none rounded-lg"
          />
        </CardContent>
      </CyberCard>

      {/* Scan Line Speed */}
      <CyberCard>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-neon-pink h-4 w-4" />
              <span className="text-text-primary font-medium">Scan Line Speed</span>
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
            className="bg-glass-surface accent-neon-pink h-2 w-full cursor-pointer appearance-none rounded-lg"
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
