"use client";

import Link from "next/link";
import { Maximize } from "lucide-react";
import { ThemedImage } from "@/components/themed-image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type FileTree, type RegistryBlockItem } from "@/lib/blocks";
import { BlockInstallButton } from "./block-install-button";
import { BlockViewerCode, type HighlightedFile } from "./block-viewer-code";

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
  return (
    <Tabs
      defaultValue="preview"
      className="w-full gap-4"
      style={
        {
          "--block-preview-height": block.meta?.iframeHeight ?? "930px",
        } as React.CSSProperties
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3 max-md:hidden">
        <TabsList className="bg-background dark:border-input dark:bg-input/30 h-8! gap-0.5 rounded-md border p-0.5 shadow-xs">
          <TabsTrigger value="preview" className={tabTriggerClassName}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className={tabTriggerClassName}>
            Code
          </TabsTrigger>
        </TabsList>

        <div className="flex min-w-0 items-center gap-2">
          <BlockInstallButton name={block.name} />
          <Button
            variant="outline"
            size="icon-sm"
            asChild
            aria-label="Open in new tab"
          >
            <Link href={`/view/${block.name}`} target="_blank">
              <Maximize />
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 ring-foreground/5 dark:bg-muted/30 rounded-2xl p-2 ring-1">
        <div className="bg-background ring-foreground/5 relative aspect-[16/10] overflow-hidden rounded-lg shadow-xs ring-1 md:hidden">
          <ThemedImage src={`/blocks/${block.name}`} sizes="100vw" />
        </div>

        <TabsContent
          value="preview"
          forceMount
          className="data-[state=inactive]:hidden max-md:hidden"
        >
          {children}
        </TabsContent>

        <TabsContent value="code" className="max-md:hidden">
          <BlockViewerCode tree={tree} highlightedFiles={highlightedFiles} />
        </TabsContent>
      </div>
    </Tabs>
  );
}

const tabTriggerClassName =
  "text-muted-foreground hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground dark:data-[state=active]:bg-accent rounded-sm px-3 text-xs data-[state=active]:shadow-none! dark:data-[state=active]:border-transparent";
