import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GitHubButton } from "./github-button";
import { MobileNav } from "./mobile-nav";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  return (
    <View
      className={cn(
        "bg-background/85 supports-backdrop-filter:bg-background/70 z-50 w-full backdrop-blur",
        className,
      )}
    >
      <SafeAreaView edges={["top"]}>
        <View className="container flex flex-row h-14 w-full items-center gap-2">
          <MobileNav />

          <View className="ml-auto flex flex-row items-center gap-1.5">
            {/* <CommandSearch /> TODO: Add command search */}
            <GitHubButton />
            <ThemeToggle />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
