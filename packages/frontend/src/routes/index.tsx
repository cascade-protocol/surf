import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Check,
  ChevronRight,
  Copy,
  Globe,
  MessageSquare,
  Plug,
  Terminal,
  Zap,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
      "Twitter data API. 26 endpoints across tweets, users, lists, communities, spaces, and trends.",
    endpoints: [
      { method: "GET", path: "/users/{ref}" },
      { method: "GET", path: "/users/{ref}/tweets" },
      { method: "GET", path: "/tweets/search" },
      { method: "GET", path: "/tweets/{id}" },
    ],
    pricing: [{ label: "Per request", price: "$0.001 – $0.005" }],
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

const TWITTER_ENDPOINTS = [
  {
    group: "Tweets",
    endpoints: [
      { path: "/tweets/search", price: "$0.005" },
      { path: "/tweets/{id}", price: "$0.001" },
      { path: "/tweets", price: "$0.004" },
      { path: "/tweets/{id}/replies", price: "$0.004" },
      { path: "/tweets/{id}/quotes", price: "$0.004" },
      { path: "/tweets/{id}/retweeters", price: "$0.004" },
      { path: "/tweets/{id}/thread", price: "$0.004" },
      { path: "/tweets/{id}/article", price: "$0.005" },
    ],
  },
  {
    group: "Users",
    endpoints: [
      { path: "/users/{ref}", price: "$0.001" },
      { path: "/users/search", price: "$0.004" },
      { path: "/users/relationship", price: "$0.001" },
      { path: "/users", price: "$0.004" },
      { path: "/users/{ref}/tweets", price: "$0.004" },
      { path: "/users/{ref}/mentions", price: "$0.004" },
      { path: "/users/{ref}/followers", price: "$0.004" },
      { path: "/users/{ref}/following", price: "$0.004" },
      { path: "/users/{ref}/verified_followers", price: "$0.004" },
    ],
  },
  {
    group: "Lists",
    endpoints: [
      { path: "/lists/{id}/tweets", price: "$0.004" },
      { path: "/lists/{id}/members", price: "$0.004" },
      { path: "/lists/{id}/followers", price: "$0.004" },
    ],
  },
  {
    group: "Communities",
    endpoints: [
      { path: "/communities/search", price: "$0.004" },
      { path: "/communities/{id}", price: "$0.004" },
      { path: "/communities/{id}/tweets", price: "$0.004" },
      { path: "/communities/{id}/members", price: "$0.004" },
    ],
  },
  {
    group: "Other",
    endpoints: [
      { path: "/spaces/{id}", price: "$0.001" },
      { path: "/trends", price: "$0.001" },
    ],
  },
] as const;

const MCP_TOOLS = [
  { name: "twitter_search", desc: "Search with advanced operators", price: "$0.008" },
  { name: "twitter_tweet", desc: "Tweet + thread + replies", price: "$0.005" },
  { name: "twitter_user", desc: "Profile + recent tweets", price: "$0.005" },
] as const;

const RESPONSE_EXAMPLE = `// GET /users/cascade_fyi  ($0.001)
{
  "data": {
    "id": "1716142083299860480",
    "username": "cascade_fyi",
    "name": "Cascade",
    "description": "Pay-per-use APIs for AI agents",
    "public_metrics": {
      "followers_count": 128,
      "following_count": 42,
      "tweet_count": 314,
      "like_count": 891
    },
    "created_at": "2023-10-22T15:30:00.000Z",
    "profile_image_url": "https://pbs.twimg.com/..."
  }
}`;

const WORKFLOW_EXAMPLE = `// Research a person: profile + latest article + AI summary
const profile = await x402Fetch("https://twitter.surf.cascade.fyi/users/elonmusk");
const { data: user } = await profile.json();

const tweets = await x402Fetch(\`https://twitter.surf.cascade.fyi/users/\${user.username}/tweets\`);
const { data: posts } = await tweets.json();

const article = posts.find(t => t.entities?.urls?.length);
const page = await x402Fetch("https://web.surf.cascade.fyi/v1/crawl", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: article.entities.urls[0].expanded_url }),
});

const summary = await x402Fetch("https://inference.surf.cascade.fyi/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "moonshotai/kimi-k2.5",
    messages: [{ role: "user", content: \`Summarize: \${(await page.json()).content}\` }],
  }),
});
// Total cost: $0.001 + $0.004 + $0.005 + $0.004 = $0.014`;

