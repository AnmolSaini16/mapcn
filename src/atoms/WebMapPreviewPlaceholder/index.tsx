import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type WebMapPreviewPlaceholderProps = {
  className?: string;
  title?: string;
};

/* TODO: add the app stores qrcodes/buttons */
export function WebMapPreviewPlaceholder({
  className,
  title = "Map preview",
}: WebMapPreviewPlaceholderProps) {
  return (
    <View
      className={cn(
        "bg-muted flex-1 items-center justify-center gap-2 px-6",
        className,
      )}
    >
      <Text className="text-foreground text-center text-sm font-medium">
        {title}
      </Text>
      <Text className="text-muted-foreground text-center text-xs">
        Map previews run on iOS and Android. Open this app in a simulator or
        device to see the live map.
      </Text>
    </View>
  );
}
