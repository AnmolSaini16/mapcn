import { Separator } from "./ui/separator";

import { CommandSearch } from "@/components/command-search";
import { GitHubButton } from "@/components/github-button";
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "bg-background/85 supports-backdrop-filter:bg-background/70 sticky top-0 z-50 h-14 w-full backdrop-blur",
        className,
      )}
    >
      <nav className="container flex size-full items-center gap-2">
        <MobileNav />
        <Logo className="hidden shrink-0 lg:flex" />
        <Separator
          className="bg-primary/15 ml-2.5 hidden h-4! lg:block"
          orientation="vertical"
        />
        <MainNav className="hidden lg:flex" />

        <div className="ml-auto flex items-center gap-1.5">
          <CommandSearch />
          <GitHubButton />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
