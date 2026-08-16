import {
  DocsLayout,
  DocsSection,
  DocsCode,
  DocsLink,
} from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { RouteExample } from "../_components/examples/route-example";
import { OsrmRouteExample } from "../_components/examples/osrm-route-example";
import { getExampleSource } from "../_components/get-example-source";
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
      next={{ title: "Arcs", href: "/docs/arcs" }}
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
        <ComponentPreview code={routeSource}>
          <RouteExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Route Planning">
        <p>
          Display multiple route options and let users select between them. This
          example fetches real driving directions from the{" "}
          <DocsLink href="https://project-osrm.org/" external>
            OSRM API
          </DocsLink>
          . Click on a route or use the buttons to switch.
        </p>
        <ComponentPreview code={osrmRouteSource} height="500px">
          <OsrmRouteExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
