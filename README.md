# Agentic Coding Boilerplate

Un boilerplate completo per agentic coding con autenticazione, database PostgreSQL, funzionalità di chat AI e componenti UI moderni - perfetto per costruire applicazioni basate sull'intelligenza artificiale e agenti autonomi.

## 🚀 Funzionalità

- **🔐 Autenticazione**: Better Auth con integrazione Google OAuth
- **🗃️ Database**: Drizzle ORM con PostgreSQL
- **🤖 Integrazione AI**: Vercel AI SDK con OpenRouter (accesso a oltre 100 modelli AI)
- **📁 Archiviazione File**: Storage automatico locale/Vercel Blob con cambio trasparente
- **🎨 Componenti UI**: shadcn/ui con Tailwind CSS
- **⚡ Stack Moderno**: Next.js 16, React 19, TypeScript
- **📱 Responsivo**: Approccio mobile-first

## 🖼️ Il Tool Ufficiale

Il tool ufficiale della Agentic Coding Masterclass.

![Agentic Coding Boilerplate](./Home_Page_Image.jpg)

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato sul tuo computer:

- **Node.js**: Versione 18.0 o superiore (<a href="https://nodejs.org/" target="_blank">Scarica qui</a>)
- **Git**: Per clonare il repository (<a href="https://git-scm.com/" target="_blank">Scarica qui</a>)
- **PostgreSQL**: Installato localmente o accedi a un servizio hostato come Vercel Postgres

## 🛠️ Installazione Rapida

