---
name: surf
description: Build with Surf pay-per-use APIs - Twitter data, LLM inference, and web scraping at surf.cascade.fyi. Use this skill whenever working with Surf endpoints, Twitter/X data extraction, web crawling/search, or pay-per-request LLM inference. Also use when setting up @x402/fetch for Surf services, using x402-proxy with Surf URLs, or any mention of twitter.surf, inference.surf, or web.surf domains. Even if the user just says "get tweets" or "crawl a page" and Surf is in the project context, use this skill.
---

# Surf APIs

Three APIs, one wallet. No API keys, no subscriptions.

| Service | Base URL | Price range |
|---------|----------|-------------|
| Twitter | `twitter.surf.cascade.fyi` | $0.001 - $0.005/req |
| Inference | `inference.surf.cascade.fyi` | $0.001 - $0.17/req |
| Web | `web.surf.cascade.fyi` | $0.005 - $0.01/req |

Payments in USDC on Solana or Base. Choose either chain.

## Try it

Test any endpoint with [x402-proxy](https://github.com/cascade-protocol/x402-proxy) - no code, no wallet setup:

```bash
# Fetch a Twitter profile ($0.001)
npx x402-proxy https://twitter.surf.cascade.fyi/users/cascade_fyi

# Get recent tweets ($0.004)
npx x402-proxy https://twitter.surf.cascade.fyi/users/cascade_fyi/tweets

# Chat with Kimi K2.5 ($0.004)
npx x402-proxy --method POST \
  --header "Content-Type: application/json" \
  --body '{"model":"moonshotai/kimi-k2.5","messages":[{"role":"user","content":"Hello"}]}' \
  https://inference.surf.cascade.fyi/v1/chat/completions

# Crawl a webpage ($0.005)
npx x402-proxy --method POST \
  --header "Content-Type: application/json" \
  --body '{"url":"https://example.com"}' \
  https://web.surf.cascade.fyi/v1/crawl
```

First run walks you through wallet setup automatically.

## Twitter MCP Server

Twitter is also available as an MCP server with 3 composite tools that bundle multiple API calls into single tool invocations.

Setup wallet (first time only):

```bash
npx x402-proxy
```

Add to Claude Code:

```bash
claude mcp add -s user twitter -- npx x402-proxy https://twitter.surf.cascade.fyi/mcp
```

Use with any MCP-compatible client:

```bash
npx x402-proxy https://twitter.surf.cascade.fyi/mcp
```

| Tool | Cost | What it bundles |
|------|------|-----------------|
| `twitter_search` | $0.008 | Advanced search with 50+ operators, enriched results with engagement summary |
| `twitter_tweet` | $0.005 | Tweet + thread context + parent (if reply). Optionally include replies/quotes |
| `twitter_user` | $0.005 | User profile + recent tweets timeline |

Each tool call costs more than its REST equivalent but bundles what would be 2-3 separate API calls into one. A `twitter_tweet` call returning tweet + thread ($0.005) replaces `GET /tweets/{id}` + `GET /tweets/{id}/thread` ($0.001 + $0.004 = $0.005 via REST).

## Pricing

### Twitter (26 endpoints)

| Tier | Cost | Endpoints |
|------|------|-----------|
| Lookup | $0.001 | Single tweet, user profile, relationship check, trends, spaces |
| Paginated | $0.004 | Timelines, followers, user search, replies, lists, communities |
| Search | $0.005 | Tweet search with advanced operators, article content |

### Inference

| Model | Cost | Notes |
|-------|------|-------|
| `anthropic/claude-sonnet-4.5` | from $0.10 | Dynamic - varies by token usage |
| `anthropic/claude-sonnet-4.6` | from $0.10 | Dynamic - varies by token usage |
| `anthropic/claude-opus-4.5` | from $0.17 | Dynamic - varies by token usage |
| `anthropic/claude-opus-4.6` | from $0.17 | Dynamic - varies by token usage |
| `moonshotai/kimi-k2.5` | $0.004 | Flat per-request |
| `minimax/minimax-m2.5` | $0.003 | Flat per-request |
| `qwen/qwen-2.5-7b-instruct` | $0.001 | Flat per-request |

### Web

| Endpoint | Cost |
|----------|------|
| Crawl (per request) | $0.005 |
| Search | $0.01 |

### Cost example

An agent doing 1,000 Twitter lookups + 100 tweet searches + 50 inference calls per day:
- Twitter: 1,000 x $0.001 + 100 x $0.005 = $1.50
- Inference: 50 x $0.004 = $0.20
- **Total: $1.70/day**

## Integrate with @x402/fetch

```bash
npm install @x402/fetch
```

### Solana wallet

```typescript
import { wrapFetch } from "@x402/fetch";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const keypair = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY!));
const fetchX402 = wrapFetch(fetch, keypair);
```

### Base (EVM) wallet

```typescript
import { wrapFetch } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const account = privateKeyToAccount(process.env.EVM_PRIVATE_KEY as `0x${string}`);
const wallet = createWalletClient({ account, chain: base, transport: http() });
const fetchX402 = wrapFetch(fetch, wallet);
```

Then call any Surf endpoint like a normal fetch:

```typescript
// Twitter - user profile
const res = await fetchX402("https://twitter.surf.cascade.fyi/users/cascade_fyi");
const { data } = await res.json();

// Inference - chat completion
const chat = await fetchX402("https://inference.surf.cascade.fyi/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "moonshotai/kimi-k2.5",
    messages: [{ role: "user", content: "Summarize x402 in one sentence" }],
  }),
});

// Web - crawl a page
const page = await fetchX402("https://web.surf.cascade.fyi/v1/crawl", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com" }),
});
```

## Debugging with x402-proxy

Body streams to stdout, payment info to stderr - safe for piping:

```bash
npx x402-proxy https://twitter.surf.cascade.fyi/users/cascade_fyi | jq '.data'

npx x402-proxy wallet            # addresses and balances
npx x402-proxy wallet history    # payment log
```

## OpenAPI specs

Each service serves its full OpenAPI spec:

- `https://twitter.surf.cascade.fyi/openapi.json`
- `https://inference.surf.cascade.fyi/openapi.json`
- `https://web.surf.cascade.fyi/openapi.json`

## Endpoint reference

For full endpoint docs, request/response formats, and query parameters:

- **Twitter** (26 endpoints) - read `references/twitter.md`
- **Inference** (chat completions + streaming) - read `references/inference.md`
- **Web** (crawl + search) - read `references/web.md`
