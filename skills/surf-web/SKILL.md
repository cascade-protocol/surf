---
name: surf-web
description: "Web crawling and search via Surf's paid API: crawl URLs ($0.005) and search via Exa ($0.01) at web.surf.cascade.fyi. Uses @x402/fetch for automatic USDC micropayments on Solana. Use when: (1) scraping web pages to markdown/html/text, (2) searching the web, (3) bulk crawling multiple URLs, (4) extracting content from behind anti-bot protection."
---

# Surf Web

Web crawling and search API at `https://web.surf.cascade.fyi`. Uses x402 for USDC micropayments on Solana.

## Setup

```bash
npm install @x402/fetch
```

```typescript
import { wrapFetch } from "@x402/fetch";

const x402Fetch = wrapFetch(fetch, walletClient);
```

## Endpoints

### POST /v1/crawl

Crawl one or more URLs. Supports markdown, HTML, or plain text output.

```typescript
// Single URL
const res = await x402Fetch("https://web.surf.cascade.fyi/v1/crawl", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://example.com",
    format: "markdown",
  }),
});

// Bulk URLs
const res = await x402Fetch("https://web.surf.cascade.fyi/v1/crawl", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    urls: ["https://example.com", "https://other.com"],
    format: "markdown",
  }),
});
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| url | string | yes* | Single URL to crawl |
| urls | string[] | yes* | Multiple URLs to crawl |
| format | string | yes | `markdown`, `html`, or `text` |
| selector | string | no | CSS selector to extract specific content |
| proxy | boolean | no | Use rotating proxy for blocked sites |

*Provide either `url` or `urls`, not both.

**Response (single):** `{ status, content[], url }`
**Response (bulk):** `[{ status, content[], url }, ...]`

**Auto-escalation:** The crawler automatically escalates through fetching strategies (simple HTTP -> browser-like -> stealth) when content appears blocked.

### POST /v1/search

Search the web via Exa AI.

```typescript
const res = await x402Fetch("https://web.surf.cascade.fyi/v1/search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "x402 protocol payments",
    num_results: 5,
  }),
});
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| query | string | yes | Search query |
| num_results | integer | no | 1-20, default 5 |

**Response:** `{ results: [{ title, url, snippet }] }`

## Errors

| HTTP | Meaning |
|------|---------|
| 400 | Invalid request (check format, url/urls) |
| 402 | Payment required (handled automatically by @x402/fetch) |
| 429 | Too many concurrent crawls (max 5) |
| 502 | Upstream error |

## Pricing

| Endpoint | Cost |
|----------|------|
| POST /v1/crawl | $0.005 |
| POST /v1/search | $0.01 |

## Payment

- Network: Solana mainnet
- Token: USDC
- Facilitator: https://facilitator.cascade.fyi
