import * as React from "react";
import { Pressable, View } from "react-native";

import { useDocsScroll } from "../docs-scroll-context";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface TocItem {
  title: string;
  slug: string;
}

interface DocsTocProps {
  items: TocItem[];
  className?: string;
}

export function DocsToc({ items, className }: DocsTocProps) {
  const { activeSection, scrollToSection } = useDocsScroll();

  if (!items.length) {
    return null;
  }

  return (
    <View className={cn("flex flex-col", className)}>
      <Text className="text-muted-foreground/70 mb-3 text-[11px] font-semibold tracking-wide uppercase">
        On This Page
      </Text>

      <View className="flex flex-col gap-1.5">
        {items.map((item) => {
          const isActive = item.slug === activeSection;
          return (
            <Pressable
              key={item.slug}
              accessibilityRole="button"
              onPress={() => {
                scrollToSection(item.slug);
              }}
              className="py-0.5"
            >
              <Text
                className={cn(
                  "text-sm",
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
