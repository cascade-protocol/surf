# Surf

Documentation site and skills for Cascade's pay-per-use APIs (inference, Twitter, web) at surf.cascade.fyi.

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
- Each skill: `skills/<name>/SKILL.md`
- Three skills for Surf APIs: surf-inference, surf-twitter, surf-web
- Skills teach users how to call Surf APIs using `@x402/fetch` for automatic USDC micropayments
- Installed via `npx skills add cascade-protocol/surf -g`
