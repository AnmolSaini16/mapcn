interface IframePreviewProps {
  src: string;
  title: string;
}

export function IframePreview({ src, title }: IframePreviewProps) {
  return (
    <div className="bg-background ring-foreground/5 relative h-(--block-preview-height) w-full overflow-hidden rounded-lg shadow-xs ring-1">
      <iframe src={src} title={title} className="size-full border-0" />
    </div>
  );
}
