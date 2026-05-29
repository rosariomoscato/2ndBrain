# Task 03: Server Actions for AI Settings

## Status

complete

## Wave

2

## Description

Create server actions to save and load per-user AI settings (encrypted API key, selected embedding model, selected chat model). These actions bridge the UI (task-04) and the backend consumers (task-05).

## Dependencies

**Depends on:** task-01-encryption-utility.md, task-02-api-key-validation.md
**Blocks:** task-04-settings-ai-tab-ui.md, task-05-wire-backend.md

**Context from dependencies:**
- task-01 creates `src/lib/crypto.ts` with `encrypt(plaintext)` and `decrypt(encrypted)` functions for AES-256-GCM encryption. The encrypted key is stored as a JSON string `{ iv, ciphertext, tag }`.
- task-02 creates `src/lib/openrouter.ts` with `validateOpenRouterKey(apiKey)`, `fetchAvailableModels(apiKey)`, `SUPPORTED_EMBEDDING_MODELS`, and `DEFAULT_CHAT_MODELS`.

## Files to Create

- `src/lib/actions/ai-settings.ts` — Server actions for AI settings CRUD

## Files to Modify

- `src/lib/types.ts` — Update `UserAISettings` type to include new fields
- `src/lib/validations.ts` — Add validation for new AI settings fields

## Technical Details

### Updated `UserAISettings` type (in `src/lib/types.ts`):

```ts
export type UserAISettings = {
  model?: string;
  embeddingModel?: string;
  openrouterApiKey?: string;  // encrypted JSON string (never sent to client)
  streamResponses?: boolean;
  includeCitations?: boolean;
  desktopNotifications?: boolean;
};
```

### Server Actions (in `src/lib/actions/ai-settings.ts`):

#### `saveOpenRouterApiKey(apiKey: string): Promise<{ success: boolean; error?: string }>`
1. Get authenticated session (same pattern as other actions)
2. Validate key using `validateOpenRouterKey(apiKey)` from task-02
3. If invalid, return `{ success: false, error: "..." }`
4. If valid, encrypt using `encrypt(apiKey)` from task-01
5. Save to `user_settings.ai` JSONB field as `{ openrouterApiKey: encryptedJson }`
6. Return `{ success: true }`

#### `removeOpenRouterApiKey(): Promise<{ success: boolean }>`
1. Get session
2. Set `openrouterApiKey` to `null` in `user_settings.ai`
3. Also clear `model` and `embeddingModel` since they depend on the key
4. Return `{ success: true }`

#### `getAISettings(): Promise<AISettingsResponse>`
1. Get session
2. Load from `user_settings` (same as existing `getSettings()`)
3. Return:
```ts
{
  hasKey: boolean,          // true if openrouterApiKey is set
  keyLast4: string | null,  // last 4 chars of decrypted key (for display)
  model: string | null,     // selected chat model
  embeddingModel: string | null, // selected embedding model
  streamResponses: boolean,
  includeCitations: boolean,
  desktopNotifications: boolean,
}
```
4. NEVER return the full decrypted key to the client

#### `saveAIModel(modelId: string): Promise<{ success: boolean }>`
1. Get session
2. Update `model` in `user_settings.ai`

#### `saveAIEmbeddingModel(modelId: string): Promise<{ success: boolean }>`
1. Get session
2. Update `embeddingModel` in `user_settings.ai`

#### `getUserOpenRouterKey(): Promise<string | null>`
1. Get session
2. Load `openrouterApiKey` from settings
3. If set, decrypt and return plaintext
4. If not set, return null
5. This is a SERVER-ONLY function, never exposed to client

#### `fetchModels(): Promise<{ chat: ModelInfo[]; embeddings: ModelInfo[] }>`
1. Get session
2. Decrypt user's API key
3. If no key, throw error
4. Call `fetchAvailableModels(decryptedKey)` from task-02
5. Return the model lists

### Validation (in `src/lib/validations.ts`):

Add to `updateSettingsSchema.ai`:
```ts
openrouterApiKey: z.string().optional(),
embeddingModel: z.string().optional(),
```

## Acceptance Criteria

- [ ] `saveOpenRouterApiKey` validates and encrypts the key before saving
- [ ] `getAISettings` never returns the full API key to the client
- [ ] `getAISettings` returns `keyLast4` (last 4 chars) for UI display
- [ ] `getUserOpenRouterKey` decrypts and returns the key for server-side use
- [ ] `removeOpenRouterApiKey` clears the key and model selections
- [ ] All actions require authentication and check session
