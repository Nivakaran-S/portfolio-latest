# Backend — nivakaran.dev

Node/Express + MongoDB Atlas API with a **Groq-powered RAG chatbot** and CRUD
for the chatbot's knowledge base.

## Stack
- **Express** — HTTP API
- **MongoDB Atlas** + Mongoose — stores knowledge chunks + their vectors
- **Jina AI** (`jina-embeddings-v3`, 1024-d) — hosted embeddings, free tier
- **Groq** (`groq-sdk`) — fast LLM inference for answer generation

## Setup
```bash
cd backend
npm install
cp .env.example .env      # then fill in MONGODB_URI and GROQ_API_KEY
npm run seed              # embeds + loads the knowledge base into MongoDB
npm run dev               # http://localhost:4000
```

- **MONGODB_URI** — from MongoDB Atlas (free tier is fine): create a cluster →
  Database → Connect → Drivers → copy the `mongodb+srv://...` string.
- **GROQ_API_KEY** — free at https://console.groq.com/keys (LLM generation).
- **JINA_API_KEY** — free at https://jina.ai (embeddings, ~1M tokens free).
- Without `GROQ_API_KEY` the chatbot still answers, but with the top retrieved
  snippet instead of a generated reply.

## API
| Method | Route                | Purpose                          |
| ------ | -------------------- | -------------------------------- |
| GET    | `/api/health`        | status + whether AI is enabled   |
| POST   | `/api/chat`          | `{ message, history? }` → answer |
| GET    | `/api/documents`     | list knowledge chunks            |
| GET    | `/api/documents/:id` | one chunk                        |
| POST   | `/api/documents`     | create (auto-embeds)             |
| PUT    | `/api/documents/:id` | update (re-embeds)               |
| DELETE | `/api/documents/:id` | delete                           |

## How the RAG works
1. Each knowledge chunk is embedded (1024-d via Jina) and stored in MongoDB.
2. A chat query is embedded, scored by cosine similarity against all chunks,
   and the top 4 become the context.
3. Groq generates a grounded answer from that context only.

For larger corpora, swap the in-process cosine scan in `services/rag.js` for
**MongoDB Atlas Vector Search** (`$vectorSearch`) — the chunks already carry an
`embedding` field.

## Deploy (Render — free tier)
This repo ships with a [`render.yaml`](./render.yaml) blueprint. From Render →
**New → Blueprint** → connect the GitHub repo and it picks the backend service
up automatically. Then in the Render dashboard, fill in the env vars:
`MONGODB_URI`, `GROQ_API_KEY`, `JINA_API_KEY`, `ADMIN_TOKEN`, `CORS_ORIGIN`
(the rest are pre-filled). After the first deploy, open the Render Shell and
run `npm run seed` once to load the knowledge base.

Render free tier: 512 MB RAM (plenty — no local model), spins down after
15 min of idle (~5–10 s Node cold-start on the first chat after that).
Upgrade to Starter ($7/mo) for no spin-down.

## Security
All `/api/documents` routes (read + write) require an **`x-admin-token`** header
matching `ADMIN_TOKEN`. If `ADMIN_TOKEN` is unset, the routes fail closed (503).
The frontend `/admin` page sends this token. `/api/chat` stays public.
