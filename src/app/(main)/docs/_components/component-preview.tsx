import { highlightCode } from "@/lib/highlight";
import { ComponentPreviewClient } from "./component-preview-client";

interface ComponentPreviewProps {
  children: React.ReactNode;
  code: string;
  height?: string;
  className?: string;
}

export async function ComponentPreview({
  children,
  code,
  height,
  className,
}: ComponentPreviewProps) {
  const highlightedCode = await highlightCode(code, "tsx");

  return (
    <ComponentPreviewClient
      code={code}
      highlightedCode={highlightedCode}
      height={height}
      className={className}
    >
      {children}
    </ComponentPreviewClient>
  );
}
