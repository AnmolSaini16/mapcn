import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { MapControlsExample } from "../_components/examples/map-controls-example";
import { getExampleSource } from "../_components/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Controls",
};

export default function ControlsPage() {
  const controlsSource = getExampleSource("map-controls-example.tsx");

  return (
    <DocsLayout
      title="Controls"
      description="Add interactive controls to your map for zoom, compass, location, and fullscreen."
      prev={{ title: "Map", href: "/docs/basic-map" }}
      next={{ title: "Markers", href: "/docs/markers" }}
    >
      <DocsSection title="Basic Usage">
        <p>
          The <DocsCode>MapControls</DocsCode> component provides a set of
          interactive controls that can be positioned on any corner of the map.
        </p>
        <ComponentPreview code={controlsSource}>
          <MapControlsExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
