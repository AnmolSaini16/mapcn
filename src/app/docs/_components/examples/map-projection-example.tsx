import { Map, MapControls } from "@/registry/map";

export function MapProjectionExample() {
  return (
    <div className="h-[400px] w-full">
      <Map center={[0, 20]} zoom={1.5}>
        <MapControls showZoom={false} showProjection />
      </Map>
    </div>
  );
}
