import {
  Map,
  MapArc,
  MapMarker,
  MarkerContent,
  MarkerLabel,
} from "@/registry/map";

const hub = { name: "London", lng: -0.1276, lat: 51.5074 };

const destinations = [
  { name: "New York", lng: -74.006, lat: 40.7128 },
  { name: "Tokyo", lng: 139.6917, lat: 35.6895 },
  { name: "Sydney", lng: 151.2093, lat: -33.8688 },
];

const arcs = destinations.map((dest) => ({
  id: dest.name,
  from: [hub.lng, hub.lat] as [number, number],
  to: [dest.lng, dest.lat] as [number, number],
}));

export function GreatCircleArcExample() {
  return (
    <div className="h-[420px] w-full">
      <Map center={[hub.lng, hub.lat]} zoom={1} projection={{ type: "globe" }}>
        <MapArc
          data={arcs}
          path="greatCircle"
          paint={{
            "line-color": "#f97316",
            "line-width": 1.5,
          }}
          interactive={false}
        />

        <MapMarker longitude={hub.lng} latitude={hub.lat}>
          <MarkerContent>
            <div className="size-3 rounded-full border-2 border-white bg-orange-500" />
            <MarkerLabel
              position="top"
              className="bg-background/80 rounded-sm px-1.5 py-0.5 text-[11px] font-semibold backdrop-blur"
            >
              {hub.name}
            </MarkerLabel>
          </MarkerContent>
        </MapMarker>

        {destinations.map((dest) => (
          <MapMarker key={dest.name} longitude={dest.lng} latitude={dest.lat}>
            <MarkerContent>
              <div className="size-2 rounded-full border-2 border-white bg-orange-500" />
              <MarkerLabel position="top">{dest.name}</MarkerLabel>
            </MarkerContent>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
