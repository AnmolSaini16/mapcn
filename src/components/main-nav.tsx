"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { docsNavigation, siteNavigation } from "@/lib/site-navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const componentHrefs = new Set(
  docsNavigation
    .find((group) => group.title === "Components")
    ?.items.map((item) => item.href),
);

export function MainNav({ className, ...props }: React.ComponentProps<"nav">) {
  const pathname = usePathname();
  const navItems = siteNavigation
    .find((group) => group.title === "Pages")
    ?.items.filter((item) => item.title !== "Home");

  if (!navItems?.length) return null;

  return (
    <nav className={cn("flex items-center gap-0.5", className)} {...props}>
      {navItems.map((item) => {
        const isActive = isActiveSection(item.href, pathname);
        return (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            size="sm"
            className={cn(
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Link href={item.href} aria-current={isActive ? "page" : undefined}>
              <span>{item.title}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

function isActiveSection(href: string, pathname: string) {
  if (componentHrefs.has(href)) return componentHrefs.has(pathname);
  if (href === "/docs") {
    return pathname.startsWith("/docs") && !componentHrefs.has(pathname);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
