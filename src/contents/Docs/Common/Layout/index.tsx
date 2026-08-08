import { Link, type Href } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import * as React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import { DocsScrollProvider, useDocsScroll } from "./docs-scroll-context";
import { DocsToc } from "./DocsToc";

import { PageHead } from "@/components/page-head";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface TocItem {
  title: string;
  slug: string;
}

interface DocsTitleProps {
  title: string;
  description: string;
}

function DocsTitle({ title, description }: DocsTitleProps) {
  return (
    <View className="gap-3">
      <Text className="text-foreground text-3xl font-semibold tracking-tight">
        {title}
      </Text>
      <Text className="text-muted-foreground text-base leading-relaxed">
        {description}
      </Text>
    </View>
  );
}

interface DocsLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  prev?: { title: string; href: Href };
  next?: { title: string; href: Href };
  toc?: TocItem[];
}

const SCROLL_OFFSET = 56;

export function DocsLayout({
  title,
  description,
  children,
  prev,
  next,
  toc = [],
}: DocsLayoutProps) {
  const scrollRef = React.useRef<ScrollView>(null);
  const [sectionsBaseY, setSectionsBaseY] = React.useState(0);
  const sectionOffsets = React.useRef<Record<string, number>>({});
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  const registerSection = React.useCallback((slug: string, y: number) => {
    sectionOffsets.current[slug] = y;
  }, []);

  const scrollToSection = React.useCallback((slug: string) => {
    const y = sectionOffsets.current[slug];
    if (y === undefined) {
      return;
    }

    scrollRef.current?.scrollTo({
      y: Math.max(y - SCROLL_OFFSET, 0),
      animated: true,
    });
    setActiveSection(slug);
  }, []);

  const updateActiveSection = React.useCallback(
    (scrollY: number) => {
      if (!toc.length) {
        return;
      }

      const adjustedScrollY = scrollY + SCROLL_OFFSET;
      let nextActive: string | null = toc[0]?.slug ?? null;

      for (const item of toc) {
        const offset = sectionOffsets.current[item.slug];
        if (offset !== undefined && adjustedScrollY >= offset) {
          nextActive = item.slug;
        }
      }

      setActiveSection((current) =>
        current === nextActive ? current : nextActive,
      );
    },
    [toc],
  );

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      updateActiveSection(event.nativeEvent.contentOffset.y);
    },
    [updateActiveSection],
  );

  const scrollContextValue = React.useMemo(
    () => ({
      scrollRef,
      sectionsBaseY,
      registerSection,
      scrollToSection,
      activeSection,
      setActiveSection,
      sectionOffsets,
    }),
    [
      registerSection,
      scrollToSection,
      activeSection,
      setActiveSection,
      sectionOffsets,
    ],
  );

  return (
    <DocsScrollProvider value={scrollContextValue}>
      <PageHead
        title={title}
        description={description}
      />
      <View className="flex-1 flex-row bg-background">
        <ScrollView
          ref={scrollRef}
          className="min-w-0 flex-1 bg-background"
          contentContainerClassName="flex-grow pb-20"
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className="mx-auto w-full max-w-200 flex-1 px-4 pt-10 lg:px-4">
            <DocsTitle
              title={title}
              description={description}
            />
            <View
              className="mt-12 mb-12 gap-12"
              onLayout={(event) => {
                setSectionsBaseY(event.nativeEvent.layout.y);
              }}
            >
              {children}
            </View>
            {(prev ?? next) && (
              <View className="mt-auto flex-row items-center justify-between gap-4">
                {prev ? (
                  <Link
                    href={prev.href as Href}
                    asChild
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-2 h-auto py-2"
                    >
                      <ChevronLeft size={16} />
                      <Text>{prev.title}</Text>
                    </Button>
                  </Link>
                ) : (
                  <View />
                )}
                {next ? (
                  <Link
                    href={next.href as Href}
                    asChild
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-mr-2 h-auto py-2"
                    >
                      <Text>{next.title}</Text>
                      <ChevronRight size={16} />
                    </Button>
                  </Link>
                ) : null}
              </View>
            )}
          </View>
        </ScrollView>

        {toc.length > 0 && (
          <View className="hidden w-48 shrink-0 xl:flex">
            <View className="pt-10 pb-10">
              <DocsToc items={toc} />
            </View>
          </View>
        )}
      </View>
    </DocsScrollProvider>
  );
}

interface DocsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function DocsListItem({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row items-start gap-2 pl-1">
      <Text className="leading-7">{"\u2022"}</Text>
      <View className="min-w-0 flex-1">
        <Text className="leading-7">{children}</Text>
      </View>
    </View>
  );
}

