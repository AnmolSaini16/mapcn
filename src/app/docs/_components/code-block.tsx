import { highlightCode } from "@/lib/highlight";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  code: string;
  language?: string;
  showCopyButton?: boolean;
}

export async function CodeBlock({
  code,
  language = "tsx",
  showCopyButton = true,
}: CodeBlockProps) {
  const highlighted = await highlightCode(code, language);

  return (
    <div className="w-full rounded-lg border overflow-hidden">
      {showCopyButton && (
        <div className="flex items-center justify-end border-b bg-muted/30 px-2 h-10">
          <CopyButton text={code} />
        </div>
      )}
      <div
        className="p-4 overflow-auto text-sm bg-muted/20 [&_pre]:bg-transparent! [&_code]:bg-transparent!"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}
