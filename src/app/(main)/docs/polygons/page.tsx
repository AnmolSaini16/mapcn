import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { PolygonExample } from "../_components/examples/polygon-example";
import { getExampleSource } from "../_components/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polygons",
};

export default function PolygonsPage() {
  const polygonSource = getExampleSource("polygon-example.tsx");

  return (
    <DocsLayout
      title="Polygons"
      description="Draw filled regions with hover and click support."
      prev={{ title: "Arcs", href: "/docs/arcs" }}
      next={{ title: "Clusters", href: "/docs/clusters" }}
      toc={[{ title: "Basic Example", slug: "basic-example" }]}
    >
      <DocsSection>
        <p>
          Use <DocsCode>MapPolygon</DocsCode> to draw filled regions on the
          map — zones, areas of coverage, administrative boundaries, geofences,
          or any closed shape. Each polygon supports per-feature styling, hover
          highlights, and click events.
        </p>
      </DocsSection>

      <DocsSection title="Basic Example">
        <p>
          Pass an array of polygons to the <DocsCode>data</DocsCode> prop. Each
          polygon needs a unique <DocsCode>id</DocsCode> and{" "}
          <DocsCode>coordinates</DocsCode> as a ring of{" "}
          <DocsCode>[longitude, latitude]</DocsCode> tuples. The outline is
          drawn by default — pass <DocsCode>outline={"{false}"}</DocsCode> to
          omit it. Use a <DocsCode>{'["get", "color"]'}</DocsCode> expression
          on <DocsCode>fill-color</DocsCode> to style polygons by category.
        </p>
        <ComponentPreview code={polygonSource}>
          <PolygonExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
