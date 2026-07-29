"use client";

import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

import { mapConfig, visitorsByCountry, type Theme } from "./data";

import { useWorldData } from "@/lib/use-world-data";
import { Map, MapControls, MapGeoJSON, MapPopup } from "@/registry/map";

// WebGL paint can't read CSS variables, so we build a concrete value→color
// expression per theme. The hovered country is highlighted in place via the
// `hover` feature-state, restricted to countries that actually have data.
function buildFillColor(theme: Theme): unknown[] {
  const { base, ramp, hover } = mapConfig.colors[theme];
  const [s0, s1, s2, s3, s4] = mapConfig.scaleStops;
  const ramped = [
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
  return [
    "case",
    [
      "all",
      ["boolean", ["feature-state", "hover"], false],
      [">", ["coalesce", ["get", "visitors"], 0], 0],
    ],
    hover,
    ramped,
  ];
}

const legendGradientStyle = {
  "--choropleth-ramp-light": `linear-gradient(to right, ${mapConfig.colors.light.ramp.join(", ")})`,
  "--choropleth-ramp-dark": `linear-gradient(to right, ${mapConfig.colors.dark.ramp.join(", ")})`,
} as React.CSSProperties;

interface HoverInfo {
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
  const { resolvedTheme } = useTheme();
  const theme: Theme = resolvedTheme === "dark" ? "dark" : "light";
  const [hover, setHover] = useState<HoverInfo | null>(null);
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

  // Recompute paint only when the theme changes; MapGeoJSON recolors in place.
  const fillPaint = useMemo(
    () => ({
      "fill-color": buildFillColor(theme) as never,
      "fill-opacity": 0.92,
    }),
    [theme],
  );

  return (
    <div className="bg-card relative h-screen overflow-hidden">
      <Map
        blank
        center={mapConfig.view.center}
        zoom={mapConfig.view.zoom}
        minZoom={mapConfig.view.minZoom}
        maxZoom={mapConfig.view.maxZoom}
        scrollZoom={false}
        dragRotate={false}
        pitchWithRotate={false}
        loading={!countries}
      >
        {countries && (
          <MapGeoJSON<CountryProperties>
            data={countries}
            promoteId="NAME_LONG"
            fillPaint={fillPaint}
            interactive
            onHover={(e) => {
              const visitors = e?.feature.properties.visitors ?? 0;
              // Only countries with data are interactive.
              if (!e || visitors <= 0) {
                setHover(null);
                return;
              }
              setHover({
                name: e.feature.properties.NAME_LONG,
                visitors,
                lng: e.longitude,
                lat: e.latitude,
              });
            }}
          />
        )}
        <MapControls className="bottom-2" />
        {hover && (
          <MapPopup
            longitude={hover.lng}
            latitude={hover.lat}
            offset={12}
            closeOnClick={false}
            className="pointer-events-none p-2"
          >
            <p className="text-xs font-medium">{hover.name}</p>
            <div className="flex items-center justify-between gap-4 pt-1">
              <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: mapConfig.colors[theme].hover }}
                />
                Visitors
              </span>
              <span className="text-foreground text-xs font-semibold tabular-nums">
                {hover.visitors.toLocaleString()}
              </span>
            </div>
          </MapPopup>
        )}
      </Map>

      <div
        className="bg-card absolute bottom-4 left-4 z-10 rounded-lg border px-3 py-2.5 backdrop-blur-sm"
        style={legendGradientStyle}
      >
        <p className="text-foreground text-xs font-medium">
          Visitors by country
        </p>
        <div className="mt-2 h-2 w-40 rounded-full [background-image:var(--choropleth-ramp-light)] dark:[background-image:var(--choropleth-ramp-dark)]" />
        <div className="text-muted-foreground flex items-center justify-between pt-1.5 text-[10px]">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
