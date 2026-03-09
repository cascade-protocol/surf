---
name: surf-twitter
description: "Twitter/X data via Surf's paid API: search tweets, fetch users and tweets at twitter.surf.cascade.fyi. All endpoints $0.003 USDC on Solana or Base. Uses @x402/fetch for automatic micropayments. Use when: (1) searching tweets by keyword, (2) fetching tweet details with thread/replies, (3) looking up Twitter user profiles, (4) batch fetching multiple tweets or users."
---

# Surf Twitter

Twitter/X data API at `https://twitter.surf.cascade.fyi`. All endpoints cost $0.003 USDC via x402 on Solana or Base.

## Setup (Solana)

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

## Setup (Base / EVM)

```bash
npm install @x402/fetch @x402/evm viem
```

```typescript
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { toClientEvmSigner } from "@x402/evm";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount("0x...");
const publicClient = createPublicClient({ chain: base, transport: http() });
const evmSigner = toClientEvmSigner(account, publicClient);

const client = new x402Client();
registerExactEvmScheme(client, { signer: evmSigner });
const x402Fetch = wrapFetchWithPayment(fetch, client);
```

## Endpoints

### GET /search

Search tweets by query.

```typescript
const res = await x402Fetch(
  "https://twitter.surf.cascade.fyi/search?q=x402+protocol&type=Latest&limit=10",
);
const data = await res.json();
// data.tweets, data.count, data.hasMore, data.nextCursor
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| q | string | yes | Search query |
| type | string | no | `Latest` (default) or `Top` |
| limit | integer | no | 1-100, default 20 |
| cursor | string | no | Pagination cursor from previous response |

**Response:**

```typescript
interface SearchResponse {
  query: string;
  tweets: Tweet[];
  count: number;
  hasMore: boolean;
  nextCursor: string | null;
  summary: {
    totalLikes: number;
    totalRetweets: number;
    totalReplies: number;
    avgLikes: number;
    maxLikes: number;
    topTweetId: string;
  };
}
```

### GET /tweet/{ref}

Fetch tweet(s) by ID or URL.

```typescript
const res = await x402Fetch(
  "https://twitter.surf.cascade.fyi/tweet/1234567890?include=thread,replies",
);
const data = await res.json();
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| ref | string | yes | Tweet ID, URL, or comma-separated IDs |
| include | string | no | Comma-separated: `thread`, `replies`, `quotes` |
| limit | integer | no | 1-100, max items for included data |

**Response:** `{ tweets: Tweet[], count, parent?, thread?, replies?, quotes? }`

### GET /user/{ref}

Fetch user profile by username or ID.

```typescript
const res = await x402Fetch(
  "https://twitter.surf.cascade.fyi/user/CoinbaseDev?include=tweets&limit=5",
);
const data = await res.json();
// data.user, data.tweets
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| ref | string | yes | Username, @username, user ID, or comma-separated IDs |
| include | string | no | Comma-separated: `tweets`, `followers`, `following` |
| include_replies | boolean | no | Include replies in tweets (default false) |
| limit | integer | no | 1-100 |

**Response:** `{ user: User, tweets?, followers?, following? }`

## Response Types

```typescript
interface Tweet {
  id: string;
  url: string;
  text: string;
  createdAt: string;         // ISO 8601
  timeAgo: string;           // e.g. "2h"
  likeCount: number;
  retweetCount: number;
  replyCount: number;
  quoteCount: number;
  viewCount: number;
  bookmarkCount: number;
  conversationId: string;
  isReply: boolean;
  isThreadStart: boolean;
  inReplyToId: string | null;
  author: {
    id: string;
    username: string;
    name: string;
    profilePicture: string;
    isVerified: boolean;
    followers: number;
  };
}

interface User {
  id: string;
  username: string;
  name: string;
  description: string;
  profilePicture: string;
  isVerified: boolean;
  followers: number;
  following: number;
  tweetsCount: number;
  createdAt: string;
  location: string;
  website: string;
}
```

## Errors

| HTTP | Meaning |
|------|---------|
| 400 | Invalid request |
| 402 | Payment required (handled automatically by @x402/fetch) |
| 404 | Tweet or user not found |
| 502 | Twitter API error |

## Tips

- Use `cursor` from `nextCursor` to paginate through large result sets. Each page costs $0.003.
- Batch-fetch tweets by passing comma-separated IDs: `/tweet/123,456,789` (one payment).
- The `summary` field on search responses gives aggregate stats without parsing every tweet.
- `include=thread` on a reply returns the full thread. `include=replies` gets replies to a tweet.

## Payment

- Networks: Solana mainnet, Base mainnet
- Token: USDC
- Price: $0.003 per request (all endpoints)
- Facilitator: https://facilitator.payai.network
