import { Zap } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { ExampleCard } from "@/atoms/ExampleCard";
import { ExampleMap } from "@/atoms/ExampleMap";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { MapMarker, MarkerContent, MarkerPopup } from "@/registry/map";

type Status = "available" | "in-use" | "offline";

interface ChargingStation {
  name: string;
  lng: number;
  lat: number;
  status: Status;
  detail: string;
}

const stations: ChargingStation[] = [
  {
    name: "Union Square",
    lng: -122.4074,
    lat: 37.7879,
    status: "available",
    detail: "50 kW • $0.28/kWh",
  },
  {
    name: "Castro Station",
    lng: -122.435,
    lat: 37.7625,
    status: "in-use",
    detail: "~15 min remaining",
  },
  {
    name: "Hayes Valley",
    lng: -122.4264,
    lat: 37.7759,
    status: "offline",
    detail: "",
  },
  {
    name: "Embarcadero",
    lng: -122.3934,
    lat: 37.7935,
    status: "available",
    detail: "350 kW • $0.40/kWh",
  },
  {
    name: "Marina District",
    lng: -122.437,
    lat: 37.801,
    status: "available",
    detail: "150 kW • $0.32/kWh",
  },
  {
    name: "SoMa Charger",
    lng: -122.401,
    lat: 37.778,
    status: "available",
    detail: "50 kW • $0.30/kWh",
  },
  {
    name: "Noe Valley",
    lng: -122.431,
    lat: 37.75,
    status: "available",
    detail: "150 kW • $0.33/kWh",
  },
  {
    name: "Richmond Charger",
    lng: -122.478,
    lat: 37.781,
    status: "in-use",
    detail: "~8 min remaining",
  },
  {
    name: "Potrero Hill",
    lng: -122.401,
    lat: 37.76,
    status: "offline",
    detail: "",
  },
  {
    name: "Mission Bay",
    lng: -122.391,
    lat: 37.77,
    status: "available",
    detail: "350 kW • $0.38/kWh",
  },
  {
    name: "Golden Gate Park",
    lng: -122.466,
    lat: 37.77,
    status: "available",
    detail: "150 kW • $0.34/kWh",
  },
];

const statusConfig: Record<
  Status,
  { bg: string; label: string; textClass: string }
> = {
  available: {
    bg: "bg-emerald-500",
    label: "Available",
    textClass: "text-emerald-500",
  },
  "in-use": {
    bg: "bg-amber-500",
    label: "In Use",
    textClass: "text-amber-500",
  },
  offline: {
    bg: "bg-zinc-400",
    label: "Offline",
    textClass: "text-muted-foreground",
  },
};

export function EVChargingExample() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  return (
    <ExampleCard
      className="aspect-square min-h-[280px]"
      previewImage="/images/previews/home-ev-charging.png"
    >
      <ExampleMap
        viewport={{
          center: [-122.434, 37.776],
          zoom: 11,
          bearing: 0,
          pitch: 0,
        }}
      >
        {stations.map((station) => {
          const config = statusConfig[station.status];
          const isSelected = selectedStation === station.name;

          return (
            <MapMarker
              key={station.name}
              longitude={station.lng}
              latitude={station.lat}
              onClick={() => {
                setSelectedStation((current) =>
                  current === station.name ? null : station.name,
                );
              }}
            >
              <MarkerContent>
                <View className={`${config.bg} rounded-full p-1.5 shadow-lg`}>
                  <Icon
                    as={Zap}
                    className="size-3 fill-white text-white"
                  />
                </View>
                {isSelected ? (
                  <MarkerPopup
                    className="bg-popover text-popover-foreground min-w-28 border px-2.5 py-1.5"
                    closeButton
                    onClose={() => {
                      setSelectedStation(null);
                    }}
                  >
                    <View className="gap-1 pr-3">
                      <Text className="text-xs font-medium">
                        {station.name}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <View
                          className={`size-1.5 rounded-full ${config.bg}`}
                        />
                        <Text className={`text-xs ${config.textClass}`}>
                          {config.label}
                        </Text>
                      </View>
                      {station.detail ? (
                        <Text className="text-muted-foreground text-[11px]">
                          {station.detail}
                        </Text>
                      ) : null}
                    </View>
                  </MarkerPopup>
                ) : null}
              </MarkerContent>
            </MapMarker>
          );
        })}
      </ExampleMap>
    </ExampleCard>
  );
}
