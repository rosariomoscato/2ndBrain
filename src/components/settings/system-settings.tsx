import { Monitor } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberCard, CardHeader, CardTitle, CardContent } from "@/components/ui/cyber-card";
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