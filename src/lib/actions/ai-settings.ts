"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { encrypt, decrypt } from "@/lib/crypto";
import { db } from "@/lib/db";
import { validateOpenRouterKey, fetchAvailableModels, type ModelInfo } from "@/lib/openrouter";
import { userSettings } from "@/lib/schema";
import type { AISettingsResponse } from "@/lib/types";

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
 * Saves an OpenRouter API key for the authenticated user.
 * The key is validated against the OpenRouter API, then encrypted and stored.
 *
 * @param apiKey - The OpenRouter API key to save
 * @returns Promise resolving to { success: boolean; error?: string }
 * @throws Error if user is not authenticated
 */
export async function saveOpenRouterApiKey(
  apiKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();

    // Validate key using OpenRouter API
    const isValid = await validateOpenRouterKey(apiKey);
    if (!isValid) {
      return { success: false, error: "Invalid OpenRouter API key" };
    }

    // Encrypt the key
    const encrypted = encrypt(apiKey);

    // Update user settings
    const existing = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1);

    if (existing.length === 0) {
      // Create new settings row
      await db.insert(userSettings).values({
        userId: session.user.id,
        theme: {},
        system: {},
        ai: {
          openrouterApiKey: encrypted,
        },
      });
    } else {
      const existingSettings = existing[0];
      if (!existingSettings) {
        throw new Error("Failed to retrieve existing settings");
      }

      // Merge with existing AI settings
      const currentAI = (existingSettings.ai as Record<string, unknown>) || {};
      await db
        .update(userSettings)
        .set({
          ai: {
            ...currentAI,
            openrouterApiKey: encrypted,
          },
        })
        .where(eq(userSettings.userId, session.user.id));
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving OpenRouter API key:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save API key",
    };
  }
}

/**
 * Removes the OpenRouter API key for the authenticated user.
 * Also clears the selected chat and embedding models since they depend on the key.
 *
 * @returns Promise resolving to { success: boolean }
 * @throws Error if user is not authenticated
 */
export async function removeOpenRouterApiKey(): Promise<{ success: boolean }> {
  try {
    const session = await getSession();

    const existing = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1);

    if (existing.length > 0) {
      const existingSettings = existing[0];
      if (!existingSettings) {
        throw new Error("Failed to retrieve existing settings");
      }

      const currentAI = (existingSettings.ai as Record<string, unknown>) || {};
      const { openrouterApiKey, model, embeddingModel, ...restAI } = currentAI;

      // Clear the key and model selections
      await db
        .update(userSettings)
        .set({
          ai: restAI,
        })
        .where(eq(userSettings.userId, session.user.id));
    }

    return { success: true };
  } catch (error) {
    console.error("Error removing OpenRouter API key:", error);
    throw error;
  }
}

/**
 * Retrieves the user's AI settings, including masked API key info.
 * Never returns the full API key to the client - only the last 4 characters.
 *
 * @returns Promise resolving to AISettingsResponse
 * @throws Error if user is not authenticated
 */
export async function getAISettings(): Promise<AISettingsResponse> {
  const session = await getSession();

  const existing = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  const ai = existing.length > 0 ? (existing[0]?.ai as Record<string, unknown>) || {} : {};

  // Extract and mask the API key
  const encryptedKey = ai.openrouterApiKey as string | undefined;
  let hasKey = false;
  let keyLast4: string | null = null;

  if (encryptedKey) {
    try {
      const decrypted = decrypt(encryptedKey);
      hasKey = true;
      keyLast4 = decrypted.slice(-4);
    } catch (error) {
      console.error("Error decrypting API key:", error);
    }
  }

  return {
    hasKey,
    keyLast4,
    model: (ai.model as string | null) ?? null,
    embeddingModel: (ai.embeddingModel as string | null) ?? null,
    streamResponses: (ai.streamResponses as boolean) ?? true,
    includeCitations: (ai.includeCitations as boolean) ?? true,
    desktopNotifications: (ai.desktopNotifications as boolean) ?? false,
  };
}

/**
 * Saves the selected AI chat model for the authenticated user.
 *
 * @param modelId - The model ID to save
 * @returns Promise resolving to { success: boolean }
 * @throws Error if user is not authenticated
 */
