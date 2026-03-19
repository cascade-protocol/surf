# Surf

Documentation site and skills for Cascade's pay-per-use APIs (inference, Twitter, Reddit, web) at surf.cascade.fyi.

## Stack
- pnpm workspaces monorepo + Turborepo
- Frontend: TanStack Start (SSR) + Vite + React 19 + Tailwind v4
- Deploys to Cloudflare Workers (wrangler)
- Biome 2.x for linting and formatting
- Node.js 24+

## Validation
- Run `pnpm check` (root) after each set of changes - runs type-check and biome via Turborepo
- Fix all errors before moving on

## Code Style
- No classes, use plain functions
- Tailwind v4 CSS-first theming (no tailwind.config.js)
- Theme defined in `packages/frontend/src/app.css` via `@theme inline {}`

## Deploying
- Frontend: `cd packages/frontend && pnpm run deploy`
  - Always use `pnpm run deploy`, never `pnpm deploy` (built-in pnpm command)
  - Do NOT use `pnpm turbo deploy` - turbo's non-interactive subprocess breaks wrangler OAuth
- Custom domain: surf.cascade.fyi

## Git
- Always use conventional commits: `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `ci`, `build`
- Scope is optional, use package name when relevant: `feat(frontend):`

## Skills
- Skills live in `skills/` (NOT a workspace package)
- One unified skill: `skills/surf/SKILL.md` with `references/` for per-service details
- `references/twitter.md` (26 endpoints), `references/reddit.md` (7 endpoints), `references/inference.md`, `references/web.md`
- Skills teach users how to call Surf APIs using `@x402/fetch` and `npx x402-proxy`
- Installed via `npx skills add cascade-protocol/surf -g`
