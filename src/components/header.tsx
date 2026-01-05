import { MapPin } from "lucide-react";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { GitHubButton } from "@/components/github-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
  leftContent?: React.ReactNode;
}

export function Header({ className, leftContent }: HeaderProps) {
  return (
    <header className={cn("w-full px-6 py-4", className)}>
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {leftContent}
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <MapPin className="size-4" />
            <span className="font-semibold tracking-tight">mapcn</span>
          </Link>
        </div>
        <div className="flex items-center gap-1.5 h-4.5">
          <GitHubButton />
          <Separator orientation="vertical" />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
