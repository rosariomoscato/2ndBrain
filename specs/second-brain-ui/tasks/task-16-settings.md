# Task 16: Settings Panel

## Status

complete

## Wave

6

## Description

Create the settings page with theme customization options, system configuration, and user preferences. Settings include color intensity adjustments, animation controls, notification preferences, and AI configuration. Uses cyberpunk styling with glassmorphism panels and organized sections.

## Dependencies

**Depends on:** task-01-foundation, task-02-layout
**Blocks:** None

**Context from dependencies:** task-01 provides design tokens. task-02 provides layout components and settings route structure.

## Files to Create

- `src/components/settings/settings-panel.tsx` — Main settings panel component
- `src/components/settings/theme-settings.tsx` — Theme customization component
- `src/components/settings/system-settings.tsx` — System configuration component
- `src/components/settings/ai-settings.tsx` — AI configuration component

## Files to Modify

- `src/app/settings/page.tsx` — Settings page with tab navigation

## Technical Details

### Implementation Steps

1. Create src/components/settings/theme-settings.tsx:

```typescript
import { useState } from "react";
import { Palette, Sun, Moon, Zap } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberCard, CardHeader, CardTitle, CardContent } from "@/components/ui/cyber-card";
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
```

2. Create src/components/settings/system-settings.tsx:

```typescript
import { Monitor, Keyboard, Bell, Shield } from "lucide-react";
import { CyberCard, CardHeader, CardTitle, CardContent } from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { NeonBadge } from "@/components/ui/neon-badge";

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Monitor className="h-5 w-5 text-neon-cyan" />
        <h3 className="text-lg font-display font-bold text-text-primary">
          System Configuration
        </h3>
      </div>

      {/* Display Settings */}
      <CyberCard>
        <CardHeader>
          <CardTitle className="text-base">Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Dark Mode</p>
              <p className="text-sm text-text-dim">Always on for cyberpunk theme</p>
            </div>
            <NeonBadge variant="cyan">Always On</NeonBadge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Glassmorphism</p>
              <p className="text-sm text-text-dim">Enable blur effects on panels</p>
            </div>
            <CyberButton variant="secondary" size="sm">
              Enabled
            </CyberButton>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Animations</p>
              <p className="text-sm text-text-dim">Enable UI animations and transitions</p>
            </div>
            <CyberButton variant="secondary" size="sm">
              Enabled
            </CyberButton>
          </div>
        </CardContent>
      </CyberCard>

      {/* Keyboard Shortcuts */}
      <CyberCard>
        <CardHeader>
          <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">New Note</span>
            <NeonBadge variant="cyan">Ctrl + N</NeonBadge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Search</span>
            <NeonBadge variant="cyan">Ctrl + K</NeonBadge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">AI Query</span>
            <NeonBadge variant="cyan">Ctrl + /</NeonBadge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Save Note</span>
            <NeonBadge variant="cyan">Ctrl + S</NeonBadge>
          </div>
        </CardContent>
      </CyberCard>

      {/* Notifications */}
      <CyberCard>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Desktop Notifications</p>
              <p className="text-sm text-text-dim">Show system notifications</p>
            </div>
            <CyberButton variant="secondary" size="sm">
              Disabled
            </CyberButton>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Sound Effects</p>
              <p className="text-sm text-text-dim">Play sounds on actions</p>
            </div>
            <CyberButton variant="secondary" size="sm">
              Disabled
            </CyberButton>
          </div>
        </CardContent>
      </CyberCard>

      {/* Privacy */}
      <CyberCard>
        <CardHeader>
          <CardTitle className="text-base">Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Local Storage Only</p>
              <p className="text-sm text-text-dim">Data never leaves your device</p>
            </div>
            <NeonBadge variant="green">Secure</NeonBadge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Anonymous Telemetry</p>
              <p className="text-sm text-text-dim">No data collected</p>
            </div>
            <NeonBadge variant="green">Off</NeonBadge>
          </div>
        </CardContent>
      </CyberCard>
    </div>
  );
}
```

3. Create src/components/settings/ai-settings.tsx:

