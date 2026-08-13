import { Image } from "expo-image";
import { Smartphone } from "lucide-react-native";
import { Platform, useColorScheme, View } from "react-native";

import { Phone } from "./Phone";

import { AppStoreIcon } from "@/atoms/AppStoreIcon";
import { PlayStoreIcon } from "@/atoms/PlayStoreIcon";
import { QrCode } from "@/atoms/QrCode";
import { StoreBadgeButton } from "@/atoms/StoreBadgeButton";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { SITE_APP_STORE_URL, SITE_PLAY_STORE_URL } from "@/lib/site-metadata";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";

const PREVIEW_IMAGE = "/images/previews/landing-page.png";
const QR_SIZE = 132;

export function GetTheApp() {
  const colorScheme = useColorScheme();
  const colors = THEME[colorScheme === "dark" ? "dark" : "light"];
  const iconColor = colors.background;
  const showAppStore = SITE_APP_STORE_URL.length > 0;
  const showPlayStore = SITE_PLAY_STORE_URL.length > 0;
  const hasAnyStore = showAppStore || showPlayStore;

  return (
    <View className="w-full pb-16 md:pb-20">
      <View
        className={cn(
          "border-border relative overflow-hidden rounded-3xl border",
          Platform.select({
            web: "bg-[radial-gradient(120%_80%_at_10%_0%,oklch(0.96_0.02_240),transparent_55%),radial-gradient(90%_70%_at_95%_15%,oklch(0.95_0.03_145),transparent_50%),var(--surface)] dark:bg-[radial-gradient(120%_80%_at_10%_0%,oklch(0.28_0.03_240),transparent_55%),radial-gradient(90%_70%_at_95%_15%,oklch(0.27_0.04_145),transparent_50%),var(--surface)]",
            default: "bg-surface",
          }),
        )}
      >
        <View
          pointerEvents="none"
          className={cn(
            "absolute inset-0 opacity-[0.35]",
            Platform.select({
              web: "bg-[linear-gradient(to_right,oklch(0.7_0_0/0.12)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.7_0_0/0.12)_1px,transparent_1px)] bg-size-[28px_28px] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.06)_1px,transparent_1px)]",
            }),
          )}
        />

        <View className="relative flex-col gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:gap-14 lg:px-14 lg:py-14">
          <View className="min-w-0 flex-1 gap-7">
            <View className="gap-4">
              <Badge
                variant="secondary"
                className="self-start"
              >
                <Icon
                  as={Smartphone}
                  size={12}
                />
                <Text>iOS & Android</Text>
              </Badge>

              <View className="gap-3">
                <Text
                  variant="h2"
                  className="border-0 pb-0 text-left text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
                >
                  Get the maps on your phone
                </Text>
                <Text className="text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-base">
                  Live MapLibre previews shine on native. Download the companion
                  app and explore every interactive example on iOS or Android.
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-3">
              <StoreBadgeButton
                label="App Store"
                sublabel={showAppStore ? "Download on the" : "Coming soon on"}
                url={SITE_APP_STORE_URL}
                accessibilityLabel="Download on the App Store"
                icon={
                  <AppStoreIcon
                    size={22}
                    color={iconColor}
                  />
                }
              />
              <StoreBadgeButton
                label="Google Play"
                sublabel={showPlayStore ? "Get it on" : "Coming soon on"}
                url={SITE_PLAY_STORE_URL}
                accessibilityLabel="Get it on Google Play"
                icon={
                  <PlayStoreIcon
                    size={22}
                    color={iconColor}
                  />
                }
              />
            </View>

            <View
              className={cn(
                "hidden gap-3 pt-1",
                Platform.select({
                  web: "md:flex md:flex-col",
                }),
              )}
            >
              <Text className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
                {hasAnyStore
                  ? "Or scan to download"
                  : "Store links coming soon"}
              </Text>
              <View className="flex-row flex-wrap gap-4">
                <QrCode
                  label="App Store"
                  hint="Scan with your iPhone"
                  url={SITE_APP_STORE_URL}
                  qrSize={QR_SIZE}
                />
                <QrCode
                  label="Google Play"
                  hint="Scan with your Android"
                  url={SITE_PLAY_STORE_URL}
                  qrSize={QR_SIZE}
                />
              </View>
            </View>
          </View>

          <View className="items-center justify-center lg:w-[42%]">
            <Phone>
              <Image
                source={PREVIEW_IMAGE}
                contentFit="cover"
                style={{ width: "100%", height: "100%" }}
                accessibilityLabel="Map markers preview on a phone"
              />
            </Phone>
          </View>
        </View>
      </View>
    </View>
  );
}
