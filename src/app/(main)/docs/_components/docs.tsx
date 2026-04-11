import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DOCS_PAGE_MARKDOWN_ROOT_ID } from "@/lib/docs-markdown-ids";
import { DocsToc } from "./docs-toc";
import { CopyPageAsMarkdownButton } from "./copy-page-markdown-button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface TocItem {
  title: string;
  slug: string;
}

// DocsHeader - Page title and description
interface DocsTitleProps {
  title: string;
  description: string;
}

function DocsTitle({ title, description }: DocsTitleProps) {
  return (
    <div className="space-y-3">
      <h1 className="text-foreground text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// DocsLayout - Full page wrapper with nav
interface DocsLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
  toc?: TocItem[];
}

export function DocsLayout({
  title,
  description,
  children,
  prev,
  next,
  toc = [],
}: DocsLayoutProps) {
  return (
    <div className="flex size-full">
      <div className="relative mx-auto flex max-w-[52rem] min-w-0 flex-1 flex-col pt-10 pb-20 lg:px-4">
        <CopyPageAsMarkdownButton className="absolute top-10 right-0 z-10 lg:right-4" />
        <div
          id={DOCS_PAGE_MARKDOWN_ROOT_ID}
          className="min-w-0 pr-[7.5rem] sm:pr-36"
        >
          <DocsTitle title={title} description={description} />
          <div className="mt-12 mb-12 space-y-12">{children}</div>
        </div>
        {(prev || next) && (
          <div className="mt-auto flex items-center justify-between gap-4">
            {prev ? (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="-ml-2 h-auto py-2"
              >
                <Link href={prev.href}>
                  <ChevronLeft /> {prev.title}
                </Link>
              </Button>
            ) : (
              <div />
            )}
            {next && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="-mr-2 h-auto py-2"
              >
                <Link href={next.href}>
                  {next.title} <ChevronRight />
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <aside className="hidden w-42 shrink-0 xl:block">
        <nav className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto pr-1">
          {toc.length > 0 && <DocsToc items={toc} />}
        </nav>
      </aside>
    </div>
  );
}

// DocsSection - Content section with optional title
interface DocsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function DocsSection({ title, children }: DocsSectionProps) {
  const id = title ? slugify(title) : undefined;
  return (
    <section className="scroll-m-24 space-y-5" id={id}>
      {title && (
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          {title}
        </h2>
      )}
      <div className="text-primary [&_strong]:text-foreground [&_em]:text-muted-foreground space-y-4 text-base leading-7 [&_li]:leading-7 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:leading-7 [&_strong]:font-medium [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

// DocsNote - Highlighted note/callout
interface DocsNoteProps {
  children: React.ReactNode;
}

export function DocsNote({ children }: DocsNoteProps) {
  return (
    <div className="bg-muted/40 text-foreground/80 [&_strong]:text-foreground rounded-lg border px-5 py-4 text-[15px] leading-relaxed [&_strong]:font-medium">
      {children}
    </div>
  );
}

// DocsLink - Styled link
interface DocsLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export function DocsLink({ href, children, external }: DocsLinkProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-foreground font-medium underline underline-offset-4"
    >
      {children}
    </Link>
  );
}

// DocsCode - Inline code
export function DocsCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <code
      className={cn(
        "bg-muted relative rounded-md px-2 py-1 font-mono text-sm",
        className,
      )}
    >
      {children}
    </code>
  );
}

// DocsPropTable - API reference table for component props
interface DocsPropTableProps {
  props: {
    name: string;
    type: string;
    default?: string;
    description: string;
  }[];
}

export function DocsPropTable({ props }: DocsPropTableProps) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-transparent">
            <TableHead className="h-10 px-4 text-xs font-medium">
              Prop
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-medium">
              Type
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-medium">
              Default
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-medium">
              Description
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell className="px-4 py-3 align-top">
                <DocsCode className="text-[13px]">{prop.name}</DocsCode>
              </TableCell>
              <TableCell className="px-4 py-3 align-top whitespace-normal">
                <DocsCode className="text-muted-foreground text-xs">
                  {prop.type}
                </DocsCode>
              </TableCell>
              <TableCell className="px-4 py-3 align-top">
                <DocsCode className="text-muted-foreground text-xs whitespace-normal">
                  {prop.default ?? "—"}
                </DocsCode>
              </TableCell>
              <TableCell className="text-foreground/70 min-w-[180px] px-4 py-3 text-sm leading-relaxed whitespace-normal">
                {prop.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
