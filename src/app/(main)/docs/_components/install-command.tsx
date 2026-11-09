"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCopyLabel, useCopy } from "@/hooks/use-copy";
import { trackEvent } from "@/lib/events";

interface InstallCommandProps {
  /** What to add, e.g. "@mapcn/map" */
  name: string;
  /** The CLI and subcommand to run it with */
  cli?: string;
}

const PACKAGE_MANAGERS = [
  { manager: "pnpm", exec: "pnpm dlx" },
  { manager: "npm", exec: "npx" },
  { manager: "yarn", exec: "yarn dlx" },
  { manager: "bun", exec: "bunx --bun" },
] as const;

export function InstallCommand({
  name,
  cli = "shadcn@latest add",
}: InstallCommandProps) {
  const tabs = PACKAGE_MANAGERS.map(({ manager, exec }) => ({
    manager,
    command: `${exec} ${cli} ${name}`,
  }));

  const [active, setActive] = useState<string>(tabs[0].manager);
  const { status, copy } = useCopy();

  const copyCommand = async () => {
    const current = tabs.find((tab) => tab.manager === active);
    if (!current || !(await copy(current.command))) return;
    trackEvent({
      name: "copy_install_command",
      properties: { name, cli, packageManager: active },
    });
  };

  return (
    <div className="bg-muted/50 ring-foreground/5 dark:bg-muted/30 w-full rounded-xl p-1 ring-1">
      <Tabs value={active} onValueChange={setActive} className="gap-1">
        <div className="flex items-center justify-between p-0.5">
          <TabsList className="h-8 gap-0.5 bg-transparent p-0 group-data-[orientation=horizontal]/tabs:h-8">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.manager}
                value={tab.manager}
                className="h-7 flex-none px-2.5 font-mono text-xs"
              >
                {tab.manager}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={copyCommand}
            aria-label={getCopyLabel(status, "Copy command")}
            className="text-muted-foreground"
          >
            {status === "copied" ? <Check /> : <Copy />}
          </Button>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.manager} value={tab.manager}>
            <pre className="bg-background ring-foreground/5 overflow-x-auto rounded-lg p-4 text-sm shadow-xs ring-1">
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
