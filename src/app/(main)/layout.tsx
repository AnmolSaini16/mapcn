import { Header } from "@/components/header";
import { CopyPageAsMarkdownButton } from "@/components/copy-page-markdown-button";
import { PAGE_MARKDOWN_ROOT_ID } from "@/lib/page-markdown-ids";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      <Header />
      <main className="relative flex flex-1 flex-col">
        <CopyPageAsMarkdownButton className="absolute top-4 right-4 z-40 max-w-[calc(100%-1rem)] sm:right-6" />
        <div
          id={PAGE_MARKDOWN_ROOT_ID}
          className="flex min-h-0 flex-1 flex-col pr-14 pt-2 sm:pr-40"
        >
          {children}
        </div>
      </main>
    </div>
  );
}
