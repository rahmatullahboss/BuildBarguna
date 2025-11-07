# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` contains App Router routes and server actions grouped by locale; keep dashboard flows isolated from marketing segments.
- `src/components/` holds reusable shadcn/ui primitives—store component-specific hooks and types beside the component.
- `src/lib/`, `src/i18n/`, and `src/messages/` provide utilities, locale config, and message bundles; update EN and BN keys together.
- `prisma/schema.prisma`, `prisma/migrations/`, and `prisma/seed.ts` define, evolve, and seed the data model; run migrations before seeding to keep `@prisma/client` current.
- Static assets live in `public/`; update the admin runbooks whenever env vars change.

## Build, Test, and Development Commands
- `npm run dev` – start the localized dev server.
- `npm run build` – create the production bundle for CI/Vercel.
- `npm run start` – serve the `.next` output for smoke checks.
- `npm run lint` – apply ESLint + TypeScript rules from `eslint.config.mjs`.
- `npx prisma migrate dev --name <tag>` – scaffold and apply schema changes.
- `npm run prisma:seed` – run seeding via `dotenv-cli` + `ts-node`.
Postinstall runs `dotenv -- prisma generate`; ensure `.env` exists before installing dependencies.

## Coding Style & Naming Conventions
- Code in TypeScript with two-space indentation and semicolons enforced by ESLint.
- Use `PascalCase` for components/hooks/routes, `camelCase` for helpers, and `SCREAMING_SNAKE_CASE` for configuration.
- Prefer server components and async handlers; keep `"use client"` wrappers minimal and follow shadcn Tailwind ordering.

## Testing Guidelines
- No formal runner ships yet; add React Testing Library or Playwright suites beside new code and name files `<Component>.test.tsx` or `<route>.spec.ts`.
- Smoke test critical pages, Prisma mappers, and NextAuth flows; mock email/blob providers under `tests/__mocks__` as needed.
- Until automation lands, record manual verification notes plus `lint`/`build` results in each PR.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat(ui): …`, `fix(auth): …`, `chore(deps): …`) to signal scope.
- Each PR should link an issue, summarize the change, include UI evidence when applicable, and list schema/env updates plus the commands you ran.
- Keep PRs focused (<400 LOC touched) and rebase before requesting review to preserve a linear history.

## Security & Configuration Tips
- Never commit `.env*`; store machine secrets in `.env.local` and mirror keys in `.env.example` plus Vercel settings.
- Update the admin setup guides whenever authentication, email, or analytics keys change so operators stay aligned.
- After editing `schema.prisma`, rerun `npx prisma generate` (or reinstall) to refresh the Prisma client before pushing.
