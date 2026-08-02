import { ScrollView } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type LlmMarkdownViewProps = {
  markdown: string;
};

export function LlmMarkdownView({ markdown }: LlmMarkdownViewProps) {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="flex-grow"
      showsVerticalScrollIndicator={false}
    >
      <Text
        selectable
        className={cn(
          "text-foreground p-4 font-mono text-sm leading-6",
          "whitespace-pre-wrap",
        )}
      >
        {markdown}
      </Text>
    </ScrollView>
  );
}
