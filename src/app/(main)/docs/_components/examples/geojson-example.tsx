import { Map, MapGeoJSON } from "@/registry/map";
import { WORLD_GEOJSON } from "@/lib/use-world-data";

export function GeoJSONExample() {
  return (
    <div className="h-[420px] w-full">
      <Map blank center={[10, 25]}>
        <MapGeoJSON data={WORLD_GEOJSON} linePaint={false} />
      </Map>
    </div>
  );
}
