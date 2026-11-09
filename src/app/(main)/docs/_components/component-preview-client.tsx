"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CodeSurface } from "@/components/code-surface";
import { CodeCopyButton } from "@/components/code-copy-button";

interface ComponentPreviewClientProps {
  children: React.ReactNode;
  code: string;
  highlightedCode: string;
  /** Height of the preview panel. The expanded code block caps separately. */
  height?: string;
  className?: string;
}

export function ComponentPreviewClient({
  children,
  code,
  highlightedCode,
  height = "420px",
  className,
}: ComponentPreviewClientProps) {
  const [expanded, setExpanded] = useState(false);
  const codeId = useId();

  return (
    <div
      className={cn("bg-code overflow-hidden rounded-lg lg:-mx-3", className)}
      style={{ "--preview-height": height } as React.CSSProperties}
    >
      <div className="bg-background h-(--preview-height) overflow-hidden rounded-lg border *:h-full!">
        {children}
      </div>

      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <CodeCopyButton text={code} />
        </div>
        <CodeSurface
          id={codeId}
          className={cn(
            expanded
              ? "max-h-[420px] overflow-auto"
              : "max-h-26 overflow-hidden",
          )}
          html={highlightedCode}
        />
        {!expanded && (
          <div className="from-surface to-surface/0 pointer-events-none absolute inset-x-0 bottom-0 flex w-full items-center justify-center bg-linear-to-t pt-12 pb-4">
            <Button
              variant="outline"
              size="xs"
              onClick={() => setExpanded(true)}
              aria-expanded={expanded}
              aria-controls={codeId}
              className="dark:bg-background dark:hover:bg-muted pointer-events-auto"
            >
              View Code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
