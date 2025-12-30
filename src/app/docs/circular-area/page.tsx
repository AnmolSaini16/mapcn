import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { CircularAreaHighlightExample } from "../_components/examples/circular-area-highlight-example";
import { getExampleSource } from "@/lib/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Circular Area",
};

export default function CircleHighlightPage() {
  const circularAreaHighlightSource = getExampleSource(
    "circular-area-highlight-example.tsx"
  );

  return (
    <DocsLayout
      title="Highlighted Circular Area"
      description="Highlight a circular area on the map using a center point and radius."
      prev={{ title: "Routes", href: "/docs/routes" }}
      next={{ title: "Advanced Usage", href: "/docs/advanced-usage" }}
    >
      <DocsSection>
        <p>
          The <DocsCode>MapCircleArea</DocsCode> component is used to visually
          highlight a circular region on the map. It is useful for showing
          coverage areas, search radius, geofencing zones, or distance-based
          highlights.
        </p>
        <p>
          You define the circle by providing a center coordinate and a radius in
          meters. The circle is rendered as a filled area with an optional
          outline.
        </p>
      </DocsSection>

      <ComponentPreview code={circularAreaHighlightSource}>
        <CircularAreaHighlightExample />
      </ComponentPreview>
    </DocsLayout>
  );
}
