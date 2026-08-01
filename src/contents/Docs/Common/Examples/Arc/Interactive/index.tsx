import { useMemo, useState } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import {
  Map,
  MapArc,
  MapMarker,
  MapPopup,
  MarkerContent,
  MarkerLabel,
  type MapArcDatum,
} from "@/registry/map";

type Lane = MapArcDatum & {
  origin: string;
  destination: string;
  volume: string;
  mode: "air" | "sea";
};

const lanes: Lane[] = [
  {
    id: "shg-lax",
    origin: "Shanghai",
    destination: "Los Angeles",
    from: [121.4737, 31.2304],
    to: [-118.2437, 34.0522],
    volume: "24.8k TEU",
    mode: "sea",
  },
  {
    id: "sin-rtm",
    origin: "Singapore",
    destination: "Rotterdam",
    from: [103.8198, 1.3521],
    to: [4.4777, 51.9244],
    volume: "9.4k TEU",
    mode: "sea",
  },
  {
    id: "san-cpt",
    origin: "Santos",
    destination: "Cape Town",
    from: [-46.3322, -23.9608],
    to: [18.4241, -33.9249],
    volume: "3.2k TEU",
    mode: "sea",
  },
  {
    id: "syd-nrt",
    origin: "Sydney",
    destination: "Tokyo",
    from: [151.2093, -33.8688],
    to: [139.6917, 35.6895],
    volume: "640 tons",
    mode: "air",
  },
  {
    id: "dxb-jfk",
    origin: "Dubai",
    destination: "New York",
    from: [55.2708, 25.2048],
    to: [-74.006, 40.7128],
    volume: "980 tons",
    mode: "air",
  },
  {
    id: "dxb-bom",
    origin: "Dubai",
    destination: "Mumbai",
    from: [55.2708, 25.2048],
    to: [72.8777, 19.076],
    volume: "1.2k tons",
    mode: "sea",
  },
];

const modeColors = {
  air: "#a78bfa",
  sea: "#34d399",
};

type SelectedLane = {
  lane: Lane;
  popupLngLat: { longitude: number; latitude: number };
};

const modeColorExpression: [
  "match",
  ["get", "mode"],
  "air",
  string,
  "sea",
  string,
  string,
] = [
  "match",
  ["get", "mode"],
  "air",
  modeColors.air,
  "sea",
  modeColors.sea,
  "#888",
];

export function InteractiveArcExample() {
  const [selected, setSelected] = useState<SelectedLane | null>(null);

  const endpoints = useMemo(() => {
    const points: { name: string; coords: [number, number] }[] = [];
    const seen = new Set<string>();
    for (const lane of lanes) {
      if (!seen.has(lane.origin)) {
        seen.add(lane.origin);
        points.push({ name: lane.origin, coords: lane.from });
      }
      if (!seen.has(lane.destination)) {
        seen.add(lane.destination);
        points.push({ name: lane.destination, coords: lane.to });
      }
    }
    return points;
  }, []);

  return (
    <View className="relative h-[420px] w-full">
      <Map
        viewport={{
          center: [20, 20],
          zoom: 0.8,
        }}
        style={{ flex: 1 }}
      >
        <MapArc<Lane>
          data={lanes}
          paint={{
            "line-color": modeColorExpression,
            "line-width": 1.5,
          }}
          selectedId={selected?.lane.id ?? null}
          selectedPaint={{
            "line-width": 3,
            "line-opacity": 1,
          }}
          onClick={(event) => {
            setSelected((current) =>
              current?.lane.id === event.arc.id
                ? null
                : {
                    lane: event.arc,
                    popupLngLat: {
                      longitude: event.longitude,
                      latitude: event.latitude,
                    },
                  },
            );
          }}
        />

        {endpoints.map((point) => (
          <MapMarker
            key={point.name}
            longitude={point.coords[0]}
            latitude={point.coords[1]}
          >
            <MarkerContent>
              <View className="bg-foreground/80 size-2 rounded-full shadow-sm" />
              <MarkerLabel
                position="top"
                className="tracking-tight"
              >
                <Text className="text-foreground/80 text-[10px] font-medium">
                  {point.name}
                </Text>
              </MarkerLabel>
            </MarkerContent>
          </MapMarker>
        ))}

        {selected ? (
          <MapPopup
            longitude={selected.popupLngLat.longitude}
            latitude={selected.popupLngLat.latitude}
            closeButton
            closeOnClick={false}
            className="p-0"
            onClose={() => {
              setSelected(null);
            }}
          >
            <View className="flex-row items-center gap-2 px-2.5 py-1.5 pr-8">
              <View
                className="size-1.5 rounded-full"
                style={{
                  backgroundColor:
                    selected.lane.mode === "air"
                      ? modeColors.air
                      : modeColors.sea,
                }}
              />
              <Text className="text-xs font-medium">
                {selected.lane.origin} → {selected.lane.destination}
              </Text>
              <Text className="text-muted-foreground border-border border-l pl-2 text-xs">
                {selected.lane.volume}
              </Text>
            </View>
          </MapPopup>
        ) : null}
      </Map>

      <View className="bg-background/80 border-border absolute bottom-3 left-3 flex-row items-center gap-3 rounded-full border px-3 py-1.5 shadow-sm">
        <View className="flex-row items-center gap-1.5">
          <View
            className="size-1.5 rounded-full"
            style={{ backgroundColor: modeColors.air }}
          />
          <Text className="text-[11px]">Air</Text>
        </View>
        <View className="bg-border h-3 w-px" />
        <View className="flex-row items-center gap-1.5">
          <View
            className="size-1.5 rounded-full"
            style={{ backgroundColor: modeColors.sea }}
          />
          <Text className="text-[11px]">Sea</Text>
        </View>
      </View>
    </View>
  );
}
