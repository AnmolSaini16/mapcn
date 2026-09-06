import {
  DocsLayout,
  DocsSection,
  DocsCode,
  DocsLink,
} from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { RouteExample } from "../_components/examples/route-example";
import { RouteProgressExample } from "../_components/examples/route-progress-example";
import { OsrmRouteExample } from "../_components/examples/osrm-route-example";
import { getExampleSource } from "../_components/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Routes",
};

export default function RoutesPage() {
  const routeSource = getExampleSource("route-example.tsx");
  const routeProgressSource = getExampleSource("route-progress-example.tsx");
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

      <DocsSection title="Route Progress">
        <p>
          Pass <DocsCode>progress</DocsCode> (0 to 1) and a{" "}
          <DocsCode>RouteProgress</DocsCode> child paints the covered part of
          the line. <DocsCode>RouteMarker</DocsCode> pins a marker at{" "}
          <DocsCode>&quot;start&quot;</DocsCode>,{" "}
          <DocsCode>&quot;end&quot;</DocsCode>,{" "}
          <DocsCode>&quot;progress&quot;</DocsCode>, or any fraction.
        </p>
        <ComponentPreview code={routeProgressSource}>
          <RouteProgressExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Route Planning">
        <p>
          Render one <DocsCode>MapRoute</DocsCode> per option and mark the
          selected one <DocsCode>active</DocsCode>, it moves on top and uses the{" "}
          <DocsCode>active*</DocsCode> styles. Click a line or a row to switch.
        </p>
        <ComponentPreview code={osrmRouteSource} height="500px">
          <OsrmRouteExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
