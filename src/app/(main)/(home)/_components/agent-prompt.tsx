"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { mapInstallAgentPrompt } from "@/lib/llm-prompts";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/events";

export function AgentPrompt() {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(mapInstallAgentPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      trackEvent({ name: "copy_agent_prompt" });
    } catch (error) {
      console.error("Failed to copy prompt:", error);
    }
  }

  return (
    <Button
      type="button"
      onClick={copyPrompt}
      aria-live="polite"
      variant="ghost"
      size="xs"
      className="text-muted-foreground hover:text-foreground h-7 px-2.5!"
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied — paste into your agent" : "Copy prompt for your agent"}
    </Button>
  );
}
