import { TrendingUp } from "lucide-react-native";
import { View } from "react-native";

import { totalVisitors, visitorGrowth, visitorLocations } from "./data";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Map, MapGeoJSON, MapMarker, MarkerContent } from "@/registry/map";

const WORLD_GEOJSON =
  "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

function bubbleSize(visitors: number) {
  return Math.round(10 + Math.sqrt(visitors) * 2.2);
}

export default function Page() {
  return (
    <View className="min-h-screen flex-1 items-center justify-center p-8">
      <Card className="relative aspect-video w-full max-w-md overflow-hidden py-0">
        <View className="absolute inset-0">
          <Map
            blank
            viewport={{ center: [1, 30], zoom: 1 }}
            scrollEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            <MapGeoJSON
              data={WORLD_GEOJSON}
              linePaint={false}
            />
            {visitorLocations.map((location) => {
              const size = bubbleSize(location.visitors);
              return (
                <MapMarker
                  key={location.city}
                  longitude={location.lng}
                  latitude={location.lat}
                >
                  <MarkerContent>
                    <View
                      className="bg-chart-2/80 rounded-full"
                      style={{ width: size, height: size }}
                    />
                  </MarkerContent>
                </MapMarker>
              );
            })}
          </Map>
        </View>

        <CardHeader className="from-card via-card/85 to-card/0 relative z-10 flex-row items-start justify-between gap-1 bg-gradient-to-b pt-4 pb-10">
          <View className="gap-1">
            <CardDescription>Visitors</CardDescription>
            <CardTitle className="text-lg tabular-nums">
              {totalVisitors}
            </CardTitle>
          </View>

          <Badge
            variant="outline"
            className="flex-row gap-1"
          >
            <Icon
              as={TrendingUp}
              size={12}
            />
            <Text className="text-xs">{visitorGrowth} growth</Text>
          </Badge>
        </CardHeader>
      </Card>
    </View>
  );
}
