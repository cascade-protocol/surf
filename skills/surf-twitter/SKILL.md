---
name: surf-twitter
description: "Twitter/X data via Surf's paid API: search tweets, fetch users and tweets at twitter.surf.cascade.fyi. All endpoints $0.003 USDC on Solana or Base. Uses @x402/fetch for automatic micropayments. Use when: (1) searching tweets by keyword, (2) fetching tweet details with thread/replies, (3) looking up Twitter user profiles, (4) batch fetching multiple tweets or users."
---

# Surf Twitter

Twitter/X data API at `https://twitter.surf.cascade.fyi`. All endpoints cost $0.003 USDC via x402 on Solana or Base.

## Setup

```bash
npm install @x402/fetch
```

```typescript
import { wrapFetch } from "@x402/fetch";

const x402Fetch = wrapFetch(fetch, walletClient);
```

## Endpoints

### GET /search

Search tweets by query.

```typescript
const res = await x402Fetch(
  "https://twitter.surf.cascade.fyi/search?q=x402+protocol&type=Latest&limit=10",
);
const data = await res.json();
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| q | string | yes | Search query |
| type | string | no | `Latest` (default) or `Top` |
| limit | integer | no | 1-100, default 20 |
| cursor | string | no | Pagination cursor from previous response |

**Response:** `{ query, tweets[], count, hasMore, nextCursor, summary }`

### GET /tweet/{ref}

Fetch tweet(s) by ID or URL.

```typescript
const res = await x402Fetch(
  "https://twitter.surf.cascade.fyi/tweet/1234567890?include=thread,replies",
);
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| ref | string | yes | Tweet ID, URL, or comma-separated IDs |
| include | string | no | Comma-separated: `thread`, `replies`, `quotes` |
| limit | integer | no | 1-100, max items for included data |

**Response:** `{ tweets[], count, parent?, thread?, replies?, quotes? }`

### GET /user/{ref}

Fetch user profile by username or ID.

```typescript
const res = await x402Fetch(
  "https://twitter.surf.cascade.fyi/user/elonmusk?include=tweets&limit=5",
);
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| ref | string | yes | Username, @username, user ID, or comma-separated IDs |
| include | string | no | Comma-separated: `tweets`, `followers`, `following` |
| include_replies | boolean | no | Include replies in tweets (default false) |
| limit | integer | no | 1-100 |

**Response:** `{ user, tweets?, followers?, following? }`

## Errors

| HTTP | Meaning |
|------|---------|
| 400 | Invalid request |
| 402 | Payment required (handled automatically by @x402/fetch) |
| 404 | Tweet or user not found |
| 502 | Twitter API error |

## Payment

- Networks: Solana mainnet, Base mainnet
- Token: USDC
- Price: $0.003 per request (all endpoints)
