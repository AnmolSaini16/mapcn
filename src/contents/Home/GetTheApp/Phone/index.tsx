import { PropsWithChildren } from "react";
import { Platform, useColorScheme, View } from "react-native";

import {
  getHomeIndicatorClassName,
  getStatusBarIslandClassName,
  type PhoneContentTheme,
} from "@/lib/phone-status-bar";
import { cn } from "@/lib/utils";

type PhoneProps = {
  contentTheme?: PhoneContentTheme;
};

export function Phone({
  children,
  contentTheme,
}: PropsWithChildren<PhoneProps>) {
  const systemTheme = useColorScheme() === "dark" ? "dark" : "light";
  const resolvedContentTheme = contentTheme ?? systemTheme;

  return (
    <View
      className={cn(
        "relative w-[min(100%,280px)]",
        Platform.select({
          web: "transition-transform duration-300 ease-out hover:-translate-y-1.5",
        }),
      )}
    >
      <View className="absolute top-[17%] -left-0.75 z-10 h-6 w-0.75 rounded-l-xs bg-neutral-600" />
      <View className="absolute top-[26%] -left-0.75 z-10 h-11 w-0.75 rounded-l-xs bg-neutral-600" />
      <View className="absolute top-[38%] -left-0.75 z-10 h-11 w-0.75 rounded-l-xs bg-neutral-600" />
      <View className="absolute top-[28%] -right-0.75 z-10 h-16 w-0.75 rounded-r-xs bg-neutral-600" />

      <View
        className={cn(
          "rounded-[2.85rem] p-px",
          Platform.select({
            web: "bg-[linear-gradient(160deg,#a1a1aa_0%,#52525b_28%,#27272a_62%,#71717a_100%)] shadow-[0_28px_55px_-18px_rgba(0,0,0,0.45),0_12px_24px_-16px_rgba(0,0,0,0.35)]",
            default: "bg-neutral-500 shadow-xl shadow-black/30",
          }),
        )}
      >
        <View
          className={cn(
            "overflow-hidden rounded-[2.8rem] border border-neutral-800 p-2.25",
            Platform.select({
              web: "bg-[linear-gradient(165deg,#3f3f46_0%,#171717_45%,#0a0a0a_100%)]",
              default: "bg-neutral-950",
            }),
          )}
        >
          <View
            className={cn(
              "relative overflow-hidden rounded-[2.15rem]",
              resolvedContentTheme === "dark" ? "bg-black" : "bg-white",
            )}
            style={{ aspectRatio: 9 / 19.5 }}
          >
            {children}

            <View
              pointerEvents="none"
              className="absolute top-2.5 right-0 left-0 z-20 items-center"
            >
              <View
                className={cn(
                  getStatusBarIslandClassName(resolvedContentTheme),
                  "h-5.75 w-23 flex-row items-center justify-end px-2.5",
                )}
              >
                <View className="h-2.5 w-2.5 items-center justify-center rounded-full bg-neutral-900">
                  <View className="h-1.5 w-1.5 rounded-full bg-[#1a2744]" />
                </View>
              </View>
            </View>

            <View
              pointerEvents="none"
              className="absolute right-0 bottom-2 left-0 z-20 items-center"
            >
              <View
                className={getHomeIndicatorClassName(resolvedContentTheme)}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