Inizia con un singolo comando usando [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit rosariomoscato/agentic-coding-boilerplate my-app
cd my-app
```

Questo creerà una copia pulita del boilerplate nella cartella `my-app`.

> **Nota:** Se stai reinstallando il boilerplate in una directory esistente, usa il flag `--force`:
> ```bash
> npx degit rosariomoscato/agentic-coding-boilerplate my-app --force
> ```

### Passaggi Post-Installazione

Dopo aver scaricato il boilerplate, segui questi passaggi:

**1. Configura le variabili d'ambiente**

```bash
cp env.example .env
```

Compila le variabili d'ambiente nel file `.env`:

```env
# Database
POSTGRES_URL="postgresql://username:password@localhost:5432/nome_database"

# Autenticazione - Better Auth
BETTER_AUTH_SECRET="la-tua-chiave-segreta-random-di-32-caratteri-qui"

# Google OAuth (Ottienilo dalla Google Cloud Console)
GOOGLE_CLIENT_ID="il-tuo-google-client-id"
GOOGLE_CLIENT_SECRET="il-tuo-google-client-secret"

# Integrazione AI via OpenRouter (Opzionale - per funzionalità chat)
# Ottieni la tua chiave API da: https://openrouter.ai/settings/keys
# Visualizza i modelli disponibili su: https://openrouter.ai/models
OPENROUTER_API_KEY="sk-or-v1-la-tua-chiave-openrouter-api-qui"
OPENROUTER_MODEL="openai/gpt-5-mini"

# URL App (per deployment in produzione)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Archiviazione File (Opzionale - per funzionalità caricamento file)
# Lascia vuoto per utilizzare lo storage locale (public/uploads/) in sviluppo
# Imposta per abilitare Vercel Blob storage in produzione
BLOB_READ_WRITE_TOKEN=""
```

**2. Installa le dipendenze**

```bash
npm install
```

**3. Avvia il database**

```bash
docker compose up -d
```

**4. Esegui le migrazioni del database**

```bash
npm run db:migrate
```

**5. Avvia il server di sviluppo**

```bash
npm run dev
```

La tua applicazione sarà disponibile su [http://localhost:3000](http://localhost:3000)

## ⚙️ Configurazione Servizi

### Database PostgreSQL su Vercel

1. Vai alla <a href="https://vercel.com/dashboard" target="_blank">Vercel Dashboard</a>
2. Naviga nella scheda **Storage**
3. Clicca **Create** → **Postgres**
4. Scegli il nome del database e la regione
5. Copia la `POSTGRES_URL` dalla scheda `.env.local`
6. Aggiungila al tuo file `.env`

### Credenziali Google OAuth

1. Vai alla <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a>
2. Crea un nuovo progetto o selezionane uno esistente
3. Naviga in **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Imposta il tipo di applicazione su **Web application**
5. Aggiungi gli URI di reindirizzamento autorizzati:
   - `http://localhost:3000/api/auth/callback/google` (sviluppo)
   - `https://tuodominio.com/api/auth/callback/google` (produzione)
6. Copia il **Client ID** e il **Client Secret** nel tuo file `.env`

### Chiave API OpenRouter

1. Vai su <a href="https://openrouter.ai/" target="_blank">OpenRouter</a>
2. Registrati o accedi al tuo account
3. Naviga in **Settings** → **Keys** o visita <a href="https://openrouter.ai/settings/keys" target="_blank">Impostazioni Keys</a>
4. Clicca **Create Key** e assegna un nome
5. Copia la chiave API e aggiungila al tuo file `.env` come `OPENROUTER_API_KEY`
6. Sfoglia i modelli disponibili su <a href="https://openrouter.ai/models" target="_blank">Modelli OpenRouter</a>

### Configurazione Archiviazione File

Il progetto include un'astrazione di archiviazione flessibile che commuta automaticamente tra archiviazione filesystem locale (sviluppo) e Vercel Blob storage (produzione).

**Per lo Sviluppo (Archiviazione Locale):**
- Lascia `BLOB_READ_WRITE_TOKEN` vuoto o non impostato nel file `.env`
- I file vengono automaticamente salvati in `public/uploads/`
- I file sono serviti al percorso URL `/uploads/`
- Nessun servizio esterno o configurazione necessaria

**Per la Produzione (Vercel Blob):**
1. Vai alla <a href="https://vercel.com/dashboard" target="_blank">Vercel Dashboard</a>
2. Naviga nel tuo progetto → scheda **Storage**
3. Clicca **Create** → **Blob**
4. Copia il `BLOB_READ_WRITE_TOKEN` dall'integrazione
5. Aggiungilo alle tue variabili d'ambiente di produzione

Il servizio di archiviazione rileva automaticamente quale backend utilizzare in base alla presenza della variabile d'ambiente `BLOB_READ_WRITE_TOKEN`.

## 🗂️ Struttura del Progetto

```
src/
├── app/                    # Directory app Next.js
│   ├── api/               # Route API
│   │   ├── auth/          # Endpoint autenticazione
│   │   └── chat/          # Endpoint chat AI
│   ├── chat/              # Pagina chat AI
│   ├── dashboard/         # Dashboard utente
│   └── page.tsx           # Home page
├── components/            # Componenti React
│   ├── auth/             # Componenti autenticazione
│   └── ui/               # Componenti shadcn/ui
└── lib/                  # Utilità e configurazioni
    ├── auth.ts           # Configurazione Better Auth
    ├── auth-client.ts    # Utilità auth lato client
    ├── db.ts             # Connessione database
    ├── schema.ts         # Schema database
    ├── storage.ts        # Astrazione archiviazione file
    └── utils.ts          # Utilità generiche
```

## 🔧 Script Disponibili

```bash
npm run dev          # Avvia server di sviluppo con Turbopack
npm run build        # Build per produzione
npm run start        # Avvia server di produzione
npm run lint         # Esegui ESLint
npm run typecheck    # Esegui controllo tipi TypeScript
npm run check        # Esegui lint e typecheck
npm run format       # Formatta il codice con Prettier
npm run format:check # Verifica formattazione codice
npm run db:generate  # Genera migrazioni database
npm run db:migrate   # Esegui migrazioni database
npm run db:push      # Invia modifiche schema al database
npm run db:studio    # Apri Drizzle Studio (GUI database)
npm run db:dev       # Invia schema per sviluppo
npm run db:reset     # Reset database (elimina tutte le tabelle)
```

## 📖 Panoramica Pagine

- **Home (`/`)**: Landing page con istruzioni di setup e panoramica delle funzionalità
- **Dashboard (`/dashboard`)**: Dashboard utente protetta con informazioni profilo
- **Chat (`/chat`)**: Interfaccia chat potenziata dall'AI tramite OpenRouter (richiede autenticazione)

## 🚀 Deployment

### Deploy su Vercel (Consigliato)

1. Installa la Vercel CLI globalmente:

   ```bash
   npm install -g vercel
   ```

2. Esegui il deploy della tua applicazione:

   ```bash
   vercel --prod
   ```

3. Segui le istruzioni per configurare il tuo deployment
4. Aggiungi le tue variabili d'ambiente quando richiesto o tramite la dashboard Vercel

### Variabili d'Ambiente di Produzione

Assicurati che queste siano impostate nel tuo ambiente di produzione:

- `POSTGRES_URL` - Stringa di connessione PostgreSQL di produzione
- `BETTER_AUTH_SECRET` - Stringa sicura random di almeno 32 caratteri
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `OPENROUTER_API_KEY` - Chiave API OpenRouter (opzionale, per funzionalità chat AI)
- `OPENROUTER_MODEL` - Nome modello da OpenRouter (opzionale, default: openai/gpt-5-mini)
- `NEXT_PUBLIC_APP_URL` - Il tuo dominio di produzione
- `BLOB_READ_WRITE_TOKEN` - Token Vercel Blob (opzionale, usa storage locale se non impostato)

## 🤖 Comandi Claude Code

Questo progetto include comandi slash personalizzati per [Claude Code](https://claude.ai/code) che semplificano lo sviluppo di funzionalità con integrazione GitHub.

### Comandi Disponibili

| Comando | Descrizione |
|---------|-------------|
| `/create-feature` | Crea una nuova specifica di funzionalità con requisiti e piano di implementazione |
| `/publish-to-github` | Pubblica una funzionalità su GitHub Issues e Projects |
| `/continue-feature` | Continua l'implementazione del prossimo task per una funzionalità pubblicata su GitHub |
| `/checkpoint` | Crea un commit di checkpoint completo con tutte le modifiche |

### Prerequisiti

Prima di utilizzare i comandi con integrazione GitHub:

1. **GitHub CLI**: Installa e autentica la GitHub CLI
   ```bash
   # Installa (se necessario)
   brew install gh  # macOS
   # oppure vedi https://cli.github.com/

   # Autenticati
   gh auth login

   # Aggiungi gli scope del progetto (richiesto per /publish-to-github)
   gh auth refresh -s project,read:project
   ```

2. **Claude Code**: Installa la CLI di Claude Code da [claude.ai/code](https://claude.ai/code)

### Workflow Tipico

#### 1. Pianifica la Tua Funzionalità

Inizia una conversazione con Claude Code e descrivi la funzionalità che vuoi costruire:

```
Tu: Voglio aggiungere una pagina preferenze utente dove gli utenti possono aggiornare
    il nome visualizzato, le notifiche email e le preferenze del tema.
```

#### 2. Crea la Specifica della Funzionalità

Una volta discussi i requisiti, esegui:

```
/create-feature
```

Questo crea una cartella spec in `specs/{nome-funzionalita}/` contenente:
- `requirements.md` - Cosa fa la funzionalità e criteri di accettazione
- `implementation-plan.md` - Task fasi con checkbox

#### 3. Pubblica su GitHub

Pubblica la funzionalità su GitHub per tracciamento:

```
/publish-to-github
```

Questo crea:
- Una **Epic issue** con i requisiti completi
- **Task issues** per ogni step di implementazione
- Un **GitHub Project** per tracciare i progressi
- **Labels** per l'organizzazione
- Un file `github.md` con tutti i riferimenti

#### 4. Implementa i Task

Inizia a implementare i task uno alla volta:

```
/continue-feature
```

Questo comando:
1. Trova il prossimo task sbloccato (rispettando le dipendenze)
2. Aggiorna lo stato del GitHub Project a "In Progress"
3. Implementa il task seguendo le convenzioni del progetto
4. Esegue lint e typecheck
5. Effettua il commit con `closes #{numero-issue}`
6. Aggiorna l'issue con i dettagli di implementazione
7. Sposta il task a "Done" sulla bacheca del Project

Ripeti `/continue-feature` per ogni task, o lascia che Claude continui automaticamente.

#### 5. Crea Checkpoint

In qualsiasi momento, crea un commit di checkpoint dettagliato:

```
/checkpoint
```

Questo stages tutte le modifiche e crea un commit ben formattato con:
- Riepilogo chiaro
- Descrizione dettagliata delle modifiche
- Attribuzione co-autore

### Esempio di Sessione

```bash
# Avvia Claude Code nel tuo progetto
claude

# Discuti i requisiti della funzionalità
Tu: Ho bisogno di aggiungere rate limiting API per proteggere i nostri endpoint...

# Claude aiuta a pianificare, poi esegui:
/create-feature

# Revisiona la specifica, poi pubblica:
/publish-to-github

# Implementa task per task:
/continue-feature
# ... Claude implementa, committa, aggiorna GitHub ...

/continue-feature
# ... prossimo task ...

# Una volta terminato, pusha su GitHub:
git push
```

### Senza Integrazione GitHub

Se preferisci non utilizzare GitHub, puoi comunque usare `/create-feature` per creare le specifiche, poi lavorare manualmente tramite i checkbox del file `implementation-plan.md`. Il comando `/continue-feature` supporta anche la modalità offline, tracciando i progressi direttamente nel file markdown.

### Posizione File dei Comandi

I comandi sono definiti in `.claude/commands/`:
```
.claude/commands/
├── checkpoint.md
├── continue-feature.md
├── create-feature.md
└── publish-to-github.md
```

Puoi personalizzare questi comandi o aggiungerne di nuovi seguendo la [documentazione Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## 🤝 Contribuire

1. Fai un fork di questo repository
2. Crea un branch per la funzionalità (`git checkout -b feature/funzionalita-fantastica`)
3. Effettua il commit delle modifiche (`git commit -m 'Aggiungi funzionalità fantastica'`)
4. Pusha sul branch (`git push origin feature/funzionalita-fantastica`)
5. Apri una Pull Request

## 📝 Licenza

Questo progetto è concesso in licenza sotto la MIT License - vedi il file [LICENSE](LICENSE) per i dettagli.

## 🆘 Serve Aiuto?

Se riscontri problemi:

1. Consulta la sezione [Issues](https://github.com/rosariomoscato/agentic-coding-boilerplate/issues)
2. Rileggi la documentazione sopra
3. Crea una nuova issue con informazioni dettagliate sul tuo problema

---

**Buon coding! 🚀**
