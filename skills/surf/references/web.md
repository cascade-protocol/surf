# Web API Reference

Base URL: `https://web.surf.cascade.fyi`
OpenAPI spec: `https://web.surf.cascade.fyi/openapi.json`

Two POST endpoints: crawl web pages and search the web. Also available as an MCP server.

## MCP Server

Web is also available as an MCP server with 2 tools. Add to Claude Code:

```bash
claude mcp add -s user web -- npx x402-proxy https://web.surf.cascade.fyi/mcp
```

Or start the MCP server for any client:

```bash
npx x402-proxy https://web.surf.cascade.fyi/mcp
```

Setup wallet first (one-time): `npx x402-proxy`

### MCP Tools

| Tool | Params | Cost |
|------|--------|------|
| `surf_web_search` | `query` (required), `num_results` | $0.01 |
| `surf_web_crawl` | `url` (required), `format`, `selector`, `proxy` | $0.005 |

## Crawl

Extract content from web pages as markdown, HTML, or plain text.

```bash
# Single URL
npx x402-proxy --method POST \
  --header "Content-Type: application/json" \
  --body '{"url":"https://example.com"}' \
  https://web.surf.cascade.fyi/v1/crawl

# Multiple URLs in one request
npx x402-proxy --method POST \
  --header "Content-Type: application/json" \
  --body '{"urls":["https://example.com","https://example.org"]}' \
  https://web.surf.cascade.fyi/v1/crawl
```

```typescript
const res = await fetchX402("https://web.surf.cascade.fyi/v1/crawl", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://example.com",
    format: "markdown",
  }),
});
const result = await res.json();
// result.content, result.status, result.url
```

### Request body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | one of url/urls | Single URL to crawl |
| `urls` | string[] | one of url/urls | Multiple URLs (one payment covers all) |
| `format` | string | no | Output: `markdown` (default), `html`, `text` |
| `selector` | string | no | CSS selector to extract specific elements |
| `proxy` | boolean | no | Use proxy for blocked sites |

**Cost:** $0.005 per request

## Search

Web search powered by Exa. Returns titles, URLs, and snippets.

```bash
npx x402-proxy --method POST \
  --header "Content-Type: application/json" \
  --body '{"query":"x402 protocol"}' \
  https://web.surf.cascade.fyi/v1/search
```

```typescript
const res = await fetchX402("https://web.surf.cascade.fyi/v1/search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "x402 protocol",
    num_results: 10,
  }),
});
const { results } = await res.json();
// results[].title, results[].url, results[].snippet
```

### Request body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | yes | Search query |
| `num_results` | number | no | Results to return (1-20, default 5) |

**Cost:** $0.01 per request

## Tips

- Use `format: "markdown"` for LLM-friendly output
- The `selector` param extracts specific page elements (e.g., `"article"`, `".content"`)
- Batch URLs with the `urls` array to crawl multiple pages in one paid request
- Enable `proxy: true` for sites that block datacenter IPs
