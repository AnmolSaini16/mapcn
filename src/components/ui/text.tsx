import { Slot } from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Platform, Text as RNText, type Role } from "react-native";

import { cn } from "@/lib/utils";

const textVariants = cva(
  cn(
    "text-foreground text-base",
    Platform.select({
      web: "select-text",
    }),
  ),
  {
    variants: {
      variant: {
        default: "",
        h1: cn(
          "text-center text-4xl font-extrabold tracking-tight",
          Platform.select({ web: "scroll-m-20 text-balance" }),
        ),
        h2: cn(
          "border-border border-b pb-2 text-3xl font-semibold tracking-tight",
          Platform.select({ web: "scroll-m-20 first:mt-0" }),
        ),
        h3: cn(
          "text-2xl font-semibold tracking-tight",
          Platform.select({ web: "scroll-m-20" }),
        ),
        h4: cn(
          "text-xl font-semibold tracking-tight",
          Platform.select({ web: "scroll-m-20" }),
        ),
        p: "mt-3 leading-7 sm:mt-6",
        blockquote: "mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6",
        code: cn(
          "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        ),
        lead: "text-muted-foreground text-xl",
        large: "text-lg font-semibold",
        small: "text-sm font-medium leading-none",
        muted: "text-muted-foreground text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps["variant"]>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  blockquote: Platform.select({ web: "blockquote" as Role }),
  code: Platform.select({ web: "code" as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: "1",
  h2: "2",
  h3: "3",
  h4: "4",
};

const TEXT_SIZE_PX: Record<string, number> = {
  "text-xs": 12,
  "text-sm": 14,
  "text-base": 16,
  "text-lg": 18,
  "text-xl": 20,
  "text-2xl": 24,
  "text-3xl": 30,
  "text-4xl": 36,
  "text-5xl": 48,
};

const LEADING_FIXED_PX: Record<string, number> = {
  "leading-3": 12,
  "leading-4": 16,
  "leading-5": 20,
  "leading-6": 24,
  "leading-7": 28,
  "leading-8": 32,
  "leading-9": 36,
  "leading-10": 40,
};

const LEADING_MULTIPLIER: Record<string, number> = {
  "leading-none": 1,
  "leading-tight": 1.25,
  "leading-snug": 1.375,
  "leading-normal": 1.5,
  "leading-relaxed": 1.625,
  "leading-loose": 2,
};

const LEADING_CLASS_RE =
  /\bleading-(?:none|tight|snug|normal|relaxed|loose|\d+(?:\.\d+)?)\b/g;

function getNativeLineHeight(className: string): number | undefined {
  const tokens = className.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    const fixed = LEADING_FIXED_PX[token];
    if (fixed !== undefined) {
      return fixed;
    }
  }

  let fontSize = 16;
  for (const token of tokens) {
    const size = TEXT_SIZE_PX[token];
    if (size !== undefined) {
      fontSize = size;
    }
  }

  for (const token of tokens) {
    const multiplier = LEADING_MULTIPLIER[token];
    if (multiplier !== undefined) {
      return Math.round(fontSize * multiplier);
    }
  }

  return undefined;
}

function resolveNativeLeading(className: string | undefined): {
  className: string | undefined;
  lineHeight: number | undefined;
} {
  if (Platform.OS === "web" || !className) {
    return { className, lineHeight: undefined };
  }

  const lineHeight = getNativeLineHeight(className);
  if (lineHeight === undefined) {
    return { className, lineHeight: undefined };
  }

  const cleaned = className
    .replace(LEADING_CLASS_RE, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    className: cleaned.length > 0 ? cleaned : undefined,
    lineHeight,
  };
}

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = "default",
  style,
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  const mergedClassName = cn(textVariants({ variant }), textClass, className);
  const { className: resolvedClassName, lineHeight } =
    resolveNativeLeading(mergedClassName);

  return (
    <Component
      className={resolvedClassName}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      style={lineHeight !== undefined ? [{ lineHeight }, style] : style}
      {...props}
    />
  );
}

export { Text, TextClassContext };
