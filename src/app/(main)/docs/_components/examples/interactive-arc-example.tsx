"use client";

import { useMemo, useState } from "react";
import type { ExpressionSpecification } from "maplibre-gl";
import {
  Map,
  MapArc,
  MapMarker,
  MapPopup,
  MarkerContent,
  MarkerLabel,
  type MapArcDatum,
} from "@/registry/map";

interface Lane extends MapArcDatum {
  origin: string;
  destination: string;
  volume: string;
  mode: "air" | "sea";
}

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

interface SelectedLane {
  lane: Lane;
  popupLngLat: { longitude: number; latitude: number };
}

const modeColorExpression: ExpressionSpecification = [
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
    <div className="relative h-[420px] w-full">
      <Map center={[20, 20]} zoom={0.6}>
        <MapArc<Lane>
          data={lanes}
          paint={{
            "line-color": modeColorExpression,
            "line-width": 1.5,
          }}
          hoverPaint={{
            "line-width": 3,
            "line-opacity": 1,
          }}
          onHover={(event) =>
            setSelected(
              event
                ? {
                    lane: event.arc,
                    popupLngLat: {
                      longitude: event.longitude,
                      latitude: event.latitude,
                    },
                  }
                : null,
            )
          }
        />

        {endpoints.map((point) => (
          <MapMarker
            key={point.name}
            longitude={point.coords[0]}
            latitude={point.coords[1]}
          >
            <MarkerContent>
              <div className="bg-foreground/80 size-2 rounded-full shadow-sm" />
              <MarkerLabel
                position="top"
                className="text-foreground/80 tracking-tight"
              >
                {point.name}
              </MarkerLabel>
            </MarkerContent>
          </MapMarker>
        ))}

        {selected && (
          <MapPopup
            longitude={selected.popupLngLat.longitude}
            latitude={selected.popupLngLat.latitude}
            offset={12}
            closeOnClick={false}
            className="p-0"
          >
            <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs">
              <span
                className="size-1.5 rounded-full"
                style={{
                  background:
                    selected.lane.mode === "air"
                      ? modeColors.air
                      : modeColors.sea,
                }}
              />
              <span className="font-medium">
                {selected.lane.origin} → {selected.lane.destination}
              </span>
              <span className="text-muted-foreground border-l pl-2">
                {selected.lane.volume}
              </span>
            </div>
          </MapPopup>
        )}
      </Map>

      <div className="bg-background/80 absolute bottom-3 left-3 flex items-center gap-3 rounded-full border px-3 py-0.5 text-[11px] shadow-sm backdrop-blur">
        <div className="flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full"
            style={{ background: modeColors.air }}
          />
          Air
        </div>
        <span className="bg-border h-3 w-px" />
        <div className="flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full"
            style={{ background: modeColors.sea }}
          />
          Sea
        </div>
      </div>
    </div>
  );
}
