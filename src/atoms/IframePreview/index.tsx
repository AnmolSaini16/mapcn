import { WebView } from "@expo/dom-webview";
import Constants from "expo-constants";
import { createElement } from "react";
import { Platform, View } from "react-native";

interface IframePreviewProps {
  src: string;
  title: string;
}

function resolvePreviewUri(src: string): string {
  if (/^https?:\/\//.test(src)) {
    return src;
  }

  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      return new URL(src, window.location.origin).href;
    }
    return src;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return new URL(src, `http://${hostUri}`).href;
  }

  return src;
}

export function IframePreview({ src, title }: IframePreviewProps) {
  const uri = resolvePreviewUri(src);

  return (
    <View className="relative h-full w-full overflow-hidden rounded-xl border">
      {Platform.OS === "web" ? (
        createElement("iframe", {
          src: uri,
          title,
          className: "size-full border-0",
        })
      ) : (
        <WebView
          source={{ uri }}
          style={{ flex: 1 }}
          accessibilityLabel={title}
        />
      )}
    </View>
  );
}
