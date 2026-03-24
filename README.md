# LavorAssieme

Piattaforma italiana per connettere candidati e aziende. Semplice, veloce, gratuita.

## Stack

- **Next.js** (App Router)
- **Supabase** (auth + database + storage)
- **Tailwind CSS v4**
- **TypeScript**

## Setup

### 1. Configura le variabili d'ambiente

Copia `.env.local.example` in `.env.local` e inserisci le credenziali Supabase:

```bash
cp .env.local.example .env.local
```

### 2. Crea il database Supabase

Apri l'editor SQL di Supabase ed esegui il contenuto di `supabase-schema.sql`.

Oppure manualmente:
- Crea le tabelle `profiles`, `candidati`, `aziende`
- Abilita RLS su tutte le tabelle
- Crea il bucket `cvs` (pubblico) in Supabase Storage

### 3. Installa le dipendenze

```bash
npm install
```

### 4. Avvia in sviluppo

```bash
npm run dev
```

## Struttura pagine

| Pagina | Descrizione |
|--------|-------------|
| `/` | Landing page |
| `/registrati` | Registrazione (candidato o azienda) |
| `/login` | Accesso |
| `/candidato/dashboard` | Dashboard candidato (upload CV, modifica profilo) |
| `/candidato/[id]` | Profilo pubblico candidato |
| `/azienda/dashboard` | Dashboard azienda (ricerca candidati) |

## Funzionalità

**Candidati:**
- Registrazione con dati personali e ruolo cercato
- Upload CV (PDF, max 5MB) su Supabase Storage
- Profilo pubblico con link diretto al CV

**Aziende:**
- Registrazione con nome, settore e città
- Ricerca candidati per ruolo e/o città
- Visualizzazione profili e download CV
