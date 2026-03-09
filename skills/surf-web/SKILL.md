---
name: surf-web
description: "Web crawling and search via Surf's paid API: crawl URLs ($0.005) and search via Exa ($0.01) at web.surf.cascade.fyi. Uses @x402/fetch for automatic USDC micropayments on Solana. Use when: (1) scraping web pages to markdown/html/text, (2) searching the web, (3) bulk crawling multiple URLs, (4) extracting content from behind anti-bot protection."
---

# Surf Web

Web crawling and search API at `https://web.surf.cascade.fyi`. USDC micropayments via x402 on Solana.

## Setup

```bash
npm install @x402/fetch @x402/svm @solana/kit
```

```typescript
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { registerExactSvmScheme } from "@x402/svm/exact/client";
import { createKeyPairSignerFromPrivateKeyBytes } from "@solana/kit";

const signer = await createKeyPairSignerFromPrivateKeyBytes(
  new Uint8Array(keypairBytes.slice(0, 32)),
);

const client = new x402Client();
registerExactSvmScheme(client, { signer });
const x402Fetch = wrapFetchWithPayment(fetch, client);
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
const data = await res.json();
// data.content[0] contains the markdown

// Bulk URLs (one payment for all)
const res = await x402Fetch("https://web.surf.cascade.fyi/v1/crawl", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    urls: ["https://example.com", "https://other.com"],
    format: "markdown",
  }),
});
const results = await res.json();
// results is an array of { status, content[], url }
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| url | string | yes* | Single URL to crawl |
| urls | string[] | yes* | Multiple URLs to crawl |
| format | string | yes | `markdown`, `html`, or `text` |
| selector | string | no | CSS selector to extract specific content |
| proxy | boolean | no | Use rotating proxy for blocked sites |

*Provide either `url` or `urls`, not both.

**Response (single):**

```typescript
interface CrawlResponse {
  status: number;    // HTTP status from crawled page
  content: string[]; // Extracted content (may have multiple parts)
  url: string;       // Final URL (after redirects)
}
```

**Response (bulk):** `CrawlResponse[]`

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
const data = await res.json();
// data.results[0].title, data.results[0].url, data.results[0].snippet
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| query | string | yes | Search query |
| num_results | integer | no | 1-20, default 5 |

**Response:**

```typescript
interface SearchResponse {
  results: {
    title: string;
    url: string;
    snippet: string;
  }[];
}
```

## Errors

| HTTP | Meaning |
|------|---------|
| 400 | Invalid request (check format, url/urls) |
| 402 | Payment required (handled automatically by @x402/fetch) |
| 429 | Too many concurrent crawls (max 10) |
| 502 | Upstream error |

## Pricing

| Endpoint | Cost |
|----------|------|
| POST /v1/crawl | $0.005 per request |
| POST /v1/search | $0.01 per request |

Bulk crawls (`urls` array) cost one payment regardless of how many URLs are included.

## Tips

- Use `format: "markdown"` for LLM consumption, `format: "text"` for minimal output.
- Use `selector` (CSS selector) to extract just the content you need, e.g. `"article"`, `"main"`, `".post-body"`.
- Use `urls` array instead of multiple single calls to save on payments.
- The crawler auto-escalates through strategies (simple HTTP -> browser-like -> stealth) when content looks blocked. No configuration needed.
- Set `proxy: true` for sites with aggressive anti-bot protection.
- The `content` array may have multiple elements if the page has distinct content sections.

## Payment

- Network: Solana mainnet
- Token: USDC
- Facilitator: https://facilitator.cascade.fyi
