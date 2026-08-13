import { ReactNode } from "react";
import { Platform, Pressable, useColorScheme, View } from "react-native";

import { Text } from "@/components/ui/text";
import { openExternalUrl } from "@/lib/link";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";

type StoreBadgeButtonProps = {
  label: string;
  sublabel: string;
  url: string;
  icon: ReactNode;
  accessibilityLabel: string;
};

export function StoreBadgeButton({
  label,
  sublabel,
  url,
  icon,
  accessibilityLabel,
}: StoreBadgeButtonProps) {
  const colorScheme = useColorScheme();
  const colors = THEME[colorScheme === "dark" ? "dark" : "light"];
  const hasUrl = url.length > 0;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !hasUrl }}
      disabled={!hasUrl}
      onPress={() => {
        if (hasUrl) {
          openExternalUrl(url);
        }
      }}
      className={cn(
        "min-h-14 min-w-46 flex-row items-center gap-3 rounded-xl px-4 py-2.5 transition-opacity",
        hasUrl
          ? "bg-foreground active:opacity-90"
          : "bg-foreground/40 cursor-not-allowed",
        Platform.select({
          web: hasUrl ? "cursor-pointer hover:opacity-90" : undefined,
        }),
      )}
    >
      {icon}
      <View className="gap-0.5">
        <Text
          className="text-[10px] leading-none font-medium tracking-wide uppercase"
          style={{ color: colors.background }}
        >
          {sublabel}
        </Text>
        <Text
          className="text-[15px] leading-tight font-semibold tracking-tight"
          style={{ color: colors.background }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
