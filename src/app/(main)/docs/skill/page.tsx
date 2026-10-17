import { Metadata } from "next";

import {
  DocsCode,
  DocsLayout,
  DocsLink,
  DocsSection,
} from "../_components/docs";
import { CodeBlock } from "../_components/code-block";
import { InstallCommand } from "../_components/install-command";
import { CodeCopyButton } from "@/components/code-copy-button";
import { githubRepoUrl } from "@/lib/site-navigation";

export const metadata: Metadata = {
  title: "Skill",
  description:
    "Teach your coding agent mapcn: install components and blocks, and follow the rules that make maps work.",
};

export default function SkillPage() {
  return (
    <DocsLayout
      title="Skill"
      description="Teach your coding agent mapcn, so it installs the right pieces and writes maps that work the first time."
      prev={{ title: "Installation", href: "/docs/installation" }}
      next={{ title: "API Reference", href: "/docs/api-reference" }}
    >
      <DocsSection title="Installation">
        <InstallCommand cli="skills add" name="AnmolSaini16/mapcn" />
        <p>
          Works with Claude Code, Cursor, Codex and other agents that support
          skills. To add it by hand, copy the{" "}
          <DocsLink href={`${githubRepoUrl}/tree/main/skills/mapcn`} external>
            skills/mapcn
          </DocsLink>{" "}
          folder into <DocsCode>.claude/skills/</DocsCode> or your agent&apos;s
          skills folder.
        </p>
        <p>
          The skill loads on its own when you ask for a map. Not sure where a
          map fits? Ask it to look through your project and suggest some.
        </p>
        <p>
          Agent doesn&apos;t support skills? Point it at{" "}
          <DocsLink href="/llms.txt" external>
            llms.txt
          </DocsLink>{" "}
          instead.
        </p>
      </DocsSection>

      <DocsSection title="What it knows">
        <ul>
          <li>
            <strong>Setup.</strong> Installs the map and blocks with the shadcn
            CLI, and skips what&apos;s already there.
          </li>
          <li>
            <strong>The gotchas.</strong> Gives every map a height, keeps
            coordinates in <DocsCode>[lng, lat]</DocsCode> order, and fetches
            route data outside the map.
          </li>
          <li>
            <strong>Basemaps.</strong> Street tiles when people need to find
            places, a blank canvas when the data is the map, or your own style.
          </li>
          <li>
            <strong>Recipes.</strong> Fly-to, live route tracking, custom
            layers, large datasets and strict CSP.
          </li>
          <li>
            <strong>Every component and block,</strong> with links to the
            working examples in these docs.
          </li>
        </ul>
      </DocsSection>

      <DocsSection title="Try asking">
        <div className="bg-surface overflow-hidden rounded-lg">
          <ul className="divide-y">
            {examplePrompts.map((prompt) => (
              <li
                key={prompt}
                className="group flex items-center justify-between gap-4 py-2.5 pr-2.5 pl-4"
              >
                <span>{prompt}</span>
                <CodeCopyButton
                  text={prompt}
                  label="Copy prompt"
                  className="shrink-0 bg-transparent opacity-0 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
                />
              </li>
            ))}
          </ul>
        </div>
      </DocsSection>

      <DocsSection title="What's inside">
        <p>
          The skill is generated from the same registry and examples as this
          site, so it stays in step with the components. Your agent reads only
          the files a task needs.
        </p>
        <CodeBlock
          code={skillTree}
          language="bash"
          showLineNumbers={false}
          showCopyButton={false}
        />
      </DocsSection>
    </DocsLayout>
  );
}

const examplePrompts = [
  "Where could a map help in this app?",
  "Add a store locator for our locations.",
  "Show the delivery route on the order page with live progress.",
  "Make a choropleth of revenue by country.",
  "Draw arcs between our offices on a globe.",
];

const skillTree = `skills/mapcn/
├── SKILL.md            # workflow, install, rules, basemaps
└── references/
    ├── components.md   # every export, docs and example links
    ├── blocks.md       # blocks, files they add, install commands
    └── patterns.md     # recipes beyond the basics`;
