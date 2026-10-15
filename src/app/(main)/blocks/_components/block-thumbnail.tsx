"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 800;

interface BlockThumbnailProps {
  src: string;
  title: string;
}

export function BlockThumbnail({ src, title }: BlockThumbnailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / FRAME_WIDTH);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="bg-muted/40 relative aspect-[16/10] w-full overflow-hidden"
    >
      {scale > 0 && (
        <iframe
          src={src}
          title={`${title} preview`}
          loading="lazy"
          inert
          className="pointer-events-none absolute top-0 left-0 origin-top-left border-0"
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: `scale(${scale})`,
          }}
        />
      )}
    </div>
  );
}
