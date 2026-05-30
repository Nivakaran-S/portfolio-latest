# Backend — nivakaran.dev

Node/Express + MongoDB Atlas API with a **Groq-powered RAG chatbot** and CRUD
for the chatbot's knowledge base.

## Stack
- **Express** — HTTP API
- **MongoDB Atlas** + Mongoose — stores knowledge chunks + their vectors
- **Transformers.js** (`all-MiniLM-L6-v2`) — local embeddings, no API key
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
- **GROQ_API_KEY** — free at https://console.groq.com/keys
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
1. Each knowledge chunk is embedded (384-d) and stored in MongoDB.
2. A chat query is embedded, scored by cosine similarity against all chunks,
   and the top 4 become the context.
3. Groq generates a grounded answer from that context only.

For larger corpora, swap the in-process cosine scan in `services/rag.js` for
**MongoDB Atlas Vector Search** (`$vectorSearch`) — the chunks already carry an
`embedding` field.

## Deploy
Host on Render / Railway / Fly (it's an always-on Node service).
- Set the env vars there.
- Run `npm run seed` once after first deploy.
- Set `CORS_ORIGIN` to your frontend URL (e.g. `https://nivakaran.dev`).
- Transformers.js needs ~300–400 MB RAM; pick a plan accordingly, or switch to
  a hosted embedding API in `services/embeddings.js`.

## Security
All `/api/documents` routes (read + write) require an **`x-admin-token`** header
matching `ADMIN_TOKEN`. If `ADMIN_TOKEN` is unset, the routes fail closed (503).
The frontend `/admin` page sends this token. `/api/chat` stays public.
