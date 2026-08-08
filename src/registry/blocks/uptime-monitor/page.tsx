import { View } from "react-native";

import { EdgeNodeMarker } from "./components/edge-node-marker";
import { StatusSidebar } from "./components/status-sidebar";
import { edgeNodes, mapView, WORLD_GEOJSON } from "./data";

import { Map, MapControls, MapGeoJSON } from "@/registry/map";

export default function Page() {
  return (
    <View className="min-h-screen flex-1 items-center justify-center p-4">
      <View className="bg-card h-[500px] w-full max-w-4xl flex-row overflow-hidden rounded-xl border shadow-sm">
        <StatusSidebar nodes={edgeNodes} />

        <View className="relative min-w-0 flex-1">
          <Map
            blank
            viewport={{
              center: mapView.center,
              zoom: mapView.zoom,
            }}
            minZoom={mapView.minZoom}
            maxZoom={mapView.maxZoom}
            dragPan={false}
            touchRotate={false}
            touchPitch={false}
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
        </View>
      </View>
    </View>
  );
}
