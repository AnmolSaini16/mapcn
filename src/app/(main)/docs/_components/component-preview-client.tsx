"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./copy-button";

interface ComponentPreviewClientProps {
  children: React.ReactNode;
  code: string;
  highlightedCode: string;
  className?: string;
}

export function ComponentPreviewClient({
  children,
  code,
  highlightedCode,
  className,
}: ComponentPreviewClientProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "w-full overflow-hidden rounded-lg border",
          "h-[420px]",
          className,
        )}
        data-docs-live-preview
      >
        {children}
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border">
        <div className="absolute top-2 right-2 z-10">
          <CopyButton text={code} />
        </div>
        <div
          className={cn(
            "bg-muted/40 overflow-hidden p-4 text-sm transition-[max-height] [&_code]:bg-transparent! [&_pre]:bg-transparent!",
            expanded ? "max-h-[420px] overflow-auto" : "max-h-44",
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex w-full items-center justify-center",
            !expanded &&
              "from-background to-background/0 bg-linear-to-t pt-12 pb-6",
          )}
          data-docs-copy-strip
        >
          {!expanded && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="bg-background hover:bg-muted dark:bg-background dark:hover:bg-muted"
            >
              View Code
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
