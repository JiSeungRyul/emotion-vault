# Quickstart: Emotion Capsule Journal

## Prerequisites
- Node.js 20.x
- Docker (for Postgres via docker-compose)
- pnpm/npm (project uses npm lockfile)

## 1) Environment
```bash
cp .env.example .env
```
- Set a strong `POSTGRES_PASSWORD`.
- If running locally (no Docker), change `DATABASE_URL` host to `localhost`.

## 2) Database
```bash
# Start Postgres
docker-compose up -d db

# Apply schema
npm install
npm run prisma:migrate
```

## 3) Dev server
```bash
npm run dev
# http://localhost:3000
```

## 4) Seeding / default user
- The create API will auto-create a default user (`default@emotionvault.local`) on first use.
- If you prefer a manual seed, create a user via Prisma Studio:
```bash
npm run prisma:studio
# Create a user record, then close the studio before running dev
```

## 5) Smoke test
- Record a capsule at `/record`.
- Confirm it appears on `/timeline`.
- Open a card to reach `/capsule/[id]` detail (404 if id is invalid).
