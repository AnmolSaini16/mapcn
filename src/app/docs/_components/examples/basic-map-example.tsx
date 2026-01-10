import { Map } from "@/registry/map-gl";

export function BasicMapExample() {
  return (
    <div className="h-[400px] w-full">
      <Map
        initialViewState={{ longitude: -74.006, latitude: 40.7128, zoom: 12 }}
      />
    </div>
  );
}
