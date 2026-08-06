import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { ArcExample } from "../_components/examples/arc-example";
import { GreatCircleArcExample } from "../_components/examples/great-circle-arc-example";
import { InteractiveArcExample } from "../_components/examples/interactive-arc-example";
import { getExampleSource } from "../_components/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arcs",
};

export default function ArcsPage() {
  const arcSource = getExampleSource("arc-example.tsx");
  const greatCircleArcSource = getExampleSource(
    "great-circle-arc-example.tsx",
  );
  const interactiveArcSource = getExampleSource("interactive-arc-example.tsx");

  return (
    <DocsLayout
      title="Arcs"
      description="Draw curved connections between two coordinates with hover and click support."
      prev={{ title: "Routes", href: "/docs/routes" }}
      next={{ title: "GeoJSON", href: "/docs/geojson" }}
      toc={[
        { title: "Basic Arc", slug: "basic-arc" },
        { title: "Interactive Arcs", slug: "interactive-arcs" },
        { title: "Great Circle Paths", slug: "great-circle-paths" },
      ]}
    >
      <DocsSection>
        <p>
          Use <DocsCode>MapArc</DocsCode> to draw curved lines between
          coordinate pairs. Arcs are great for showing flight paths, shipping
          lanes, or any origin–destination connection where a straight line
          would feel flat.
        </p>
      </DocsSection>

      <DocsSection title="Basic Arc">
        <p>
          Pass an array of arcs to the <DocsCode>data</DocsCode> prop. Each arc
          needs a unique <DocsCode>id</DocsCode> and <DocsCode>from</DocsCode> /{" "}
          <DocsCode>to</DocsCode> coordinates as{" "}
          <DocsCode>[longitude, latitude]</DocsCode> tuples.
        </p>
        <ComponentPreview code={arcSource}>
          <ArcExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Interactive Arcs">
        <p>
          Combine <DocsCode>hoverPaint</DocsCode> with{" "}
          <DocsCode>onHover</DocsCode> to highlight an arc and surface details
          in a <DocsCode>MapPopup</DocsCode>. Use a <DocsCode>match</DocsCode>{" "}
          expression on <DocsCode>line-color</DocsCode> to style arcs by
          category. Here, air and sea lanes are styled differently.
        </p>
        <ComponentPreview code={interactiveArcSource}>
          <InteractiveArcExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Great Circle Paths">
        <p>
          By default arcs are decorative Bézier curves bowed by{" "}
          <DocsCode>curvature</DocsCode> in longitude/latitude space. Set{" "}
          <DocsCode>path=&quot;greatCircle&quot;</DocsCode> to render the true
          shortest path over the sphere (the orthodrome) instead. This is the
          route an aircraft actually flies, so long-haul connections bend
          toward the poles — the same London hub as above, but a London → New
          York flight now arcs up over Greenland instead of straight across the
          Atlantic. In this mode{" "}
          <DocsCode>curvature</DocsCode> is ignored, while{" "}
          <DocsCode>samples</DocsCode> still controls smoothness. Great circles
          look most natural on the <DocsCode>globe</DocsCode> projection.
        </p>
        <ComponentPreview code={greatCircleArcSource}>
          <GreatCircleArcExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
