import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { MapControlsExample } from "../_components/examples/map-controls-example";
import { getExampleSource } from "@/lib/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map Controls",
};

export default function ControlsPage() {
  const controlsSource = getExampleSource("map-controls-example.tsx");

  return (
    <DocsLayout
      title="Map Controls"
      description="Add interactive controls to your map for zoom, compass, location, and fullscreen."
      prev={{ title: "Basic Map", href: "/docs/basic-map" }}
      next={{ title: "Map Projection", href: "/docs/map-projection" }}
    >
      <DocsSection>
        <p>
          The <DocsCode>MapControls</DocsCode> component provides a set of
          interactive controls that can be positioned on any corner of the map.
        </p>
      </DocsSection>

      <ComponentPreview code={controlsSource}>
        <MapControlsExample />
      </ComponentPreview>
    </DocsLayout>
  );
}
