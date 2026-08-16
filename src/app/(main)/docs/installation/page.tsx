import {
  DocsCode,
  DocsLayout,
  DocsLink,
  DocsNote,
  DocsSection,
} from "../_components/docs";
import { CodeBlock } from "../_components/code-block";
import { InstallCommand } from "../_components/install-command";
import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Map, MapControls } from "@/registry/map";

const cspCode = `script-src 'self' https://unpkg.com;
worker-src 'self' blob:;`;

const selfHostWorkerCode = `cp node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs \\
   node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs \\
   public/`;

const workerUrlCode = `MapLibreGL.setWorkerUrl("/maplibre-gl-worker.mjs");`;

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
        <InstallCommand name="@mapcn/map" />
        <p>
          This will install <DocsCode>maplibre-gl</DocsCode> and add the map
          component to your project.
        </p>
      </DocsSection>

      <DocsSection title="Usage">
        <p>Import and use the map component:</p>
        <CodeBlock code={usageCode} />
        <Card className="h-[320px] overflow-hidden rounded-lg p-0">
          <Map center={[-74.006, 40.7128]} zoom={11}>
            <MapControls />
          </Map>
        </Card>
        <DocsNote>
          <strong>Note:</strong> The map uses free CARTO basemap tiles by
          default. Tiles automatically switch between light and dark themes.
        </DocsNote>
      </DocsSection>

      <DocsSection title="Web Worker">
        <p>
          MapLibre parses tiles in a Web Worker, which ships as a separate file,
          so mapcn loads it from unpkg, pinned to your installed version. No
          setup needed - under a strict CSP, the worker needs:
        </p>
        <CodeBlock code={cspCode} language="bash" showLineNumbers={false} />
        <p>Your basemap host needs its own entries alongside these.</p>
        <p>
          To self-host it instead, copy both files into{" "}
          <DocsCode>public/</DocsCode> - they must sit side by side:
        </p>
        <CodeBlock
          code={selfHostWorkerCode}
          language="bash"
          showLineNumbers={false}
        />
        <p>Then replace the unpkg URL near the top of the component:</p>
        <CodeBlock
          code={workerUrlCode}
          filename="components/ui/map.tsx"
          showLineNumbers={false}
        />
      </DocsSection>
    </DocsLayout>
  );
}
