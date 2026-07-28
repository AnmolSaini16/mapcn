import { Moon, Sun } from "lucide-react-native";
import { useCallback } from "react";
import { Appearance, useColorScheme } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function ThemeToggle() {
  const colorScheme = useColorScheme();

  const toggleTheme = useCallback(() => {
    Appearance.setColorScheme(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme]);

  return (
    <Button
      onPress={toggleTheme}
      variant="ghost"
      accessibilityLabel="Toggle theme"
      size="icon"
    >
      <Icon
        as={colorScheme === "dark" ? Moon : Sun}
        size={16}
      />
    </Button>
  );
}
