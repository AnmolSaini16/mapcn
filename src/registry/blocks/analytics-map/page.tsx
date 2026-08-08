import { View } from "react-native";

import { BreakdownCard } from "./components/breakdown-card";
import { OverviewCard } from "./components/overview-card";
import {
  locations,
  visitedPagesRows,
  countriesRows,
  referrersRows,
  browsersRows,
} from "./data";

import { Text } from "@/components/ui/text";
import {
  Map,
  MapControls,
  MapGeoJSON,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/registry/map";

const MAP_HEIGHT = 608;

const WORLD_GEOJSON =
  "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

export default function Page() {
  return (
    <View className="bg-background relative min-h-screen flex-1">
      <View
        className="bg-card relative"
        style={{ height: MAP_HEIGHT }}
      >
        <Map
          blank
          viewport={{ center: [-2, 16], zoom: 1.4 }}
          maxZoom={4}
          minZoom={1.4}
          dragPan={false}
          touchRotate={false}
          touchPitch={false}
        >
          <MapGeoJSON
            data={WORLD_GEOJSON}
            linePaint={false}
          />
          <MapControls className="bottom-2" />
          {locations.map((location) => (
            <MapMarker
              key={location.city}
              longitude={location.lng}
              latitude={location.lat}
            >
              <MarkerContent>
                <View
                  className="bg-chart-2/80 rounded-full"
                  style={{
                    width: location.size * 3,
                    height: location.size * 3,
                  }}
                />
              </MarkerContent>
              <MarkerTooltip className="bg-popover border-border border">
                <Text className="font-medium">{location.city}</Text>
                <Text className="text-muted-foreground mt-0.5">
                  {location.size} active users
                </Text>
              </MarkerTooltip>
            </MapMarker>
          ))}
        </Map>
        <View
          className="via-background/30 to-background pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent"
          accessibilityElementsHidden
        />
        <OverviewCard />
      </View>

      <View className="flex-row flex-wrap gap-4 p-4">
        <View className="min-w-[220px] flex-1">
          <BreakdownCard
            title="Visited pages"
            rows={visitedPagesRows}
          />
        </View>
        <View className="min-w-[220px] flex-1">
          <BreakdownCard
            title="Referrers"
            rows={referrersRows}
          />
        </View>
        <View className="min-w-[220px] flex-1">
          <BreakdownCard
            title="Countries"
            rows={countriesRows}
          />
        </View>
        <View className="min-w-[220px] flex-1">
          <BreakdownCard
            title="Browsers"
            rows={browsersRows}
          />
        </View>
      </View>
    </View>
  );
}
