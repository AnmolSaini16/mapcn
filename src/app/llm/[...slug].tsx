import { router, useLocalSearchParams } from "expo-router";

import { ErrorBoundary } from "../_layout";

import { LlmMarkdownView } from "@/components/llm-markdown-view";
import { createLlmItemMarkdown, getRegistryItem } from "@/lib/llm-content";

export default function LlmItemScreen() {
  const { slug } = useLocalSearchParams<{
    slug?: string[];
  }>();

  const itemName = slug?.[0];

  // Equivalent to Next.js notFound()
  if (!itemName || slug.length > 1) {
    return <ErrorBoundary />;
  }

  const item = getRegistryItem(itemName);

  if (!item) {
    router.push("/+not-found");
    return;
  }

  const markdown = createLlmItemMarkdown(item);

  return <LlmMarkdownView markdown={markdown} />;
}
