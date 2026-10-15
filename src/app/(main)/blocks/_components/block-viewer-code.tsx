"use client";

import * as React from "react";
import { ChevronRight, File, Folder } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { type FileTree } from "@/lib/blocks";
import { trackEvent } from "@/lib/events";
import { CodeSurface } from "@/components/code-surface";
import { CodeCopyButton } from "@/components/code-copy-button";

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
}

export function BlockViewerCode({
  tree,
  highlightedFiles,
}: BlockViewerCodeProps) {
  const [activeFile, setActiveFile] = React.useState<string>(
    highlightedFiles[0]?.target ?? "",
  );

  const file = React.useMemo(
    () => highlightedFiles.find((f) => f.target === activeFile),
    [highlightedFiles, activeFile],
  );

  if (!file) return null;

  return (
    <BlockViewerCodeCtx.Provider
      value={{ activeFile, setActiveFile, highlightedFiles, tree }}
    >
      <div className="bg-background flex h-(--block-preview-height) overflow-hidden rounded-xl border">
        <div className="w-64 shrink-0">
          <FileTreeSidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="bg-surface flex h-12 shrink-0 items-center gap-2 border-b px-4 text-sm">
            <span className="text-muted-foreground">{file.target}</span>
            <div className="ml-auto">
              <CodeCopyButton
                text={file.content}
                onCopy={() =>
                  trackEvent({
                    name: "copy_block_code",
                    properties: { file: file.target },
                  })
                }
              />
            </div>
          </div>
          <CodeSurface
            key={file.path}
            html={file.highlightedContent}
            className="flex-1 overflow-x-auto"
          />
        </div>
      </div>
    </BlockViewerCodeCtx.Provider>
  );
}

function FileTreeSidebar() {
  const { tree } = useBlockViewerCode();

  return (
    <SidebarProvider className="flex min-h-full! flex-col border-r">
      <Sidebar collapsible="none" className="w-full flex-1">
        <SidebarGroupLabel className="h-12 rounded-none border-b px-4 text-sm">
          Files
        </SidebarGroupLabel>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="translate-x-0 gap-1.5">
              {tree.map((file, index) => (
                <TreeNode key={index} item={file} index={1} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>
    </SidebarProvider>
  );
}

function TreeNode({ item, index }: { item: FileTree; index: number }) {
  const { activeFile, setActiveFile } = useBlockViewerCode();

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={item.path === activeFile}
          onClick={() => item.path && setActiveFile(item.path)}
          className="hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15 rounded-none pl-(--index) whitespace-nowrap"
          data-index={index}
          style={
            {
              "--index": `${index * (index === 2 ? 1.2 : 1.3)}rem`,
            } as React.CSSProperties
          }
        >
          <ChevronRight className="invisible" />
          <File className="size-4" />
          {item.name}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className="hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15 rounded-none pl-(--index) whitespace-nowrap"
            style={
              {
                "--index": `${index * (index === 1 ? 1 : 1.2)}rem`,
              } as React.CSSProperties
            }
          >
            <ChevronRight className="transition-transform" />
            <Folder />
            {item.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="m-0 w-full translate-x-0 border-none p-0">
            {item.children.map((subItem, key) => (
              <TreeNode key={key} item={subItem} index={index + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
