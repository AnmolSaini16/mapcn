"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "./use-in-view";

// Blocks are designed as full pages, so the thumbnail renders them at a
// desktop width and scales the whole frame down to fit the card.
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 800;

interface BlockThumbnailProps {
  src: string;
  title: string;
}

export function BlockThumbnail({ src, title }: BlockThumbnailProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Frames stay mounted once loaded so scrolling back never reloads them. Each
  // one holds a WebGL context and Chrome caps those at about 16, so past ~14
  // blocks switch to `{ once: false }` or static screenshots.
  const inView = useInView(ref);
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
      {inView && scale > 0 && (
        <ThumbnailFrame src={src} title={title} scale={scale} />
      )}
    </div>
  );
}

// Owns the load state so a frame that remounts fades in again.
function ThumbnailFrame({
  src,
  title,
  scale,
}: BlockThumbnailProps & { scale: number }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <iframe
      src={src}
      title={`${title} preview`}
      // inert keeps the map's controls out of the tab order and away from
      // assistive tech; the card's own button is the only target.
      inert
      onLoad={() => setLoaded(true)}
      className={cn(
        "pointer-events-none absolute top-0 left-0 origin-top-left border-0 transition-opacity duration-500",
        loaded ? "opacity-100" : "opacity-0",
      )}
      style={{
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        transform: `scale(${scale})`,
      }}
    />
  );
}
