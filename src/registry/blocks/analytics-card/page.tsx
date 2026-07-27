"use client";

import { TrendingUp } from "lucide-react-native";

import { totalVisitors, visitorGrowth, visitorLocations } from "./data";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Map, MapGeoJSON, MapMarker, MarkerContent } from "@/registry/map";

// Country borders from a public CDN, or swap in your own GeoJSON.
const WORLD_GEOJSON =
  "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

function bubbleSize(visitors: number) {
  return Math.round(10 + Math.sqrt(visitors) * 2.2);
}

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="relative aspect-16/10 w-full max-w-md overflow-hidden py-0">
        <div className="absolute inset-0">
          <Map
            center={[1, 30]}
            scrollZoom={false}
            dragRotate={false}
            dragPan={false}
            doubleClickZoom={false}
            pitchWithRotate={false}
            className="[&_.maplibregl-canvas]:cursor-default! [&_.maplibregl-canvas-container]:cursor-default!"
            blank
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
                  <MarkerContent className="cursor-default">
                    <span
                      className="bg-chart-2/80 block rounded-full"
                      style={{ width: size, height: size }}
                    />
                  </MarkerContent>
                </MapMarker>
              );
            })}
          </Map>
        </div>

        <CardHeader className="from-card via-card/85 to-card/0 relative z-10 gap-1 rounded-t-[inherit] bg-linear-to-b pt-4 pb-10 mask-[linear-gradient(to_bottom,black_calc(100%_-_2.5rem),transparent)] backdrop-blur-[2px]">
          <CardDescription>Visitors</CardDescription>
          <CardTitle className="text-lg tabular-nums">
            {totalVisitors}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              {visitorGrowth} growth
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
