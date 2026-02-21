"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    for (const id of itemIds ?? []) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      for (const id of itemIds ?? []) {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      }
    };
  }, [itemIds]);

  return activeId;
}

interface TocItem {
  title: string;
  slug: string;
}

interface DocsTocProps {
  items: TocItem[];
  className?: string;
}

export function DocsToc({ items, className }: DocsTocProps) {
  const itemIds = React.useMemo(() => items.map((item) => item.slug), [items]);
  const activeHeading = useActiveItem(itemIds);

  if (!items?.length) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="text-foreground text-[13px] font-medium mb-2">
        On This Page
      </p>
      <div className="relative">
        <div className="absolute left-0 top-1 bottom-1 w-px bg-border" />
        <div className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = item.slug === activeHeading;
            return (
              <a
                key={item.slug}
                href={`#${item.slug}`}
                className={cn(
                  "relative pl-3 py-1 text-[13px] no-underline transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1 bottom-1 w-px bg-foreground rounded-full" />
                )}
                {item.title}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
