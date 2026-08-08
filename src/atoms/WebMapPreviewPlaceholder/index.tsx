import { Image } from "expo-image";
import { ImageIcon, Smartphone } from "lucide-react-native";
import { useState } from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SITE_APP_STORE_URL, SITE_PLAY_STORE_URL } from "@/lib/site-metadata";
import { cn } from "@/lib/utils";

type WebMapPreviewPlaceholderProps = {
  className?: string;
  title?: string;
  previewImage?: string;
  layout?: "overlay" | "aside";
};

function PlayStoreIcon({
  size = 16,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      viewBox="0 0 640 640"
      width={size}
      height={size}
      fill={color}
    >
      <Path d="M389.6 298.3L168.9 77L449.7 238.2L389.6 298.3zM111.3 64C98.3 70.8 89.6 83.2 89.6 99.3L89.6 540.6C89.6 556.7 98.3 569.1 111.3 575.9L367.9 319.9L111.3 64zM536.5 289.6L477.6 255.5L411.9 320L477.6 384.5L537.7 350.4C555.7 336.1 555.7 303.9 536.5 289.6zM168.9 563L449.7 401.8L389.6 341.7L168.9 563z" />
    </Svg>
  );
}

function AppStoreIcon({
  size = 16,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      viewBox="0 0 640 640"
      width={size}
      height={size}
      fill={color}
    >
      <Path d="M496 96L144 96C117.5 96 96 117.5 96 144L96 496C96 522.5 117.5 544 144 544L496 544C522.5 544 544 522.5 544 496L544 144C544 117.5 522.5 96 496 96zM223 448.5C217.5 458.1 205.2 461.3 195.7 455.8C186.1 450.3 182.9 438 188.4 428.5L202.7 403.8C218.8 398.9 232 402.7 242.3 415.2L223 448.5zM361.9 394.6L180 394.6C169 394.6 160 385.6 160 374.6C160 363.6 169 354.6 180 354.6L231 354.6L296.4 241.4L275.9 206C270.4 196.4 273.7 184.2 283.2 178.7C292.8 173.2 305 176.5 310.5 186L319.4 201.4L328.3 186C333.8 176.4 346.1 173.2 355.6 178.7C365.2 184.2 368.4 196.5 362.9 206L277.1 354.6L339.2 354.6C359.4 354.6 370.7 378.3 361.9 394.6zM460 394.6L431 394.6L450.6 428.5C456.1 438.1 452.8 450.3 443.3 455.8C433.7 461.3 421.5 458 416 448.5C383.1 391.6 358.5 348.8 342 320.4C325.3 291.4 337.2 262.4 349.1 252.6C362.2 275.3 381.8 309.3 408 354.6L460 354.6C471 354.6 480 363.6 480 374.6C480 385.7 471 394.6 460 394.6z" />
    </Svg>
  );
}

function openStoreUrl(url: string) {
  if (Platform.OS === "web") {
    window.open(url, "_blank");
  } else {
    void Linking.openURL(url);
  }
}

function PreviewImage({
  className,
  previewImage,
  failedImage,
  onImageError,
}: {
  className?: string;
  previewImage?: string;
  failedImage: string | null;
  onImageError: (image: string) => void;
}) {
  const showImage = Boolean(previewImage) && failedImage !== previewImage;

  return (
    <View className={cn("bg-muted relative overflow-hidden", className)}>
      {showImage && previewImage ? (
        <Image
          source={previewImage}
          contentFit="cover"
          transition={200}
          onError={() => {
            onImageError(previewImage);
          }}
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Map preview screenshot"
        />
      ) : (
        <View className="absolute inset-0 items-center justify-center text-muted-foreground">
          <ImageIcon className="size-10 opacity-75" />
        </View>
      )}
    </View>
  );
}

