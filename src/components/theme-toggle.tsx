"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { THEME_HOTKEY } from "./theme-provider";

export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return { resolvedTheme, toggleTheme };
}

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useThemeToggle();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="size-8" />;
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      aria-label="Toggle theme"
      aria-keyshortcuts={THEME_HOTKEY.toUpperCase()}
      size="icon-sm"
    >
      {resolvedTheme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
}
