"use client";

import { useEffect, useRef } from "react";
import { getSettings } from "@/lib/actions/settings";

const DEFAULTS = {
  neonIntensity: 70,
  gridVisibility: 50,
  particleDensity: 60,
  scanLineSpeed: 50,
};

export function CyberThemeInjector() {
  const appliedRef = useRef(false);

  useEffect(() => {
    if (appliedRef.current) return;

    async function apply() {
      try {
        const settings = await getSettings();
        appliedRef.current = true;
        applyThemeVars(settings.theme);
        listenForSettingsChanges();
      } catch {
        applyThemeVars(DEFAULTS);
      }
    }

    function applyThemeVars(theme: Record<string, unknown>) {
      const root = document.documentElement;
      const neon = (theme.neonIntensity as number) ?? DEFAULTS.neonIntensity;
      const grid = (theme.gridVisibility as number) ?? DEFAULTS.gridVisibility;
      const particles = (theme.particleDensity as number) ?? DEFAULTS.particleDensity;
      const scanSpeed = (theme.scanLineSpeed as number) ?? DEFAULTS.scanLineSpeed;

      root.style.setProperty("--theme-neon-intensity", `${neon / 100}`);
      root.style.setProperty("--theme-grid-opacity", `${grid / 100}`);
      root.style.setProperty("--theme-particle-density", `${particles / 100}`);
      root.style.setProperty("--theme-scan-speed", `${6 - (scanSpeed / 100) * 5}s`);

      const glowBlur1 = Math.round((neon / 100) * 20);
      const glowBlur2 = Math.round((neon / 100) * 40);
      const glowBlur3 = Math.round((neon / 100) * 60);
      root.style.setProperty("--theme-glow-1", `0 0 ${glowBlur1}px`);
      root.style.setProperty("--theme-glow-2", `0 0 ${glowBlur2}px`);
      root.style.setProperty("--theme-glow-3", `0 0 ${glowBlur3}px`);

      const borderGlow = Math.round((neon / 100) * 15);
      root.style.setProperty("--theme-border-glow", `0 0 ${borderGlow}px`);
      root.style.setProperty("--theme-inset-glow", `inset 0 0 ${Math.round(borderGlow * 0.67)}px`);
    }

    function listenForSettingsChanges() {
      const observer = new MutationObserver(() => {
        getSettings()
          .then((s) => applyThemeVars(s.theme as Record<string, unknown>))
          .catch(() => {});
      });

      const CustomEvent_overlay = "__cyber_theme_update";
      window.addEventListener(CustomEvent_overlay, () => {
        getSettings()
          .then((s) => applyThemeVars(s.theme as Record<string, unknown>))
          .catch(() => {});
      });

      window.__cyberThemeUpdate = () => {
        getSettings()
          .then((s) => applyThemeVars(s.theme as Record<string, unknown>))
          .catch(() => {});
      };

      return () => observer.disconnect();
    }

    apply();
  }, []);

  return null;
}

declare global {
  interface Window {
    __cyberThemeUpdate?: () => void;
  }
}
