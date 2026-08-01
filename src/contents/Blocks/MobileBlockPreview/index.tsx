import { Suspense } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

import { PhoneFrame } from "@/atoms/PhoneFrame";
import { Text } from "@/components/ui/text";
import { blockComponents } from "@/registry/blocks/__index__";

type MobileBlockPreviewProps = {
  name: string;
  title: string;
};

function PreviewFallback() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <ActivityIndicator />
    </View>
  );
}

function WebUnsupportedPreview({ title }: { title: string }) {
  return (
    <View className="bg-muted flex-1 items-center justify-center gap-2 px-6">
      <Text className="text-foreground text-center text-sm font-medium">
        {title}
      </Text>
      <Text className="text-muted-foreground text-center text-xs">
        Map previews run on iOS and Android. Open this app in a simulator or
        device to see the live block.
      </Text>
    </View>
  );
}

export function MobileBlockPreview({ name, title }: MobileBlockPreviewProps) {
  const Component = blockComponents[name];

  return (
    <View className="h-full w-full items-center justify-center overflow-hidden rounded-xl border py-4">
      <PhoneFrame>
        {Platform.OS === "web" || !Component ? (
          <WebUnsupportedPreview title={title} />
        ) : (
          <Suspense fallback={<PreviewFallback />}>
            <View className="flex-1">
              <Component />
            </View>
          </Suspense>
        )}
      </PhoneFrame>
    </View>
  );
}
