"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "./use-in-view";

interface IframePreviewProps {
  src: string;
  title: string;
}

export function IframePreview({ src, title }: IframePreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      ref={ref}
      className="bg-background relative h-(--block-preview-height) w-full overflow-hidden rounded-xl border"
    >
      {inView && (
        <iframe
          src={src}
          title={title}
          onLoad={() => setLoaded(true)}
          className={cn(
            "size-full border-0 transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