function StoreButtons({ variant }: { variant: "overlay" | "aside" }) {
  const showAppStore = SITE_APP_STORE_URL.length > 0;
  const showPlayStore = SITE_PLAY_STORE_URL.length > 0;

  if (!showAppStore && !showPlayStore) {
    return null;
  }

  const buttonClassName =
    variant === "overlay" ? "bg-white/95 dark:bg-white/90" : undefined;
  const labelClassName = variant === "overlay" ? "text-black" : undefined;
  const buttonVariant = variant === "overlay" ? "secondary" : "default";
  const buttonSize = variant === "overlay" ? "sm" : "default";

  return (
    <View
      className={cn(
        "flex-row flex-wrap gap-2",
        variant === "overlay" ? "items-center justify-center" : "items-center",
      )}
    >
      {showAppStore ? (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={buttonClassName}
          onPress={() => {
            openStoreUrl(SITE_APP_STORE_URL);
          }}
          accessibilityLabel="Download on the App Store"
        >
          <AppStoreIcon
            size={14}
            color={variant === "overlay" ? "#000" : "currentColor"}
          />
          <Text className={labelClassName}>App Store</Text>
        </Button>
      ) : null}

      {showPlayStore ? (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={buttonClassName}
          onPress={() => {
            openStoreUrl(SITE_PLAY_STORE_URL);
          }}
          accessibilityLabel="Get it on Google Play"
        >
          <PlayStoreIcon
            size={14}
            color={variant === "overlay" ? "#000" : "currentColor"}
          />
          <Text className={labelClassName}>Google Play</Text>
        </Button>
      ) : null}
    </View>
  );
}

function PreviewInfo({
  title,
  layout,
}: {
  title: string;
  layout: "overlay" | "aside";
}) {
  if (layout === "aside") {
    const showAppStore = SITE_APP_STORE_URL.length > 0;
    const showPlayStore = SITE_PLAY_STORE_URL.length > 0;

    return (
      <View className="border-border bg-surface min-w-0 flex-1 rounded-xl border p-5 shadow-sm shadow-black/5 flex-col justify-start">
        <View className="gap-5">
          <View className="flex-row items-center gap-3">
            <View className="bg-primary/10 rounded-lg p-2.5">
              <Smartphone
                size={20}
                className="text-primary"
              />
            </View>
            <Badge variant="secondary">
              <Text>iOS & Android</Text>
            </Badge>
          </View>

          <View className="gap-2.5">
            <Text className="text-foreground text-lg font-semibold tracking-tight">
              {title}
            </Text>
            <Text className="text-muted-foreground text-[15px] leading-relaxed">
              Live map previews run on iOS and Android. Open the app to explore
              the interactive map.
            </Text>
          </View>

          {showAppStore || showPlayStore ? (
            <View className="gap-2.5">
              <Text className="text-foreground text-xs font-medium tracking-wide uppercase">
                Get the app
              </Text>
              <StoreButtons variant="aside" />
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <>
      <View
        pointerEvents="none"
        className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/70 via-black/35 to-transparent"
      />

      <View
        className={cn(
          "absolute inset-x-0 bottom-0 gap-3 px-4 py-8",
          Platform.select({
            web: "supports-backdrop-filter:bg-black/25 bg-black/40 backdrop-blur-md",
            default: "bg-black/50",
          }),
        )}
      >
        <View className="gap-1">
          <Text className="text-center text-sm font-medium text-white">
            {title}
          </Text>
          <Text className="text-center text-xs text-white/75">
            Live map previews run on iOS and Android. Open the app to explore
            the interactive map.
          </Text>
        </View>
        <StoreButtons variant="overlay" />
      </View>
    </>
  );
}

export function WebMapPreviewPlaceholder({
  className,
  title = "Map preview",
  previewImage,
  layout = "overlay",
}: WebMapPreviewPlaceholderProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);

  if (layout === "aside") {
    return (
      <View className="w-full flex-row items-stretch gap-6">
        <PreviewImage
          className={cn(
            "border-border aspect-square w-1/2 min-w-0 rounded-lg border",
            className,
          )}
          previewImage={previewImage}
          failedImage={failedImage}
          onImageError={setFailedImage}
        />
        <PreviewInfo
          title={title}
          layout="aside"
        />
      </View>
    );
  }

  return (
    <View className={cn("bg-muted relative flex-1 overflow-hidden", className)}>
      <PreviewImage
        className="absolute inset-0"
        previewImage={previewImage}
        failedImage={failedImage}
        onImageError={setFailedImage}
      />
      <PreviewInfo
        title={title}
        layout="overlay"
      />
    </View>
  );
}
