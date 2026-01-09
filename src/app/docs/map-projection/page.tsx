import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { MapProjectionExample } from "../_components/examples/map-projection-example";
import { ProjectionCustomUIExample } from "../_components/examples/projection-custom-ui-example";
import { ProjectionExternalExample } from "../_components/examples/projection-external-example";
import { getExampleSource } from "@/lib/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map Projection",
};

export default function MapProjectionPage() {
  const projectionSource = getExampleSource("map-projection-example.tsx");
  const customUISource = getExampleSource("projection-custom-ui-example.tsx");
  const externalSource = getExampleSource("projection-external-example.tsx");

  return (
    <DocsLayout
      title="Map Projection"
      description="Switch between globe and mercator projections for different map views."
      prev={{ title: "Map Controls", href: "/docs/controls" }}
      next={{ title: "Markers", href: "/docs/markers" }}
    >
      <DocsSection>
        <p>
          The <DocsCode>Map</DocsCode> component supports two projection types:{" "}
          <DocsCode>mercator</DocsCode> for the traditional flat map (default)
          and <DocsCode>globe</DocsCode> for a 3D spherical view.
        </p>
        <p>
          The <DocsCode>projection</DocsCode> prop is fully reactive. Change it
          at any time and the map will transition to the new projection.
        </p>
      </DocsSection>

      <DocsSection title="Using MapControls">
        <p>
          The easiest way to add projection switching is with the built-in{" "}
          <DocsCode>MapControls</DocsCode> component. Set{" "}
          <DocsCode>showProjection</DocsCode> to display a toggle button.
        </p>
      </DocsSection>

      <ComponentPreview code={projectionSource}>
        <MapProjectionExample />
      </ComponentPreview>

      <DocsSection title="Custom UI">
        <p>
          Since <DocsCode>projection</DocsCode> is just a prop, you can build
          any UI to control it.
        </p>
      </DocsSection>

      <ComponentPreview code={customUISource}>
        <ProjectionCustomUIExample />
      </ComponentPreview>

      <DocsSection title="External Control">
        <p>
          The projection can be controlled from anywhere in your component tree.
          The button doesn&apos;t need to be inside the map.
        </p>
      </DocsSection>

      <ComponentPreview code={externalSource}>
        <ProjectionExternalExample />
      </ComponentPreview>
    </DocsLayout>
  );
}
