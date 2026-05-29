# Task 02: API Key Validation & Model Fetching

## Status

pending

## Wave

1

## Description

Create server actions to validate an OpenRouter API key and to fetch available models from OpenRouter. These will be called from the settings UI to verify a user's key before saving it, and to populate model selection dropdowns.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-03-ai-settings-actions.md

**Context from dependencies:** No prior task output needed. This task creates pure API interaction functions.

## Files to Create

- `src/lib/openrouter.ts` — OpenRouter API utilities (validate key, fetch models)

## Files to Modify

None

## Technical Details

### Implementation Steps

1. Create `src/lib/openrouter.ts` with these exported functions:

#### `validateOpenRouterKey(apiKey: string): Promise<{ valid: boolean; error?: string }>`
- Makes a GET request to `https://openrouter.ai/api/v1/models` with `Authorization: Bearer ${apiKey}`
- If response is 200, key is valid; return `{ valid: true }`
- If response is 401/403, return `{ valid: false, error: "Invalid API key" }`
- If network error, return `{ valid: false, error: "Could not reach OpenRouter" }`

#### `fetchAvailableModels(apiKey: string): Promise<{ chat: ModelInfo[]; embeddings: ModelInfo[] }>`
- Fetches `https://openrouter.ai/api/v1/models` with the user's key
- Parses the response JSON `data` array
- Separates models into two lists:
  - **Chat models**: models where `model.id` does NOT contain "embedding" and `model.architecture.modality` includes "text"
  - **Embedding models**: models where `model.id` contains "embedding" AND the model's embedding dimension is 1536
- For embedding model filtering: check if `model.architecture` exists and look for dimension info. Since OpenRouter may not expose dimensions directly, use a **fixed allowlist** of known 1536-dim embedding models:
  ```
  openai/text-embedding-3-small
  openai/text-embedding-ada-002
  ```
- Sort both lists alphabetically by `name`
- Return both arrays

#### `ModelInfo` type:
```ts
export type ModelInfo = {
  id: string;
  name: string;
  contextLength?: number;
  pricing?: { prompt: string; completion: string };
};
```

2. Export a `SUPPORTED_EMBEDDING_MODELS` constant:
```ts
export const SUPPORTED_EMBEDDING_MODELS = [
  { id: "openai/text-embedding-3-small", name: "Text Embedding 3 Small", dimension: 1536 },
  { id: "openai/text-embedding-ada-002", name: "Text Embedding Ada 002", dimension: 1536 },
];
```

3. Export a `DEFAULT_CHAT_MODELS` constant as fallback (used when API is unreachable):
```ts
export const DEFAULT_CHAT_MODELS = [
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash" },
  { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
];
```

### API Endpoints

- `GET https://openrouter.ai/api/v1/models` — Returns `{ data: Model[] }` with model info

## Acceptance Criteria

- [ ] `validateOpenRouterKey` returns `{ valid: true }` for a valid key
- [ ] `validateOpenRouterKey` returns `{ valid: false, error }` for an invalid key
- [ ] `fetchAvailableModels` returns chat and embedding model lists
- [ ] Embedding model list only includes 1536-dim models
- [ ] Both functions handle network errors gracefully

## Notes

The OpenRouter models endpoint is public (returns data even without auth), but we use the user's key to verify it's valid. The response format has `data[].id`, `data[].name`, `data[].context_length`, `data[].pricing`.