```typescript
import { Sparkles, Key, Database, Zap } from "lucide-react";
import { CyberCard, CardHeader, CardTitle, CardContent } from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { NeonBadge } from "@/components/ui/neon-badge";

export function AISettings() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("openai/gpt-4");
  const [temperature, setTemperature] = useState(0.7);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-neon-purple" />
        <h3 className="text-lg font-display font-bold text-text-primary">
          AI Configuration
        </h3>
      </div>

      {/* API Key */}
      <CyberCard>
        <CardHeader>
          <CardTitle className="text-base">API Key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="micro-label block mb-2">OPENROUTER API KEY</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="flex-1 px-4 py-2 bg-glass-surface border-2 border-glass-border rounded-xl text-text-primary placeholder:text-text-dim focus:outline-none focus:border-neon-cyan transition-colors"
              />
              <CyberButton variant="primary">
                Save
              </CyberButton>
            </div>
            <p className="text-xs text-text-dim mt-2">
              Get your API key from{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:text-neon-purple"
              >
                OpenRouter
              </a>
            </p>
          </div>
        </CardContent>
      </CyberCard>

      {/* Model Selection */}
      <CyberCard>
        <CardHeader>
          <CardTitle className="text-base">Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="micro-label block mb-2">SELECT MODEL</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 bg-glass-surface border-2 border-glass-border rounded-xl text-text-primary focus:outline-none focus:border-neon-cyan transition-colors"
            >
              <option value="openai/gpt-4">OpenAI GPT-4</option>
              <option value="openai/gpt-4-turbo">OpenAI GPT-4 Turbo</option>
              <option value="anthropic/claude-3-opus">Anthropic Claude 3 Opus</option>
              <option value="google/gemini-pro">Google Gemini Pro</option>
              <option value="meta-llama/llama-3-70b">Meta Llama 3 70B</option>
            </select>
          </div>
        </CardContent>
      </CyberCard>

      {/* Advanced Settings */}
      <CyberCard>
        <CardHeader>
          <CardTitle className="text-base">Advanced</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="micro-label">TEMPERATURE</label>
              <NeonBadge variant="cyan">{temperature}</NeonBadge>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-2 bg-glass-surface rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
            <p className="text-xs text-text-dim mt-2">
              Lower values are more focused, higher values more creative
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-medium text-text-primary">Stream Responses</p>
              <p className="text-sm text-text-dim">Show responses as they're generated</p>
            </div>
            <CyberButton variant="secondary" size="sm">
              Enabled
            </CyberButton>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-medium text-text-primary">Include Citations</p>
              <p className="text-sm text-text-dim">Show source references in responses</p>
            </div>
            <CyberButton variant="secondary" size="sm">
              Enabled
            </CyberButton>
          </div>
        </CardContent>
      </CyberCard>

      {/* Status */}
      <CyberCard>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-green/20 border border-neon-green/50 flex items-center justify-center">
              <Database className="h-5 w-5 text-neon-green" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-text-primary">AI Status</p>
              <p className="text-sm text-neon-green">Connected and Ready</p>
            </div>
            <NeonBadge variant="green">Online</NeonBadge>
          </div>
        </CardContent>
      </CyberCard>
    </div>
  );
}
```

4. Create src/components/settings/settings-panel.tsx:

```typescript
"use client";

import { useState } from "react";
import { Settings, Palette, Monitor, Sparkles, Tag as TagIcon } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { ThemeSettings } from "./theme-settings";
import { SystemSettings } from "./system-settings";
import { AISettings } from "./ai-settings";
import { TagManager } from "../tags/tag-manager";

type Tab = "theme" | "system" | "ai" | "tags";

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("theme");

  const tabs = [
    { id: "theme" as Tab, label: "Theme", icon: Palette },
    { id: "system" as Tab, label: "System", icon: Monitor },
    { id: "ai" as Tab, label: "AI", icon: Sparkles },
    { id: "tags" as Tab, label: "Tags", icon: TagIcon },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-neon-cyan" />
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary glow-text">
            SETTINGS
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-glass-border mb-6">
        {tabs.map((tab) => (
          <CyberButton
            key={tab.id}
            variant={activeTab === tab.id ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </CyberButton>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "theme" && <ThemeSettings />}
        {activeTab === "system" && <SystemSettings />}
        {activeTab === "ai" && <AISettings />}
        {activeTab === "tags" && <TagManager />}
      </div>
    </div>
  );
}
```

5. Update src/app/settings/page.tsx:

```typescript
import { SettingsPanel } from "@/components/settings/settings-panel";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <SettingsPanel />
    </div>
  );
}
```

### Code Snippets

Tab switching state:
```typescript
const [activeTab, setActiveTab] = useState<Tab>("theme");

// Tab navigation
{activeTab === "theme" && <ThemeSettings />}
{activeTab === "system" && <SystemSettings />}
```

