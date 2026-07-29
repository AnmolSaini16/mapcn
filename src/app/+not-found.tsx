import { Link } from "expo-router";
import { MapPin } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export default function NotFound() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="max-w-md items-center gap-6">
        <View className="items-center">
          <View className="relative">
            <Icon
              as={MapPin}
              className="text-muted-foreground/30"
              size={64}
              strokeWidth={1}
            />
            <Text className="absolute -right-1 -top-1 text-4xl">?</Text>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-center text-4xl font-semibold tracking-tight">
            Lost on the map
          </Text>
          <Text className="text-center text-lg text-muted-foreground">
            The page you{"'"}re looking for doesn{"'"}t exist or has been moved.
          </Text>
        </View>

        <View className="flex-row justify-center gap-3">
          <Link
            href="/"
            asChild
          >
            <Button className="justify-center">
              <Text>Go home</Text>
            </Button>
          </Link>
          <Link
            href="/docs" /* TODO: Update to correct path */
            asChild
          >
            <Button
              variant="outline"
              className="justify-center"
            >
              <Text>Read docs</Text>
            </Button>
          </Link>
        </View>
      </View>
    </View>
  );
}
