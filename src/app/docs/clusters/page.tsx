import { DocsLayout, DocsSection, DocsCode } from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import ClusterExample from "../_components/examples/cluster-example";
import { getExampleSource } from "@/lib/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clusters",
};

export default function ClustersPage() {
  const clusterSource = getExampleSource("cluster-example.tsx");

  return (
    <DocsLayout
      title="Clusters"
      description="Visualize large datasets with automatic point clustering."
      prev={{ title: "Routes", href: "/docs/routes" }}
      next={{ title: "Advanced Usage", href: "/docs/advanced-usage" }}
    >
      <DocsSection>
        <p>
          The <DocsCode>MapClusterLayer</DocsCode> component uses
          MapLibre&apos;s built-in clustering to efficiently render large
          numbers of points. Points are automatically grouped into clusters at
          low zoom levels, and expand as you zoom in.
        </p>
      </DocsSection>

      <DocsSection title="Basic Example">
        <p>
          Click on clusters to zoom in. Click individual points to see details
          in a popup.
        </p>
      </DocsSection>

      <ComponentPreview code={clusterSource}>
        <ClusterExample />
      </ComponentPreview>
    </DocsLayout>
  );
}
