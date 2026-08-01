import { Network, Plane, Truck } from "lucide-react-native";
import { ScrollView, View } from "react-native";

import { regionLabels, statusConfig, type Hub, type Route } from "../data";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

const regionIcons: Record<Hub["region"], string> = {
  west: "W",
  midwest: "MW",
  south: "S",
  northeast: "NE",
};

interface FilterSidebarProps {
  hubs: Hub[];
  routes: Route[];
}

export function FilterSidebar({ hubs, routes }: FilterSidebarProps) {
  const totalShipments = routes.reduce((s, r) => s + r.shipments, 0);
  const activeCount = routes.filter((r) => r.status === "active").length;
  const delayedCount = routes.filter((r) => r.status === "delayed").length;
  const airRouteCount = routes.filter((r) => r.mode === "air").length;
  const groundRouteCount = routes.filter((r) => r.mode === "ground").length;

  return (
    <View className="bg-sidebar border-sidebar-border w-72 shrink-0 border-r">
      <View className="p-4">
        <View className="flex-row items-center gap-2">
          <View className="bg-sidebar-primary size-8 items-center justify-center rounded-lg">
            <Icon
              as={Network}
              size={16}
              className="text-sidebar-primary-foreground"
            />
          </View>
          <View className="gap-0.5">
            <Text className="text-sm font-medium">Logistics Network</Text>
            <Text className="text-muted-foreground text-xs">
              Domestic Routes
            </Text>
          </View>
        </View>
        <View className="mt-3 flex-row gap-2">
          <View className="bg-background flex-1 items-center rounded-md border px-2.5 py-2">
            <Text className="text-lg leading-none font-bold tabular-nums">
              {hubs.length}
            </Text>
            <Text className="text-muted-foreground mt-1 text-[10px]">Hubs</Text>
          </View>
          <View className="bg-background flex-1 items-center rounded-md border px-2.5 py-2">
            <Text className="text-lg leading-none font-bold tabular-nums">
              {activeCount}
            </Text>
            <Text className="text-muted-foreground mt-1 text-[10px]">
              Active
            </Text>
          </View>
          <View className="bg-background flex-1 items-center rounded-md border px-2.5 py-2">
            <Text className="text-lg leading-none font-bold tabular-nums">
              {delayedCount}
            </Text>
            <Text className="text-muted-foreground mt-1 text-[10px]">
              Delayed
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-sidebar-border h-px" />

      <ScrollView className="flex-1">
        <View className="gap-4 p-4">
          <View className="gap-2">
            <Text className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Transport Mode
            </Text>
            <View className="flex-row items-center justify-between py-1.5">
              <View className="flex-row items-center gap-2">
                <Icon
                  as={Plane}
                  size={16}
                />
                <Text className="text-sm">Air Freight</Text>
              </View>
              <Text className="text-muted-foreground text-xs tabular-nums">
                {airRouteCount}
              </Text>
            </View>
            <View className="flex-row items-center justify-between py-1.5">
              <View className="flex-row items-center gap-2">
                <Icon
                  as={Truck}
                  size={16}
                />
                <Text className="text-sm">Ground</Text>
              </View>
              <Text className="text-muted-foreground text-xs tabular-nums">
                {groundRouteCount}
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Status
            </Text>
            <View className="flex-row items-center justify-between py-1.5">
              <View className="flex-row items-center gap-2">
                <View className="size-4 items-center justify-center">
                  <View
                    className="size-2 rounded-full"
                    style={{ backgroundColor: statusConfig.active.color }}
                  />
                </View>
                <Text className="text-sm">{statusConfig.active.label}</Text>
              </View>
              <Text className="text-muted-foreground text-xs tabular-nums">
                {activeCount}
              </Text>
            </View>
            <View className="flex-row items-center justify-between py-1.5">
              <View className="flex-row items-center gap-2">
                <View className="size-4 items-center justify-center">
                  <View
                    className="size-2 rounded-full"
                    style={{ backgroundColor: statusConfig.delayed.color }}
                  />
                </View>
                <Text className="text-sm">{statusConfig.delayed.label}</Text>
              </View>
              <Text className="text-muted-foreground text-xs tabular-nums">
                {delayedCount}
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Region
            </Text>
            {(["west", "midwest", "south", "northeast"] as const).map(
              (region) => {
                const hubsInRegion = hubs.filter((h) => h.region === region);
                return (
                  <View
                    key={region}
                    className="flex-row items-center justify-between py-1.5"
                  >
                    <View className="flex-row items-center gap-2">
                      <View className="bg-muted size-4 items-center justify-center rounded">
                        <Text className="text-muted-foreground text-[9px] font-bold">
                          {regionIcons[region]}
                        </Text>
                      </View>
                      <Text className="text-sm">{regionLabels[region]}</Text>
                    </View>
                    <Text className="text-muted-foreground text-xs tabular-nums">
                      {hubsInRegion.length}
                    </Text>
                  </View>
                );
              },
            )}
          </View>
        </View>
      </ScrollView>

      <View className="p-4 pt-0">
        <Text className="text-muted-foreground mb-2 text-[11px] font-medium tracking-wider uppercase">
          Summary
        </Text>
        <View className="bg-background gap-1.5 rounded-md border px-3 py-2">
          <View className="flex-row justify-between">
            <Text className="text-muted-foreground text-xs">Shipments</Text>
            <Text className="text-xs font-medium tabular-nums">
              {totalShipments.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-muted-foreground text-xs">Routes</Text>
            <Text className="text-xs font-medium tabular-nums">
              {routes.length}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