export async function saveAIModel(modelId: string): Promise<{ success: boolean }> {
  try {
    const session = await getSession();

    const existing = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1);

    if (existing.length === 0) {
      // Create new settings row
      await db.insert(userSettings).values({
        userId: session.user.id,
        theme: {},
        system: {},
        ai: {
          model: modelId,
        },
      });
    } else {
      const existingSettings = existing[0];
      if (!existingSettings) {
        throw new Error("Failed to retrieve existing settings");
      }

      const currentAI = (existingSettings.ai as Record<string, unknown>) || {};
      await db
        .update(userSettings)
        .set({
          ai: {
            ...currentAI,
            model: modelId,
          },
        })
        .where(eq(userSettings.userId, session.user.id));
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving AI model:", error);
    throw error;
  }
}

/**
 * Saves the selected embedding model for the authenticated user.
 *
 * @param modelId - The embedding model ID to save
 * @returns Promise resolving to { success: boolean }
 * @throws Error if user is not authenticated
 */
export async function saveAIEmbeddingModel(
  modelId: string
): Promise<{ success: boolean }> {
  try {
    const session = await getSession();

    const existing = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1);

    if (existing.length === 0) {
      // Create new settings row
      await db.insert(userSettings).values({
        userId: session.user.id,
        theme: {},
        system: {},
        ai: {
          embeddingModel: modelId,
        },
      });
    } else {
      const existingSettings = existing[0];
      if (!existingSettings) {
        throw new Error("Failed to retrieve existing settings");
      }

      const currentAI = (existingSettings.ai as Record<string, unknown>) || {};
      await db
        .update(userSettings)
        .set({
          ai: {
            ...currentAI,
            embeddingModel: modelId,
          },
        })
        .where(eq(userSettings.userId, session.user.id));
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving embedding model:", error);
    throw error;
  }
}

/**
 * Retrieves the user's decrypted OpenRouter API key for server-side use.
 * This is a SERVER-ONLY function and should never be exposed to the client.
 *
 * @returns Promise resolving to the decrypted API key, or null if not set
 * @throws Error if user is not authenticated
 */
export async function getUserOpenRouterKey(): Promise<string | null> {
  const session = await getSession();

  const existing = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  if (existing.length === 0) {
    return null;
  }

  const ai = existing[0]?.ai as Record<string, unknown> | undefined;
  const encryptedKey = ai?.openrouterApiKey as string | undefined;

  if (!encryptedKey) {
    return null;
  }

  try {
    return decrypt(encryptedKey);
  } catch (error) {
    console.error("Error decrypting API key:", error);
    return null;
  }
}

/**
 * Fetches available models from OpenRouter using the user's API key.
 *
 * @returns Promise resolving to { chat: ModelInfo[], embeddings: ModelInfo[] }
 * @throws Error if user is not authenticated or no API key is configured
 */
export async function fetchModels(): Promise<{
  chat: ModelInfo[];
  embeddings: ModelInfo[];
}> {
  await getSession();

  const apiKey = await getUserOpenRouterKey();
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  return fetchAvailableModels(apiKey);
}

/**
 * Resolves the OpenRouter configuration for the authenticated user.
 * Prioritizes the user's decrypted API key and selected model from settings.
 * Falls back to environment variables if no per-user key is configured.
 *
 * @returns Promise resolving to { apiKey: string; model: string } or null if no key is available
 */
export async function resolveOpenRouterConfig(): Promise<{
  apiKey: string;
  model: string;
} | null> {
  try {
    // Try to get user's per-user API key
    const apiKey = await getUserOpenRouterKey();
    if (apiKey) {
      const settings = await getAISettings();
      return {
        apiKey,
        model: settings.model ?? "openai/gpt-4o-mini",
      };
    }
  } catch (error) {
    console.error("Error resolving OpenRouter config from user settings:", error);
  }

  // Fallback to environment variables
  const envKey = process.env.OPENROUTER_API_KEY;
  if (envKey) {
    return {
      apiKey: envKey,
      model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
    };
  }

  return null;
}