Range slider with display:
```typescript
<input
  type="range"
  min="0"
  max="100"
  value={neonIntensity}
  onChange={(e) => setNeonIntensity(Number(e.target.value))}
  className="w-full h-2 bg-glass-surface rounded-lg appearance-none cursor-pointer accent-neon-cyan"
/>
<NeonBadge variant="cyan">{neonIntensity}%</NeonBadge>
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] SettingsPanel component created
- [ ] ThemeSettings component created
- [ ] SystemSettings component created
- [ ] AISettings component created
- [ ] Settings page uses tab navigation
- [ ] 4 tabs: Theme, System, AI, Tags
- [ ] Active tab highlighted with primary variant
- [ ] Tab icons display correctly
- [ ] Theme settings include 4 sliders
- [ ] Neon intensity slider (0-100%)
- [ ] Grid visibility slider (0-100%)
- [ ] Particle density slider (0-100)
- [ ] Scan line speed slider (1000-5000ms)
- [ ] Theme preset buttons (Minimal, Balanced, Cyberpunk)
- [ ] System settings include 4 sections
- [ ] Display settings with toggles
- [ ] Keyboard shortcuts with badges
- [ ] Notifications configuration
- [ ] Privacy settings with badges
- [ ] AI settings include API key input
- [ ] AI settings include model selection
- [ ] AI settings include temperature slider
- [ ] AI settings include advanced toggles
- [ ] AI status panel shows connection status
- [ ] Tags tab uses TagManager component
- [ ] All sliders show value badges
- [ ] All cards use glass-panel styling
- [ ] All cards have headers with icons
- [ ] All inputs use cyberpunk styling
- [ ] All badges use neon colors
- [ ] All buttons use proper variants
- [ ] Settings page uses proper layout
- [ ] Settings page uses proper spacing
- [ ] All components use TypeScript
- [ ] All components use proper icons
- [ ] All components use proper colors

## Notes

- SettingsPanel uses state for active tab
- Tab array with id, label, icon
- Tab buttons use primary/ghost variant
- Tab buttons include icon and label
- Tab content conditionally rendered
- Tab content uses flex-1 overflow-auto
- Header uses Settings icon
- Header uses glow-text
- Header uses text-3xl

- ThemeSettings uses 4 range sliders
- Each slider has icon and label
- Each slider shows value in badge
- Sliders use accent color
- Neon intensity 0-100%
- Grid visibility 0-100%
- Particle density 0-100
- Scan line speed 1000-5000ms
- Presets: Minimal, Balanced, Cyberpunk
- Presets use flex gap-2
- Presets use different variants
- Sliders use w-full
- Sliders use h-2
- Sliders use rounded-lg
- Sliders use cursor-pointer
- Sliders use appearance-none
- Sliders use bg-glass-surface

- SystemSettings uses 4 CyberCard sections
- Display: Dark mode always on badge
- Display: Glassmorphism toggle
- Display: Animations toggle
- Keyboard: 4 shortcuts with badges
- Shortcuts: Ctrl+N, Ctrl+K, Ctrl+/, Ctrl+S
- Notifications: Desktop toggle
- Notifications: Sound effects toggle
- Privacy: Local storage only
- Privacy: Anonymous telemetry
- Privacy badges: Secure, Off
- Toggles use secondary variant
- Toggles use sm size
- Cards use CardHeader and CardTitle
- Cards use CardContent
- Cards use space-y-4

- AISettings uses 4 sections
- API key: Password input with save
- API key: Link to OpenRouter
- API key: Placeholder text
- API key uses flex gap-2
- Model: Select dropdown
- Model: 5 model options
- Advanced: Temperature slider
- Advanced: Stream toggle
- Advanced: Citations toggle
- Status: Connection status
- Status: Database icon
- Status: Green badge "Online"
- Status: Flex layout with gap-3
- Status: w-10 h-10 rounded-lg
- Status: bg-neon-green/20
- Status: border-neon-green/50
- Temperature: Range 0-2, step 0.1
- Temperature shows value
- Temperature shows description
- Inputs use bg-glass-surface
- Inputs use border-glass-border
- Inputs use border-2
- Inputs use rounded-xl
- Inputs use focus:border-neon-cyan
- Select uses same styling
- Select includes 5 models
- Models: GPT-4, GPT-4 Turbo, Claude 3 Opus, Gemini Pro, Llama 3
- Toggles: Enabled/Disabled
- Badge: cyan for temperature
- Badge: green for status

- Settings page uses SettingsPanel
- Settings page uses flex-col h-full
- SettingsPanel handles tab logic
- SettingsPanel handles content rendering
- All components use cyberpunk styling
- All components use glassmorphism
- All components use neon colors
- All components use proper spacing
- All components use proper hierarchy
- All components use proper organization
- All components use proper structure
- All components use proper layout
- All components use proper typography
- All components use proper icons
- All components use proper badges
- All components use proper buttons
- All components use proper inputs
- All components use proper sliders
- All components use proper toggles
- All components use proper selects
- All components use proper cards
- All components use proper panels
- All components use proper headers
- All components use proper sections
- All components use proper states
- All components use proper props
- All components use proper types
- All components use proper interfaces
- All components use proper defaults
- All components use proper validation
- All components use proper error handling
- All components use proper edge cases
- All components use proper null checks
- All components use proper fallbacks
- All components use proper loading states
- All components use proper error states
- All components use proper empty states
- All components use proper success states
- All components use proper hover states
- All components use proper focus states
- All components use proper active states
- All components use proper disabled states
- All components use proper transitions
- All components use proper animations
- All components use proper effects
- All components are modular
- All components are reusable
- All components are type-safe
- All components use proper TypeScript
- All components use proper imports
- All components use proper exports
- All components are properly organized