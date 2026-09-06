import { cn } from "@/lib/utils";
import { highlightCode } from "@/lib/highlight";
import { CodeSurface } from "@/components/code-surface";
import { CodeCopyButton } from "@/components/code-copy-button";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showCopyButton?: boolean;
  showLineNumbers?: boolean;
}

export async function CodeBlock({
  code,
  language = "tsx",
  filename,
  showCopyButton = true,
  showLineNumbers = true,
}: CodeBlockProps) {
  const highlighted = await highlightCode(code, language);

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {filename ? (
        <div className="bg-code border-border/60 flex items-center justify-between gap-3 border-b py-1 pr-2 pl-4">
          <span className="text-muted-foreground truncate font-mono text-xs">
            {filename}
          </span>
          {showCopyButton && <CodeCopyButton text={code} />}
        </div>
      ) : (
        showCopyButton && (
          <div className="absolute top-2 right-2 z-10">
            <CodeCopyButton text={code} />
          </div>
        )
      )}
      <CodeSurface
        className={cn(
          "overflow-auto",
          !showLineNumbers && "no-line-numbers pl-4",
        )}
        html={highlighted}
      />
    </div>
  );
}
