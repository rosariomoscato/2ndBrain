# SecondBrain

Un'applicazione per la gestione della conoscenza personale (PKM) con knowledge graph, ricerca semantica AI e editor markdown. Costruita con stack moderno e estetica cyberpunk.

![SecondBrain Dashboard](./dashboard-screenshot.png)

## Funzionalità

- **Note Markdown** — Crea, modifica e organizza note con editor markdown e preview live
- **Knowledge Graph** — Visualizzazione interattiva delle connessioni tra note (tag-based e semantiche)
- **Ricerca AI (RAG)** — Interroga le tue note in linguaggio naturale con retrieval-augmented generation
- **Ricerca Semantica** — Embeddings vettoriali con pgvector per trovare note simili
- **Autenticazione** — Better Auth con email/password, verifica email e reset password
- **Multi-utente** — Ogni utente vede solo le proprie note e il proprio graph

## Stack Tecnico

| Layer | Tecnologia |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| Database | PostgreSQL + pgvector |
| ORM | Drizzle ORM |
| Auth | Better Auth |
| AI | OpenRouter (GPT-5-mini, text-embedding-3-small) |
| Email | Resend |
| UI | Tailwind CSS, ReactFlow |

## Installazione

### Prerequisiti

- Node.js 18+
- Docker (per PostgreSQL)
- Chiave API [OpenRouter](https://openrouter.ai/)

### Setup

```bash
# Clona il repo
git clone https://github.com/rosariomoscato/2ndBrain.git
cd 2ndBrain

# Installa dipendenze
npm install

# Configura environment
cp .env.example .env
# Modifica .env con le tue chiavi

# Avvia PostgreSQL
docker compose up -d

# Esegui migrazioni
npm run db:migrate

# Avvia il server
npm run dev
```

### Variabili d'ambiente (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
BETTER_AUTH_SECRET="chiave-segreta-random-32-caratteri"
BETTER_AUTH_URL="http://localhost:3000"
OPENROUTER_API_KEY="sk-or-v1-..."
OPENROUTER_MODEL="openai/gpt-5-mini"
RESEND_API_KEY="re_..."
```

## Script Utili

```bash
npm run dev          # Server di sviluppo
npm run build        # Build produzione
npm run db:generate  # Genera migrazioni da schema changes
npm run db:migrate   # Applica migrazioni
npm run db:studio    # GUI database (Drizzle Studio)
```

## Struttura

```
src/
├── app/                # Next.js App Router
│   ├── ai/            # Pagina AI Query
│   ├── graph/         # Knowledge Graph
│   ├── notes/         # Lista e editor note
│   ├── settings/      # Impostazioni
│   └── api/           # API routes
├── components/        # Componenti React
│   ├── graph/         # ReactFlow graph components
│   ├── layout/        # Header, Sidebar
│   ├── notes/         # Note editor
│   └── ui/            # Componenti UI base
└── lib/               # Business logic
    ├── actions/       # Server actions
    ├── auth.ts        # Better Auth config
    ├── db.ts          # Database connection
    ├── schema.ts      # Drizzle schema
    └── embeddings.ts  # Embedding & vector search
```

## Licenza

Questo progetto è distribuito sotto la [GNU GPLv3](./LICENSE). Puoi studiare, usare e modificare il codice, ma le opere derivate devono mantenere la stessa licenza e includere l'attribuzione.

---

Di [Rosario Moscato](mailto:ros.moscato@gmail.com)
