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
- Set strong `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET` (JWT). Defaults: access 15m, refresh 7d.

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

## 4) 계정 생성
- `/register` 페이지에서 이메일/비밀번호로 회원가입 후 자동 로그인된다.
- 기존 기본 사용자 자동 생성 로직은 제거되었으므로 반드시 로그인/회원가입 후 진행한다.

## 5) Smoke test
- 회원가입 → `/record`에서 캡슐 기록 시 201 응답 확인.
- `/timeline`에서 내 캡슐만 조회되는지 확인.
- `/capsule/[id]` 상세 진입(잘못된 id는 404).
