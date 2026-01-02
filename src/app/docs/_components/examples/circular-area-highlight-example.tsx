import { Map, MapMarker, MarkerContent, MapCircleArea } from "@/registry/map";

const center = {
  lng: 79.865348,
  lat: 7.411814,
  radius: 1000,
};

export function CircularAreaHighlightExample() {
  return (
    <div className="h-[400px] w-full">
      <Map center={[center.lng, center.lat]} zoom={13}>
        <MapMarker longitude={center.lng} latitude={center.lat}>
          <MarkerContent>
            <div className="size-4 rounded-full bg-green-500 border-2 border-white shadow-lg" />
          </MarkerContent>
        </MapMarker>
        <MapCircleArea
          center={[center.lng, center.lat]}
          radiusMeters={center.radius}
          fillColor="#22c55e"
          fillOpacity={0.2}
          outlineColor="#16a34a"
          outlineWidth={2}
          steps={64}
        />
      </Map>
    </div>
  );
}
