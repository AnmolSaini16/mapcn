import { ComponentPreview } from "../Common/ComponentPreview";
import { RouteExample } from "../Common/Examples/Route";
import { OsrmRouteExample } from "../Common/Examples/Route/Osrm";
import { DocsCode, DocsLayout, DocsLink, DocsSection } from "../Common/Layout";

import { Text } from "@/components/ui/text";
import { getExampleSource } from "@/lib/example-source";

export function RoutesPage() {
  const routeSource = getExampleSource("route-example.tsx");
  const osrmRouteSource = getExampleSource("osrm-route-example.tsx");

  return (
    <DocsLayout
      title="Routes"
      description="Draw lines and paths connecting coordinates on the map."
      prev={{ title: "Popups", href: "/docs/popups" }}
      next={{ title: "Arcs", href: "/docs/arcs" }}
      toc={[
        { title: "Basic Route", slug: "basic-route" },
        { title: "Route Planning", slug: "route-planning" },
      ]}
    >
      <DocsSection>
        <Text className="leading-7">
          Use <DocsCode>MapRoute</DocsCode> to draw lines connecting a series of
          coordinates. Perfect for showing directions, trails, or any path
          between points.
        </Text>
      </DocsSection>

      <DocsSection title="Basic Route">
        <Text className="leading-7">
          Draw a route with numbered stop markers along the path.
        </Text>
        <ComponentPreview
          code={routeSource}
          previewImage="/images/previews/route.png"
        >
          <RouteExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Route Planning">
        <Text className="leading-7">
          Display multiple route options and let users select between them. This
          example fetches real driving directions from the{" "}
          <DocsLink
            href="https://project-osrm.org/"
            external
          >
            OSRM API
          </DocsLink>
          . Press a route or use the buttons to switch.
        </Text>
        <ComponentPreview
          code={osrmRouteSource}
          className="h-[500px]"
          previewImage="/images/previews/osrm-route.png"
        >
          <OsrmRouteExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
