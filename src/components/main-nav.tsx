import { Link } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { siteNavigation } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

type MainNavProps = {
  className?: string;
};

export function MainNav({ className }: MainNavProps) {
  const navItems = siteNavigation
    .find((group) => group.title === "Pages")
    ?.items.filter((item) => item.title !== "Home");

  if (!navItems?.length) return null;

  return (
    <View className={cn("flex flex-row items-center gap-0.5", className)}>
      {navItems.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          asChild
        >
          <Button
            variant="ghost"
            size="sm"
          >
            <Text>{item.title}</Text>
          </Button>
        </Link>
      ))}
    </View>
  );
}
