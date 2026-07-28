import { createContext, useContext } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type HeaderAlign = "center" | "left";
type HeaderSize = "default" | "sm";

const PageHeaderContext = createContext<{
  align: HeaderAlign;
  size: HeaderSize;
}>({
  align: "center",
  size: "default",
});

function usePageHeaderContext() {
  return useContext(PageHeaderContext);
}

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
  /** Header content alignment (default: center) */
  align?: HeaderAlign;
  /** Visual scale of the header (default: "default") */
  size?: HeaderSize;
}

function PageHeader({
  children,
  className,
  align = "center",
  size = "default",
}: PageHeaderProps) {
  return (
    <PageHeaderContext.Provider value={{ align, size }}>
      <View
        className={cn(
          "container mx-auto flex w-full max-w-6xl flex-col",
          size === "sm"
            ? "gap-3 py-14 md:py-18"
            : "gap-4 py-16 md:py-20 lg:py-24 lg:pb-20",
          align === "center"
            ? "items-center text-center"
            : "items-start text-left",
          className,
        )}
      >
        {children}
      </View>
    </PageHeaderContext.Provider>
  );
}

interface PageHeaderHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
}

function PageHeaderHeading({
  children,
  className,
  as = "h1",
}: PageHeaderHeadingProps) {
  const { align, size } = usePageHeaderContext();

  return (
    <Text
      variant={as === "h2" ? "h2" : "h1"}
      className={cn(
        "animate-fade-up animate-stagger max-w-4xl font-bold tracking-tight",
        size === "sm"
          ? "text-4xl font-semibold md:text-5xl"
          : "text-4xl sm:text-5xl md:text-6xl",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
      style={
        {
          "--stagger": 1,
        } as StyleProp<TextStyle>
      }
    >
      {children}
    </Text>
  );
}

interface PageHeaderDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

function PageHeaderDescription({
  children,
  className,
}: PageHeaderDescriptionProps) {
  const { align, size } = usePageHeaderContext();

  return (
    <Text
      className={cn(
        "text-foreground/80 animate-fade-up animate-stagger max-w-2xl leading-relaxed",
        size === "sm"
          ? "text-muted-foreground text-base sm:text-lg"
          : "sm:text-lg md:text-xl",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
      style={
        {
          "--stagger": 2,
        } as StyleProp<TextStyle>
      }
    >
      {children}
    </Text>
  );
}

interface PageActionsProps {
  children: React.ReactNode;
  className?: string;
}

function PageActions({ children, className }: PageActionsProps) {
  const { align } = usePageHeaderContext();

  return (
    <View
      className={cn(
        "animate-fade-up animate-stagger mt-3 flex-row flex-wrap items-center gap-3",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
      style={
        {
          "--stagger": 3,
        } as StyleProp<ViewStyle>
      }
    >
      {children}
    </View>
  );
}

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading };
