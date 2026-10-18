"use client";

import { cn } from "@/lib/utils";
import { createContext, useContext, type CSSProperties } from "react";

type HeaderAlign = "center" | "left";
type HeaderSize = "default" | "sm";

const PageHeaderContext = createContext<{
  align: HeaderAlign;
  size: HeaderSize;
  animated: boolean;
}>({
  align: "center",
  size: "default",
  animated: false,
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
  /** Animate header content on entry (default: false) */
  animated?: boolean;
}

function PageHeader({
  children,
  className,
  align = "center",
  size = "default",
  animated = false,
}: PageHeaderProps) {
  return (
    <PageHeaderContext.Provider value={{ align, size, animated }}>
      <section
        className={cn(
          "container mx-auto flex w-full max-w-6xl flex-col",
          size === "sm"
            ? "gap-3 py-14 md:py-18"
            : "gap-4 py-16 md:gap-5 md:py-20",
          align === "center"
            ? "items-center text-center"
            : "items-start text-left",
          className,
        )}
      >
        {children}
      </section>
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
  as: Comp = "h1",
}: PageHeaderHeadingProps) {
  const { align, size, animated } = usePageHeaderContext();

  return (
    <Comp
      className={cn(
        "text-foreground max-w-4xl font-bold tracking-tight text-balance",
        animated && "animate-fade-up animate-stagger",
        size === "sm"
          ? "text-4xl font-semibold md:text-5xl"
          : "text-4xl md:text-6xl",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
      style={
        animated
          ? ({
              "--stagger": 1,
            } as CSSProperties)
          : undefined
      }
    >
      {children}
    </Comp>
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
  const { align, size, animated } = usePageHeaderContext();

  return (
    <p
      className={cn(
        "text-foreground/80 max-w-2xl leading-relaxed text-balance",
        animated && "animate-fade-up animate-stagger",
        size === "sm"
          ? "text-muted-foreground text-base sm:text-lg"
          : "sm:text-lg md:text-xl",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
      style={
        animated
          ? ({
              "--stagger": 2,
            } as CSSProperties)
          : undefined
      }
    >
      {children}
    </p>
  );
}

interface PageActionsProps {
  children: React.ReactNode;
  className?: string;
}

function PageActions({ children, className }: PageActionsProps) {
  const { align, animated } = usePageHeaderContext();

  return (
    <div
      className={cn(
        "mt-3 flex flex-wrap items-center gap-4 max-sm:w-full max-sm:flex-col",
        animated && "animate-fade-up animate-stagger",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
      style={
        animated
          ? ({
              "--stagger": 3,
            } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}

export { PageHeader, PageHeaderHeading, PageHeaderDescription, PageActions };