const FAQ_ITEMS = [
  {
    q: "What is x402?",
    a: "x402 is an open HTTP payment protocol backed by Coinbase. When your agent hits a paid endpoint, the server returns 402 Payment Required with payment instructions. The client library (@x402/fetch) automatically signs a USDC payment and retries. Your agent's wallet is the only credential needed - no API keys, no OAuth, no accounts.",
  },
  {
    q: "Do I pay for failed requests?",
    a: "No. Payment is only settled on-chain when the server returns a successful response. If the upstream service errors or times out, you are not charged.",
  },
  {
    q: "What are the rate limits?",
    a: "Inference: 20 requests per 60 seconds per wallet. Web: 10 concurrent requests. Twitter: no per-wallet rate limit. If you hit a limit, you get a 429 response with no charge.",
  },
  {
    q: "What wallet do I need?",
    a: "Any Solana or Base (EVM) wallet holding USDC. For testing, x402-proxy generates a wallet on first run. For production, pass your Keypair (Solana) or WalletClient (Base) to @x402/fetch.",
  },
  {
    q: "What happens when my balance runs out?",
    a: "You get a 402 response with an insufficient-balance reason. No partial charges - either the full request is paid or nothing is deducted. Top up your USDC and retry.",
  },
  {
    q: "What is the Twitter MCP server?",
    a: "An MCP server at twitter.surf.cascade.fyi/mcp that exposes 3 composite tools: twitter_search ($0.008), twitter_tweet ($0.005), and twitter_user ($0.005). Each tool bundles multiple API calls into one - for example, twitter_tweet returns the tweet, its thread, and parent context in a single call. Add it to Claude Code with: claude mcp add -s user twitter -- npx x402-proxy https://twitter.surf.cascade.fyi/mcp",
  },
] as const;

const COST_EXAMPLES = [
  {
    title: "Research 20 outreach targets",
    total: "$0.27",
    calls: "70 API calls",
    breakdown: "5 searches + 20 profiles + 20 timelines + 5 page crawls + 20 LLM calls",
  },
  {
    title: "Monitor a keyword for a week",
    total: "$0.37",
    calls: "126 API calls",
    breakdown: "49 searches + 50 tweet lookups + 20 profiles + 7 daily summaries",
  },
] as const;

function HomePage() {
  return (
    <>
      <Hero />
      <CostExamples />
      <QuickStart />
      <Services />
      <ResponseExample />
      <WorkflowExample />
      <FAQ />
    </>
  );
}

function Hero() {
  return (
    <section className="mb-16 pt-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">Pay-per-use APIs for AI agents</h1>
        <p className="mx-auto max-w-lg text-lg text-muted-foreground">
          Your agent's wallet is the only credential. No API keys to provision, no subscriptions to
          manage. One wallet, three services.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Built on{" "}
          <a
            href="https://www.x402.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-2 hover:underline"
          >
            x402
          </a>
          , the Coinbase-backed HTTP payment protocol
        </p>
      </div>
      <CodeBlock code="npx x402-proxy https://twitter.surf.cascade.fyi/users/cascade_fyi" />
    </section>
  );
}

