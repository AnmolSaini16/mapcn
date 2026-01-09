"use client";

import { useState } from "react";
import { Map } from "@/registry/map";

export function ProjectionExternalExample() {
  const [projection, setProjection] = useState<"globe" | "mercator">(
    "mercator"
  );

  return (
    <div className="flex flex-col">
      <div className="p-2 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Current: <strong className="text-foreground">{projection}</strong>
        </span>
        <button
          onClick={() =>
            setProjection((p) => (p === "globe" ? "mercator" : "globe"))
          }
          className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Toggle Projection
        </button>
      </div>
      <div className="h-88 w-full">
        <Map projection={projection} center={[0, 20]} zoom={1.5} />
      </div>
    </div>
  );
}
