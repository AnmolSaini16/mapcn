import { Clock, MapPin, Phone } from "lucide-react-native";
import { useEffect } from "react";
import { View } from "react-native";

import type { Store } from "../data";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import {
  Map,
  MapControls,
  MapMarker,
  MapPopup,
  MarkerContent,
  MarkerTooltip,
  useMap,
} from "@/registry/map";

interface LocatorMapProps {
  stores: Store[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClearSelection: () => void;
  center: [number, number];
}

function FlyToSelected({ store }: { store?: Store }) {
  const { camera } = useMap();

  useEffect(() => {
    if (!camera || !store) return;
    camera.flyTo({
      center: [store.lng, store.lat],
      zoom: 14,
      duration: 800,
    });
  }, [camera, store]);

  return null;
}

function StorePin({ active }: { active: boolean }) {
  return (
    <View
      className={cn(
        "items-center justify-center rounded-full shadow-md",
        active ? "bg-foreground/80 size-9" : "bg-foreground size-7",
      )}
    >
      <Icon
        as={MapPin}
        size={active ? 18 : 14}
        className="text-background"
      />
    </View>
  );
}

export function LocatorMap({
  stores,
  selectedId,
  onSelect,
  onClearSelection,
  center,
}: LocatorMapProps) {
  const selected = stores.find((store) => store.id === selectedId);

  return (
    <View className="relative flex-1">
      <Map
        viewport={{ center, zoom: 12 }}
        minZoom={10}
        maxZoom={17}
      >
        <MapControls showCompass />
        <FlyToSelected store={selected} />

        {stores.map((store) => (
          <MapMarker
            key={store.id}
            longitude={store.lng}
            latitude={store.lat}
            onClick={() => {
              onSelect(store.id);
            }}
          >
            <MarkerContent>
              <StorePin active={store.id === selectedId} />
            </MarkerContent>
            <MarkerTooltip className="bg-foreground">
              <Text className="text-background">{store.name}</Text>
            </MarkerTooltip>
          </MapMarker>
        ))}

        {selected ? (
          <MapPopup
            longitude={selected.lng}
            latitude={selected.lat}
            closeButton
            closeOnClick={false}
            onClose={onClearSelection}
            className="min-w-56"
          >
            <Text className="text-popover-foreground pr-5 font-medium">
              {selected.name}
            </Text>
            <View
              className={cn(
                "mt-1 flex-row items-center gap-1.5",
                selected.openNow ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <View
                className={cn(
                  "size-1.5 rounded-full",
                  selected.openNow ? "bg-emerald-500" : "bg-neutral-500",
                )}
              />
              <Text
                className={cn(
                  "text-xs font-medium",
                  selected.openNow
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {selected.openNow ? "Open now" : "Closed"}
              </Text>
            </View>

            <View className="mt-2.5 gap-1.5">
              <View className="flex-row items-center gap-1.5">
                <Icon
                  as={MapPin}
                  size={14}
                  className="text-muted-foreground shrink-0"
                />
                <Text className="text-muted-foreground text-xs tabular-nums">
                  {selected.address}, {selected.neighborhood}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Icon
                  as={Clock}
                  size={14}
                  className="text-muted-foreground shrink-0"
                />
                <Text className="text-muted-foreground text-xs tabular-nums">
                  {selected.hours}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Icon
                  as={Phone}
                  size={14}
                  className="text-muted-foreground shrink-0"
                />
                <Text className="text-muted-foreground text-xs tabular-nums">
                  {selected.phone}
                </Text>
              </View>
            </View>
          </MapPopup>
        ) : null}
      </Map>
    </View>
  );
}
