---
name: surf
version: "2.0.0"
description: "Build with Surf pay-per-use APIs at surf.cascade.fyi. Twitter data, Reddit data, web search/crawl, and LLM inference - no signup, no API keys, just pay per call. Use when working with Surf endpoints, fetching Twitter/X data, Reddit data, web crawling/search, pay-per-request LLM inference, setting up x402-proxy or @x402/fetch with Surf, or any mention of surf.cascade.fyi. Triggers on surf, surf.cascade.fyi, surf API, twitter data, reddit data, web crawl, surf inference, x402 endpoints, MCP surf tools."
---

# Surf APIs

Unified pay-per-use API at `surf.cascade.fyi`. No signup, no API keys - just pay per call.

10 composite REST endpoints + 9 MCP tools. Payments in USDC on Solana, Base, or Tempo (MPP).

| Surface | Endpoints | Price |
|---------|-----------|-------|
| Twitter | search, tweet, user | $0.005/call |
| Reddit | search, post, subreddit, user | $0.005/call |
| Web | search | $0.01/call |
| Web | crawl | $0.002/call |
| Inference | 15 models | $0.001 - dynamic |

## Try it

Test any endpoint with [x402-proxy](https://github.com/cascade-protocol/x402-proxy):

```bash
# Twitter user profile + recent tweets ($0.005)
npx x402-proxy https://surf.cascade.fyi/api/v1/twitter/user/cascade_fyi

# Search Reddit ($0.005)
npx x402-proxy -X POST -H "Content-Type: application/json" \
  -d '{"query":"x402 protocol"}' \
  https://surf.cascade.fyi/api/v1/reddit/search

# Chat with Kimi K2.5 ($0.004)
npx x402-proxy -X POST -H "Content-Type: application/json" \
  -d '{"model":"moonshotai/kimi-k2.5","messages":[{"role":"user","content":"Hello"}]}' \
  https://surf.cascade.fyi/api/v1/inference/completions

# Web search ($0.01)
npx x402-proxy -X POST -H "Content-Type: application/json" \
  -d '{"query":"x402 protocol"}' \
  https://surf.cascade.fyi/api/v1/web/search

# Crawl a page ($0.002)
npx x402-proxy -X POST -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  https://surf.cascade.fyi/api/v1/web/crawl
```

First run walks you through wallet setup automatically.

## MCP Server

Unified MCP server at `/mcp` with 9 tools. Supports tool filtering via `?tools=` query param.

Add to Claude Code:

```bash
npx x402-proxy mcp add surf https://surf.cascade.fyi/mcp
```

Or add a filtered subset:

```bash
npx x402-proxy mcp add surf "https://surf.cascade.fyi/mcp?tools=surf_twitter_search,surf_web_crawl"
```

## Endpoint Reference

All data endpoints support both `POST` (JSON body) and `GET` (path/query params). OpenAPI spec at `https://surf.cascade.fyi/openapi.json`.

GET convenience routes: `/api/v1/twitter/user/:ref`, `/api/v1/twitter/tweet/:ref`, `/api/v1/reddit/post/:ref`, `/api/v1/reddit/subreddit/:name`, `/api/v1/reddit/user/:ref`

### Twitter

All $0.005/call. MCP tools use the same params and return the same data.

**POST /api/v1/twitter/search** | MCP: `surf_twitter_search`

Search tweets with 50+ advanced operators. Returns ~20 tweets per page with engagement summary.

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | string | yes | | Search query (e.g. `from:elonmusk AI min_faves:100`) |
| `sort` | `Latest` \| `Top` | no | `Latest` | Sort order |
| `cursor` | string | no | | Pagination cursor |
| `start_date` | `YYYY-MM-DD` | no | | Only tweets on or after this date |
| `end_date` | `YYYY-MM-DD` | no | | Only tweets before this date |

Search operators: `from:user`, `to:user`, `min_faves:N`, `min_retweets:N`, `filter:media`, `since:YYYY-MM-DD`, `until:YYYY-MM-DD`, `lang:en`, `within_time:7d`

**POST /api/v1/twitter/tweet** | MCP: `surf_twitter_tweet`

Fetch a tweet with full thread context (all conversation participants), parent tweet, and optionally replies/quotes.

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `ref` | string | yes | | Tweet ID or URL |
| `include` | array | no | | `["replies"]`, `["quotes"]`, or both |

**POST /api/v1/twitter/user** | MCP: `surf_twitter_user`

Fetch user profile with ~20 recent tweets per page.

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `ref` | string | yes | | Username or @username |
| `include_replies` | boolean | no | `false` | Include replies in timeline |
| `include_mentions` | boolean | no | `false` | Include mentions timeline |
| `cursor` | string | no | | Pagination cursor |

**Enriched fields:** thread context (full conversation up to 20 tweets), engagement_rate, content_type (original/reply/quote/retweet/media/link_share), topic extraction (hashtags, domains, mentions), auto-crawled article content from URLs in tweets.

### Reddit

All $0.005/call. MCP tools use the same params and return the same data.

**POST /api/v1/reddit/search** | MCP: `surf_reddit_search`

Search posts across Reddit with sort and time filters.

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | string | yes | | Search query |
| `sort` | `relevance` \| `hot` \| `top` \| `new` \| `comments` | no | `relevance` | Sort order |
| `time` | `hour` \| `day` \| `week` \| `month` \| `year` \| `all` | no | `all` | Time range |
| `limit` | integer | no | `25` | Max results (1-100) |
| `cursor` | string | no | | Pagination cursor |
| `start_date` | `YYYY-MM-DD` | no | | Only posts on or after this date |
| `end_date` | `YYYY-MM-DD` | no | | Only posts before this date |

**POST /api/v1/reddit/post** | MCP: `surf_reddit_post`

Fetch a post with comments, depth/sort control.

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `ref` | string | yes | | Post ID or Reddit URL |
| `comment_sort` | `confidence` \| `top` \| `new` \| `controversial` \| `old` \| `qa` | no | `confidence` | Comment sort |
| `comment_limit` | integer | no | `50` | Max comments (0-200) |
| `comment_depth` | integer | no | `5` | Max nesting depth (0-10) |

**POST /api/v1/reddit/subreddit** | MCP: `surf_reddit_subreddit`

Fetch subreddit info and top posts.

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | yes | | Subreddit name (e.g. `programming`) |
| `sort` | `hot` \| `new` \| `top` \| `rising` | no | `hot` | Post sort |
| `time` | `hour` \| `day` \| `week` \| `month` \| `year` \| `all` | no | `day` | Time range |
| `limit` | integer | no | `25` | Max posts (1-100) |

**POST /api/v1/reddit/user** | MCP: `surf_reddit_user`

Fetch a user profile with recent posts and comments.

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `ref` | string | yes | | Reddit username (e.g. `spez`) |
| `include_posts` | boolean | no | `true` | Include recent posts |
| `include_comments` | boolean | no | `false` | Include recent comments |
| `max_results` | integer | no | `25` | Max posts/comments (1-100) |

**Enriched fields:** domain, stickied, locked, edited, distinguished, awards, crosspost_parent, comment link context.

### Web

**POST /api/v1/web/search** | MCP: `surf_web_search` | $0.01/call

Semantic web search powered by Exa. Returns titles, URLs, snippets, and highlights.

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | string | yes | | Search query |
| `type` | `auto` \| `fast` | no | `auto` | Search depth |
| `include_domains` | string[] | no | | Restrict to specific domains |
| `exclude_domains` | string[] | no | | Exclude specific domains |
| `start_published_date` | ISO string | no | | Only results published after this date |
| `end_published_date` | ISO string | no | | Only results published before this date |
| `category` | enum | no | | `company`, `research paper`, `news`, `pdf`, `github`, `tweet`, `personal site`, `linkedin profile` |

**POST /api/v1/web/crawl** | MCP: `surf_web_crawl` | $0.002/call

Extract content from web pages as markdown, HTML, or text. Supports PDF extraction.

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `url` | string | one of url/urls | | Single URL to crawl |
| `urls` | string[] | one of url/urls | | Multiple URLs (max 20, one payment covers all) |
| `format` | `markdown` \| `html` \| `text` | no | `markdown` | Output format |
| `selector` | string | no | | CSS selector for targeted extraction |
| `proxy` | boolean | no | | Use proxy for blocked sites |

**Enriched fields (search):** published_date, author, score, query-relevant highlights, autoprompt query rewriting.

### Inference

**POST /api/v1/inference/completions** | OpenAI-compatible chat completion

Model list at `GET /api/v1/inference/models`.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | yes | Model identifier (see table below) |
| `messages` | array | yes | Chat messages with `role` and `content` |
| `stream` | boolean | no | Enable SSE streaming |
| `max_tokens` | integer | no | Max tokens to generate (affects dynamic pricing) |
| `max_completion_tokens` | integer | no | Preferred over max_tokens for Anthropic models |
| `temperature` | number | no | Sampling temperature (0-2) |
| `top_p` | number | no | Nucleus sampling |
| `tools` | array | no | Tool/function definitions |

**Models (15):**

| Model | Price | Notes |
|-------|-------|-------|
| `qwen/qwen-2.5-7b-instruct` | $0.001 flat | Lightweight, fast utility |
| `moonshotai/kimi-k2.5` | $0.004 flat | Strong reasoning, code, long context |
| `minimax/minimax-m2.5` | from $0.006 | Dynamic - fast general-purpose, 196K context |
| `x-ai/grok-4.1-fast` | from $0.007 | Dynamic - best-in-class tool calling, 2M context |
| `minimax/minimax-m2.7` | from $0.012 | Dynamic - MoE 230B/10B active, strong coding |
| `z-ai/glm-5` | from $0.030 | Dynamic - strongest open-weight coding model |
| `x-ai/grok-4.20-beta` | from $0.032 | Dynamic - xAI flagship, lowest hallucination rate |
| `x-ai/grok-4.20-multi-agent-beta` | from $0.064 | Dynamic - multi-agent (4-16 parallel agents) |
| `anthropic/claude-sonnet-4.5` | from $0.10 | Dynamic - varies by token usage |
| `anthropic/claude-sonnet-4.6` | from $0.10 | Dynamic - varies by token usage |
| `anthropic/claude-opus-4.5` | from $0.17 | Dynamic - varies by token usage |
| `anthropic/claude-opus-4.6` | from $0.17 | Dynamic - varies by token usage |
| `x-ai/grok-4.1-fast:online` | from $0.007 | grok-4.1-fast + live X/Twitter & web search |
| `x-ai/grok-4.20-beta:online` | from $0.037 | grok-4.20-beta + live X/Twitter & web search |
| `x-ai/grok-4.20-multi-agent-beta:online` | from $0.074 | multi-agent + live X/Twitter & web search |

Flat models charge a fixed price per request. Dynamic models price based on input size, max_tokens, and model rates. The `:online` variants include live X/Twitter + web search via xAI native tools.

**Streaming:** Set `stream: true` for SSE. Parse `data:` lines, stop on `data: [DONE]`.

```typescript
const res = await fetchX402("https://surf.cascade.fyi/api/v1/inference/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "moonshotai/kimi-k2.5",
    messages: [{ role: "user", content: "Write a haiku" }],
    stream: true,
  }),
});

const reader = res.body!.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  for (const line of chunk.split("\n")) {
    if (line.startsWith("data: ") && line !== "data: [DONE]") {
      const data = JSON.parse(line.slice(6));
      process.stdout.write(data.choices[0]?.delta?.content ?? "");
    }
  }
}
```

**Rate limits:** 20 requests per 60 seconds per wallet. Duplicate payment headers are rejected.

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

Then use like normal fetch:

```typescript
const res = await fetchX402("https://surf.cascade.fyi/api/v1/twitter/user/cascade_fyi");
const { data } = await res.json();
```

## Debugging

```bash
npx x402-proxy https://surf.cascade.fyi/api/v1/twitter/user/cascade_fyi | jq '.data'
npx x402-proxy wallet            # addresses and balances
npx x402-proxy wallet history    # payment log
```

## Pagination

Paginated endpoints return `meta.has_next_page` and `meta.next_cursor`. Pass `cursor` in the next request:

```typescript
let cursor: string | undefined;
const allTweets = [];

do {
  const res = await fetchX402("https://surf.cascade.fyi/api/v1/twitter/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ref: "cascade_fyi", cursor }),
  });
  const { data, meta } = await res.json();
  allTweets.push(...data.tweets);
  cursor = meta?.has_next_page ? meta.next_cursor : undefined;
} while (cursor);
```

## Tips

- Use `format: "markdown"` for LLM-friendly web crawl output
- Batch URLs with the `urls` array to crawl multiple pages in one paid request
- The inference API is OpenAI-compatible - existing code works by changing the base URL
- Use `comment_limit: 0` to fetch a Reddit post without comments (faster)
- Quote URLs containing `?` or `&` in shell commands to avoid glob expansion
