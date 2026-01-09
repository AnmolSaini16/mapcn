"use client";

import { useState } from "react";
import { Map } from "@/registry/map";
import { Globe, Map as MapIcon } from "lucide-react";

export function ProjectionCustomUIExample() {
  const [projection, setProjection] = useState<"globe" | "mercator">("mercator");

  return (
    <div className="h-[400px] w-full">
      <Map projection={projection} center={[0, 20]} zoom={1.5}>
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => setProjection("mercator")}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border transition-colors ${
              projection === "mercator"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background/90 backdrop-blur border-border hover:bg-accent"
            }`}
          >
            <MapIcon className="size-4" />
            Flat
          </button>
          <button
            onClick={() => setProjection("globe")}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border transition-colors ${
              projection === "globe"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background/90 backdrop-blur border-border hover:bg-accent"
            }`}
          >
            <Globe className="size-4" />
            Globe
          </button>
        </div>
      </Map>
    </div>
  );
}
