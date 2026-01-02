"use client";

import { useState } from "react";
import { RefreshCcw, UserRoundCheck, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Map,
  MapMarker,
  MarkerContent,
  MapControls,
  MapCircleArea,
  useMap,
} from "@/registry/map";

const center = {
  lng: 79.85972481411729,
  lat: 6.865262464032597,
  radius: 800,
};

type Location = {
  longitude: number;
  latitude: number;
};

export function GeoFenceExample() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  const isInside =
    userLocation &&
    isWithinRadius(
      userLocation,
      { lat: center.lat, lng: center.lng },
      center.radius
    );

  return (
    <div className="relative h-[400px] w-full">
      {userLocation && (
        <div className="absolute top-3 left-3 z-10">
          <Button variant="secondary" size="sm">
            {isInside ? (
              <UserRoundCheck className="size-4 mr-1.5" />
            ) : (
              <UserRoundX className="size-4 mr-1.5" />
            )}
            {isInside ? "Inside Area" : "Outside Area"}
          </Button>
        </div>
      )}

      <Map center={[center.lng, center.lat]} zoom={13.5}>
        <MapMarker longitude={center.lng} latitude={center.lat}>
          <MarkerContent>
            <div className="size-4 rounded-full bg-green-500 border-2 border-white shadow-lg" />
          </MarkerContent>
        </MapMarker>

        {userLocation && (
          <MapMarker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
          >
            <MarkerContent>
              <div className="size-4 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse" />
            </MarkerContent>
          </MapMarker>
        )}

        {/* Controls (Zoom) */}
        <MapControls position="top-right" showZoom />

        {/* Reset Location Button (clear user location and recenter) */}
        <ResetCenterButton onClear={() => setUserLocation(null)} />

        {/* Controls (Locate) */}
        <MapControls
          position="bottom-right"
          showZoom={false}
          showLocate
          onLocate={(coords) => setUserLocation(coords)}
        />

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

function ResetCenterButton({ onClear }: { onClear?: () => void }) {
  const { map, isLoaded } = useMap();
  const handleClick = () => {
    onClear?.();
    if (isLoaded && map) {
      map.flyTo({
        center: [center.lng, center.lat],
        zoom: 13.5,
        duration: 800,
      });
    }
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className="absolute bottom-20 right-2 z-10 size-8"
      onClick={handleClick}
    >
      <RefreshCcw size={16} />
    </Button>
  );
}

function isWithinRadius(
  user: { latitude: number; longitude: number },
  center: { lat: number; lng: number },
  radiusMeters: number
) {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371000;
  const dLat = toRad(center.lat - user.latitude);
  const dLng = toRad(center.lng - user.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(user.latitude)) *
      Math.cos(toRad(center.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= radiusMeters;
}
