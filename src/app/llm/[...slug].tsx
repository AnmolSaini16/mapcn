import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, TextInput } from "react-native";

import { Text } from "@/components/ui/text";
import { createLlmItemMarkdown, getRegistryItem } from "@/lib/llm-content";
import { cn } from "@/lib/utils";

export default function LlmItemScreen() {
  const { slug } = useLocalSearchParams<{
    slug?: string[];
  }>();

  const itemName = slug?.[0];

  // Equivalent to Next.js notFound()
  if (!itemName || slug.length > 1) {
    return (
      <>
        <Stack.Screen options={{ title: "Not Found" }} />
        <Text>404</Text>
      </>
    );
  }

  const item = getRegistryItem(itemName);

  if (!item) {
    router.push("/+not-found");
    return;
  }

  const markdown = createLlmItemMarkdown(item);

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
