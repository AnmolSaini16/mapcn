"use client";

import { EdgeNodeMarker } from "./components/edge-node-marker";
import { StatusSidebar } from "./components/status-sidebar";
import { edgeNodes, mapView, WORLD_GEOJSON } from "./data";

import { Map, MapControls, MapGeoJSON } from "@/registry/map";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="bg-card flex h-[500px] w-full max-w-4xl overflow-hidden rounded-xl border shadow-sm">
        <StatusSidebar nodes={edgeNodes} />

        <div className="relative min-w-0 flex-1">
          <Map
            blank
            center={mapView.center}
            zoom={mapView.zoom}
            minZoom={mapView.minZoom}
            maxZoom={mapView.maxZoom}
            scrollZoom={false}
            dragRotate={false}
            pitchWithRotate={false}
          >
            <MapGeoJSON
              data={WORLD_GEOJSON}
              linePaint={false}
            />

            {edgeNodes.map((node) => (
              <EdgeNodeMarker
                key={node.id}
                node={node}
              />
            ))}

            <MapControls className="bottom-2" />
          </Map>
        </div>
      </div>
    </div>
  );
}
