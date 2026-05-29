"use client";

import * as React from "react";
import { toast } from "sonner";
import { TagEditorModal } from "@/components/tags/tag-editor-modal";
import { TagManager } from "@/components/tags/tag-manager";
import { CyberButton as Button } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { LoadingOrb } from "@/components/ui/loading-orb";
import { getSettings, updateSettings } from "@/lib/actions/settings";
import type { UserThemeSettings, UserSystemSettings, UserAISettings } from "@/lib/types";
import { applySystemSettingsUpdate } from "@/components/shared/system-settings-provider";
import { useSystemSettings } from "@/components/shared/system-settings-provider";
import { playToggleSound } from "@/lib/sounds";
import { requestNotificationPermission, showNotification } from "@/lib/notifications";

// Theme presets
const THEME_PRESETS: Record<string, UserThemeSettings> = {
  minimal: {
    neonIntensity: 20,
    gridVisibility: 10,
    particleDensity: 15,
    scanLineSpeed: 20,
    preset: "minimal",
  },
  balanced: {
    neonIntensity: 50,
    gridVisibility: 40,
    particleDensity: 40,
    scanLineSpeed: 50,
    preset: "balanced",
  },
  cyberpunk: {
    neonIntensity: 100,
    gridVisibility: 70,
    particleDensity: 80,
    scanLineSpeed: 80,
    preset: "cyberpunk",
  },
};

