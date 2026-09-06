"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  FileText,
  SearchIcon,
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
import { siteNavigation } from "@/lib/site-navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function CommandSearch({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSelect(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label="Jump to pages, components, and docs"
        className={cn(
          "bg-muted dark:bg-muted/40 text-muted-foreground hover:bg-muted dark:hover:bg-muted/60 hover:text-foreground mr-2.5 hidden w-36 md:flex",
          className,
        )}
      >
        <SearchIcon className="size-3.5" />
        <span>Search</span>
        <Kbd className="text-muted-foreground/70 ml-auto bg-transparent">
          ⌘K
        </Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search..."
        description="Jump to pages, components, and docs"
        showCloseButton={false}
      >
        <CommandInput
          placeholder="Search..."
          className="h-10 border-none text-sm"
        />
        <CommandList>
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
        </CommandList>
        <div className="text-muted-foreground/80 flex items-center justify-between border-t p-3 text-xs">
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