export function DocsSection({ title, children }: DocsSectionProps) {
  const id = title ? slugify(title) : undefined;
  const { sectionsBaseY, registerSection } = useDocsScroll();
  const localY = React.useRef(0);

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      localY.current = event.nativeEvent.layout.y;

      if (id) {
        registerSection(id, sectionsBaseY + localY.current);
      }
    },
    [id, registerSection, sectionsBaseY],
  );

  React.useEffect(() => {
    if (!id) {
      return;
    }

    registerSection(id, sectionsBaseY + localY.current);
  }, [id, registerSection, sectionsBaseY]);

  return (
    <View
      className="gap-5"
      onLayout={handleLayout}
      nativeID={id}
    >
      {title ? (
        <Text className="text-foreground text-xl font-semibold tracking-tight">
          {title}
        </Text>
      ) : null}
      <View className="gap-4">{children}</View>
    </View>
  );
}

interface DocsNoteProps {
  children: React.ReactNode;
}

export function DocsNote({ children }: DocsNoteProps) {
  return (
    <View className="bg-surface rounded-lg px-5 py-4">
      <Text className="text-foreground/80 text-[15px] leading-relaxed">
        {children}
      </Text>
    </View>
  );
}

interface DocsLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export function DocsLink({ href, children, external }: DocsLinkProps) {
  const isExternal =
    external ?? (href.startsWith("http://") || href.startsWith("https://"));

  if (isExternal) {
    return (
      <Text
        accessibilityRole="link"
        className="text-foreground font-medium underline underline-offset-4"
        onPress={() => {
          if (Platform.OS === "web") {
            window.open(href as string, "_blank");
          } else {
            void WebBrowser.openBrowserAsync(href);
          }
        }}
      >
        {children}
      </Text>
    );
  }

  return (
    <Link
      href={href as Href}
      asChild
    >
      <Pressable>
        <Text className="text-foreground font-medium underline underline-offset-4">
          {children}
        </Text>
      </Pressable>
    </Link>
  );
}

export function DocsCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text
      {...(Platform.OS === "web"
        ? ({ dataSet: { slot: "docs-code" } } as object)
        : {})}
      className={cn(
        "bg-muted relative rounded-md px-1.5 py-0.5 font-mono text-sm",
        className,
      )}
    >
      {children}
    </Text>
  );
}

interface DocsPropTableProps {
  props: {
    name: string;
    type: string;
    default?: string;
    description: string;
  }[];
}

export function DocsPropTable({ props }: DocsPropTableProps) {
  if (Platform.OS === "web") {
    return (
      <View className="my-6 overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface">
              <TableHead className="h-10 px-4 text-xs font-medium">
                Prop
              </TableHead>
              <TableHead className="h-10 px-4 text-xs font-medium">
                Type
              </TableHead>
              <TableHead className="h-10 px-4 text-xs font-medium">
                Default
              </TableHead>
              <TableHead className="h-10 px-4 text-xs font-medium">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.map((prop) => (
              <TableRow key={prop.name}>
                <TableCell className="px-4 py-3 align-top">
                  <DocsCode className="text-[13px]">{prop.name}</DocsCode>
                </TableCell>
                <TableCell className="px-4 py-3 align-top whitespace-normal">
                  <DocsCode className="text-foreground/70 text-xs">
                    {prop.type}
                  </DocsCode>
                </TableCell>
                <TableCell className="px-4 py-3 align-top">
                  <DocsCode className="text-foreground/70 text-xs whitespace-normal">
                    {prop.default ?? "-"}
                  </DocsCode>
                </TableCell>
                <TableCell className="text-foreground/70 min-w-45 px-4 py-3 text-sm leading-relaxed whitespace-normal">
                  {prop.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>
    );
  }

  return (
    <View className="my-6 overflow-hidden rounded-lg border border-border">
      {props.map((prop, index) => (
        <View
          key={prop.name}
          className={cn(
            "gap-3 px-4 py-3",
            index < props.length - 1 && "border-b border-border",
            // index === 0 && "bg-surface",
          )}
        >
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-muted-foreground text-xs font-medium">
              Prop
            </Text>
            <DocsCode className="text-[13px]">{prop.name}</DocsCode>
          </View>
          <View className="gap-1">
            <Text className="text-muted-foreground text-xs font-medium">
              Type
            </Text>
            <DocsCode className="text-foreground/70 text-xs">
              {prop.type}
            </DocsCode>
          </View>
          <View className="gap-1">
            <Text className="text-muted-foreground text-xs font-medium">
              Default
            </Text>
            <DocsCode className="text-foreground/70 text-xs">
              {prop.default ?? "-"}
            </DocsCode>
          </View>
          <View className="gap-1">
            <Text className="text-muted-foreground text-xs font-medium">
              Description
            </Text>
            <Text className="text-foreground/70 text-sm leading-relaxed">
              {prop.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
