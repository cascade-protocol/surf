# Surf

Pay-per-use API gateway for AI agents. Inference, Twitter data, and web crawling - no API keys, no subscriptions. Pay per request with USDC via the [x402](https://www.x402.org/) protocol.

Live at [surf.cascade.fyi](https://surf.cascade.fyi)

## Services

| Service | Domain | Price | Networks |
|---------|--------|-------|----------|
| **Inference** - LLM chat completions (Kimi K2.5, MiniMax M2.5) | `inference.surf.cascade.fyi` | $0.003-0.004 | Solana, Base |
| **Twitter** - Search tweets, fetch users and tweets | `twitter.surf.cascade.fyi` | $0.001-0.005 | Solana, Base |
| **Web** - Crawl pages, search via Exa | `web.surf.cascade.fyi` | $0.005-0.01 | Solana, Base |

## Quick start

```bash
npm install @x402/fetch
```

```typescript
import { wrapFetch } from "@x402/fetch";

const x402Fetch = wrapFetch(fetch, walletClient);

const res = await x402Fetch(
  "https://inference.surf.cascade.fyi/v1/chat/completions",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "moonshotai/kimi-k2.5",
      messages: [{ role: "user", content: "Hello!" }],
    }),
  },
);

const data = await res.json();
```

## Claude Code skills

Surf ships [Claude Code skills](https://github.com/anthropics/claude-code/blob/main/docs/skills.md) that teach the agent how to call each API:

```bash
npx skills add cascade-protocol/surf -g
```

Installs the unified `surf` skill with references for each service.

## Development

```bash
pnpm install
pnpm dev        # Start dev server
pnpm check      # Type-check + lint
```

## License

[Apache-2.0](LICENSE)
