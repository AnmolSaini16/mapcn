import { Link } from "expo-router";
import { Check, Maximize, Terminal } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { BlockViewerCode, type HighlightedFile } from "../BlockViewerCode";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { type FileTree, type RegistryBlockItem } from "@/lib/blocks";
import { copyText } from "@/lib/clipboard";
import { trackEvent } from "@/lib/events";

interface BlockPreviewProps {
  block: RegistryBlockItem;
  children: React.ReactNode;
  tree: FileTree[];
  highlightedFiles: HighlightedFile[];
}

function parsePreviewHeight(iframeHeight?: string): number {
  const parsed = Number.parseInt(iframeHeight ?? "930", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 930;
}

export function BlockPreview({
  block,
  children,
  tree,
  highlightedFiles,
}: BlockPreviewProps) {
  const { name, title, description, meta } = block;
  const [copiedType, setCopiedType] = useState<"code" | "cli" | null>(null);
  const [tab, setTab] = useState("preview");
  const previewHeight = parsePreviewHeight(meta?.iframeHeight);

  async function copyCli() {
    await copyText(
      `npx shadcn@latest add unkn0wndfbx/mapcn-react-native/${name}`,
    );
    setCopiedType("cli");
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
    trackEvent({ name: "copy_block_cli", properties: { block: name } });
  }

  return (
    <View className="gap-4">
      <View>
        <Text className="text-lg font-semibold tracking-tight">{title}</Text>
        {description ? (
          <Text className="text-muted-foreground mt-0.5 text-sm">
            {description}
          </Text>
        ) : null}
      </View>

      <Tabs
        value={tab}
        onValueChange={setTab}
        className="w-full"
      >
        <View className="flex-row items-center justify-between gap-2">
          <TabsList className="h-8">
            <TabsTrigger value="preview">
              <Text className="text-xs">Preview</Text>
            </TabsTrigger>
            <TabsTrigger value="code">
              <Text className="text-xs">Code</Text>
            </TabsTrigger>
          </TabsList>

          <View className="flex-row items-center gap-2.5">
            <Button
              onPress={() => {
                void copyCli();
              }}
              variant="outline"
              accessibilityLabel="Copy CLI command"
              size="sm"
              className="gap-1.5"
            >
              <Icon
                as={copiedType === "cli" ? Check : Terminal}
                size={14}
              />
              <Text className="font-mono text-xs">
                npx shadcn add unkn0wndfbx/mapcn-react-native/{name}
              </Text>
            </Button>
            <View className="h-4 justify-center">
              <Separator orientation="vertical" />
            </View>
            <Link
              href={`/view/${name}`}
              asChild
            >
              <Button
                variant="outline"
                size="icon"
                accessibilityLabel="Open block"
              >
                <Icon
                  as={Maximize}
                  size={16}
                />
              </Button>
            </Link>
          </View>
        </View>

        <TabsContent
          value="preview"
          className="mt-3"
          style={{ height: previewHeight }}
        >
          {children}
        </TabsContent>

        <TabsContent
          value="code"
          className="mt-3"
          style={{ height: previewHeight }}
        >
          <BlockViewerCode
            tree={tree}
            highlightedFiles={highlightedFiles}
            height={previewHeight}
          />
        </TabsContent>
      </Tabs>
    </View>
  );
}
