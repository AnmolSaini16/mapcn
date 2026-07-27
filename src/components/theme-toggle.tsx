"use client";

import { Moon, Sun } from "lucide-react-native";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { Skeleton } from "./ui/skeleton";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
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
      size="icon-sm"
    >
      {resolvedTheme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
}
