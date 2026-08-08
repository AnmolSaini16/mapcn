import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";


export function openExternalUrl(url: string) {
  if (Platform.OS === "web") {
    window.open(url, "_blank");
    return;
  }

  void WebBrowser.openBrowserAsync(url);
}