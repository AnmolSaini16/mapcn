import { Truck } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  landingPageDeliveryRoute,
  landingPageDeliveryRouteColor,
  landingPageDeliveryTruckPosition,
  landingPageDeliveryViewport,
} from "@/lib/landing-page-delivery-data";
import { Map, MapMarker, MapRoute, MarkerContent } from "@/registry/map";

export function LandingPageDeliveryPreview() {
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-background flex-1">
      <Map
        viewport={landingPageDeliveryViewport}
        dragPan={false}
        style={{ flex: 1 }}
      >
        <MapRoute
          coordinates={landingPageDeliveryRoute}
          width={4}
          color={landingPageDeliveryRouteColor}
          interactive={false}
        />
        <MapMarker
          longitude={landingPageDeliveryTruckPosition[0]}
          latitude={landingPageDeliveryTruckPosition[1]}
        >
          <MarkerContent>
            <View className="rounded-full bg-blue-500 p-2 shadow-lg">
              <Icon
                as={Truck}
                className="size-3.5 text-white"
              />
            </View>
          </MarkerContent>
        </MapMarker>
      </Map>

      <View
        pointerEvents="none"
        className="absolute inset-0 justify-between"
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 16,
        }}
      >
        <View className="bg-card border-border/60 max-w-[220px] gap-1 rounded-2xl border px-4 py-3 shadow-lg">
          <Text className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            Delivery
          </Text>
          <Text className="text-card-foreground text-xl font-bold tracking-tight">
            Arriving in 8 min
          </Text>
          <Text className="text-muted-foreground text-sm">
            Soho {"->"} Shoreditch
          </Text>
        </View>

        <View className="bg-card border-border/60 flex-row items-center gap-3 rounded-3xl border px-4 py-3.5 shadow-lg">
          <View className="size-11 shrink-0 items-center justify-center rounded-full bg-blue-500">
            <Icon
              as={Truck}
              className="size-5 text-white"
            />
          </View>

          <View className="min-w-0 flex-1 gap-0.5">
            <Text className="text-card-foreground text-base font-semibold">
              Alex is nearby
            </Text>
            <Text className="text-muted-foreground text-sm">
              Blue route · 1.4 km remaining
            </Text>
          </View>

          <View className="items-end gap-0.5">
            <Text className="text-card-foreground text-2xl font-bold tracking-tight">
              98%
            </Text>
            <Text className="text-muted-foreground text-[10px] font-medium tracking-[0.12em] uppercase">
              On time
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
