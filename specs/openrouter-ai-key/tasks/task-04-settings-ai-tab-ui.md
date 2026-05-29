# Task 04: Settings AI Tab UI Redesign

## Status

complete

## Wave

3

## Description

Redesign the Settings > AI tab to support: (1) OpenRouter API key input with validation and masking, (2) Embedding model dropdown (1536-dim only), (3) Chat model dropdown (fetched from OpenRouter), (4) Graceful states when no key is configured (everything disabled with explanation).

## Dependencies

**Depends on:** task-03-ai-settings-actions.md
**Blocks:** task-05-wire-backend.md

**Context from dependencies:**
- task-03 creates `src/lib/actions/ai-settings.ts` with server actions:
  - `getAISettings()` returns `{ hasKey, keyLast4, model, embeddingModel, streamResponses, includeCitations, desktopNotifications }`
  - `saveOpenRouterApiKey(apiKey)` validates and encrypts the key
  - `removeOpenRouterApiKey()` clears the key
  - `saveAIModel(modelId)` saves the selected chat model
  - `saveAIEmbeddingModel(modelId)` saves the selected embedding model
  - `fetchModels()` returns `{ chat: ModelInfo[], embeddings: ModelInfo[] }`
- task-02 creates `SUPPORTED_EMBEDDING_MODELS` and `DEFAULT_CHAT_MODELS` constants in `src/lib/openrouter.ts`

## Files to Modify

- `src/app/settings/page.tsx` — Complete redesign of the AI tab section

## Technical Details

### UI States

**State 1: No API Key configured** (initial state for new users)
- Show a prominent card explaining that AI features require an OpenRouter key
- Show a text input for the API key
- Show a "Validate & Save" button
- All model dropdowns and other settings are disabled/hidden
- Include a link to https://openrouter.ai/keys to get a key

**State 2: Validating key** (loading state)
- Show spinner on the save button
- Disable the input

**State 3: Key configured** (hasKey = true)
- Show a card: "OpenRouter API Key: ****{keyLast4}" with a "Remove" button
- Show embedding model dropdown (from `SUPPORTED_EMBEDDING_MODELS` constant in task-02)
- Show chat model dropdown with a "Load Models" button that calls `fetchModels()`
  - On click, fetches models from OpenRouter, populates dropdown
  - Falls back to `DEFAULT_CHAT_MODELS` if fetch fails
- Show existing toggles (Stream Responses, Include Citations, Desktop Notifications)
- If user changes embedding model, show a warning: "Changing the embedding model requires re-generating embeddings for all notes. Existing embeddings may be incompatible."

**State 4: Validation failed**
- Show error message below the input: "Invalid API key. Please check and try again."
- Keep the input populated so user can correct it

### Implementation

Replace the existing AI tab section in `settings/page.tsx` (currently lines ~407-473). The tab content should:

1. Load AI settings on mount via `getAISettings()`
2. Use local state for: `apiKeyInput`, `isValidating`, `validationError`, `chatModels`, `embeddingsModels`, `isLoadingModels`
3. The API key input should be `type="password"` with a toggle to show/hide
4. Model dropdowns use `<select>` or custom dropdown styled consistently with the app

### Key Components

```tsx
// Pseudo-structure for the AI tab:

{!aiSettings.hasKey ? (
  // No key state: show input form
  <CyberCard>
    <CardHeader>OpenRouter API Key</CardHeader>
    <CardContent>
      <p>Enter your OpenRouter API key to enable AI features...</p>
      <input type="password" value={apiKeyInput} onChange={...} />
      <CyberButton onClick={handleSaveKey} disabled={isValidating}>
        {isValidating ? "Validating..." : "Validate & Save"}
      </CyberButton>
      {validationError && <p className="text-neon-pink">{validationError}</p>}
    </CardContent>
  </CyberCard>
) : (
  // Key configured state: show model selection + toggles
  <>
    <Card>API Key: ****{aiSettings.keyLast4} [Remove]</Card>
    <Card>Embedding Model: <select>...</select></Card>
    <Card>Chat Model: <select>...</select> [Load Models]</Card>
    <Card>Stream Responses toggle</Card>
    <Card>Include Citations toggle</Card>
    <Card>Desktop Notifications toggle</Card>
  </>
)}
```

### Imports needed

```ts
import { getAISettings, saveOpenRouterApiKey, removeOpenRouterApiKey, saveAIModel, saveAIEmbeddingModel, fetchModels } from "@/lib/actions/ai-settings";
import { SUPPORTED_EMBEDDING_MODELS, DEFAULT_CHAT_MODELS } from "@/lib/openrouter";
```

## Acceptance Criteria

- [ ] Without a key, AI tab shows key input form only, no model selection
- [ ] Entering an invalid key shows error message
- [ ] Entering a valid key saves it and shows masked version (****{last4})
- [ ] With a valid key, embedding model dropdown shows supported 1536-dim models
- [ ] With a valid key, chat model dropdown can be populated from OpenRouter API
- [ ] "Remove" button clears the key and returns to no-key state
- [ ] Model selections persist (saved to DB)
- [ ] Warning shown when changing embedding model about re-indexing
