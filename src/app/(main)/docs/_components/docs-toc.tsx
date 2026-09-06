"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(
    () => itemIds[0] ?? null,
  );

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%" },
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
    <nav aria-label="On this page" className={cn("flex flex-col", className)}>
      <p className="text-muted-foreground/70 mb-3 text-[11px] font-semibold tracking-wide uppercase">
        On This Page
      </p>

      <div className="flex flex-col gap-1.5">
        {items.map((item) => {
          const isActive = item.slug === activeHeading;
          return (
            <a
              key={item.slug}
              href={`#${item.slug}`}
              className={cn(
                "py-0.5 text-sm no-underline transition-colors",
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
