import { Image } from "expo-image";
import { ImageIcon, Smartphone } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

import { AppStoreIcon } from "../AppStoreIcon";
import { PlayStoreIcon } from "../PlayStoreIcon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { SITE_APP_STORE_URL, SITE_PLAY_STORE_URL } from "@/lib/site-metadata";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";

const DEFAULT_PHONE_ASPECT_RATIO = 9 / 19.5;

type WebMapPreviewPlaceholderProps = {
  className?: string;
  title?: string;
  previewImage?: string;
  previewImageDark?: string;
  layout?: "overlay" | "aside";
};

function openStoreUrl(url: string) {
  if (Platform.OS === "web") {
    window.open(url, "_blank");
  } else {
    void Linking.openURL(url);
  }
}

function PreviewImage({
  className,
  contentFit = "cover",
  previewImage,
  failedImage,
  onImageError,
  onImageLoad,
  imageAspectRatio,
}: {
  className?: string;
  contentFit?: "cover" | "contain";
  previewImage?: string;
  failedImage: string | null;
  onImageError: (image: string) => void;
  onImageLoad?: (aspectRatio: number) => void;
  imageAspectRatio?: number | null;
}) {
  const showImage = Boolean(previewImage) && failedImage !== previewImage;
  const usesIntrinsicWidth = contentFit === "contain";

  return (
    <View
      className={cn("bg-muted relative overflow-hidden", className)}
      style={
        usesIntrinsicWidth
          ? {
              aspectRatio: imageAspectRatio ?? DEFAULT_PHONE_ASPECT_RATIO,
            }
          : undefined
      }
    >
      {showImage && previewImage ? (
        <Image
          source={previewImage}
          contentFit={contentFit}
          transition={200}
          onError={() => {
            onImageError(previewImage);
          }}
          onLoad={(event) => {
            const { width, height } = event.source;
            if (width > 0 && height > 0) {
              onImageLoad?.(width / height);
            }
          }}
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Map preview screenshot"
        />
      ) : (
        <View className="absolute inset-0 items-center justify-center text-muted-foreground">
          <Icon
            as={ImageIcon}
            className="text-muted-foreground size-10 opacity-75"
          />
        </View>
      )}
    </View>
  );
}

function StoreButtons({ variant }: { variant: "overlay" | "aside" }) {
  const colorScheme = useColorScheme();
  const colors = THEME[colorScheme === "dark" ? "dark" : "light"];
  const showAppStore = SITE_APP_STORE_URL.length > 0;
  const showPlayStore = SITE_PLAY_STORE_URL.length > 0;
  const iconColor =
    variant === "overlay" ? "#000000" : colors.primaryForeground;

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
            color={iconColor}
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
            color={iconColor}
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
      <View className="border-border bg-surface min-w-0 flex-1 rounded-xl border p-5 flex-col justify-center">
        <View className="gap-5">
          <View className="flex-row items-center gap-3">
            <View className="bg-primary/10 rounded-lg p-2.5">
              <Icon
                as={Smartphone}
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
  previewImageDark,
  layout = "overlay",
}: WebMapPreviewPlaceholderProps) {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [useLightFallback, setUseLightFallback] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const hasFixedHeight = Boolean(className?.match(/(?:^|\s)h-/));

  const activePreviewImage =
    colorScheme === "dark" && previewImageDark && !useLightFallback
      ? previewImageDark
      : previewImage;

  useEffect(() => {
    setFailedImage(null);
    setUseLightFallback(false);
    setImageAspectRatio(null);
  }, [previewImage, previewImageDark, colorScheme]);

  function handleImageError(image: string) {
    if (image === previewImageDark && previewImage) {
      setUseLightFallback(true);
      return;
    }

    setFailedImage(image);
  }

  if (layout === "aside") {
    return (
      <View className="w-full flex-row items-stretch gap-6 cursor-not-allowed select-none">
        <PreviewImage
          className={cn(
            "border-border shrink-0 min-w-0 rounded-lg border",
            !hasFixedHeight && "aspect-square w-1/2",
            className,
          )}
          contentFit={hasFixedHeight ? "contain" : "cover"}
          previewImage={activePreviewImage}
          failedImage={failedImage}
          onImageError={handleImageError}
          onImageLoad={setImageAspectRatio}
          imageAspectRatio={imageAspectRatio}
        />
        <PreviewInfo
          title={title}
          layout="aside"
        />
      </View>
    );
  }

  return (
    <View
      className={cn(
        "bg-muted relative flex-1 overflow-hidden cursor-not-allowed select-none",
        className,
      )}
    >
      <PreviewImage
        className="absolute inset-0"
        previewImage={activePreviewImage}
        failedImage={failedImage}
        onImageError={handleImageError}
      />
      <PreviewInfo
        title={title}
        layout="overlay"
      />
    </View>
  );
}
