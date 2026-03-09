---
name: surf-inference
description: "LLM inference via Surf's paid API: OpenAI-compatible chat completions at inference.surf.cascade.fyi. Supports Kimi K2.5 ($0.003), MiniMax M2.5 ($0.002). Uses @x402/fetch for automatic USDC micropayments on Solana. Use when: (1) calling LLM chat completions via a pay-per-request endpoint, (2) integrating x402 payment flow into an agent, (3) generating text with kimi or minimax models, (4) streaming LLM responses via SSE."
---

# Surf Inference

OpenAI-compatible chat completions at `https://inference.surf.cascade.fyi`. Flat-rate USDC micropayments per call via x402 on Solana.

## Setup (Solana)

```bash
npm install @x402/fetch @x402/svm @solana/kit
```

```typescript
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { registerExactSvmScheme } from "@x402/svm/exact/client";
import { createKeyPairSignerFromPrivateKeyBytes } from "@solana/kit";

// Create signer from Solana keypair (first 32 bytes = private key)
const signer = await createKeyPairSignerFromPrivateKeyBytes(
  new Uint8Array(keypairBytes.slice(0, 32)),
);

// Register Solana payment scheme and wrap fetch
const client = new x402Client();
registerExactSvmScheme(client, { signer });
const x402Fetch = wrapFetchWithPayment(fetch, client);
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
console.log(data.choices[0].message.content);
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| model | string | yes | Model ID (see table below) |
| messages | array | yes | Array of `{role, content}` objects |
| max_tokens | integer | no | Maximum tokens to generate |
| temperature | number | no | Sampling temperature (0-2) |
| stream | boolean | no | Enable SSE streaming |

**Message roles:** `system`, `user`, `assistant`

### Streaming

Set `stream: true` to receive Server-Sent Events:

```typescript
const res = await x402Fetch(
  "https://inference.surf.cascade.fyi/v1/chat/completions",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "moonshotai/kimi-k2.5",
      messages: [{ role: "user", content: "Write a haiku" }],
      stream: true,
    }),
  },
);

const reader = res.body.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  // Each line: "data: {json}\n\n" or "data: [DONE]\n\n"
  for (const line of chunk.split("\n")) {
    if (line.startsWith("data: ") && line !== "data: [DONE]") {
      const delta = JSON.parse(line.slice(6));
      process.stdout.write(delta.choices[0]?.delta?.content ?? "");
    }
  }
}
```

## Models & Pricing

| Model | Cost/call | Context | Best for |
|-------|-----------|---------|----------|
| `moonshotai/kimi-k2.5` | $0.003 | 262K tokens | High-quality, reasoning chains |
| `minimax/minimax-m2.5` | $0.002 | Large | Balanced quality/cost |

## Response

```typescript
interface ChatCompletion {
  id: string;                  // "gen-..."
  object: "chat.completion";
  model: string;               // e.g. "moonshotai/kimi-k2.5-0127"
  created: number;             // Unix timestamp
  choices: [{
    index: number;
    message: {
      role: "assistant";
      content: string;
      reasoning?: string;      // Chain-of-thought (Kimi K2.5)
    };
    finish_reason: "stop" | "length";
  }];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

Kimi K2.5 may include a `reasoning` field in `choices[0].message` with chain-of-thought output.

## Errors

| HTTP | Meaning |
|------|---------|
| 400 | Invalid request (check model name and messages format) |
| 402 | Payment required (handled automatically by @x402/fetch) |
| 502 | Upstream provider error |

## Tips

- Price is flat per call, not per token. Long outputs cost the same as short ones.
- Use `max_tokens` to control output length when you need concise answers.
- Kimi K2.5's `reasoning` field is useful for debugging complex prompts.
- The API is OpenAI-compatible, so any OpenAI SDK can be used if you handle the 402 flow manually.

## Payment

- Network: Solana mainnet
- Token: USDC
- Facilitator: https://facilitator.cascade.fyi
