"use client";

import { useState } from "react";
import { Sparkles, Database } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberCard, CardHeader, CardTitle, CardContent } from "@/components/ui/cyber-card";
import { NeonBadge } from "@/components/ui/neon-badge";

export function AISettings() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("openai/gpt-4");
  const [temperature, setTemperature] = useState(0.7);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="text-neon-purple h-5 w-5" />
        <h3 className="font-display text-text-primary text-lg font-bold">AI Configuration</h3>
      </div>

      {/* API Key */}
      <CyberCard>
        <CardHeader>
          <CardTitle className="text-base">API Key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="micro-label mb-2 block">OPENROUTER API KEY</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="bg-glass-surface border-glass-border text-text-primary placeholder:text-text-dim focus:border-neon-cyan flex-1 rounded-xl border-2 px-4 py-2 transition-colors focus:outline-none"
              />
              <CyberButton variant="primary">Save</CyberButton>
            </div>
            <p className="text-text-dim mt-2 text-xs">
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
            <label className="micro-label mb-2 block">SELECT MODEL</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-glass-surface border-glass-border text-text-primary focus:border-neon-cyan w-full rounded-xl border-2 px-4 py-2 transition-colors focus:outline-none"
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
            <div className="mb-2 flex items-center justify-between">
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
              className="bg-glass-surface accent-neon-cyan h-2 w-full cursor-pointer appearance-none rounded-lg"
            />
            <p className="text-text-dim mt-2 text-xs">
              Lower values are more focused, higher values more creative
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-text-primary font-medium">Stream Responses</p>
              <p className="text-text-dim text-sm">Show responses as they're generated</p>
            </div>
            <CyberButton variant="secondary" size="sm">
              Enabled
            </CyberButton>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-text-primary font-medium">Include Citations</p>
              <p className="text-text-dim text-sm">Show source references in responses</p>
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
            <div className="bg-neon-green/20 border-neon-green/50 flex h-10 w-10 items-center justify-center rounded-lg border">
              <Database className="text-neon-green h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-text-primary font-medium">AI Status</p>
              <p className="text-neon-green text-sm">Connected and Ready</p>
            </div>
            <NeonBadge variant="green">Online</NeonBadge>
          </div>
        </CardContent>
      </CyberCard>
    </div>
  );
}
