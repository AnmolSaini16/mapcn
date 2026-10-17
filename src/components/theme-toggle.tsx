"use client";

import { useCallback } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { THEME_HOTKEY } from "./theme-provider";

export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    if (!resolvedTheme) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return { resolvedTheme, toggleTheme };
}

export function ThemeToggle() {
  const { toggleTheme } = useThemeToggle();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      aria-label="Toggle theme"
      aria-keyshortcuts={THEME_HOTKEY.toUpperCase()}
      size="icon-sm"
      className="text-muted-foreground hover:text-foreground"
    >
      <Moon className="hidden dark:block" />

      <Sun className="block dark:hidden" />
    </Button>
  );
}
