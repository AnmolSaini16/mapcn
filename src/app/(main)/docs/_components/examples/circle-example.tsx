import { Map, MapCircle, MapMarker, MarkerContent } from "@/registry/map";

const center = [-122.4194, 37.7749] as [number, number];

export function CircleExample() {
  return (
    <div className="h-[420px] w-full">
      <Map center={center} zoom={11}>
        <MapCircle center={center} radius={5000} />
        <MapMarker longitude={center[0]} latitude={center[1]}>
          <MarkerContent />
        </MapMarker>
      </Map>
    </div>
  );
}
