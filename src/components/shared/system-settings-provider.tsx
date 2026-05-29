"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSettings } from "@/lib/actions/settings";

interface SystemSettings {
  glassmorphism: boolean;
  animations: boolean;
  notifications: boolean;
  soundEffects: boolean;
}

const defaults: SystemSettings = {
  glassmorphism: true,
  animations: true,
  notifications: false,
  soundEffects: false,
};

const SystemSettingsContext = createContext<SystemSettings>(defaults);

export function useSystemSettings() {
  return useContext(SystemSettingsContext);
}

export function SystemSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>(defaults);

  useEffect(() => {
    getSettings()
      .then((s) => {
        const sys = s.system;
        const resolved: SystemSettings = {
          glassmorphism: sys.glassmorphism ?? true,
          animations: sys.animations ?? true,
          notifications: sys.notifications ?? false,
          soundEffects: sys.soundEffects ?? false,
        };
        setSettings(resolved);
        applySystemClasses(resolved);
      })
      .catch(() => {});
  }, []);

  return (
    <SystemSettingsContext.Provider value={settings}>{children}</SystemSettingsContext.Provider>
  );
}

function applySystemClasses(s: SystemSettings) {
  const root = document.documentElement;
  root.classList.toggle("system-no-glass", !s.glassmorphism);
  root.classList.toggle("system-no-animations", !s.animations);
}

export function applySystemSettingsUpdate(s: Partial<SystemSettings>) {
  const current: SystemSettings = {
    glassmorphism: s.glassmorphism ?? true,
    animations: s.animations ?? true,
    notifications: s.notifications ?? false,
    soundEffects: s.soundEffects ?? false,
  };
  applySystemClasses(current);
}
