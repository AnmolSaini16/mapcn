import { ComponentPreviewClient } from "./ComponentPreviewClient";

interface ComponentPreviewProps {
  children: React.ReactNode;
  code: string;
  className?: string;
}

export function ComponentPreview({
  children,
  code,
  className,
}: ComponentPreviewProps) {
  return (
    <ComponentPreviewClient
      code={code}
      className={className}
    >
      {children}
    </ComponentPreviewClient>
  );
}
