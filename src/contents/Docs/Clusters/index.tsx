import { ComponentPreview } from "../Common/ComponentPreview";
import { ClusterExample } from "../Common/Examples/Cluster";
import { DocsCode, DocsLayout, DocsSection } from "../Common/Layout";

import { Text } from "@/components/ui/text";
import { getExampleSource } from "@/lib/example-source";

export function ClustersPage() {
  const clusterSource = getExampleSource("cluster-example.tsx");

  return (
    <DocsLayout
      title="Clusters"
      description="Visualize large datasets with automatic point clustering."
      prev={{ title: "GeoJSON", href: "/docs/geojson" }}
      next={{ title: "Advanced", href: "/docs/advanced-usage" }}
      toc={[{ title: "Basic Example", slug: "basic-example" }]}
    >
      <DocsSection>
        <Text className="leading-7">
          The <DocsCode>MapClusterLayer</DocsCode> component uses
          MapLibre&apos;s built-in clustering to efficiently render large
          numbers of points. Points are automatically grouped into clusters at
          low zoom levels, and expand as you zoom in.
        </Text>
      </DocsSection>

      <DocsSection title="Basic Example">
        <Text className="leading-7">
          Click on clusters to zoom in. Click individual points to see details
          in a popup.
        </Text>
        <ComponentPreview
          code={clusterSource}
          previewImage="/images/previews/cluster.png"
        >
          <ClusterExample />
        </ComponentPreview>
      </DocsSection>
    </DocsLayout>
  );
}
