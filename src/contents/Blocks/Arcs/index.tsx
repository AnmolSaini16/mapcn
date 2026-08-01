import { Text } from "@/components/ui/text";
import { ComponentPreview } from "@/contents/Docs/Common/ComponentPreview";
import {
  DocsCode,
  DocsLayout,
  DocsSection,
} from "@/contents/Docs/Common/DocsLayout";
import { ArcExample } from "@/contents/Docs/Common/Examples/Arc";
import { InteractiveArcExample } from "@/contents/Docs/Common/Examples/Arc/Interactive";
import { getExampleSource } from "@/lib/example-source";

export function ArcsPage() {
  const arcSource = getExampleSource("arc-example.tsx");
  const interactiveArcSource = getExampleSource("interactive-arc-example.tsx");

  return (
    <DocsLayout
      title="Arcs"
      description="Draw curved connections between two coordinates with press selection support."
      prev={{ title: "Routes", href: "/docs/routes" }}
      next={{ title: "GeoJSON", href: "/docs/geojson" }}
      toc={[
        { title: "Basic Arc", slug: "basic-arc" },
        { title: "Interactive Arcs", slug: "interactive-arcs" },
      ]}
    >
      <DocsSection>
        <Text className="leading-7">
          Use <DocsCode>MapArc</DocsCode> to draw curved lines between
          coordinate pairs. Arcs are great for showing flight paths, shipping
          lanes, or any origin–destination connection where a straight line
          would feel flat.
        </Text>
      </DocsSection>

      <DocsSection title="Basic Arc">
        <Text className="leading-7">
          Pass an array of arcs to the <DocsCode>data</DocsCode> prop. Each arc
          needs a unique <DocsCode>id</DocsCode> and <DocsCode>from</DocsCode> /{" "}
          <DocsCode>to</DocsCode> coordinates as{" "}
          <DocsCode>[longitude, latitude]</DocsCode> tuples.
        </Text>
        <ComponentPreview code={arcSource}>
          <ArcExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Interactive Arcs">
        <Text className="leading-7">
          Combine <DocsCode>selectedPaint</DocsCode> with{" "}
          <DocsCode>selectedId</DocsCode> and <DocsCode>onClick</DocsCode> to
          highlight an arc on press and surface details in a{" "}
          <DocsCode>MapPopup</DocsCode>. Use a <DocsCode>match</DocsCode>{" "}
          expression on <DocsCode>line-color</DocsCode> to style arcs by
          category. Here, air and sea lanes are styled differently.
        </Text>
        <ComponentPreview code={interactiveArcSource}>
          <InteractiveArcExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