function SettingsPanel() {
  const [settings, setSettings] = React.useState<{
    theme: UserThemeSettings;
    system: UserSystemSettings;
    ai: UserAISettings;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"tags" | "theme" | "system" | "ai">("tags");

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateThemeSetting = async (key: keyof UserThemeSettings, value: number | string) => {
    if (!settings) return;

    const newTheme = {
      ...settings.theme,
      [key]: value,
    };

    const newSettings = {
      ...settings,
      theme: newTheme,
    };

    setSettings(newSettings);

    applyThemeVars(newTheme as Record<string, unknown>);

    await debouncedSave({ theme: newTheme });
  };

  const applyThemeVars = (theme: Record<string, unknown>) => {
    const root = document.documentElement;
    const neon = (theme.neonIntensity as number) ?? 70;
    const grid = (theme.gridVisibility as number) ?? 50;
    const particles = (theme.particleDensity as number) ?? 60;
    const scanSpeed = (theme.scanLineSpeed as number) ?? 50;

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
  };

  const systemSettings = useSystemSettings();

  const updateSystemSetting = async (key: keyof UserSystemSettings, value: boolean) => {
    if (!settings) return;

    const newSystem = { ...settings.system, [key]: value };
    const newSettings = { ...settings, system: newSystem };

    setSettings(newSettings);

    applySystemSettingsUpdate(newSystem);

    if (systemSettings.soundEffects) playToggleSound();

    if (key === "notifications" && value) {
      const granted = await requestNotificationPermission();
      if (granted) {
        showNotification("2ndBrain Notifications Enabled", {
          body: "You will now receive desktop notifications.",
        });
      }
    }

    await debouncedSave({ system: newSystem });
  };

  const updateAISetting = async (key: keyof UserAISettings, value: string | boolean) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      ai: {
        ...settings.ai,
        [key]: value,
      },
    };

    setSettings(newSettings);
    await debouncedSave({ ai: newSettings.ai });
  };

  // Debounced save to avoid saving on every slider movement
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const debouncedSave = React.useCallback(async (updates: any) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await updateSettings(updates);
        toast.success("Settings saved");
      } catch (error) {
        console.error("Failed to save settings:", error);
        toast.error("Failed to save settings");
        // Reload to revert optimistic update
        await loadSettings();
      } finally {
        setSaving(false);
      }
    }, 500); // 500ms debounce
  }, []);

  const applyThemePreset = async (preset: keyof typeof THEME_PRESETS) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      theme: { ...THEME_PRESETS[preset] },
    };

    setSettings(newSettings);
    setSaving(true);
    try {
      await updateSettings({ theme: newSettings.theme });
      toast.success(`Applied ${preset} theme`);
    } catch (error) {
      console.error("Failed to apply theme preset:", error);
      toast.error("Failed to apply theme preset");
      await loadSettings();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <LoadingOrb size="lg" />
          <p className="text-text-secondary text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {["tags", "theme", "system", "ai"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {/* Tags Tab */}
      {activeTab === "tags" && (
        <TagManager TagEditorModalComponent={TagEditorModal} />
      )}

      {/* Theme Tab */}
      {activeTab === "theme" && (
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold glow-text">Theme Settings</h3>

          {/* Presets */}
          <div className="glass-panel rounded-xl p-4">
            <h4 className="text-sm font-semibold font-display text-text-primary mb-4">
              Theme Presets
            </h4>
            <div className="flex gap-2">
              {Object.keys(THEME_PRESETS).map((preset) => (
                <Button
                  key={preset}
                  variant={settings.theme.preset === preset ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => applyThemePreset(preset as keyof typeof THEME_PRESETS)}
                >
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Neon Intensity */}
          <div className="glass-panel rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold font-display text-text-primary">
                Neon Intensity
              </label>
              <span className="text-xs text-neon-cyan">{settings.theme.neonIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.theme.neonIntensity ?? 70}
              onChange={(e) => updateThemeSetting("neonIntensity", parseInt(e.target.value))}
              className="w-full h-2 bg-glass-surface rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
          </div>

          {/* Grid Visibility */}
          <div className="glass-panel rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold font-display text-text-primary">
                Grid Visibility
              </label>
              <span className="text-xs text-neon-cyan">{settings.theme.gridVisibility}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.theme.gridVisibility ?? 50}
              onChange={(e) => updateThemeSetting("gridVisibility", parseInt(e.target.value))}
              className="w-full h-2 bg-glass-surface rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
          </div>

          {/* Particle Density */}
          <div className="glass-panel rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold font-display text-text-primary">
                Particle Density
              </label>
              <span className="text-xs text-neon-cyan">{settings.theme.particleDensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.theme.particleDensity ?? 60}
              onChange={(e) => updateThemeSetting("particleDensity", parseInt(e.target.value))}
              className="w-full h-2 bg-glass-surface rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
          </div>

          {/* Scan Line Speed */}
          <div className="glass-panel rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold font-display text-text-primary">
                Scan Line Speed
              </label>
              <span className="text-xs text-neon-cyan">{settings.theme.scanLineSpeed}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.theme.scanLineSpeed ?? 50}
              onChange={(e) => updateThemeSetting("scanLineSpeed", parseInt(e.target.value))}
              className="w-full h-2 bg-glass-surface rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold glow-text">System Settings</h3>

          {/* Glassmorphism */}
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold font-display text-text-primary block mb-1">
                Glassmorphism
              </label>
              <p className="text-xs text-text-secondary">Enable glass-effect panels and cards</p>
            </div>
            <input
              type="checkbox"
              checked={settings.system.glassmorphism ?? true}
              onChange={(e) => updateSystemSetting("glassmorphism", e.target.checked)}
              className="h-5 w-5 accent-neon-cyan cursor-pointer"
            />
          </div>

          {/* Animations */}
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold font-display text-text-primary block mb-1">
                Animations
              </label>
              <p className="text-xs text-text-secondary">Enable smooth transitions and animations</p>
            </div>
            <input
              type="checkbox"
              checked={settings.system.animations ?? true}
              onChange={(e) => updateSystemSetting("animations", e.target.checked)}
              className="h-5 w-5 accent-neon-cyan cursor-pointer"
            />
          </div>

          {/* Notifications */}
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold font-display text-text-primary block mb-1">
                Notifications
              </label>
              <p className="text-xs text-text-secondary">Show desktop notifications for updates</p>
            </div>
            <input
              type="checkbox"
              checked={settings.system.notifications ?? false}
              onChange={(e) => updateSystemSetting("notifications", e.target.checked)}
              className="h-5 w-5 accent-neon-cyan cursor-pointer"
            />
          </div>

          {/* Sound Effects */}
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold font-display text-text-primary block mb-1">
                Sound Effects
              </label>
              <p className="text-xs text-text-secondary">Play sounds for interactions and events</p>
            </div>
            <input
              type="checkbox"
              checked={settings.system.soundEffects ?? false}
              onChange={(e) => updateSystemSetting("soundEffects", e.target.checked)}
              className="h-5 w-5 accent-neon-cyan cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* AI Tab */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold glow-text">AI Settings</h3>

          {/* AI Model */}
          <div className="glass-panel rounded-xl p-4">
            <label className="text-sm font-semibold font-display text-text-primary block mb-2">
              AI Model
            </label>
            <CyberInput
              value={settings.ai.model ?? "openai/gpt-5-mini"}
              onChange={(e) => updateAISetting("model", e.target.value)}
              placeholder="Enter AI model identifier"
            />
            <p className="text-xs text-text-secondary mt-2">
              Example: openai/gpt-4, anthropic/claude-3-opus
            </p>
          </div>

          {/* Stream Responses */}
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold font-display text-text-primary block mb-1">
                Stream Responses
              </label>
              <p className="text-xs text-text-secondary">Show AI responses as they're generated</p>
            </div>
            <input
              type="checkbox"
              checked={settings.ai.streamResponses ?? true}
              onChange={(e) => updateAISetting("streamResponses", e.target.checked)}
              className="h-5 w-5 accent-neon-cyan cursor-pointer"
            />
          </div>

          {/* Include Citations */}
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold font-display text-text-primary block mb-1">
                Include Citations
              </label>
              <p className="text-xs text-text-secondary">Show note references in AI responses</p>
            </div>
            <input
              type="checkbox"
              checked={settings.ai.includeCitations ?? true}
              onChange={(e) => updateAISetting("includeCitations", e.target.checked)}
              className="h-5 w-5 accent-neon-cyan cursor-pointer"
            />
          </div>

          {/* Desktop Notifications */}
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold font-display text-text-primary block mb-1">
                Desktop Notifications
              </label>
              <p className="text-xs text-text-secondary">Notify when AI query completes</p>
            </div>
            <input
              type="checkbox"
              checked={settings.ai.desktopNotifications ?? false}
              onChange={(e) => updateAISetting("desktopNotifications", e.target.checked)}
              className="h-5 w-5 accent-neon-cyan cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Saving Indicator */}
      {saving && (
        <div className="fixed bottom-6 right-6 glass-panel rounded-lg px-4 py-3 flex items-center gap-3 animate-scale-in">
          <LoadingOrb size="sm" />
          <span className="text-sm text-text-primary">Saving settings...</span>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex-col h-full">
      {/* Header */}
      <div className="glass-panel border-b border-neon-cyan/20 px-6 py-4">
        <h1 className="text-3xl font-display font-bold glow-text">
          SETTINGS
        </h1>
        <p className="text-text-secondary mt-1">
          Customize your Second Brain experience
        </p>
      </div>

      {/* Main Content */}
      <SettingsPanel />
    </div>
  );
}