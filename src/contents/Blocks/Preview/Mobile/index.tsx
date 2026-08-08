import { Suspense } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

import { PhoneFrame } from "@/atoms/PhoneFrame";
import { WebMapPreviewPlaceholder } from "@/atoms/WebMapPreviewPlaceholder";
import { blockComponents } from "@/registry/blocks/__index__";

type MobileBlockPreviewProps = {
  name: string;
  title: string;
  previewImage?: string;
};

function PreviewFallback() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <ActivityIndicator />
    </View>
  );
}

export function MobileBlockPreview({
  name,
  title,
  previewImage,
}: MobileBlockPreviewProps) {
  const Component = blockComponents[name];

  return (
    <View className="h-full w-full items-center justify-center overflow-hidden rounded-xl border py-4">
      <PhoneFrame>
        {Platform.OS === "web" || !Component ? (
          <WebMapPreviewPlaceholder
            title={title}
            previewImage={previewImage}
          />
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
