import { ComponentPreview } from "../Common/ComponentPreview";
import { MapControlsExample } from "../Common/Examples/MapControls";
import { DocsCode, DocsLayout, DocsNote, DocsSection } from "../Common/Layout";

import { Text } from "@/components/ui/text";
import { getExampleSource } from "@/lib/example-source";

export function ControlsPage() {
  const controlsSource = getExampleSource("map-controls-example.tsx");

  return (
    <DocsLayout
      title="Controls"
      description="Add interactive controls to your map for zoom, compass, location, and fullscreen."
      prev={{ title: "Map", href: "/docs/basic-map" }}
      next={{ title: "Markers", href: "/docs/markers" }}
    >
      <DocsSection>
        <Text className="leading-7">
          The <DocsCode>MapControls</DocsCode> component provides a set of
          interactive controls that can be positioned on any corner of the map.
          Place it inside <DocsCode>Map</DocsCode> - it uses{" "}
          <DocsCode>useMap</DocsCode> for camera and viewport state.
        </Text>
        <DocsNote>
          <Text className="font-medium">Native:</Text>{" "}
          <DocsCode>showLocate</DocsCode> requests location permission via
          MapLibre&apos;s <DocsCode>LocationManager</DocsCode>.{" "}
          <DocsCode>showFullscreen</DocsCode> only renders when you pass{" "}
          <DocsCode>onFullscreenRequest</DocsCode> - wire it to your own
          full-screen UI (modal, screen navigation, etc.).
        </DocsNote>
        <ComponentPreview code={controlsSource}>
          <MapControlsExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
