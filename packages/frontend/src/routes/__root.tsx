/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import appCss from "@/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cascade Surf - Pay-per-use APIs for AI agents" },
      {
        name: "description",
        content:
          "Pay-per-use APIs for AI agents. Inference, Twitter data, and web scraping - no API keys, just pay per request with USDC.",
      },
      { property: "og:title", content: "Cascade Surf" },
      {
        property: "og:description",
        content: "Pay-per-use APIs for AI agents. One wallet, three services.",
      },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <div className="flex min-h-screen flex-col items-center px-6">
          <nav className="flex w-full max-w-[720px] items-center justify-between py-6">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="Cascade" width={32} height={32} />
              <span className="text-lg font-semibold">Surf</span>
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/cascade_fyi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                @cascade_fyi
              </a>
              <a
                href="https://github.com/cascade-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </nav>

          <main className="w-full max-w-[720px] flex-1 pb-12">
            <Outlet />
          </main>

          <footer className="w-full max-w-[720px] border-t border-border py-8 text-center text-xs text-muted-foreground">
            Built with{" "}
            <a
              href="https://www.x402.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              x402
            </a>{" "}
            by{" "}
            <a
              href="https://cascade.fyi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Cascade
            </a>
          </footer>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
