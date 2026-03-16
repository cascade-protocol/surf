import { createFileRoute } from "@tanstack/react-router";
import { Bot, Check, Copy, Globe, MessageSquare, Zap } from "lucide-react";
import { useCallback, useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const SERVICES = [
  {
    name: "Inference",
    icon: Bot,
    domain: "inference.surf.cascade.fyi",
    description: "LLM gateway via OpenRouter. Send chat completions, pay per request.",
    endpoints: [{ method: "POST", path: "/v1/chat/completions" }],
    pricing: [
      { label: "kimi-k2.5", price: "$0.004" },
      { label: "minimax-m2.5", price: "$0.003" },
    ],
    networks: ["Solana", "Base"],
  },
  {
    name: "Twitter",
    icon: MessageSquare,
    domain: "twitter.surf.cascade.fyi",
    description:
      "Twitter data API. 27 endpoints across tweets, users, lists, communities, spaces, and trends.",
    endpoints: [
      { method: "GET", path: "/users/{ref}" },
      { method: "GET", path: "/users/{ref}/tweets" },
      { method: "GET", path: "/tweets/search?q={query}" },
      { method: "GET", path: "/tweets/{id}" },
    ],
    pricing: [
      { label: "Lookup", price: "$0.001" },
      { label: "Paginated", price: "$0.002" },
      { label: "Search", price: "$0.003" },
    ],
    networks: ["Solana", "Base"],
  },
  {
    name: "Web",
    icon: Globe,
    domain: "web.surf.cascade.fyi",
    description: "Web crawling and search. Scrape pages or search the web via Exa.",
    endpoints: [
      { method: "POST", path: "/v1/crawl" },
      { method: "POST", path: "/v1/search" },
    ],
    pricing: [
      { label: "Crawl", price: "$0.005" },
      { label: "Search", price: "$0.01" },
    ],
    networks: ["Solana", "Base"],
  },
] as const;

function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <QuickStart />
    </>
  );
}

function Hero() {
  return (
    <section className="mb-16 pt-8 text-center">
      <h1 className="mb-4 text-4xl font-bold">Pay-per-use APIs for AI agents</h1>
      <p className="text-muted mx-auto max-w-md text-lg">
        Inference, Twitter data, and web scraping. No API keys, no subscriptions - just pay per
        request with USDC via the x402 protocol.
      </p>
    </section>
  );
}

function Services() {
  return (
    <section className="mb-16">
      <h2 className="text-muted mb-6 text-xs uppercase tracking-wider">Services</h2>
      <div className="grid gap-4">
        {SERVICES.map((svc) => (
          <ServiceCard key={svc.name} {...svc} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({
  name,
  icon: Icon,
  domain,
  description,
  endpoints,
  pricing,
  networks,
}: (typeof SERVICES)[number]) {
  return (
    <div className="rounded-[0.625rem] border border-border bg-card px-5 py-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon className="size-4 text-accent" />
          <h3 className="font-semibold">{name}</h3>
        </div>
        <div className="flex gap-1.5">
          {networks.map((net) => (
            <span
              key={net}
              className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[0.65rem] text-accent"
            >
              {net}
            </span>
          ))}
        </div>
      </div>

      <p className="text-muted mb-4 text-sm">{description}</p>

      <div className="mb-3 space-y-1.5">
        {endpoints.map((ep) => (
          <div key={ep.path} className="flex items-center gap-3 font-mono text-xs">
            <span
              className={`min-w-[3rem] rounded px-1.5 py-0.5 text-center text-[0.65rem] font-bold ${
                ep.method === "GET" ? "bg-secondary text-green-400" : "bg-secondary text-yellow-400"
              }`}
            >
              {ep.method}
            </span>
            <span className="text-fg/80">{ep.path}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="flex gap-3">
          {pricing.map((p) => (
            <span key={p.label} className="text-muted text-xs">
              {p.label}: <span className="text-fg font-mono font-medium">{p.price}</span>
            </span>
          ))}
        </div>
        <code className="text-muted text-[0.65rem]">{domain}</code>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);

  return (
    <button
      type="button"
      onClick={copy}
      className="absolute top-2.5 right-2.5 rounded border border-border bg-secondary p-1.5 text-muted transition-colors hover:text-fg"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

function CodeBlock({ code, header }: { code: string; header?: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-[#131416]">
      {header && (
        <div className="border-b border-border/50 px-4 py-2 text-[0.7rem] text-yellow-400">
          {header}
        </div>
      )}
      <CopyButton text={code} />
      <pre className="overflow-x-auto p-4 pr-10 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function QuickStart() {
  return (
    <section className="mb-16">
      <h2 className="text-muted mb-6 text-xs uppercase tracking-wider">Quick Start</h2>

      <div className="space-y-4">
        <div className="rounded-[0.625rem] border border-border bg-card px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="size-4 text-accent" />
            <h3 className="text-sm font-semibold">Try it now</h3>
          </div>
          <p className="text-muted mb-3 text-sm">
            Test any endpoint instantly with{" "}
            <a
              href="https://github.com/cascade-protocol/x402-proxy"
              className="text-accent underline-offset-2 hover:underline"
            >
              x402-proxy
            </a>{" "}
            - no code, no wallet setup:
          </p>
          <CodeBlock code={tryItExample} />
        </div>

        <div className="rounded-[0.625rem] border border-border bg-card px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="size-4 text-accent" />
            <h3 className="text-sm font-semibold">Integrate with @x402/fetch</h3>
          </div>
          <CodeBlock code={codeExample} header="npm install @x402/fetch" />
        </div>
      </div>
    </section>
  );
}

const tryItExample = `npx x402-proxy https://twitter.surf.cascade.fyi/users/cascade_fyi`;

const codeExample = `import { wrapFetch } from "@x402/fetch";

const x402Fetch = wrapFetch(fetch, walletClient);

const res = await x402Fetch(
  "https://inference.surf.cascade.fyi/v1/chat/completions",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "moonshotai/kimi-k2.5",
      messages: [{ role: "user", content: "Hello!" }],
    }),
  },
);

const data = await res.json();`;
