# Repository Guidelines

## Project Structure & Module Organization
- Next.js App Router lives in `app/`; pages include `app/page.tsx`, `app/record`, `app/timeline`, and `app/capsule/[id]` for detail views.
- API routes sit under `app/api/emotions` (collection and item handlers).
- Shared UI sits in `components/ui`; cross-cutting helpers in `lib/` (`types.ts`, `utils.ts`, `prisma.ts`, `date-utils.ts`).
- Data model and migrations are in `prisma/`; static assets live in `public/`.
- Root configs: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.js`, `Dockerfile`, and `docker-compose.yml`.

## Build, Test, and Development Commands
- `npm install` - install dependencies.
- `npm run dev` - start the Next dev server on :3000 using your local `DATABASE_URL`.
- `npm run build` - run `prisma generate` then build for production.
- `npm run start` - serve the production build.
- `npm run lint` - Next/ESLint checks.
- `npm run prisma:migrate` - apply migrations in development; `npm run prisma:push` for schema sync without migrations; `npm run prisma:studio` to inspect data.
- `docker-compose up -d` - spin up the app and Postgres stack; `docker-compose down` to stop.

## Coding Style & Naming Conventions
- TypeScript-first, functional React components; prefer server components unless hooks or state demand a client component.
- Two-space indentation; keep imports ordered (framework, third-party, local).
- File names: kebab-case for routes and folders, PascalCase for React components.
- Tailwind classes: group by layout -> spacing -> color for readability; reuse shared variants and components from `components/ui`.
- Define shared types in `lib/types.ts`; avoid duplicating enums used by Prisma.

## Testing Guidelines
- Automated tests are not yet configured; when adding, colocate per feature (for example, `app/record/__tests__/record-page.test.tsx`).
- Favor integration coverage that exercises API routes with a disposable test database; seed fixtures instead of reusing production data.
- Name tests by behavior, keep them deterministic, and ensure `npm run lint` and `npm run build` stay green.

## Commit & Pull Request Guidelines
- History currently only shows the init commit; use concise, present-tense subjects (for example, "Add emotion timeline filtering").
- Reference issues in bodies ("Fixes #123"); call out migrations and data impacts explicitly.
- PRs should include what and why, a local testing summary, screenshots or GIFs for UI changes, and rollout or backout notes when touching data.

## Security & Configuration
- Do not commit `.env`; start from `.env.example` and use strong Postgres credentials.
- Prisma commands honor `DATABASE_URL`; confirm the target before running migrations or `db push`.
- With Docker, `docker-compose --profile dev up -d` adds pgAdmin; use `docker-compose down -v` only when you intend to drop volumes or data.

## Agent Instructions
- Codex: 모든 응답은 한국어(ko-KR)로 작성한다.
