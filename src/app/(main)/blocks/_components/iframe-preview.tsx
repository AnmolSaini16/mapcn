interface IframePreviewProps {
  src: string;
  title: string;
}

export function IframePreview({ src, title }: IframePreviewProps) {
  return (
    <div className="bg-background relative h-(--block-preview-height) w-full overflow-hidden rounded-xl border">
      <iframe src={src} title={title} className="size-full border-0" />
    </div>
  );
}
