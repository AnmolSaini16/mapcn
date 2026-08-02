import { Link, usePathname, type Href } from "expo-router";
import { Platform } from "react-native";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Text } from "@/components/ui/text";
import { docsNavigation } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar
      className={cn(
        "bg-transparent",
        Platform.select({
          web: "sticky top-14 z-30 hidden h-[calc(100svh-3.5rem)] overscroll-none lg:flex",
        }),
      )}
      collapsible="none"
    >
      <SidebarContent className="pt-10">
        {docsNavigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="font-medium"
                    >
                      <Link
                        href={item.href as Href}
                        onPress={() => {
                          setOpenMobile(false);
                        }}
                      >
                        <Text>{item.title}</Text>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
