# Action Required: OpenRouter Per-User API Key & Model Selection

Manual steps that must be completed by a human. These cannot be automated.

## Before Implementation

- [ ] **Generate an ENCRYPTION_KEY** — Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` to generate a 64-char hex string. Add it as `ENCRYPTION_KEY` in `.env`. This key is used to AES-encrypt user API keys before storing them in the database. If lost, all stored API keys become unrecoverable.

## After Implementation

- [ ] **Run drizzle generate and migrate** — After the schema change in task-01, run `npx drizzle-kit generate` and `npx drizzle-kit migrate` to apply the new `ENCRYPTION_KEY` env var validation.
- [ ] **Test with a real OpenRouter key** — Go to Settings > AI, enter your OpenRouter key, verify validation works, select models, then test AI chat and RAG query.
