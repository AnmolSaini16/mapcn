import { SidebarProvider } from "@/components/ui/sidebar";
import { DocsSidebar } from "./_components/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <SidebarProvider className="container min-h-min px-0">
        <DocsSidebar />
        <main className="flex min-w-0 flex-1">{children}</main>
      </SidebarProvider>
    </div>
  );
}
