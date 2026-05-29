# Task 06: User Settings Server Actions

## Status

complete

## Wave

2

## Description

Implement server actions for reading and updating user settings. The settings panel (settings-panel.tsx, theme-settings.tsx, system-settings.tsx, ai-settings.tsx) currently uses local React state that resets on reload. These server actions persist theme, system, and AI preferences to the user_settings table. If no settings row exists, a default one is created automatically.

## Dependencies

**Depends on:** task-01-schema.md, task-02-types.md
**Blocks:** task-14-graph-ui.md

**Context from dependencies:** task-01 creates the `user_settings` table with `theme`, `system`, and `ai` JSONB columns. task-02 creates `UserThemeSettings`, `UserSystemSettings`, `UserAISettings` types and `updateSettingsSchema` Zod schema. The default settings should match the cyberpunk theme defaults.

## Files to Create

- `src/lib/actions/settings.ts` — Settings read and update server actions

## Files to Modify

None

## Technical Details

### Default Settings

```typescript
const DEFAULT_THEME = {
  neonIntensity: 70,
  gridVisibility: 50,
  particleDensity: 60,
  scanLineSpeed: 50,
  preset: "cyberpunk" as const,
};

const DEFAULT_SYSTEM = {
  glassmorphism: true,
  animations: true,
  notifications: false,
  soundEffects: false,
};

const DEFAULT_AI = {
  model: "openai/gpt-5-mini",
  streamResponses: true,
  includeCitations: true,
  desktopNotifications: false,
};
```

### Implementation Steps

1. Create `src/lib/actions/settings.ts`:

```typescript
"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { updateSettingsSchema } from "@/lib/validations";
import type { UserThemeSettings, UserSystemSettings, UserAISettings } from "@/lib/types";
import { headers } from "next/headers";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}
```

2. **getSettings action:**

```typescript
export async function getSettings() {
  const session = await getSession();

  let settings = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  if (settings.length === 0) {
    const [created] = await db
      .insert(userSettings)
      .values({
        userId: session.user.id,
        theme: DEFAULT_THEME,
        system: DEFAULT_SYSTEM,
        ai: DEFAULT_AI,
      })
      .returning();
    settings = [created];
  }

  return {
    theme: { ...DEFAULT_THEME, ...settings[0].theme } as UserThemeSettings,
    system: { ...DEFAULT_SYSTEM, ...settings[0].system } as UserSystemSettings,
    ai: { ...DEFAULT_AI, ...settings[0].ai } as UserAISettings,
  };
}
```

3. **updateSettings action:**

```typescript
export async function updateSettings(input: {
  theme?: UserThemeSettings;
  system?: UserSystemSettings;
  ai?: UserAISettings;
}) {
  const session = await getSession();
  const validated = updateSettingsSchema.parse(input);

  const existing = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(userSettings).values({
      userId: session.user.id,
      theme: validated.theme ?? DEFAULT_THEME,
      system: validated.system ?? DEFAULT_SYSTEM,
      ai: validated.ai ?? DEFAULT_AI,
    });
  } else {
    const updates: Record<string, unknown> = {};
    if (validated.theme) updates.theme = { ...existing[0].theme, ...validated.theme };
    if (validated.system) updates.system = { ...existing[0].system, ...validated.system };
    if (validated.ai) updates.ai = { ...existing[0].ai, ...validated.ai };

    if (Object.keys(updates).length > 0) {
      await db.update(userSettings).set(updates).where(eq(userSettings.userId, session.user.id));
    }
  }

  return getSettings();
}
```

### Notes

- Settings are merged with defaults — partial updates preserve existing values
- The getSettings action auto-creates a settings row if none exists (first-time user)
- JSONB columns allow flexible schema without migrations for new settings

## Acceptance Criteria

- [ ] `getSettings()` returns merged default + saved settings
- [ ] `getSettings()` auto-creates settings row on first call
- [ ] `updateSettings({ theme: { neonIntensity: 50 } })` only updates that field, preserves others
- [ ] Settings persist across page reloads
- [ ] All actions enforce user ownership
- [ ] Zod validation rejects invalid values
