"use client";

import { Check, Copy } from "lucide-react";

import { mapInstallAgentPrompt } from "@/lib/llm-prompts";
import { Button } from "@/components/ui/button";
import { getCopyLabel, useCopy } from "@/hooks/use-copy";
import { trackEvent } from "@/lib/events";

export function AgentPrompt() {
  const { status, copy } = useCopy(2500);

  async function copyPrompt() {
    if (await copy(mapInstallAgentPrompt)) {
      trackEvent({ name: "copy_agent_prompt" });
    }
  }

  return (
    <Button
      type="button"
      onClick={copyPrompt}
      aria-live="polite"
      variant="outline"
      size="sm"
      title="Paste into your coding agent to install the mapcn skill and mapcn"
      className="text-muted-foreground hover:text-foreground h-7 shrink-0 gap-1.5 bg-transparent px-2.5 text-[13px] font-normal shadow-none dark:bg-transparent"
    >
      {status === "copied" ? (
        <Check className="size-3.5" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {getCopyLabel(status, "Copy prompt")}
    </Button>
  );
}
