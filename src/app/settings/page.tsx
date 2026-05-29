"use client";

import * as React from "react";
import { toast } from "sonner";
import { applySystemSettingsUpdate } from "@/components/shared/system-settings-provider";
import { useSystemSettings } from "@/components/shared/system-settings-provider";
import { TagEditorModal } from "@/components/tags/tag-editor-modal";
import { TagManager } from "@/components/tags/tag-manager";
import { CyberButton as Button } from "@/components/ui/cyber-button";
import { LoadingOrb } from "@/components/ui/loading-orb";
import {
  getAISettings,
  saveOpenRouterApiKey,
  removeOpenRouterApiKey,
  saveAIModel,
  saveAIEmbeddingModel,
  fetchModels,
} from "@/lib/actions/ai-settings";
import { getSettings, updateSettings } from "@/lib/actions/settings";
import { requestNotificationPermission, showNotification } from "@/lib/notifications";
import { SUPPORTED_EMBEDDING_MODELS, DEFAULT_CHAT_MODELS, type ModelInfo } from "@/lib/openrouter";
import { playToggleSound } from "@/lib/sounds";
import type { AISettingsResponse, UserAISettings, UserSystemSettings, UserThemeSettings } from "@/lib/types";


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

function AITabContent({ updateAISetting }: { updateAISetting: (key: keyof UserAISettings, value: string | boolean) => Promise<void> }) {
  const [aiSettings, setAISettings] = React.useState<AISettingsResponse | null>(null);
  const [apiKeyInput, setApiKeyInput] = React.useState("");
  const [isValidating, setIsValidating] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [chatModels, setChatModels] = React.useState<ModelInfo[]>(DEFAULT_CHAT_MODELS);
  const [isLoadingModels, setIsLoadingModels] = React.useState(false);
  const [showEmbeddingWarning, setShowEmbeddingWarning] = React.useState(false);

  React.useEffect(() => {
    loadAISettings();
  }, []);

  const loadAISettings = async () => {
    try {
      const data = await getAISettings();
      setAISettings(data);
    } catch (error) {
      console.error("Failed to load AI settings:", error);
      toast.error("Failed to load AI settings");
    }
  };

  const handleSaveKey = async () => {
    if (!apiKeyInput.trim()) {
      setValidationError("Please enter an API key");
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const result = await saveOpenRouterApiKey(apiKeyInput.trim());
      if (result.success) {
        toast.success("API key saved successfully");
        setApiKeyInput("");
        await loadAISettings();
      } else {
        setValidationError(result.error || "Invalid API key. Please check and try again.");
      }
    } catch (error) {
      console.error("Error saving API key:", error);
      setValidationError("Failed to save API key. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveKey = async () => {
    try {
      await removeOpenRouterApiKey();
      toast.success("API key removed");
      await loadAISettings();
    } catch (error) {
      console.error("Error removing API key:", error);
      toast.error("Failed to remove API key");
    }
  };

  const handleLoadModels = async () => {
    setIsLoadingModels(true);
    try {
      const models = await fetchModels();
      setChatModels(models.chat);
      toast.success(`Loaded ${models.chat.length} chat models`);
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Failed to fetch models. Using default list.");
      setChatModels(DEFAULT_CHAT_MODELS);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleModelChange = async (modelId: string) => {
    try {
      await saveAIModel(modelId);
      await loadAISettings();
      toast.success("Chat model updated");
    } catch (error) {
      console.error("Error saving model:", error);
      toast.error("Failed to save model");
    }
  };

  const handleEmbeddingModelChange = async (modelId: string) => {
    if (aiSettings?.embeddingModel && aiSettings.embeddingModel !== modelId) {
      setShowEmbeddingWarning(true);
    }
    try {
      await saveAIEmbeddingModel(modelId);
      await loadAISettings();
      toast.success("Embedding model updated");
    } catch (error) {
      console.error("Error saving embedding model:", error);
      toast.error("Failed to save embedding model");
    }
  };

  if (!aiSettings) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingOrb size="md" />
      </div>
    );
  }

  // State 1 & 4: No API Key configured (or validation failed)
  if (!aiSettings.hasKey) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-display font-bold glow-text">AI Settings</h3>

        <div className="glass-panel rounded-xl p-6 space-y-4">
          <div>
            <h4 className="text-lg font-semibold font-display text-text-primary mb-2">
              OpenRouter API Key Required
            </h4>
            <p className="text-sm text-text-secondary mb-4">
              Enter your OpenRouter API key to enable AI features including chat, RAG queries, and semantic search.
            </p>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline text-sm"
            >
              Get an API key from OpenRouter →
            </a>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold font-display text-text-primary block">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                disabled={isValidating}
                placeholder="sk-or-..."
                className="w-full px-4 py-2 bg-glass-surface border border-glass-border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-neon-cyan disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                disabled={isValidating}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary disabled:opacity-50"
              >
                {showApiKey ? "🙈" : "👁️"}
              </button>
            </div>
            {validationError && (
              <p className="text-neon-pink text-sm">{validationError}</p>
            )}
          </div>

          <Button
            onClick={handleSaveKey}
            disabled={isValidating}
            className="w-full"
          >
            {isValidating ? (
              <span className="flex items-center gap-2">
                <LoadingOrb size="sm" />
                Validating...
              </span>
            ) : (
              "Validate & Save"
            )}
          </Button>
        </div>

        <div className="glass-panel rounded-xl p-4 opacity-50">
          <p className="text-sm text-text-secondary">
            Model selection and AI features are disabled until an API key is configured.
          </p>
        </div>
      </div>
    );
  }

  // State 3: Key configured
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display font-bold glow-text">AI Settings</h3>

      {/* API Key Card */}
      <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold font-display text-text-primary block mb-1">
            OpenRouter API Key
          </label>
          <p className="text-xs text-neon-cyan">****{aiSettings.keyLast4}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemoveKey}
        >
          Remove
        </Button>
      </div>

      {/* Embedding Model */}
      <div className="glass-panel rounded-xl p-4 space-y-3">
        <div>
          <label className="text-sm font-semibold font-display text-text-primary block mb-1">
            Embedding Model
          </label>
          <p className="text-xs text-text-secondary">Used for semantic search and RAG</p>
        </div>
        <select
          value={aiSettings.embeddingModel || SUPPORTED_EMBEDDING_MODELS[0]?.id}
          onChange={(e) => handleEmbeddingModelChange(e.target.value)}
          className="w-full px-4 py-2 bg-glass-surface border border-glass-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-neon-cyan cursor-pointer"
        >
          {SUPPORTED_EMBEDDING_MODELS.map((model) => (
            <option key={model.id} value={model.id} className="bg-space-black text-text-primary">
              {model.name}
            </option>
          ))}
        </select>
        {showEmbeddingWarning && (
          <p className="text-sm text-neon-pink">
            ⚠️ Changing the embedding model requires re-generating embeddings for all notes. Existing embeddings may be incompatible.
          </p>
        )}
      </div>

      {/* Chat Model */}
      <div className="glass-panel rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold font-display text-text-primary block mb-1">
              Chat Model
            </label>
            <p className="text-xs text-text-secondary">Used for AI responses and queries</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLoadModels}
            disabled={isLoadingModels}
          >
            {isLoadingModels ? (
              <span className="flex items-center gap-2">
                <LoadingOrb size="sm" />
                Loading...
              </span>
            ) : (
              "Load Models"
            )}
          </Button>
        </div>
        <select
          value={aiSettings.model || DEFAULT_CHAT_MODELS[0]?.id}
          onChange={(e) => handleModelChange(e.target.value)}
          className="w-full px-4 py-2 bg-glass-surface border border-glass-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-neon-cyan cursor-pointer"
        >
          {chatModels.map((model) => (
            <option key={model.id} value={model.id} className="bg-space-black text-text-primary">
              {model.name}
              {model.pricing && ` (${model.pricing.prompt} / ${model.pricing.completion})`}
            </option>
          ))}
        </select>
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
          checked={aiSettings.streamResponses}
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
          checked={aiSettings.includeCitations}
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
          checked={aiSettings.desktopNotifications}
          onChange={(e) => updateAISetting("desktopNotifications", e.target.checked)}
          className="h-5 w-5 accent-neon-cyan cursor-pointer"
        />
      </div>
    </div>
  );
}

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
      {activeTab === "ai" && <AITabContent updateAISetting={updateAISetting} />}

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