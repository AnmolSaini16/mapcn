import {
  DocsCode,
  DocsLayout,
  DocsLink,
  DocsNote,
  DocsSection,
} from "../_components/docs";
import { CodeBlock } from "../_components/code-block";
import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Map, MapControls } from "@/registry/map";

const installCommand = "npx shadcn@latest add @mapcn/map";

const usageCode = `import { Map, MapControls } from "@/components/ui/map";
import { Card } from "@/components/ui/card";

export function MyMap() {
  return (
    <Card className="h-[320px] p-0 overflow-hidden">
      <Map center={[-74.006, 40.7128]} zoom={11}>
        <MapControls />
      </Map>
    </Card>
  );
}`;

export const metadata: Metadata = {
  title: "Installation",
};

export default function InstallationPage() {
  return (
    <DocsLayout
      title="Installation"
      description="How to install and set up mapcn in your project."
      prev={{ title: "Introduction", href: "/docs" }}
      next={{ title: "API Reference", href: "/docs/api-reference" }}
      toc={[
        { title: "Prerequisites", slug: "prerequisites" },
        { title: "Installation", slug: "installation" },
        { title: "Usage", slug: "usage" },
      ]}
    >
      <DocsSection title="Prerequisites">
        <p>
          A project with{" "}
          <DocsLink href="https://tailwindcss.com" external>
            Tailwind CSS
          </DocsLink>{" "}
          and{" "}
          <DocsLink href="https://ui.shadcn.com" external>
            shadcn/ui
          </DocsLink>{" "}
          set up.
        </p>
      </DocsSection>

      <DocsSection title="Installation">
        <p>Run the following command to add the map component:</p>
        <CodeBlock code={installCommand} language="bash" />
        <p>
          This will install <DocsCode>maplibre-gl</DocsCode> and add the map
          component to your project.
        </p>
      </DocsSection>

      <DocsSection title="Usage">
        <p>Import and use the map component:</p>
        <CodeBlock code={usageCode} />
        <Card className="h-[320px] p-0 overflow-hidden rounded-lg">
          <Map center={[-74.006, 40.7128]} zoom={11}>
            <MapControls />
          </Map>
        </Card>
      </DocsSection>

      <DocsNote>
        <strong>Note:</strong> The map uses free CARTO basemap tiles by default.
        No API key required. Tiles automatically switch between light and dark
        themes.
      </DocsNote>
    </DocsLayout>
  );
}
