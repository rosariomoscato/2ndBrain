"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/schema";
import type { UserThemeSettings, UserSystemSettings, UserAISettings } from "@/lib/types";
import { updateSettingsSchema } from "@/lib/validations";

/**
 * Default theme settings for new users.
 * These values provide the optimal cyberpunk visual experience.
 */
const DEFAULT_THEME = {
  neonIntensity: 70,
  gridVisibility: 50,
  particleDensity: 60,
  scanLineSpeed: 50,
  preset: "cyberpunk" as const,
};

/**
 * Default system behavior settings.
 * Balance between visual appeal and performance.
 */
const DEFAULT_SYSTEM = {
  glassmorphism: true,
  animations: true,
  notifications: false,
  soundEffects: false,
};

/**
 * Default AI integration settings.
 * Configured for the best AI chat experience.
 */
const DEFAULT_AI = {
  model: "openai/gpt-5-mini",
  streamResponses: true,
  includeCitations: true,
  desktopNotifications: false,
};

/**
 * Retrieves the current authenticated user session.
 * Throws an error if the user is not authenticated.
 *
 * @returns The session object with user information
 * @throws Error if user is not authenticated
 */
async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/**
 * Retrieves the user's settings, merging with defaults.
 * If no settings exist in the database, creates them automatically.
 *
 * This action auto-creates a settings row for first-time users,
 * ensuring all users have valid settings on their first session.
 *
 * @returns Object containing merged theme, system, and AI settings
 * @throws Error if user is not authenticated
 */
export async function getSettings() {
  const session = await getSession();

  // Query for existing settings
  let settings = await db.select().from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  // Create default settings if none exist (first-time user)
  if (settings.length === 0) {
    const [created] = await db.insert(userSettings).values({
      userId: session.user.id,
      theme: DEFAULT_THEME,
      system: DEFAULT_SYSTEM,
      ai: DEFAULT_AI,
    }).returning();
    if (created) {
      settings = [created];
    }
  }

  // Merge saved settings with defaults to ensure all fields exist
  const savedSettings = settings[0];
  if (!savedSettings) {
    // This should never happen due to the create logic above
    return {
      theme: DEFAULT_THEME,
      system: DEFAULT_SYSTEM,
      ai: DEFAULT_AI,
    };
  }

  return {
    theme: { ...DEFAULT_THEME, ...(savedSettings.theme as Record<string, unknown>) } as UserThemeSettings,
    system: { ...DEFAULT_SYSTEM, ...(savedSettings.system as Record<string, unknown>) } as UserSystemSettings,
    ai: { ...DEFAULT_AI, ...(savedSettings.ai as Record<string, unknown>) } as UserAISettings,
  };
}

/**
 * Updates the user's settings with partial updates.
 * Only provided sections (theme, system, ai) are updated.
 * Within each section, only provided fields are merged with existing values.
 *
 * If no settings row exists, creates one with defaults merged with input.
 *
 * @param input - Partial settings object with optional theme, system, and ai sections
 * @returns The updated settings merged with defaults
 * @throws Error if user is not authenticated or validation fails
 */
export async function updateSettings(input: {
  theme?: UserThemeSettings;
  system?: UserSystemSettings;
  ai?: UserAISettings;
}) {
  const session = await getSession();

  // Validate input using Zod schema
  const validated = updateSettingsSchema.parse(input);

  // Check for existing settings
  const existing = await db.select().from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  // Create settings row if it doesn't exist
  if (existing.length === 0) {
    await db.insert(userSettings).values({
      userId: session.user.id,
      theme: validated.theme ? { ...DEFAULT_THEME, ...validated.theme } : DEFAULT_THEME,
      system: validated.system ? { ...DEFAULT_SYSTEM, ...validated.system } : DEFAULT_SYSTEM,
      ai: validated.ai ? { ...DEFAULT_AI, ...validated.ai } : DEFAULT_AI,
    });
  } else {
    const existingSettings = existing[0];
    if (!existingSettings) {
      throw new Error("Failed to retrieve existing settings");
    }

    // Build update object by merging input with existing values
    const updates: Record<string, unknown> = {};
    if (validated.theme) updates.theme = { ...(existingSettings.theme as Record<string, unknown>), ...validated.theme };
    if (validated.system) updates.system = { ...(existingSettings.system as Record<string, unknown>), ...validated.system };
    if (validated.ai) updates.ai = { ...(existingSettings.ai as Record<string, unknown>), ...validated.ai };

    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      await db.update(userSettings).set(updates)
        .where(eq(userSettings.userId, session.user.id));
    }
  }

  // Return updated settings merged with defaults
  return getSettings();
}