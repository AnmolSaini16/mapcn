"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "site-url-here";

const installCommand = `npx shadcn@latest add ${siteUrl}/maps/map.json`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? (
        <Check className="size-4 text-emerald-500" />
      ) : (
        <Copy className="size-4" />
      )}
    </button>
  );
}

export function Hero() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight animate-fade-up text-primary">
          Beautiful maps, made simple.
        </h1>
        <p className="text-foreground/80 text-lg max-w-xl mx-auto leading-relaxed animate-fade-up delay-100">
          Beautiful, ready to use, and customizable map components built on
          MapLibre. Styled with Tailwind. Zero config. One command setup.
        </p>
      </div>
      <div className="animate-fade-up delay-200 text-center">
        <div className="inline-flex items-center gap-3 bg-secondary/60 border border-border/40 rounded-full px-4 py-2.5 font-mono text-sm max-w-full overflow-x-auto">
          <span className="text-muted-foreground/60 shrink-0">$</span>
          <code className="text-foreground/90 truncate">{installCommand}</code>
          <CopyButton text={installCommand} />
        </div>
      </div>
      {/* CTA Buttons */}
      <div className="flex flex-wrap justify-center items-center gap-3 animate-fade-up delay-300">
        <Button asChild>
          <Link href="/docs">
            Get Started <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/docs/basic-map" className="text-muted-foreground">
            View Examples
          </Link>
        </Button>
      </div>{" "}
    </div>
  );
}
