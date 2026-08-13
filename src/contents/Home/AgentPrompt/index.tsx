import { Check } from "lucide-react-native";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { copyText } from "@/lib/clipboard";
import { trackEvent } from "@/lib/events";
import { mapInstallAgentPrompt } from "@/lib/llm-prompts";

export function AgentPrompt() {
  const [copied, setCopied] = useState(false);

  const copyPrompt = useCallback(async () => {
    try {
      await copyText(mapInstallAgentPrompt);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2500);
      trackEvent({ name: "copy_agent_prompt" });
    } catch (error) {
      console.error("Failed to copy prompt:", error);
    }
  }, []);

  return (
    <Button
      onPress={() => {
        void copyPrompt();
      }}
      accessibilityLiveRegion="polite"
      variant="ghost"
      size="sm"
      className="border-border text-muted-foreground active:text-foreground active:bg-muted/50 h-7 gap-1.5 rounded-full border px-3"
    >
      {copied ? (
        <Icon
          as={Check}
          size={14}
        />
      ) : null}
      <Text className="text-muted-foreground text-xs">
        {copied
          ? "Copied - paste it into your coding agent"
          : "Building with an agent? Copy the prompt"}
      </Text>
    </Button>
  );
}
