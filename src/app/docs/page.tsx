import { Zap, Moon, Puzzle, Code } from "lucide-react";
import { DocsLayout, DocsSection, DocsLink } from "./_components/docs";
import { Metadata } from "next";

const features = [
  {
    icon: Zap,
    title: "Zero Config",
    description:
      "Works out of the box with free map tiles. No API keys required.",
  },
  {
    icon: Moon,
    title: "Theme Aware",
    description: "Automatically adapts to light and dark mode.",
  },
  {
    icon: Puzzle,
    title: "Composable",
    description: "Build complex UIs with simple, composable components.",
  },
  {
    icon: Code,
    title: "TypeScript",
    description: "Full type safety with comprehensive TypeScript support.",
  },
];

export const metadata: Metadata = {
  title: "Introduction",
};

export default function IntroductionPage() {
  return (
    <DocsLayout
      title="Introduction"
      description="Beautiful, accessible map components."
      next={{ title: "Installation", href: "/docs/installation" }}
    >
      <DocsSection>
        <p>
          <strong className="text-foreground">mapcn</strong> provides
          beautifully designed, accessible, and customizable map components.
          Built on{" "}
          <DocsLink href="https://visgl.github.io/react-map-gl/" external>
            react-map-gl
          </DocsLink>{" "}
          and{" "}
          <DocsLink href="https://maplibre.org" external>
            MapLibre GL
          </DocsLink>
          , styled with{" "}
          <DocsLink href="https://tailwindcss.com" external>
            Tailwind CSS
          </DocsLink>
          , and designed to work with{" "}
          <DocsLink href="https://ui.shadcn.com" external>
            shadcn/ui
          </DocsLink>
          .
        </p>
      </DocsSection>

      <DocsSection title="Why mapcn?">
        <p>
          There&apos;s no proper copy-paste, easy-to-use map integration for
          React. Most solutions require complex configurations, API keys, or
          heavy wrapper libraries. mapcn gives you beautiful maps with a single
          command.
        </p>
      </DocsSection>

      <DocsSection title="Features">
        <div className="grid gap-4 sm:grid-cols-2 mt-4 not-prose">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border bg-card p-4 space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                  <feature.icon className="size-4 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </DocsSection>
    </DocsLayout>
  );
}
