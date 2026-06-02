import { BookOpen, CornerDownRight, Layers2, LucideIcon } from "lucide-react";

export interface MainNavItem {
  href: string;
  label: string;
}

export interface SiteNavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  new?: boolean;
}

export interface SiteNavigationGroup {
  title: string;
  items: SiteNavigationItem[];
}

export const docsNavigation: SiteNavigationGroup[] = [
  {
    title: "Basics",
    items: [
      { title: "Getting Started", href: "/docs", icon: BookOpen },
      { title: "Installation", href: "/docs/installation", icon: BookOpen },
      { title: "API Reference", href: "/docs/api-reference", icon: BookOpen },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Map", href: "/docs/basic-map", icon: Layers2 },
      { title: "Controls", href: "/docs/controls", icon: Layers2 },
      { title: "Markers", href: "/docs/markers", icon: Layers2 },
      { title: "Popups", href: "/docs/popups", icon: Layers2 },
      { title: "Routes", href: "/docs/routes", icon: Layers2 },
      { title: "Arcs", href: "/docs/arcs", icon: Layers2 },
      { title: "Polygons", href: "/docs/polygons", icon: Layers2, new: true },
      { title: "Clusters", href: "/docs/clusters", icon: Layers2 },
      { title: "Advanced", href: "/docs/advanced-usage", icon: Layers2 },
    ],
  },
];

const navItems: SiteNavigationItem[] = [
  { title: "Home", href: "/", icon: CornerDownRight },
  { title: "Docs", href: "/docs", icon: CornerDownRight },
  { title: "Components", href: "/docs/basic-map", icon: CornerDownRight },
  { title: "Blocks", href: "/blocks", icon: CornerDownRight },
];

export const siteNavigation: SiteNavigationGroup[] = [
  {
    title: "Pages",
    items: navItems,
  },
  ...docsNavigation,
];
