import { Monitor } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberCard, CardHeader, CardTitle, CardContent } from "@/components/ui/cyber-card";
import { NeonBadge } from "@/components/ui/neon-badge";

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Monitor className="text-neon-cyan h-5 w-5" />
        <h3 className="font-display text-text-primary text-lg font-bold">System Configuration</h3>
      </div>

      {/* Display Settings */}
      <CyberCard>
        <CardHeader>
          <CardTitle className="text-base">Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary font-medium">Dark Mode</p>
              <p className="text-text-dim text-sm">Always on for cyberpunk theme</p>
            </div>
            <NeonBadge variant="cyan">Always On</NeonBadge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary font-medium">Glassmorphism</p>
              <p className="text-text-dim text-sm">Enable blur effects on panels</p>
            </div>
            <CyberButton variant="secondary" size="sm">
              Enabled
            </CyberButton>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary font-medium">Animations</p>
              <p className="text-text-dim text-sm">Enable UI animations and transitions</p>
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
              <p className="text-text-primary font-medium">Desktop Notifications</p>
              <p className="text-text-dim text-sm">Show system notifications</p>
            </div>
            <CyberButton variant="secondary" size="sm">
              Disabled
            </CyberButton>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary font-medium">Sound Effects</p>
              <p className="text-text-dim text-sm">Play sounds on actions</p>
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
              <p className="text-text-primary font-medium">Local Storage Only</p>
              <p className="text-text-dim text-sm">Data never leaves your device</p>
            </div>
            <NeonBadge variant="green">Secure</NeonBadge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary font-medium">Anonymous Telemetry</p>
              <p className="text-text-dim text-sm">No data collected</p>
            </div>
            <NeonBadge variant="green">Off</NeonBadge>
          </div>
        </CardContent>
      </CyberCard>
    </div>
  );
}
