import { ScrollView, TextInput } from "react-native";

import { createLlmIndexMarkdown } from "@/lib/llm-content";
import { cn } from "@/lib/utils";

export default function LlmIndexScreen() {
  const markdown = createLlmIndexMarkdown();

  return (
    <ScrollView>
      <TextInput
        value={markdown}
        multiline
        editable={false}
        scrollEnabled={false}
        showSoftInputOnFocus={false}
        className={cn(
          "text-foreground p-4 text-base leading-6",
          "web:outline-none web:select-text",
        )}
      />
    </ScrollView>
  );
}
