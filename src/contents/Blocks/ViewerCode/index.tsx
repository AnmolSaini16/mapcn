import { Check, ChevronRight, Copy, File, Folder } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { type FileTree } from "@/lib/blocks";
import { copyText } from "@/lib/clipboard";
import { trackEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

export interface HighlightedFile {
  path: string;
  target: string;
  content: string;
  highlightedContent: string;
}

interface BlockViewerCodeContext {
  activeFile: string;
  setActiveFile: (file: string) => void;
  highlightedFiles: HighlightedFile[];
  tree: FileTree[];
}

const BlockViewerCodeCtx = React.createContext<BlockViewerCodeContext | null>(
  null,
);

function useBlockViewerCode() {
  const ctx = React.useContext(BlockViewerCodeCtx);
  if (!ctx) {
    throw new Error("useBlockViewerCode must be used within BlockViewerCode");
  }
  return ctx;
}

interface BlockViewerCodeProps {
  tree: FileTree[];
  highlightedFiles: HighlightedFile[];
  height?: number;
}

export function BlockViewerCode({
  tree,
  highlightedFiles,
  height = 930,
}: BlockViewerCodeProps) {
  const [activeFile, setActiveFile] = React.useState<string>(
    highlightedFiles[0]?.target ?? "",
  );
  const [copied, setCopied] = React.useState(false);

  const file = React.useMemo(
    () => highlightedFiles.find((f) => f.target === activeFile),
    [highlightedFiles, activeFile],
  );

  async function copyCode() {
    if (!file) return;

    await copyText(file.content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    trackEvent({
      name: "copy_block_code",
      properties: { file: file.target },
    });
  }

  if (!file) return null;

  return (
    <BlockViewerCodeCtx.Provider
      value={{ activeFile, setActiveFile, highlightedFiles, tree }}
    >
      <View
        className="flex-row overflow-hidden rounded-xl border"
        style={{ height }}
      >
        <View className="border-border w-56 shrink-0 border-r">
          <FileTreeSidebar />
        </View>
        <View className="min-w-0 flex-1">
          <View className="bg-surface border-border h-12 flex-row items-center gap-2 border-b px-4">
            <Text
              className="text-muted-foreground flex-1 text-sm"
              numberOfLines={1}
            >
              {file.target}
            </Text>
            <Pressable
              onPress={() => {
                void copyCode();
              }}
              accessibilityLabel={copied ? "Copied" : "Copy code"}
              className="bg-code size-8 items-center justify-center rounded-md"
            >
              <Icon
                as={copied ? Check : Copy}
                size={14}
                className="text-muted-foreground"
              />
            </Pressable>
          </View>
          <ScrollView
            className="bg-code flex-1"
            contentContainerClassName="px-4 py-4"
          >
            <Text className="font-mono text-sm leading-5">{file.content}</Text>
          </ScrollView>
        </View>
      </View>
    </BlockViewerCodeCtx.Provider>
  );
}

function FileTreeSidebar() {
  const { tree } = useBlockViewerCode();

  return (
    <View className="flex-1">
      <View className="border-border h-12 justify-center border-b px-4">
        <Text className="text-sm font-medium">Files</Text>
      </View>
      <ScrollView contentContainerClassName="py-1.5">
        {tree.map((file, index) => (
          <TreeNode
            key={index}
            item={file}
            depth={0}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function TreeNode({ item, depth }: { item: FileTree; depth: number }) {
  const { activeFile, setActiveFile } = useBlockViewerCode();
  const paddingLeft = 12 + depth * 12;

  if (!item.children) {
    const isActive = item.path === activeFile;

    return (
      <Pressable
        onPress={() => {
          if (item.path) setActiveFile(item.path);
        }}
        className={cn(
          "flex-row items-center gap-2 py-1.5 pr-3",
          isActive && "bg-muted-foreground/15",
        )}
        style={{ paddingLeft }}
      >
        <View className="size-4" />
        <Icon
          as={File}
          size={14}
        />
        <Text
          className="text-sm"
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  }

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger
        className="flex-row items-center gap-2 py-1.5 pr-3"
        style={{ paddingLeft }}
      >
        <Icon
          as={ChevronRight}
          size={14}
        />
        <Icon
          as={Folder}
          size={14}
        />
        <Text
          className="text-sm"
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {item.children.map((subItem, key) => (
          <TreeNode
            key={key}
            item={subItem}
            depth={depth + 1}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
