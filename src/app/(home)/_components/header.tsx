import { Heart } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GitHubButton } from "@/components/github-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandSearch } from "@/components/command-search";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  return (
    <header className={cn("w-full p-4 container", className)}>
      <nav className="flex size-full items-center justify-between">
        <Logo />

        <div className="flex items-center gap-2 h-4.5">
          <CommandSearch />
          <Separator orientation="vertical" className="hidden md:block" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://github.com/sponsors/AnmolSaini16"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart className="size-4 text-pink-500" />
                  <span className="hidden md:inline">Sponsor</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sponsor this project</p>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          <GitHubButton />
          <Separator orientation="vertical" />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
