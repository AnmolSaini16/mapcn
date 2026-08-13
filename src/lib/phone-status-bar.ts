import { cn } from "@/lib/utils";

export type PhoneContentTheme = "light" | "dark";

export function getStatusBarIslandClassName(contentTheme: PhoneContentTheme) {
  return cn(
    "rounded-full bg-black",
    contentTheme === "dark"
      ? "ring-1 ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      : "shadow-sm",
  );
}

export function getHomeIndicatorClassName(contentTheme: PhoneContentTheme) {
  return cn(
    "h-1 w-27 rounded-full",
    contentTheme === "dark" ? "bg-white/55" : "bg-black/30",
  );
}
