import { Image } from "expo-image";
import { Smartphone } from "lucide-react-native";
import { Platform, Pressable, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { openExternalUrl } from "@/lib/link";
import { cn } from "@/lib/utils";

type QrCodeProps = {
  label: string;
  hint: string;
  url: string;
  qrSize: number;
};

function getQrImageUrl(value: string, size: number): string {
  const pixelSize = String(size * 2);
  const params = new URLSearchParams({
    size: `${pixelSize}x${pixelSize}`,
    margin: "12",
    ecc: "M",
    data: value,
  });

  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

export function QrCode({ label, hint, url, qrSize }: QrCodeProps) {
  const hasUrl = url.length > 0;

  const content = (
    <>
      <View className="rounded-xl bg-white p-2.5">
        {hasUrl ? (
          <Image
            source={getQrImageUrl(url, qrSize)}
            style={{ width: qrSize, height: qrSize }}
            contentFit="contain"
            accessibilityLabel={`${label} QR code`}
          />
        ) : (
          <View
            className="items-center justify-center rounded-lg bg-zinc-100"
            style={{ width: qrSize, height: qrSize }}
          >
            <Icon
              as={Smartphone}
              size={28}
              className="text-zinc-400"
            />
          </View>
        )}
      </View>
      <View className="items-center gap-1">
        <Text className="text-foreground text-sm font-semibold tracking-tight">
          {label}
        </Text>
        <Text className="text-muted-foreground text-xs">
          {hasUrl ? hint : "Coming soon"}
        </Text>
      </View>
    </>
  );

  if (!hasUrl) {
    return (
      <View className="border-border/60 bg-background/80 items-center gap-3 rounded-2xl border px-5 py-5">
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Open ${label}`}
      onPress={() => {
        openExternalUrl(url);
      }}
      className={cn(
        "border-border/60 bg-background/80 items-center gap-3 rounded-2xl border px-5 py-5",
        Platform.select({
          web: "cursor-pointer transition-colors hover:border-foreground/25 hover:bg-background",
        }),
      )}
    >
      {content}
    </Pressable>
  );
}
