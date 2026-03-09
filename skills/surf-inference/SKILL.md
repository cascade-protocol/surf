---
name: surf-inference
description: "LLM inference via Surf's paid API: OpenAI-compatible chat completions at inference.surf.cascade.fyi. Supports Kimi K2.5 ($0.003), MiniMax M2.5 ($0.002). Uses @x402/fetch for automatic USDC micropayments on Solana. Use when: (1) calling LLM chat completions via a pay-per-request endpoint, (2) integrating x402 payment flow into an agent, (3) generating text with kimi or minimax models."
---

# Surf Inference

Paid OpenAI-compatible chat completions API at `https://inference.surf.cascade.fyi`. Costs $0.002-$0.003 USDC per call via x402 on Solana.

## Setup

```bash
npm install @x402/fetch
```

```typescript
import { wrapFetch } from "@x402/fetch";

const x402Fetch = wrapFetch(fetch, walletClient);
```

## Endpoint

### POST /v1/chat/completions

```typescript
const res = await x402Fetch(
  "https://inference.surf.cascade.fyi/v1/chat/completions",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "moonshotai/kimi-k2.5",
      messages: [{ role: "user", content: "Explain x402 in one sentence" }],
    }),
  },
);
const data = await res.json();
```

**Body Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| model | string | yes | Model ID (see table below) |
| messages | array | yes | Array of `{role, content}` objects |
| max_tokens | integer | no | Maximum tokens to generate |
| temperature | number | no | Sampling temperature (0-2) |
| stream | boolean | no | Enable streaming (SSE) |

**Message roles:** `system`, `user`, `assistant`

## Models & Pricing

| Model | Cost/call | Best for |
|-------|-----------|----------|
| `moonshotai/kimi-k2.5` | $0.003 | High-quality output, large context (262K) |
| `minimax/minimax-m2.5` | $0.002 | Balanced quality/cost |

## Response Format

Standard OpenAI chat completion response:

```json
{
  "id": "gen-...",
  "object": "chat.completion",
  "model": "moonshotai/kimi-k2.5",
  "choices": [{
    "index": 0,
    "message": { "role": "assistant", "content": "..." },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 42,
    "total_tokens": 54
  }
}
```

## Errors

| HTTP | Meaning |
|------|---------|
| 400 | Invalid request (check model name and messages format) |
| 402 | Payment required (handled automatically by @x402/fetch) |
| 502 | Upstream provider error |

## Payment

- Network: Solana mainnet
- Token: USDC
- Facilitator: https://facilitator.cascade.fyi
- Price: flat rate per model per call, determined by `model` field
