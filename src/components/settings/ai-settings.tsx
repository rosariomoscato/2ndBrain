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