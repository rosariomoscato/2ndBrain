# Task 05: Wire Backend to Use Per-User API Key

## Status

complete

## Wave

4

## Description

Replace all hardcoded `process.env.OPENROUTER_API_KEY` references in the backend with per-user decrypted API keys. This wires the full pipeline so that each user's AI requests use their own OpenRouter key and selected models. The global env var remains as a fallback for cases where per-user key is not available.

## Dependencies

**Depends on:** task-01-encryption-utility.md, task-03-ai-settings-actions.md, task-04-settings-ai-tab-ui.md
**Blocks:** None

**Context from dependencies:**
- task-01 creates `src/lib/crypto.ts` with `encrypt()` and `decrypt()` for AES-256-GCM
- task-03 creates `src/lib/actions/ai-settings.ts` with:
  - `getUserOpenRouterKey(): Promise<string | null>` — decrypts and returns the user's API key (server-only)
  - `getAISettings()` — returns user's model preferences
  - These functions require authentication (session)
- task-04 creates the UI that lets users configure their key and models

## Files to Modify

- `src/lib/actions/ai-query.ts` — Replace env var with per-user key + model
- `src/app/api/ai-query/route.ts` — Replace env var with per-user key + model
- `src/app/api/chat/route.ts` — Replace env var with per-user key + model
- `src/lib/embeddings.ts` — Accept apiKey as parameter instead of using env var

## Technical Details

### Pattern for resolving the API key

Create a shared helper function in `src/lib/actions/ai-settings.ts` (add to the file created by task-03):

```ts
export async function resolveOpenRouterConfig(): Promise<{ apiKey: string; model: string } | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;

    const apiKey = await getUserOpenRouterKey(session.user.id);
    if (apiKey) {
      const settings = await getAISettings();
      return {
        apiKey,
        model: settings.model ?? "openai/gpt-4o-mini",
      };
    }
  } catch {}

  // Fallback to env var
  const envKey = process.env.OPENROUTER_API_KEY;
  if (envKey) {
    return { apiKey: envKey, model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini" };
  }

  return null;
}
```

**Important**: `getUserOpenRouterKey` in task-03 takes no args (reads session internally). If needed for this pattern, add an overload that accepts a userId directly, or call `resolveOpenRouterConfig` which handles session internally.

### Changes to `src/lib/actions/ai-query.ts`

In the `queryWithRAG` function:
- Replace lines 80-85:
  ```ts
  // OLD:
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key not configured");
  }
  const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-5-mini";

  // NEW:
  const config = await resolveOpenRouterConfig();
  if (!config) throw new Error("OpenRouter API key not configured. Go to Settings > AI to add your key.");
  const openrouter = createOpenRouter({ apiKey: config.apiKey });
  const model = config.model;
  ```

### Changes to `src/app/api/ai-query/route.ts`

Same pattern as above (lines 110-120):
- Replace `const apiKey = process.env.OPENROUTER_API_KEY` with `resolveOpenRouterConfig()` call
- Add `import { resolveOpenRouterConfig } from "@/lib/actions/ai-settings"`
- Note: This route already has the session, so `resolveOpenRouterConfig` can reuse it

### Changes to `src/app/api/chat/route.ts`

Same pattern (lines 68-74):
- Replace `const apiKey = process.env.OPENROUTER_API_KEY` with `resolveOpenRouterConfig()`

### Changes to `src/lib/embeddings.ts`

The embedding functions currently use `process.env.OPENROUTER_API_KEY` directly in fetch calls. Modify to accept an optional `apiKey` parameter:

- `generateEmbeddings(noteId, content, userId)` → add `userId` param if not already present (it's called from server actions that have the session)
- `getQueryEmbedding(query)` → needs to accept the API key since it's called from routes that have the session context

The cleanest approach:
1. Create a helper `getEmbeddingApiKey(userId?: string): Promise<string | null>` in embeddings.ts that:
   - If userId is provided, tries to decrypt user's key via `getUserOpenRouterKey(userId)`
   - Falls back to `process.env.OPENROUTER_API_KEY`
2. Use this helper in both `generateEmbeddings` and `getQueryEmbedding`
3. Update callers in `notes.ts` and `route.ts` to pass the userId

### Also update the embedding model to be per-user

In `embeddings.ts`, the `EMBEDDING_MODEL` is hardcoded to `"openai/text-embedding-3-small"`. Add a similar pattern:
- Create `getEmbeddingModel(userId?: string): Promise<string>` that reads from user settings, falls back to the constant
- Use it in the fetch call

### Error messages

When no key is available, all AI endpoints should return a clear, user-friendly error:
- For API routes: `{ error: "OpenRouter API key not configured. Go to Settings > AI to add your key." }` with status 403
- For server actions: `throw new Error("OpenRouter API key not configured. Go to Settings > AI to add your key.")`

## Acceptance Criteria

- [ ] `process.env.OPENROUTER_API_KEY` is no longer the primary source in any AI file
- [ ] Per-user encrypted key is decrypted and used when available
- [ ] Global env var `OPENROUTER_API_KEY` is used as fallback
- [ ] When neither per-user key nor env var exists, a clear error message directs user to Settings > AI
- [ ] User's selected chat model is used instead of hardcoded default
- [ ] User's selected embedding model is used instead of hardcoded default
- [ ] All 4 files modified compile without TypeScript errors
