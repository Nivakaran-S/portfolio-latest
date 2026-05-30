# nivakaran.dev

Monorepo for Nivakaran S.'s portfolio.

```
.
├── frontend/   Next.js 16 portfolio (cinematic, motion-driven)
└── backend/    Node/Express + MongoDB Atlas + Groq RAG chatbot
```

## Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```
Optional env (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:4000   # backend origin for the chatbot
```
If unset, the chat widget shows a "coming soon" state instead of erroring.

## Backend (chatbot API)
```bash
cd backend
npm install
cp .env.example .env   # set MONGODB_URI + GROQ_API_KEY
npm run seed           # load + embed the knowledge base
npm run dev            # http://localhost:4000
```
See [backend/README.md](backend/README.md) for the full API and RAG details.

## Deploy
- **Frontend** → Vercel. Set the project **Root Directory** to `frontend`.
  Add `NEXT_PUBLIC_API_URL` (the deployed backend URL).
- **Backend** → Render / Railway / Fly (always-on Node service). Set
  `MONGODB_URI`, `GROQ_API_KEY`, and `CORS_ORIGIN` (the frontend URL); run
  `npm run seed` once after first deploy.
