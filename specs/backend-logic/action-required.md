# Action Required: Backend Logic Implementation

Manual steps that must be completed by a human. These cannot be automated.

## Before Implementation

- [ ] **Start PostgreSQL** — Run `docker-compose up -d` to start the PostgreSQL 18 with pgvector container. Verify with `docker-compose ps`.
- [ ] **Set POSTGRES_URL** — Add to .env: `POSTGRES_URL=postgres://dev_user:dev_password@localhost:5432/postgres_dev`
- [ ] **Set BETTER_AUTH_SECRET** — Generate a 32+ character secret and add to .env: `BETTER_AUTH_SECRET=your-secret-here`
- [ ] **Set OPENROUTER_API_KEY** — Get from https://openrouter.ai/keys and add to .env. Used for AI chat responses.
- [ ] **Set OPENAI_API_KEY** — Get from https://platform.openai.com/api-keys and add to .env. Required for text-embedding-3-large embeddings (OpenRouter does not support embedding endpoints).
- [ ] **Set RESEND_API_KEY** — Get from https://resend.com/api-keys and add to .env. Used for transactional emails (password reset, email verification).
- [ ] **Run existing migrations** — Run `pnpm run db:migrate` to apply the 2 existing Better Auth migrations.

## During Implementation

- [ ] **Verify pgvector extension** — After new schema migration, connect to PostgreSQL and run `CREATE EXTENSION IF NOT EXISTS vector;` if not already enabled. The pgvector Docker image should have it pre-installed.
- [ ] **Verify Graphify CLI** — Run `graphify --version` to confirm Graphify is installed and available. If not, install it.

## After Implementation

- [ ] **Create initial user** — Register a new account via /register to create your personal user.
- [ ] **Create sample notes** — Create 5-10 notes with different tags to test the knowledge graph and AI query features.
- [ ] **Run Graphify** — Execute `graphify update .` from the project root to generate the initial knowledge graph from your notes.
- [ ] **Test email delivery** — Trigger a password reset to verify Resend is sending emails correctly.
- [ ] **Test AI query** — Ask a semantic question about your notes and verify citations link to real notes.

---

> These tasks are also referenced in context within the relevant task files.
