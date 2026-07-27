"use client";

import { Menu } from "lucide-react-native";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "./logo";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteNavigation } from "@/lib/site-navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open docs menu"
          className="shrink-0 lg:hidden"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="rounded-r-xl"
      >
        <SheetHeader>
          <SheetTitle>
            <Logo isLink={false} />
          </SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-2">
          <nav className="space-y-6">
            {siteNavigation.map((group) => (
              <div key={group.title}>
                <h3 className="text-muted-foreground mb-2 px-2 text-sm font-medium">
                  {group.title}
                </h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          setOpen(false);
                        }}
                        className="active:text-muted-foreground flex items-center px-3 py-2 text-lg"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
