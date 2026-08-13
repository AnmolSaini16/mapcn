import { Geist_400Regular } from "@expo-google-fonts/geist/400Regular";
import { Geist_500Medium } from "@expo-google-fonts/geist/500Medium";
import { Geist_600SemiBold } from "@expo-google-fonts/geist/600SemiBold";
import { Geist_700Bold } from "@expo-google-fonts/geist/700Bold";
import { useFonts } from "@expo-google-fonts/geist/useFonts";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Header } from "@/components/header";
import "@/lib/appearance-polyfill";
import { NAV_THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";

void SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "@/contents/ErrorBoundary";

export default function RootLayout() {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME[colorScheme]}>
        <View
          className={cn(
            "flex-1 bg-background",
            Platform.OS === "web" && colorScheme === "dark" && "dark",
          )}
        >
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <Header />
          <View className="flex-1">
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
              }}
            >
              <Stack.Screen
                name="index"
                options={{ gestureEnabled: false }}
              />
            </Stack>
          </View>
          <PortalHost />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
