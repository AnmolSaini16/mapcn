import { ComponentPreviewClient } from "./Client";

interface ComponentPreviewProps {
  children: React.ReactNode;
  code: string;
  className?: string;
  previewImage?: string;
}

export function ComponentPreview({
  children,
  code,
  className,
  previewImage,
}: ComponentPreviewProps) {
  return (
    <ComponentPreviewClient
      code={code}
      className={className}
      previewImage={previewImage}
    >
      {children}
    </ComponentPreviewClient>
  );
}
