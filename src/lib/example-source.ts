import { basicMapExampleSource } from "@/contents/Docs/Common/Examples/BasicMapExample/source";
import { blankMapExampleSource } from "@/contents/Docs/Common/Examples/BlankMapExample/source";
import { controlledMapExampleSource } from "@/contents/Docs/Common/Examples/ControlledMapExample/source";
import { customStyleExampleSource } from "@/contents/Docs/Common/Examples/CustomStyleExample/source";
import { draggableMarkerExampleSource } from "@/contents/Docs/Common/Examples/DraggableMarkerExample/source";
import { mapControlsExampleSource } from "@/contents/Docs/Common/Examples/MapControlsExample/source";
import { markersExampleSource } from "@/contents/Docs/Common/Examples/MarkersExample/source";
import { popupExampleSource } from "@/contents/Docs/Common/Examples/PopupExample/source";
import { standalonePopupExampleSource } from "@/contents/Docs/Common/Examples/StandalonePopupExample/source";

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
};

export function getExampleSource(filename: string): string {
  const source = EXAMPLE_SOURCES[filename];
  if (!source) {
    throw new Error(`Unknown example source: ${filename}`);
  }
  return source;
}
