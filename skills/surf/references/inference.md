# Inference API Reference

Base URL: `https://inference.surf.cascade.fyi`
OpenAPI spec: `https://inference.surf.cascade.fyi/openapi.json`

OpenAI-compatible chat completion endpoint. One route: `POST /v1/chat/completions`.

## Models

| Model | Cost | Notes |
|-------|------|-------|
| `anthropic/claude-sonnet-4.5` | from $0.10 | Dynamic pricing - varies by token usage (base: 4096 max_tokens) |
| `anthropic/claude-sonnet-4.6` | from $0.10 | Dynamic pricing - varies by token usage (base: 4096 max_tokens) |
| `anthropic/claude-opus-4.5` | from $0.17 | Dynamic pricing - varies by token usage (base: 4096 max_tokens) |
| `anthropic/claude-opus-4.6` | from $0.17 | Dynamic pricing - varies by token usage (base: 4096 max_tokens) |
| `z-ai/glm-5` | from $0.030 | Dynamic pricing - strongest open-weight coding/agent model, 200K context, reasoning mode |
| `minimax/minimax-m2.7` | from $0.012 | Dynamic pricing - MoE (230B/10B active), strong coding and agentic workflows, 200K context, reasoning mode |
| `moonshotai/kimi-k2.5` | $0.004 | Strong reasoning, code, long context |
| `minimax/minimax-m2.5` | $0.003 | Fast general-purpose |
| `qwen/qwen-2.5-7b-instruct` | $0.001 | Lightweight, fast, cheap utility tier |

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
| `max_tokens` | number | no | Max tokens to generate. Defaults to 2048 for flat models, 4096 for dynamic models. Higher values increase the x402 price for dynamic models |
| `max_completion_tokens` | number | no | Alias for max_tokens (preferred for Anthropic models) |
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
