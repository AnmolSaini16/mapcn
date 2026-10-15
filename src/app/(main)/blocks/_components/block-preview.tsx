"use client";

import { useState } from "react";
import { Check, Maximize, Terminal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { type FileTree, type RegistryBlockItem } from "@/lib/blocks";
import { trackEvent } from "@/lib/events";
import { BlockViewerCode, type HighlightedFile } from "./block-viewer-code";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface BlockPreviewProps {
  block: RegistryBlockItem;
  children: React.ReactNode;
  tree: FileTree[];
  highlightedFiles: HighlightedFile[];
}

export function BlockPreview({
  block,
  children,
  tree,
  highlightedFiles,
}: BlockPreviewProps) {
  const { name, title, description, meta } = block;
  const [copiedType, setCopiedType] = useState<"code" | "cli" | null>(null);

  async function copyCli() {
    await navigator.clipboard.writeText(`npx shadcn@latest add @mapcn/${name}`);
    setCopiedType("cli");
    setTimeout(() => setCopiedType(null), 2000);
    trackEvent({ name: "copy_block_cli", properties: { block: name } });
  }

  return (
    <div
      id={name}
      className="scroll-mt-24"
      style={
        {
          "--block-preview-height": meta?.iframeHeight ?? "930px",
        } as React.CSSProperties
      }
    >
      <Tabs defaultValue="preview" className="w-full gap-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between xl:gap-6">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            {description && (
              <p className="text-muted-foreground mt-0.5 text-sm">
                {description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <TabsList className="bg-background dark:border-input dark:bg-input/30 h-8! gap-0.5 rounded-md border p-0.5 shadow-xs">
              <TabsTrigger value="preview" className={tabTriggerClassName}>
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className={tabTriggerClassName}>
                Code
              </TabsTrigger>
            </TabsList>

            <div className="hidden items-center gap-2 md:flex">
              <Separator orientation="vertical" className="mr-1 h-5!" />
              <Button
                onClick={copyCli}
                variant="outline"
                aria-label="Copy CLI command"
                size="sm"
                className="font-mono text-xs"
              >
                {copiedType === "cli" ? <Check /> : <Terminal />}
                npx shadcn add @mapcn/{name}
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                asChild
                aria-label="Open in new tab"
              >
                <Link href={`/view/${name}`} target="_blank">
                  <Maximize />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <TabsContent
          value="preview"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          {children}
        </TabsContent>

        <TabsContent value="code">
          <BlockViewerCode tree={tree} highlightedFiles={highlightedFiles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const tabTriggerClassName =
  "text-muted-foreground hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground dark:data-[state=active]:bg-accent rounded-sm px-3 text-xs data-[state=active]:shadow-none! dark:data-[state=active]:border-transparent";
