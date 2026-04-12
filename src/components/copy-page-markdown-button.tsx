"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { docsPageElementToMarkdown } from "@/lib/docs-dom-to-markdown";
import { PAGE_MARKDOWN_ROOT_ID } from "@/lib/page-markdown-ids";
import { cn } from "@/lib/utils";

interface CopyPageAsMarkdownButtonProps {
  className?: string;
}

export function CopyPageAsMarkdownButton({
  className,
}: CopyPageAsMarkdownButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const el = document.getElementById(PAGE_MARKDOWN_ROOT_ID);
    if (!el) return;
    const md = docsPageElementToMarkdown(el);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={cn(
        "text-muted-foreground hover:text-foreground gap-1.5",
        className,
      )}
      aria-label="Copy page as Markdown"
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      {copied ? "Copied" : "Copy Markdown"}
    </Button>
  );
}
