"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { docsNavigation, type NavItem } from "@/lib/docs-navigation";
import { cn } from "@/lib/utils";

export function DocsHeader({ className }: { className?: string }) {
  const pathname = usePathname();

  let activeItem: (NavItem & { groupTitle: string }) | null = null;
  let groupHref = "/docs";
  for (const group of docsNavigation) {
    const item = group.items.find((navItem) => navItem.href === pathname);
    if (item) {
      activeItem = { ...item, groupTitle: group.title };
      groupHref = group.items[0]?.href ?? "/docs";
      break;
    }
  }

  return (
    <header
      className={cn(
        "w-full p-4 px-6 sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/70",
        className
      )}
    >
      <nav className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="h-4 w-px shrink-0 bg-border" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/docs">Docs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={groupHref}>
                  {activeItem?.groupTitle ?? "Overview"}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathname !== "/docs" && pathname !== "/docs/basic-map" && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="min-w-0 truncate">
                  <BreadcrumbPage>
                    {activeItem?.title ?? "Documentation"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    </header>
  );
}
