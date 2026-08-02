import { Stack } from "expo-router";
import { Platform, View } from "react-native";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DocsSidebar } from "@/contents/Docs/Common/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

function DocsStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    />
  );
}

export default function DocsLayout() {
  const isMobileNative = useIsMobile();
  const isMobile = Platform.OS !== "web" || isMobileNative;

  if (isMobile) {
    return (
      <View className="flex flex-1">
        <DocsStack />
      </View>
    );
  }

  return (
    <View className="flex flex-1">
      <SidebarProvider className="container min-h-min px-0">
        <DocsSidebar />
        <SidebarInset className="size-full">
          <DocsStack />
        </SidebarInset>
      </SidebarProvider>
    </View>
  );
}
