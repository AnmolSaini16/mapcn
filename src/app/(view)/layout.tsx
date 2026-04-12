import { CopyPageAsMarkdownButton } from "@/components/copy-page-markdown-button";
import { PAGE_MARKDOWN_ROOT_ID } from "@/lib/page-markdown-ids";

export default function ViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <CopyPageAsMarkdownButton className="absolute top-4 right-4 z-50 max-w-[calc(100%-1rem)]" />
      <div
        id={PAGE_MARKDOWN_ROOT_ID}
        className="min-h-screen pr-14 pt-2 sm:pr-40"
      >
        {children}
      </div>
    </div>
  );
}
