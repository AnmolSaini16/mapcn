import { useMemo, useState } from "react";
import { useColorScheme, View } from "react-native";

import { mapConfig, visitorsByCountry, type Theme } from "./data";

import { Text } from "@/components/ui/text";
import { useWorldData } from "@/lib/use-world-data";
import { Map, MapControls, MapGeoJSON, MapPopup } from "@/registry/map";

function buildFillColor(theme: Theme): unknown[] {
  const { base, ramp } = mapConfig.colors[theme];
  const [s0, s1, s2, s3, s4] = mapConfig.scaleStops;
  return [
    "interpolate",
    ["linear"],
    ["coalesce", ["get", "visitors"], 0],
    s0,
    base,
    s1,
    ramp[0],
    s2,
    ramp[1],
    s3,
    ramp[2],
    s4,
    ramp[3],
  ];
}

interface SelectedInfo {
  name: string;
  visitors: number;
  lng: number;
  lat: number;
}

interface CountryProperties {
  NAME_LONG: string;
  visitors: number;
}

type CountryFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  CountryProperties
>;

export default function Page() {
  const colorScheme = useColorScheme();
  const theme: Theme = colorScheme === "dark" ? "dark" : "light";
  const [selected, setSelected] = useState<SelectedInfo | null>(null);
  const world = useWorldData();

  const countries = useMemo<CountryFeatureCollection | null>(() => {
    if (!world) return null;
    return {
      type: "FeatureCollection",
      features: world.features.map((f) => ({
        ...f,
        properties: {
          NAME_LONG: f.properties.NAME_LONG,
          visitors: visitorsByCountry[f.properties.NAME_LONG] ?? 0,
        },
      })),
    };
  }, [world]);

  const fillPaint = useMemo(
    () => ({
      "fill-color": buildFillColor(theme) as never,
      "fill-opacity": 0.92,
    }),
    [theme],
  );

  const selectedPaint = useMemo(
    () => ({
      "fill-color": mapConfig.colors[theme].hover,
    }),
    [theme],
  );

  return (
    <View className="bg-card relative h-screen flex-1 overflow-hidden">
      <Map
        blank
        viewport={{
          center: mapConfig.view.center,
          zoom: mapConfig.view.zoom,
        }}
        minZoom={mapConfig.view.minZoom}
        maxZoom={mapConfig.view.maxZoom}
        dragPan={false}
        touchRotate={false}
        touchPitch={false}
        loading={!countries}
      >
        {countries ? (
          <MapGeoJSON<CountryProperties>
            data={countries}
            promoteId="NAME_LONG"
            fillPaint={fillPaint}
            selectedPaint={selectedPaint}
            selectedId={selected?.name ?? null}
            interactive
            onClick={(e) => {
              const visitors = e.feature.properties?.visitors ?? 0;
              if (visitors <= 0) {
                setSelected(null);
                return;
              }
              setSelected({
                name: e.feature.properties.NAME_LONG,
                visitors,
                lng: e.longitude,
                lat: e.latitude,
              });
            }}
          />
        ) : null}
        <MapControls className="bottom-2" />
        {selected ? (
          <MapPopup
            longitude={selected.lng}
            latitude={selected.lat}
            closeOnClick={false}
            className="p-2"
          >
            <Text className="text-xs font-medium">{selected.name}</Text>
            <View className="flex-row items-center justify-between gap-4 pt-1">
              <View className="flex-row items-center gap-1.5">
                <View
                  className="size-2 rounded-full"
                  style={{ backgroundColor: mapConfig.colors[theme].hover }}
                />
                <Text className="text-muted-foreground text-[11px]">
                  Visitors
                </Text>
              </View>
              <Text className="text-foreground text-xs font-semibold tabular-nums">
                {selected.visitors.toLocaleString()}
              </Text>
            </View>
          </MapPopup>
        ) : null}
      </Map>

      <View className="bg-card absolute bottom-4 left-4 z-10 rounded-lg border px-3 py-2.5">
        <Text className="text-foreground text-xs font-medium">
          Visitors by country
        </Text>
        <View className="mt-2 h-2 w-40 flex-row overflow-hidden rounded-full">
          {mapConfig.colors[theme].ramp.map((color) => (
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
