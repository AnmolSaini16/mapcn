"use client";

import { Check, Copy } from "lucide-react";
import { getCopyLabel, useCopy } from "@/hooks/use-copy";
import { trackEvent } from "@/lib/events";
import { mapInstallCommand } from "@/lib/llm-prompts";
import { cn } from "@/lib/utils";

export function HeroInstallCommand({ className }: { className?: string }) {
  const { status, copy } = useCopy();

  async function copyCommand() {
    if (await copy(mapInstallCommand)) {
      trackEvent({
        name: "copy_install_command",
        properties: { name: "@mapcn/map", source: "hero" },
      });
    }
  }

  return (
    <button
      type="button"
      onClick={copyCommand}
      title="Copy install command"
      className={cn(
        "group bg-surface ring-foreground/10 focus-visible:ring-ring/50 hover:bg-muted dark:hover:bg-muted/70 inline-flex h-10 min-w-0 items-center gap-2 rounded-md px-4 font-mono text-[13px] ring-1 transition-colors outline-none focus-visible:ring-[3px]",
        className,
      )}
    >
      <span className="truncate">{mapInstallCommand}</span>
      <span className="text-muted-foreground group-hover:text-foreground ml-1 transition-colors [&_svg]:size-3.5">
        {status === "copied" ? <Check /> : <Copy />}
      </span>
      <span aria-live="polite" className="sr-only">
        {getCopyLabel(status, "")}
      </span>
    </button>
  );
}
