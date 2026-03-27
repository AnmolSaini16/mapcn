"use client";

import { useState, useEffect, useRef } from "react";
import { Map, type MapRef } from "@/registry/map";

const MAPSGURU_API_KEY =
  process.env.NEXT_PUBLIC_MAPSGURU_API_KEY ?? "";

const styles = {
  default: undefined,
  vintage: `https://maps.guru/api/v1/styles/standard/vintage/style.json?key=${MAPSGURU_API_KEY}`,
  grayscale: `https://maps.guru/api/v1/styles/standard/grayscale/style.json?key=${MAPSGURU_API_KEY}`,
  highContrast: `https://maps.guru/api/v1/styles/standard/high_contrast/style.json?key=${MAPSGURU_API_KEY}`,
  minimal: `https://maps.guru/api/v1/styles/standard/minimal/style.json?key=${MAPSGURU_API_KEY}`,
};

type StyleKey = keyof typeof styles;

export function CustomStyleExample() {
  const mapRef = useRef<MapRef>(null);
  const [style, setStyle] = useState<StyleKey>("default");
  const selectedStyle = styles[style];
  const is3D = style === "highContrast";

  useEffect(() => {
    mapRef.current?.easeTo({ pitch: is3D ? 45 : 0, duration: 500 });
  }, [is3D]);

  return (
    <div className="h-[400px] relative w-full">
      <Map
        ref={mapRef}
        center={[-0.1276, 51.5074]}
        zoom={15}
        styles={
          selectedStyle
            ? { light: selectedStyle, dark: selectedStyle }
            : undefined
        }
      />
      <div className="absolute top-2 right-2 z-10">
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as StyleKey)}
          className="bg-background text-foreground border rounded-md px-2 py-1 text-sm shadow"
        >
          <option value="default">Default (Light / Dark)</option>
          <option value="vintage">Vintage</option>
          <option value="grayscale">Grayscale</option>
          <option value="highContrast">High Contrast</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>
    </div>
  );
}
