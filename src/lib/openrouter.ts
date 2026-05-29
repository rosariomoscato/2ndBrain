/**
 * OpenRouter API integration for model validation and listing.
 *
 * This module provides functions to validate OpenRouter API keys and
 * fetch available models from the OpenRouter API.
 */

/**
 * Model information structure.
 * Used for displaying models in the UI and filtering them by type.
 */
export type ModelInfo = {
  id: string;
  name: string;
  description?: string | undefined;
  contextLength?: number | undefined;
  dimension?: number | undefined;
  pricing?:
    | {
        prompt: string;
        completion: string;
      }
    | undefined;
};

/**
 * List of supported embedding models (1536 dimensions only).
 * These are the models we support for generating embeddings.
 */
export const SUPPORTED_EMBEDDING_MODELS: ModelInfo[] = [
  { id: "openai/text-embedding-3-small", name: "Text Embedding 3 Small", dimension: 1536 },
  { id: "openai/text-embedding-ada-002", name: "Text Embedding Ada 002", dimension: 1536 },
];

/**
 * Default chat models for quick selection.
 * These are high-quality models recommended for general use.
 */
export const DEFAULT_CHAT_MODELS: ModelInfo[] = [
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash" },
];

/**
 * Validates an OpenRouter API key by making a lightweight request to the models endpoint.
 *
 * @param apiKey - The OpenRouter API key to validate
 * @returns Promise resolving to { valid: boolean, error?: string }
 */
export async function validateOpenRouterKey(
  apiKey: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401 || response.status === 403) {
      return { valid: false, error: "Invalid API key" };
    }

    if (!response.ok) {
      return {
        valid: false,
        error: `OpenRouter API returned status ${response.status}: ${response.statusText}`,
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Could not reach OpenRouter" };
  }
}

/**
 * Fetches available models from OpenRouter for the authenticated user.
 *
 * @param apiKey - The OpenRouter API key
 * @returns Promise resolving to { chat: ModelInfo[], embeddings: ModelInfo[] }
 * @throws Error if the API request fails
 */
export async function fetchAvailableModels(
  apiKey: string
): Promise<{ chat: ModelInfo[]; embeddings: ModelInfo[] }> {
  const response = await fetch("https://openrouter.ai/api/v1/models", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API returned status ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.data || !Array.isArray(data.data)) {
    throw new Error("Invalid response from OpenRouter API");
  }

  // Separate chat models from embedding models
  const chatModels: ModelInfo[] = [];
  const embeddingModels: ModelInfo[] = [];

  for (const model of data.data) {
    if (!model.id || typeof model.id !== "string") {
      continue;
    }

    const modelInfo: ModelInfo = {
      id: model.id,
      name: model.name || model.id,
      description: model.description,
      contextLength: model.context_length,
      pricing: model.pricing
        ? {
            prompt: String(model.pricing.prompt),
            completion: String(model.pricing.completion),
          }
        : undefined,
    };

    // Check if this is an embedding model (by name or id)
    const isEmbeddingModel =
      model.id.includes("embedding") ||
      model.name?.toLowerCase().includes("embedding") ||
      SUPPORTED_EMBEDDING_MODELS.some((supported) => supported.id === model.id);

    if (isEmbeddingModel) {
      // Only include embedding models that we support (1536 dimensions)
      if (SUPPORTED_EMBEDDING_MODELS.some((supported) => supported.id === model.id)) {
        embeddingModels.push(modelInfo);
      }
    } else {
      chatModels.push(modelInfo);
    }
  }

  // Sort chat models by name for better UX
  chatModels.sort((a, b) => a.name.localeCompare(b.name));

  // Always ensure our supported embedding models are present
  const finalEmbeddingModels = SUPPORTED_EMBEDDING_MODELS.map((supported) => {
    const existing = embeddingModels.find((m) => m.id === supported.id);
    return existing || supported;
  });

  return {
    chat: chatModels,
    embeddings: finalEmbeddingModels,
  };
}
