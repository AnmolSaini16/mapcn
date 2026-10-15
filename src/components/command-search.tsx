"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Bot,
  Check,
  CornerDownLeft,
  FileText,
  Moon,
  SearchIcon,
  Sun,
  Terminal,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { GitHubIcon } from "@/components/github-icon";
import { THEME_HOTKEY } from "@/components/theme-provider";
import { useThemeToggle } from "@/components/theme-toggle";
import { githubRepoUrl, siteNavigation } from "@/lib/site-navigation";
import { mapInstallAgentPrompt, mapInstallCommand } from "@/lib/llm-prompts";
import { trackEvent, type Event } from "@/lib/events";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function CommandSearch({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [copyStatus, setCopyStatus] = React.useState<CopyStatus | null>(null);
  const closeTimer = React.useRef<number | undefined>(undefined);
  const router = useRouter();
  const { resolvedTheme, toggleTheme } = useThemeToggle();

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        window.clearTimeout(closeTimer.current);
        setCopyStatus(null);
        setOpen((open) => !open);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  function handleOpenChange(open: boolean) {
    window.clearTimeout(closeTimer.current);
    setCopyStatus(null);
    setOpen(open);
  }

  function handleSelect(href: string) {
    handleOpenChange(false);
    router.push(href);
  }

  function runAction(action: () => void) {
    handleOpenChange(false);
    action();
  }

  async function copy(id: CopyId, text: string, event: Event["name"]) {
    window.clearTimeout(closeTimer.current);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setCopyStatus({ id, ok: false });
      return;
    }
    trackEvent({ name: event, properties: { source: "command-palette" } });
    setCopyStatus({ id, ok: true });
    closeTimer.current = window.setTimeout(() => handleOpenChange(false), 600);
  }

  function isCopied(id: CopyId) {
    return copyStatus?.id === id && copyStatus.ok;
  }

  function copyLabel(id: CopyId, label: string) {
    if (copyStatus?.id !== id) return label;
    return copyStatus.ok ? "Copied" : "Couldn't copy, try again";
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleOpenChange(true)}
        aria-label="Jump to pages, components, and docs"
        className={cn(
          "text-muted-foreground hover:text-foreground mr-2.5 hidden w-48 justify-start bg-transparent font-normal md:flex dark:bg-transparent",
          className,
        )}
      >
        <SearchIcon className="size-3.5" />
        <span>Search...</span>
        <Kbd className="text-muted-foreground/70 ml-auto bg-transparent">
          ⌘K
        </Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Search..."
        description="Jump to pages, components, and docs"
        showCloseButton={false}
        className="shadow-2xl"
      >
        <CommandInput
          placeholder="Search..."
          className="h-full border-none text-sm"
        />
        <CommandList className="max-h-[296px]">
          <CommandEmpty className="text-muted-foreground py-8 text-sm">
            <div className="flex flex-col items-center gap-1.5">
              <FileText className="size-5 opacity-40" />
              <span>No results found</span>
            </div>
          </CommandEmpty>
          {siteNavigation.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => handleSelect(item.href)}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandGroup heading="Actions">
            <CommandItem
              value="Toggle theme"
              keywords={["switch", "dark", "light", "mode", "appearance"]}
              onSelect={() => runAction(toggleTheme)}
            >
              {resolvedTheme === "dark" ? <Sun /> : <Moon />}
              <span>
                Switch to {resolvedTheme === "dark" ? "light" : "dark"} theme
              </span>
              <Kbd className="ml-auto">{THEME_HOTKEY.toUpperCase()}</Kbd>
            </CommandItem>
            <CommandItem
              value="Open GitHub repository"
              keywords={["source", "star", "repo", "code"]}
              onSelect={() =>
                runAction(() =>
                  window.open(githubRepoUrl, "_blank", "noopener,noreferrer"),
                )
              }
            >
              <GitHubIcon />
              <span>Open GitHub repository</span>
            </CommandItem>
            <CommandItem
              value="Copy install command"
              keywords={["npx", "shadcn", "cli", "add"]}
              onSelect={() =>
                copy("install", mapInstallCommand, "copy_install_command")
              }
            >
              {isCopied("install") ? <Check /> : <Terminal />}
              <span>{copyLabel("install", "Copy install command")}</span>
            </CommandItem>
            <CommandItem
              value="Copy prompt for your agent"
              keywords={["ai", "llm", "claude", "cursor"]}
              onSelect={() =>
                copy("prompt", mapInstallAgentPrompt, "copy_agent_prompt")
              }
            >
              {isCopied("prompt") ? <Check /> : <Bot />}
              <span>{copyLabel("prompt", "Copy prompt for your agent")}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="text-muted-foreground bg-muted/30 mt-1 flex items-center justify-between border-t px-5 py-2.5 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5">
              <Kbd>
                <ArrowUp className="size-3" />
              </Kbd>
              <Kbd>
                <ArrowDown className="size-3" />
              </Kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>
                <CornerDownLeft className="size-3" />
              </Kbd>
              <span>select</span>
            </span>
          </div>
          <span className="flex items-baseline gap-1.5">
            <Kbd>esc</Kbd>
            <span>close</span>
          </span>
        </div>
      </CommandDialog>
    </>
  );
}

type CopyId = "install" | "prompt";

interface CopyStatus {
  id: CopyId;
  ok: boolean;
}
