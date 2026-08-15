"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackEvent } from "@/lib/events";

interface InstallCommandProps {
  /** The shadcn registry item to add, e.g. "@mapcn/map" */
  name: string;
}

const PACKAGE_MANAGERS = [
  { manager: "pnpm", exec: "pnpm dlx" },
  { manager: "npm", exec: "npx" },
  { manager: "yarn", exec: "yarn dlx" },
  { manager: "bun", exec: "bunx --bun" },
] as const;

export function InstallCommand({ name }: InstallCommandProps) {
  const tabs = PACKAGE_MANAGERS.map(({ manager, exec }) => ({
    manager,
    command: `${exec} shadcn@latest add ${name}`,
  }));

  const [active, setActive] = useState<string>(tabs[0].manager);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const current = tabs.find((tab) => tab.manager === active);
    if (!current) return;
    await navigator.clipboard.writeText(current.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackEvent({
      name: "copy_install_command",
      properties: { name, packageManager: active },
    });
  };

  return (
    <div className="bg-surface relative w-full overflow-hidden rounded-lg">
      <Tabs value={active} onValueChange={setActive} className="gap-0">
        <div className="flex items-center justify-between border-b pr-2 pl-[5px]">
          <TabsList
            variant="line"
            className="h-10 bg-transparent group-data-[orientation=horizontal]/tabs:h-10"
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.manager}
                value={tab.manager}
                className="font-mono text-xs"
              >
                {tab.manager}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy command"}
            className="text-muted-foreground"
          >
            {copied ? <Check /> : <Copy />}
          </Button>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.manager} value={tab.manager}>
            <pre className="overflow-x-auto p-4 text-sm">
              <code className="font-mono" data-language="bash">
                {tab.command}
              </code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
