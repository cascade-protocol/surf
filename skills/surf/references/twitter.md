# Twitter API Reference

Base URL: `https://twitter.surf.cascade.fyi`
OpenAPI spec: `https://twitter.surf.cascade.fyi/openapi.json`

27 GET endpoints across tweets, users, lists, communities, spaces, and trends.
`{ref}` accepts a username or numeric user ID. `{id}` is a numeric ID.

## Core endpoints

### Get user profile

```bash
npx x402-proxy https://twitter.surf.cascade.fyi/users/cascade_fyi
```

```typescript
const res = await fetchX402("https://twitter.surf.cascade.fyi/users/cascade_fyi");
const { data } = await res.json();
// data.username, data.name, data.public_metrics.followers_count
```

**Cost:** $0.001

### Get user tweets

```bash
npx x402-proxy https://twitter.surf.cascade.fyi/users/cascade_fyi/tweets
```

```typescript
const res = await fetchX402("https://twitter.surf.cascade.fyi/users/cascade_fyi/tweets");
const { data, meta } = await res.json();
// data[].id, data[].text, data[].author
// meta.has_next_page, meta.next_cursor
```

Query params: `include_replies` (boolean)
**Cost:** $0.002

### Search tweets

```bash
npx x402-proxy "https://twitter.surf.cascade.fyi/tweets/search?q=from:elonmusk AI&limit=20"
```

```typescript
const res = await fetchX402(
  "https://twitter.surf.cascade.fyi/tweets/search?q=from:elonmusk+AI&limit=20"
);
const { data, meta } = await res.json();
```

Query params: `q` (required), `sort` (Latest | Top), `limit` (1-200)

Search operators: `from:user`, `to:user`, `min_faves:N`, `min_retweets:N`, `filter:media`, `since:YYYY-MM-DD`, `until:YYYY-MM-DD`, `lang:en`

**Cost:** $0.003

### Get single tweet

```bash
npx x402-proxy https://twitter.surf.cascade.fyi/tweets/1585841080431321088
```

```typescript
const res = await fetchX402("https://twitter.surf.cascade.fyi/tweets/1585841080431321088");
const { data } = await res.json();
// data.text, data.author.username, data.public_metrics
```

**Cost:** $0.001

### Get tweet thread

```bash
npx x402-proxy https://twitter.surf.cascade.fyi/tweets/1585841080431321088/thread
```

**Cost:** $0.002

### Check follow relationship

```bash
npx x402-proxy "https://twitter.surf.cascade.fyi/users/relationship?source=elonmusk&target=jack"
```

```typescript
const res = await fetchX402(
  "https://twitter.surf.cascade.fyi/users/relationship?source=elonmusk&target=jack"
);
const { data } = await res.json();
// data.following, data.followed_by
```

**Cost:** $0.001

## Complete endpoint reference

### Tweets

| Endpoint | Params | Cost |
|----------|--------|------|
| `GET /tweets/search` | `q` (required), `sort`, `limit` | $0.003 |
| `GET /tweets/{id}` | | $0.001 |
| `GET /tweets` | `ids` (comma-separated, required) | $0.002 |
| `GET /tweets/{id}/replies` | | $0.002 |
| `GET /tweets/{id}/quotes` | | $0.002 |
| `GET /tweets/{id}/retweeters` | | $0.002 |
| `GET /tweets/{id}/thread` | | $0.002 |

### Users

| Endpoint | Params | Cost |
|----------|--------|------|
| `GET /users/search` | `q` (required) | $0.002 |
| `GET /users/relationship` | `source`, `target` (both required) | $0.001 |
| `GET /users/{ref}` | | $0.001 |
| `GET /users/{ref}/about` | | $0.001 |
| `GET /users` | `ids` (comma-separated, required) | $0.002 |
| `GET /users/{ref}/tweets` | `include_replies` | $0.002 |
| `GET /users/{ref}/mentions` | | $0.002 |
| `GET /users/{ref}/followers` | | $0.002 |
| `GET /users/{ref}/following` | | $0.002 |
| `GET /users/{ref}/verified_followers` | | $0.002 |

### Lists

| Endpoint | Params | Cost |
|----------|--------|------|
| `GET /lists/{id}/tweets` | | $0.002 |
| `GET /lists/{id}/members` | | $0.002 |
| `GET /lists/{id}/followers` | | $0.002 |

### Communities

| Endpoint | Params | Cost |
|----------|--------|------|
| `GET /communities/search` | `q` (required), `sort` | $0.002 |
| `GET /communities/{id}` | | $0.002 |
| `GET /communities/{id}/tweets` | | $0.002 |
| `GET /communities/{id}/members` | | $0.002 |
| `GET /communities/{id}/moderators` | | $0.002 |

### Other

| Endpoint | Params | Cost |
|----------|--------|------|
| `GET /spaces/{id}` | | $0.001 |
| `GET /trends` | `woeid`, `count` | $0.001 |

## Pagination

Paginated endpoints return `meta.has_next_page` and `meta.next_cursor`. Pass `cursor` as a query param for the next page:

```typescript
let cursor: string | undefined;
const allTweets = [];

do {
  const url = new URL("https://twitter.surf.cascade.fyi/users/cascade_fyi/tweets");
  if (cursor) url.searchParams.set("cursor", cursor);

  const res = await fetchX402(url.toString());
  const { data, meta } = await res.json();
  allTweets.push(...data);
  cursor = meta.has_next_page ? meta.next_cursor : undefined;
} while (cursor);
```

## Tips

- Use batch endpoints (`/tweets?ids=...`, `/users?ids=...`) to fetch multiple items in one request at the paginated tier price
- `{ref}` in user endpoints accepts either a username (`cascade_fyi`) or numeric user ID (`44196397`)
- Search supports all standard X/Twitter advanced search operators
- Quote URLs containing `?` or `&` in shell commands to avoid glob expansion
