"use client";

import { useEffect, useRef } from "react";

interface IframePreviewProps {
  src: string;
  title: string;
}

export function IframePreview({ src, title }: IframePreviewProps) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = ref.current;
    if (
      iframe?.contentDocument?.readyState === "complete" &&
      iframe.contentWindow?.location.href !== "about:blank"
    ) {
      markLoaded(iframe);
    }
  }, []);

  return (
    <div className="bg-background ring-foreground/5 relative h-(--block-preview-height) w-full overflow-hidden rounded-lg shadow-xs ring-1">
      <iframe
        ref={ref}
        src={src}
        title={title}
        loading="lazy"
        onLoad={(event) => markLoaded(event.currentTarget)}
        className="size-full border-0 opacity-0 transition-opacity duration-300 data-loaded:opacity-100"
      />
    </div>
  );
}

function markLoaded(iframe: HTMLIFrameElement) {
  iframe.dataset.loaded = "";
}
