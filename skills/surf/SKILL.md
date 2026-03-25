---
name: surf
description: Build with Surf pay-per-use APIs - Twitter data, Reddit data, LLM inference, and web scraping at surf.cascade.fyi. Use this skill whenever working with Surf endpoints, Twitter/X data extraction, Reddit data, web crawling/search, or pay-per-request LLM inference. Also use when setting up @x402/fetch for Surf services, using x402-proxy with Surf URLs, or any mention of twitter.surf, reddit.surf, inference.surf, or web.surf domains. Even if the user just says "get tweets", "search reddit", or "crawl a page" and Surf is in the project context, use this skill.
---

# Surf APIs

Four APIs, one wallet. No API keys, no subscriptions.

| Service | Base URL | Price range |
|---------|----------|-------------|
| Twitter | `twitter.surf.cascade.fyi` | $0.001 - $0.005/req |
| Reddit | `reddit.surf.cascade.fyi` | $0.001 - $0.005/req |
| Inference | `inference.surf.cascade.fyi` | $0.001 - $0.17/req |
| Web | `web.surf.cascade.fyi` | $0.002 - $0.01/req |

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

# Search Reddit ($0.005)
npx x402-proxy "https://reddit.surf.cascade.fyi/search?q=x402+protocol"

# Crawl a webpage ($0.002)
npx x402-proxy --method POST \
  --header "Content-Type: application/json" \
  --body '{"url":"https://example.com"}' \
  https://web.surf.cascade.fyi/v1/crawl
```

First run walks you through wallet setup automatically.

## MCP Servers

Twitter and Reddit are available as MCP servers with composite tools that bundle multiple API calls into single tool invocations.

Setup wallet (first time only):

```bash
npx x402-proxy
```

Add to Claude Code:

```bash
claude mcp add -s user twitter -- npx x402-proxy mcp https://twitter.surf.cascade.fyi/mcp
claude mcp add -s user reddit -- npx x402-proxy mcp https://reddit.surf.cascade.fyi/mcp
claude mcp add -s user web -- npx x402-proxy mcp https://web.surf.cascade.fyi/mcp
```

### Twitter MCP Tools

| Tool | Cost | What it bundles |
|------|------|-----------------|
| `surf_twitter_search` | $0.008 | Advanced search with 50+ operators, enriched results with engagement summary |
| `surf_twitter_tweet` | $0.005 | Tweet + thread context + parent (if reply). Optionally include replies/quotes |
| `surf_twitter_user` | $0.005 | User profile + recent tweets timeline |

### Reddit MCP Tools

| Tool | Cost | What it bundles |
|------|------|-----------------|
| `reddit_search` | $0.008 | Search posts across Reddit with sort/time filters |
| `reddit_post` | $0.005 | Post + comments with depth/sort control |
| `reddit_subreddit` | $0.005 | Subreddit info + top posts |

### Web MCP Tools

| Tool | Cost | What it does |
|------|------|--------------|
| `surf_web_search` | $0.01 | Semantic web search via Exa |
| `surf_web_crawl` | $0.002 | Extract web page content as markdown/HTML/text |

Each tool call costs the same as its REST equivalent but wrapped as MCP tools for direct agent use.

## Pricing

### Reddit (7 endpoints)

| Tier | Cost | Endpoints |
|------|------|-----------|
| Lookup | $0.001 | Subreddit info, user profile |
| Listing | $0.003 | Subreddit posts |
| Content | $0.004 | Post with comments, user posts, user comments |
| Search | $0.005 | Search across Reddit |

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
| `z-ai/glm-5` | from $0.030 | Dynamic - strongest open-weight coding/agent model |
| `minimax/minimax-m2.7` | from $0.012 | Dynamic - MoE 230B/10B active, strong coding/agents |
| `x-ai/grok-4.1-fast` | from $0.007 | Dynamic - best-in-class tool calling, 2M context, agentic workflows |
| `x-ai/grok-4.20-beta` | from $0.032 | Dynamic - xAI flagship, lowest hallucination rate, 2M context |
| `x-ai/grok-4.20-multi-agent-beta` | from $0.064 | Dynamic - multi-agent (4-16 parallel agents), deep research |
| `x-ai/grok-4.1-fast:online` | from $0.007 | Dynamic - grok-4.1-fast + live X/Twitter & web search |
| `x-ai/grok-4.20-beta:online` | from $0.037 | Dynamic - grok-4.20-beta + live X/Twitter & web search |
| `x-ai/grok-4.20-multi-agent-beta:online` | from $0.074 | Dynamic - multi-agent + live X/Twitter & web search |
| `moonshotai/kimi-k2.5` | $0.004 | Flat per-request |
| `minimax/minimax-m2.5` | from $0.006 | Dynamic - fast general-purpose, 196K context |
| `qwen/qwen-2.5-7b-instruct` | $0.001 | Flat per-request |

### Web

| Endpoint | Cost |
|----------|------|
| Crawl (per request) | $0.002 |
| Search | $0.01 |

### Cost example

An agent doing 1,000 Twitter lookups + 200 Reddit lookups + 100 tweet searches + 50 inference calls per day:
- Twitter: 1,000 x $0.001 + 100 x $0.005 = $1.50
- Reddit: 200 x $0.003 = $0.60
- Inference: 50 x $0.004 = $0.20
- **Total: $2.30/day**

## Integrate with @x402/fetch

```bash
npm install @x402/fetch @x402/evm @x402/svm
```

### Solana wallet

```typescript
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactSvmScheme } from "@x402/svm/exact/client";
import { createKeyPairSignerFromBytes } from "@solana/kit";
import { base58 } from "@scure/base";

const svmSigner = await createKeyPairSignerFromBytes(base58.decode(process.env.SVM_PRIVATE_KEY!));
const client = new x402Client();
registerExactSvmScheme(client, { signer: svmSigner });
const fetchX402 = wrapFetchWithPayment(fetch, client);
```

### Base (EVM) wallet

```typescript
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const signer = privateKeyToAccount(process.env.EVM_PRIVATE_KEY as `0x${string}`);
const client = new x402Client();
registerExactEvmScheme(client, { signer });
const fetchX402 = wrapFetchWithPayment(fetch, client);
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
- `https://reddit.surf.cascade.fyi/openapi.json`
- `https://inference.surf.cascade.fyi/openapi.json`
- `https://web.surf.cascade.fyi/openapi.json`

## Endpoint reference

For full endpoint docs, request/response formats, and query parameters:

- **Twitter** (26 endpoints) - read `references/twitter.md`
- **Reddit** (7 endpoints) - read `references/reddit.md`
- **Inference** (chat completions + streaming) - read `references/inference.md`
- **Web** (crawl + search) - read `references/web.md`
