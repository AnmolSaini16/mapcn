import { GeoJSONSource, Layer } from "@maplibre/maplibre-react-native";
import { useId } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { Map } from "@/registry/map";

const EARTHQUAKE_GEOJSON_URL =
  "https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson";

const HEATMAP_GRADIENT_COLORS = [
  "#fff7bc",
  "#fee391",
  "#fec44f",
  "#fe9929",
  "#d7301f",
];

function GlobeHeatmapLayers() {
  const id = useId();
  const sourceId = `heatmap-source-${id}`;
  const heatLayerId = `heatmap-layer-${id}`;
  const pointLayerId = `heatmap-point-layer-${id}`;

  return (
    <GeoJSONSource
      id={sourceId}
      data={EARTHQUAKE_GEOJSON_URL}
    >
      <Layer
        id={heatLayerId}
        type="heatmap"
        maxZoom={6}
        paint={{
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            0,
            0,
            6,
            0.8,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            0.55,
            6,
            1.25,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(59, 130, 246, 0)",
            0.15,
            HEATMAP_GRADIENT_COLORS[0],
            0.35,
            HEATMAP_GRADIENT_COLORS[1],
            0.55,
            HEATMAP_GRADIENT_COLORS[2],
            0.75,
            HEATMAP_GRADIENT_COLORS[3],
            1,
            HEATMAP_GRADIENT_COLORS[4],
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 8, 6, 34],
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4.5,
            0.75,
            6.5,
            0.08,
          ],
        }}
      />
      <Layer
        id={pointLayerId}
        type="circle"
        minZoom={4.5}
        paint={{
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            1,
            3,
            6,
            10,
          ],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            1,
            HEATMAP_GRADIENT_COLORS[1],
            2.5,
            HEATMAP_GRADIENT_COLORS[2],
            4,
            HEATMAP_GRADIENT_COLORS[3],
            6,
            HEATMAP_GRADIENT_COLORS[4],
          ],
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(255,255,255,0.8)",
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4.5,
            0,
            6.5,
            0.7,
          ],
        }}
      />
    </GeoJSONSource>
  );
}

export default function Page() {
  return (
    <View className="bg-card relative h-screen flex-1">
      <View className="relative flex-1">
        <Map
          viewport={{
            center: [-113, 43],
            zoom: 3.2,
            pitch: 24,
          }}
          minZoom={1.2}
          maxZoom={8}
        >
          <GlobeHeatmapLayers />
        </Map>
      </View>

      <View className="bg-card/90 absolute top-4 left-4 z-10 rounded-lg border px-3 py-2.5">
        <Text className="text-foreground text-sm font-medium">
          Global Earthquakes Heatmap
        </Text>

        <View className="mt-3 h-2 w-full flex-row overflow-hidden rounded-full">
          {HEATMAP_GRADIENT_COLORS.map((color) => (
            <View
              key={color}
              className="flex-1"
              style={{ backgroundColor: color }}
            />
          ))}
        </View>
        <View className="flex-row items-center justify-between pt-1.5">
          <Text className="text-muted-foreground text-[10px]">Low</Text>
          <Text className="text-muted-foreground text-[10px]">High</Text>
        </View>
      </View>
    </View>
  );
}
