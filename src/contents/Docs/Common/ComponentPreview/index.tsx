import { ComponentPreviewClient } from "./Client";

interface ComponentPreviewProps {
  children: React.ReactNode;
  code: string;
  className?: string;
  previewImage?: string;
  previewImageDark?: string;
}

export function ComponentPreview({
  children,
  code,
  className,
  previewImage,
  previewImageDark,
}: ComponentPreviewProps) {
  return (
    <ComponentPreviewClient
      code={code}
      className={className}
      previewImage={previewImage}
      previewImageDark={previewImageDark}
    >
      {children}
    </ComponentPreviewClient>
  );
}
