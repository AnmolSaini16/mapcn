import { Platform, View } from "react-native";

import {
  AnalyticsExample,
  ArcExample,
  DeliveryExample,
  EVChargingExample,
  FlyToExample,
  TrailExample,
} from "./Examples";

import { cn } from "@/lib/utils";

export function ExamplesGrid() {
  return (
    <View
      className={cn(
        "gap-5",
        Platform.select({
          web: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        }),
      )}
    >
      <AnalyticsExample />
      <TrailExample />
      <ArcExample />
      <EVChargingExample />
      <FlyToExample />
      <DeliveryExample />
    </View>
  );
}
