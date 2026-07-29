"use client";

import { BreakdownCard } from "./components/breakdown-card";
import { OverviewCard } from "./components/overview-card";
import {
  locations,
  visitedPagesRows,
  countriesRows,
  referrersRows,
  browsersRows,
} from "./data";

import {
  Map,
  MapControls,
  MapGeoJSON,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/registry/map";

const MAP_HEIGHT = "38rem";

// Country borders from a public CDN, or swap in your own GeoJSON.
const WORLD_GEOJSON =
  "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

export default function Page() {
  return (
    <div
      className="bg-background relative min-h-screen"
      style={{ "--map-height": MAP_HEIGHT } as React.CSSProperties}
    >
      <div className="bg-card relative h-(--map-height)">
        <Map
          center={[-2, 16]}
          zoom={1.4}
          maxZoom={4}
          minZoom={1.4}
          scrollZoom={false}
          dragRotate={false}
          pitchWithRotate={false}
          renderWorldCopies
          blank
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
              <MarkerContent className="group">
                <div
                  className="bg-chart-2/80 group-hover:bg-chart-2/90 rounded-full transition-[transform,background-color] group-hover:scale-110"
                  style={{
                    width: location.size * 3,
                    height: location.size * 3,
                  }}
                />
              </MarkerContent>
              <MarkerTooltip
                offset={20}
                className="bg-popover text-popover-foreground border"
              >
                <p className="font-medium">{location.city}</p>
                <p className="text-muted-foreground mt-0.5">
                  {location.size} active users
                </p>
              </MarkerTooltip>
            </MapMarker>
          ))}
        </Map>
        <div
          className="via-background/30 to-background pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent"
          aria-hidden
        />
        <OverviewCard />
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <BreakdownCard
          title="Visited pages"
          rows={visitedPagesRows}
        />
        <BreakdownCard
          title="Referrers"
          rows={referrersRows}
        />
        <BreakdownCard
          title="Countries"
          rows={countriesRows}
        />
        <BreakdownCard
          title="Browsers"
          rows={browsersRows}
        />
      </div>
    </div>
  );
}
