# Inference API Reference

Base URL: `https://inference.surf.cascade.fyi`
OpenAPI spec: `https://inference.surf.cascade.fyi/openapi.json`

OpenAI-compatible chat completion endpoint. One route: `POST /v1/chat/completions`.

## Models

| Model | Cost | Notes |
|-------|------|-------|
| `moonshotai/kimi-k2.5` | $0.004 | Strong reasoning, code, long context |
| `minimax/minimax-m2.5` | $0.003 | Fast general-purpose |

## Chat completion

```bash
npx x402-proxy --method POST \
  --header "Content-Type: application/json" \
  --body '{"model":"moonshotai/kimi-k2.5","messages":[{"role":"user","content":"Hello"}]}' \
  https://inference.surf.cascade.fyi/v1/chat/completions
```

```typescript
const res = await fetchX402("https://inference.surf.cascade.fyi/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "moonshotai/kimi-k2.5",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Explain quantum computing briefly." },
    ],
    max_tokens: 500,
    temperature: 0.7,
  }),
});
const data = await res.json();
// data.choices[0].message.content
// data.usage.prompt_tokens, data.usage.completion_tokens
```

### Request body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | yes | Model identifier (see table above) |
| `messages` | array | yes | Chat messages with `role` (user/assistant/system) and `content` |
| `stream` | boolean | no | Enable SSE streaming (default: false) |
| `max_tokens` | number | no | Max tokens to generate (capped at 2048) |
| `temperature` | number | no | Sampling temperature (0-2) |

## Streaming

Set `stream: true` to receive Server-Sent Events:

```typescript
const res = await fetchX402("https://inference.surf.cascade.fyi/v1/chat/completions", {
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

## Rate limits

- 20 requests per 60 seconds per wallet
- Duplicate payment headers are rejected

## Tips

- The API is OpenAI-compatible - existing code works by changing the base URL and using `fetchX402`
- Streaming is recommended for interactive use - you pay once and the full response streams back
- Model IDs use the `provider/model` format (e.g., `moonshotai/kimi-k2.5`)
