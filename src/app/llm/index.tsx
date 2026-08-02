import { LlmMarkdownView } from "@/components/llm-markdown-view";
import { createLlmIndexMarkdown } from "@/lib/llm-content";

export default function LlmIndexScreen() {
  const markdown = createLlmIndexMarkdown();

  return <LlmMarkdownView markdown={markdown} />;
}
