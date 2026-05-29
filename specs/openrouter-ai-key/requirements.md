# Requirements: OpenRouter Per-User API Key & Model Selection

## Summary

Each user must be able to input their own OpenRouter API key in Settings > AI. Without a valid key, all AI features (chat, RAG queries, embeddings) are disabled with a clear message. The key is validated against the OpenRouter API, then AES-encrypted and stored per-user in the `user_settings` DB table. Once validated, the user selects an embedding model (1536-dim only) and an LLM chat model. All backend AI code reads the user's decrypted key instead of the global `OPENROUTER_API_KEY` env var.

## Goals

- Per-user OpenRouter API key stored encrypted (AES-256) in the database
- Key validation via OpenRouter `/api/v1/models` endpoint
- Without a valid key, AI features show a clear "API key not configured" message
- User selects embedding model from a fixed list of 1536-dim models
- User selects LLM model from OpenRouter's available models
- All 4 AI backend consumers (`ai-query.ts`, `api/ai-query/route.ts`, `api/chat/route.ts`, `embeddings.ts`) use the per-user key
- The global `OPENROUTER_API_KEY` env var remains as fallback

## Non-Goals

- Migrating existing embeddings when embedding model changes (future task)
- Rate limiting or quota management
- Key rotation or expiration handling
- Multi-provider support (only OpenRouter)

## Acceptance Criteria

- [ ] User can input an OpenRouter API key in Settings > AI
- [ ] Key is validated (light API call to OpenRouter); invalid keys are rejected with error message
- [ ] Valid keys are AES-encrypted before storage in DB
- [ ] Once key is set, user can choose embedding model from dropdown (1536-dim only)
- [ ] Once key is set, user can choose LLM model from dropdown (fetched from OpenRouter)
- [ ] AI features fail gracefully when no key is configured (no crash, clear message)
- [ ] All AI backend code uses per-user decrypted key; env var is fallback only
- [ ] Settings page masks the key (shows only last 4 chars)

## Assumptions

- A single `ENCRYPTION_KEY` env var (32-byte hex) is used for all AES encryption
- OpenRouter's embedding API uses the same key as their chat API
- The embedding dimension (1536) is fixed; changing it requires re-generating all embeddings (not in scope)

## Technical Constraints

- Encryption: AES-256-GCM via Node.js `crypto` module
- The encrypted key is stored as a JSON string `{ iv, ciphertext, tag }` in the `user_settings.ai` JSONB column under field `openrouterApiKey`
- The `ENCRYPTION_KEY` env var must be 64 hex characters (32 bytes)
- Existing `user_settings.ai` column is a JSONB blob; new fields are added to the same object
- Drizzle ORM is used for all DB operations; schema changes require `drizzle generate` + `drizzle migrate`
