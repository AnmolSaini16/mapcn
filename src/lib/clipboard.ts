import { setStringAsync } from "expo-clipboard";
import { Platform } from "react-native";

export async function copyText(text: string): Promise<void> {
  if (Platform.OS === "web") {
    await navigator.clipboard.writeText(text);
    return;
  }

  await setStringAsync(text);
}
