import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DocsSidebar } from "./_components/docs-sidebar";
import { DocsHeader } from "./_components/docs-header";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DocsSidebar />
      <SidebarInset>
        <DocsHeader />
        <main className="container">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
