"use client";

import { Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCopyLabel, useCopy } from "@/hooks/use-copy";
import { trackEvent } from "@/lib/events";

export function BlockInstallButton({ name }: { name: string }) {
  const { status, copy } = useCopy();

  async function copyCommand() {
    if (await copy(`npx shadcn@latest add @mapcn/${name}`)) {
      trackEvent({ name: "copy_block_cli", properties: { block: name } });
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={copyCommand}
      className="min-w-0 shrink font-mono text-xs"
    >
      {status === "copied" ? <Check /> : <Terminal />}
      <span className="truncate">npx shadcn add @mapcn/{name}</span>
      <span aria-live="polite" className="sr-only">
        {getCopyLabel(status, "")}
      </span>
    </Button>
  );
}
