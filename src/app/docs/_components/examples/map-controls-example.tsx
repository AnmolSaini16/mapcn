import { Map, MapControls } from "@/registry/map-gl";

export function MapControlsExample() {
  return (
    <div className="h-[400px] w-full">
      <Map
        initialViewState={{ longitude: 2.3522, latitude: 48.8566, zoom: 11 }}
      >
        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />
      </Map>
    </div>
  );
}
