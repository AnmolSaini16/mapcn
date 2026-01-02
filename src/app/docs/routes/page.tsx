import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { RouteExample } from "../_components/examples/route-example";
import { OsrmRouteExample } from "../_components/examples/osrm-route-example";
import { getExampleSource } from "@/lib/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Routes",
};

export default function RoutesPage() {
  const routeSource = getExampleSource("route-example.tsx");
  const osrmRouteSource = getExampleSource("osrm-route-example.tsx");

  return (
    <DocsLayout
      title="Routes"
      description="Draw lines and paths connecting coordinates on the map."
      prev={{ title: "Popups", href: "/docs/popups" }}
      next={{ title: "Circular Area", href: "/docs/circular-area" }}
    >
      <DocsSection>
        <p>
          Use <DocsCode>MapRoute</DocsCode> to draw lines connecting a series of
          coordinates. Perfect for showing directions, trails, or any path
          between points.
        </p>
      </DocsSection>

      <DocsSection title="Basic Route">
        <p>Draw a route with numbered stop markers along the path.</p>
      </DocsSection>

      <ComponentPreview code={routeSource}>
        <RouteExample />
      </ComponentPreview>

      <DocsSection title="Dynamic Route from OSRM">
        <p>
          Fetch real driving directions from the OSRM API and display them on
          the map.
        </p>
      </DocsSection>

      <ComponentPreview code={osrmRouteSource}>
        <OsrmRouteExample />
      </ComponentPreview>
    </DocsLayout>
  );
}
