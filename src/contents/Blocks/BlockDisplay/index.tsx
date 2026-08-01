import analyticsCard from "../../../../public/r/analytics-card.json";
import analyticsMap from "../../../../public/r/analytics-map.json";
import choropleth from "../../../../public/r/choropleth.json";
import deliveryTracker from "../../../../public/r/delivery-tracker.json";
import heatmap from "../../../../public/r/heatmap.json";
import logisticsNetwork from "../../../../public/r/logistics-network.json";
import storeLocator from "../../../../public/r/store-locator.json";
import uptimeMonitor from "../../../../public/r/uptime-monitor.json";
import { BlockPreview } from "../BlockPreview";
import type { HighlightedFile } from "../BlockViewerCode";
import { MobileBlockPreview } from "../MobileBlockPreview";

import { createFileTreeForRegistryItemFiles, getAllBlocks } from "@/lib/blocks";

const BLOCK_SOURCES: Record<
  string,
  {
    files?: { path: string; content?: string; target?: string }[];
  }
> = {
  "analytics-card": analyticsCard,
  "analytics-map": analyticsMap,
  choropleth,
  "delivery-tracker": deliveryTracker,
  heatmap,
  "logistics-network": logisticsNetwork,
  "store-locator": storeLocator,
  "uptime-monitor": uptimeMonitor,
};

interface BlockDisplayProps {
  name: string;
}

export function BlockDisplay({ name }: BlockDisplayProps) {
  const blocks = getAllBlocks();
  const block = blocks.find((b) => b.name === name);
  const registryItem = BLOCK_SOURCES[name];

  if (!block || !block.files?.length || !registryItem) {
    return null;
  }

  const tree = createFileTreeForRegistryItemFiles(block.files);

  const highlightedFiles: HighlightedFile[] = block.files.map((file) => {
    const registryFile = registryItem.files?.find((f) => f.path === file.path);
    const content = (registryFile?.content ?? "").replace(
      /@\/registry\/map/g,
      "@/components/ui/map",
    );

    return {
      path: file.path,
      target: file.target ?? file.path,
      content,
      highlightedContent: content,
    };
  });

  return (
    <BlockPreview
      block={block}
      tree={tree}
      highlightedFiles={highlightedFiles}
    >
      <MobileBlockPreview
        name={block.name}
        title={block.title ?? block.name}
      />
    </BlockPreview>
  );
}
