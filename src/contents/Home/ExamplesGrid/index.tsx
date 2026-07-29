import { View } from "react-native";

import {
  AnalyticsExample,
  ArcExample,
  DeliveryExample,
  EVChargingExample,
  FlyToExample,
  TrailExample,
} from "./Examples";

export function ExamplesGrid() {
  return (
    <View className="gap-5">
      <AnalyticsExample />
      <TrailExample />
      <ArcExample />
      <EVChargingExample />
      <FlyToExample />
      <DeliveryExample />
    </View>
  );
}
