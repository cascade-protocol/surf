# Reddit API Reference

Base URL: `https://reddit.surf.cascade.fyi`
OpenAPI spec: `https://reddit.surf.cascade.fyi/openapi.json`

7 GET endpoints across search, subreddits, posts, and users.

## MCP Server

Reddit is also available as an MCP server with 3 composite tools. Add to Claude Code:

```bash
claude mcp add -s user reddit -- npx x402-proxy https://reddit.surf.cascade.fyi/mcp
```

Or start the MCP server for any client:

```bash
npx x402-proxy https://reddit.surf.cascade.fyi/mcp
```

Setup wallet first (one-time): `npx x402-proxy`

### MCP Tools

| Tool | Params | Cost |
|------|--------|------|
| `reddit_search` | `query` (required), `subreddit`, `sort`, `time_range`, `limit` | $0.008 |
| `reddit_post` | `ref` (post ID or URL), `comment_sort`, `comment_limit` | $0.005 |
| `reddit_subreddit` | `name` (required), `sort`, `time_range`, `limit` | $0.005 |

These are composite tools - `reddit_post` returns post + comments in one call, `reddit_subreddit` returns subreddit info + posts. Use the REST endpoints below for granular access at lower per-request cost.

## Core endpoints

### Search Reddit

```bash
npx x402-proxy "https://reddit.surf.cascade.fyi/search?q=x402+protocol"
```

```typescript
const res = await fetchX402("https://reddit.surf.cascade.fyi/search?q=x402+protocol&limit=10");
const { data, meta } = await res.json();
// data[].id, data[].title, data[].author, data[].subreddit
// meta.has_next_page, meta.next_cursor
```

Query params: `q` (required), `sort` (relevance/hot/top/new/comments), `t` (hour/day/week/month/year/all), `limit` (1-100), `cursor`
**Cost:** $0.005

### Get subreddit info

```bash
npx x402-proxy https://reddit.surf.cascade.fyi/r/programming
```

```typescript
const res = await fetchX402("https://reddit.surf.cascade.fyi/r/programming");
const { data } = await res.json();
// data.name, data.title, data.subscribers, data.active_users
```

**Cost:** $0.001

### Get subreddit posts

```bash
npx x402-proxy "https://reddit.surf.cascade.fyi/r/programming/posts?sort=top&t=week"
```

```typescript
const res = await fetchX402("https://reddit.surf.cascade.fyi/r/programming/posts?sort=top&t=week");
const { data, meta } = await res.json();
// data[].id, data[].title, data[].author, data[].public_metrics.score
```

Query params: `sort` (hot/new/top/rising), `t` (hour/day/week/month/year/all), `limit` (1-100), `cursor`
**Cost:** $0.003

### Get post with comments

```bash
npx x402-proxy https://reddit.surf.cascade.fyi/posts/1a2b3c
```

```typescript
const res = await fetchX402("https://reddit.surf.cascade.fyi/posts/1a2b3c");
const { data, comments, meta } = await res.json();
// data.title, data.selftext, data.author
// comments[].body, comments[].author, comments[].score, comments[].depth
// meta.comment_count
```

Query params: `comment_sort` (confidence/top/new/controversial/old/qa), `comment_limit` (0-200, default 50), `comment_depth` (0-10, default 5)
**Cost:** $0.004

### Get user profile

```bash
npx x402-proxy https://reddit.surf.cascade.fyi/users/spez
```

```typescript
const res = await fetchX402("https://reddit.surf.cascade.fyi/users/spez");
const { data } = await res.json();
// data.name, data.link_karma, data.comment_karma, data.created_at
```

**Cost:** $0.001

### Get user posts

```bash
npx x402-proxy "https://reddit.surf.cascade.fyi/users/spez/posts?sort=top&t=year"
```

Query params: `sort` (hot/new/top/controversial), `t` (hour/day/week/month/year/all), `limit` (1-100), `cursor`
**Cost:** $0.004

### Get user comments

```bash
npx x402-proxy "https://reddit.surf.cascade.fyi/users/spez/comments?sort=top"
```

Query params: `sort` (hot/new/top/controversial), `t` (hour/day/week/month/year/all), `limit` (1-100), `cursor`
**Cost:** $0.004

## Complete endpoint reference

| Endpoint | Params | Cost |
|----------|--------|------|
| `GET /search` | `q` (required), `sort`, `t`, `limit`, `cursor` | $0.005 |
| `GET /r/{subreddit}` | | $0.001 |
| `GET /r/{subreddit}/posts` | `sort`, `t`, `limit`, `cursor` | $0.003 |
| `GET /posts/{id}` | `comment_sort`, `comment_limit`, `comment_depth` | $0.004 |
| `GET /users/{username}` | | $0.001 |
| `GET /users/{username}/posts` | `sort`, `t`, `limit`, `cursor` | $0.004 |
| `GET /users/{username}/comments` | `sort`, `t`, `limit`, `cursor` | $0.004 |

## Pagination

Paginated endpoints return `meta.has_next_page` and `meta.next_cursor`. Pass `cursor` as a query param for the next page:

```typescript
let cursor: string | undefined;
const allPosts = [];

do {
  const url = new URL("https://reddit.surf.cascade.fyi/r/programming/posts");
  url.searchParams.set("sort", "top");
  url.searchParams.set("t", "week");
  if (cursor) url.searchParams.set("cursor", cursor);

  const res = await fetchX402(url.toString());
  const { data, meta } = await res.json();
  allPosts.push(...data);
  cursor = meta.has_next_page ? meta.next_cursor : undefined;
} while (cursor);
```

## Tips

- Post IDs accept either a short ID (`1a2b3c`) or a full Reddit URL
- Use `comment_limit: 0` to fetch a post without comments (faster, cheaper data)
- The `t` param only affects `top` and `controversial` sorts
- Quote URLs containing `?` or `&` in shell commands to avoid glob expansion
