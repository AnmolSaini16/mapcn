import { PropsWithChildren } from "react";
import { useColorScheme, View } from "react-native";

import {
  getStatusBarIslandClassName,
  type PhoneContentTheme,
} from "@/lib/phone-status-bar";
import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  className?: string;
  width?: number;
  height?: number;
  contentTheme?: PhoneContentTheme;
};

export function PhoneFrame({
  children,
  className,
  width = 390,
  height = 844,
  contentTheme,
}: PropsWithChildren<PhoneFrameProps>) {
  const systemTheme = useColorScheme() === "dark" ? "dark" : "light";
  const resolvedContentTheme = contentTheme ?? systemTheme;

  return (
    <View className={cn("items-center justify-center", className)}>
      <View
        className="overflow-hidden rounded-[2.5rem] border-10 border-neutral-800 bg-neutral-950 shadow-xl"
        style={{ width, height }}
      >
        <View className="bg-background relative h-full w-full overflow-hidden rounded-[1.75rem]">
          <View
            pointerEvents="none"
            className="absolute top-2 right-0 left-0 z-20 items-center"
          >
            <View
              className={cn(
                getStatusBarIslandClassName(resolvedContentTheme),
                "h-6 w-28",
              )}
            />
          </View>
          {children}
        </View>
      </View>
    </View>
  );
}
