"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

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
      size="icon-sm"
    >
      {resolvedTheme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
}
