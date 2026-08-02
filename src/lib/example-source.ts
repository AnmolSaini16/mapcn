import { advancedUsageExampleSource } from "@/contents/Docs/Common/Examples/AdvancedUsage/source";
import { interactiveArcExampleSource } from "@/contents/Docs/Common/Examples/Arc/Interactive/source";
import { arcExampleSource } from "@/contents/Docs/Common/Examples/Arc/source";
import { basicMapExampleSource } from "@/contents/Docs/Common/Examples/BasicMap/source";
import { blankMapExampleSource } from "@/contents/Docs/Common/Examples/BlankMap/source";
import { clusterExampleSource } from "@/contents/Docs/Common/Examples/Cluster/source";
import { controlledMapExampleSource } from "@/contents/Docs/Common/Examples/ControlledMap/source";
import { customLayerExampleSource } from "@/contents/Docs/Common/Examples/CustomLayer/source";
import { customStyleExampleSource } from "@/contents/Docs/Common/Examples/CustomStyle/source";
import { draggableMarkerExampleSource } from "@/contents/Docs/Common/Examples/DraggableMarker/source";
import { geojsonExampleSource } from "@/contents/Docs/Common/Examples/GeoJson/source";
import { layerMarkersExampleSource } from "@/contents/Docs/Common/Examples/LayerMarkers/source";
import { mapControlsExampleSource } from "@/contents/Docs/Common/Examples/MapControls/source";
import { mapOverlayExampleSource } from "@/contents/Docs/Common/Examples/MapOverlay/source";
import { markersExampleSource } from "@/contents/Docs/Common/Examples/Markers/source";
import { popupExampleSource } from "@/contents/Docs/Common/Examples/Popup/source";
import { standalonePopupExampleSource } from "@/contents/Docs/Common/Examples/Popup/Standalone/source";
import { osrmRouteExampleSource } from "@/contents/Docs/Common/Examples/Route/Osrm/source";
import { routeExampleSource } from "@/contents/Docs/Common/Examples/Route/source";

const EXAMPLE_SOURCES: Record<string, string> = {
  "basic-map-example.tsx": basicMapExampleSource,
  "controlled-map-example.tsx": controlledMapExampleSource,
  "blank-map-example.tsx": blankMapExampleSource,
  "custom-style-example.tsx": customStyleExampleSource,
  "map-controls-example.tsx": mapControlsExampleSource,
  "markers-example.tsx": markersExampleSource,
  "popup-example.tsx": popupExampleSource,
  "draggable-marker-example.tsx": draggableMarkerExampleSource,
  "standalone-popup-example.tsx": standalonePopupExampleSource,
  "route-example.tsx": routeExampleSource,
  "osrm-route-example.tsx": osrmRouteExampleSource,
  "arc-example.tsx": arcExampleSource,
  "interactive-arc-example.tsx": interactiveArcExampleSource,
  "geojson-example.tsx": geojsonExampleSource,
  "map-overlay-example.tsx": mapOverlayExampleSource,
  "cluster-example.tsx": clusterExampleSource,
  "advanced-usage-example.tsx": advancedUsageExampleSource,
  "custom-layer-example.tsx": customLayerExampleSource,
  "layer-markers-example.tsx": layerMarkersExampleSource,
};

export function getExampleSource(filename: string): string {
  const source = EXAMPLE_SOURCES[filename];
  if (!source) {
    throw new Error(`Unknown example source: ${filename}`);
  }
  return source;
}