function CostExamples() {
  return (
    <section className="mb-16">
      <h2 className="mb-6 text-xs uppercase tracking-wider text-muted-foreground">What it costs</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {COST_EXAMPLES.map((ex) => (
          <Card key={ex.title}>
            <CardContent className="px-5 py-4">
              <p className="mb-1 text-sm font-medium text-foreground">{ex.title}</p>
              <p className="mb-2 font-mono text-2xl font-bold text-primary">{ex.total}</p>
              <p className="text-xs text-muted-foreground">
                {ex.calls} &mdash; {ex.breakdown}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="mb-16">
      <h2 className="mb-6 text-xs uppercase tracking-wider text-muted-foreground">Services</h2>
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
    <Card>
      <CardHeader className="flex-row items-center justify-between px-5 pb-0 pt-5">
        <div className="flex items-center gap-2.5">
          <Icon className="size-4 text-primary" />
          <CardTitle>{name}</CardTitle>
        </div>
        <div className="flex gap-1.5">
          {networks.map((net) => (
            <Badge key={net} variant="secondary">
              {net}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5 pt-3">
        <CardDescription>{description}</CardDescription>

        <div className="space-y-1.5">
          {endpoints.map((ep) => (
            <div key={ep.path} className="flex items-center gap-3 font-mono text-xs">
              <span
                className={cn(
                  "min-w-[3rem] rounded px-1.5 py-0.5 text-center text-[0.65rem] font-bold",
                  ep.method === "GET"
                    ? "bg-secondary text-green-400"
                    : "bg-secondary text-yellow-400",
                )}
              >
                {ep.method}
              </span>
              <span className="text-foreground/80">{ep.path}</span>
            </div>
          ))}
        </div>

        {name === "Twitter" && (
          <details className="group">
            <summary className="flex cursor-pointer select-none list-none items-center gap-1.5 text-xs font-medium text-primary [&::-webkit-details-marker]:hidden">
              <ChevronRight className="size-3 transition-transform group-open:rotate-90" />
              All 26 endpoints
            </summary>
            <div className="mt-3 space-y-3">
              {TWITTER_ENDPOINTS.map((g) => (
                <div key={g.group}>
                  <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
                    {g.group}
                  </p>
                  <div className="space-y-1">
                    {g.endpoints.map((ep) => (
                      <div
                        key={ep.path}
                        className="flex items-center justify-between font-mono text-xs"
                      >
                        <span className="text-foreground/80">GET {ep.path}</span>
                        <span className="text-muted-foreground">{ep.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}

        {name === "Twitter" && (
          <div className="space-y-1.5">
            <p className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
              MCP Tools
            </p>
            <div className="space-y-1">
              {MCP_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center justify-between font-mono text-xs"
                >
                  <span className="text-foreground/80">{tool.name}</span>
                  <span className="text-muted-foreground">{tool.price}</span>
                </div>
              ))}
            </div>
            <p className="text-[0.65rem] text-muted-foreground">
              Composite tools - each bundles multiple API calls into one.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex gap-3">
            {pricing.map((p) => (
              <span key={p.label} className="text-xs text-muted-foreground">
                {p.label}: <span className="font-mono font-medium text-foreground">{p.price}</span>
              </span>
            ))}
          </div>
          <a
            href={`https://${domain}/openapi.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            OpenAPI spec &rarr;
          </a>
        </div>
      </CardContent>
    </Card>
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
      className="absolute top-2.5 right-2.5 rounded border border-border bg-secondary p-1.5 text-muted-foreground transition-colors hover:text-foreground"
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
      <h2 className="mb-6 text-xs uppercase tracking-wider text-muted-foreground">Get started</h2>

      <div className="space-y-4">
        <Card>
          <CardContent className="px-5 py-4">
            <div className="mb-3 flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">Add to Claude Code</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Install the{" "}
              <a
                href="https://github.com/cascade-protocol/surf/tree/main/skills/surf"
                className="text-primary underline-offset-2 hover:underline"
              >
                Surf skill
              </a>{" "}
              - adds the API reference to your Claude so you can skip the docs:
            </p>
            <CodeBlock code={skillInstall} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-5 py-4">
            <div className="mb-3 flex items-center gap-2">
              <Plug className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">Connect as MCP Server</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Twitter data as native Claude tools. 3 composite tools that bundle search, profiles,
              threads, and replies into single calls.
            </p>
            <CodeBlock code={mcpInstallExample} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-5 py-4">
            <div className="mb-3 flex items-center gap-2">
              <Terminal className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">Try an endpoint</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Test any endpoint with{" "}
              <a
                href="https://github.com/cascade-protocol/x402-proxy"
                className="text-primary underline-offset-2 hover:underline"
              >
                x402-proxy
              </a>{" "}
              - no code, no wallet setup:
            </p>
            <CodeBlock code={tryItExample} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-5 py-4">
            <div className="mb-3 flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">Integrate with @x402/fetch</h3>
            </div>
            <CodeBlock code={codeExample} header="npm install @x402/fetch" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ResponseExample() {
  return (
    <section className="mb-16">
      <h2 className="mb-6 text-xs uppercase tracking-wider text-muted-foreground">
        What you get back
      </h2>
      <CodeBlock code={RESPONSE_EXAMPLE} header="Response" />
    </section>
  );
}

function WorkflowExample() {
  return (
    <section className="mb-16">
      <h2 className="mb-6 text-xs uppercase tracking-wider text-muted-foreground">
        Three services, one flow
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Profile lookup, page crawl, and AI summary in 15 lines. Total cost: $0.014.
      </p>
      <CodeBlock code={WORKFLOW_EXAMPLE} header="workflow.ts" />
    </section>
  );
}

function FAQ() {
  return (
    <section className="mb-16">
      <h2 className="mb-6 text-xs uppercase tracking-wider text-muted-foreground">FAQ</h2>
      <Card>
        <CardContent className="divide-y divide-border px-5 py-0">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer select-none list-none items-center gap-2 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                {item.q}
              </summary>
              <p className="mt-2 pl-6 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

const skillInstall = "npx skills add cascade-protocol/surf";

const mcpInstallExample = `# Setup wallet (first time only)
npx x402-proxy

# Add to Claude Code
claude mcp add -s user twitter -- npx x402-proxy https://twitter.surf.cascade.fyi/mcp

# Or start the MCP server for any client
npx x402-proxy https://twitter.surf.cascade.fyi/mcp`;

const tryItExample = "npx x402-proxy https://twitter.surf.cascade.fyi/users/cascade_fyi";

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
