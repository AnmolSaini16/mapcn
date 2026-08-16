import Link from "next/link";
import { Children, Fragment, isValidElement } from "react";
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
import { DocsToc } from "./docs-toc";
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
    <div className="space-y-2">
      <h1 className="text-foreground text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function collectToc(children: React.ReactNode): TocItem[] {
  const items: TocItem[] = [];

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue;

    if (child.type === Fragment) {
      const { children: nested } = child.props as {
        children?: React.ReactNode;
      };
      items.push(...collectToc(nested));
      continue;
    }

    if (child.type === DocsSection) {
      const { title } = child.props as DocsSectionProps;
      if (title) items.push({ title, slug: slugify(title) });
    }
  }

  return items;
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
  toc,
}: DocsLayoutProps) {
  const tocItems = toc ?? collectToc(children);

  return (
    <div className="flex size-full">
      <div className="mx-auto flex max-w-[50rem] min-w-0 flex-1 flex-col pt-10 pb-20 lg:px-4">
        <DocsTitle title={title} description={description} />
        <div className="mt-12 mb-12 space-y-12">{children}</div>
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

      <aside className="hidden w-48 shrink-0 xl:block">
        <nav className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-y-auto pt-10 pb-10 [scrollbar-gutter:stable]">
          {tocItems.length > 0 && <DocsToc items={tocItems} />}
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
      <div className="[&_em]:text-muted-foreground space-y-4 text-base leading-7 [&_strong]:font-medium [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:pl-5 [&>ol>li]:leading-7 [&>p]:leading-7 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul>li]:leading-7">
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
    <div className="bg-surface text-foreground/80 [&_strong]:text-foreground rounded-lg px-5 py-4 text-[15px] leading-relaxed [&_strong]:font-medium">
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
        "bg-muted relative rounded-md px-1.5 py-0.5 font-mono text-sm",
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
  title?: string;
}

export function DocsPropTable({ props, title }: DocsPropTableProps) {
  return (
    <div className="prop-table space-y-3 [.prop-table+&]:mt-8">
      {title && <h3 className="text-foreground font-semibold">{title}</h3>}
      <div className="overflow-hidden">
        <Table className="[&_tbody_tr:last-child]:border-b [&_td:first-child]:pl-0 [&_td:last-child]:pr-0 [&_th:first-child]:pl-0 [&_th:last-child]:pr-0">
          <TableHeader>
            <TableRow>
              <TableHead className="h-10 text-xs font-medium">Prop</TableHead>
              <TableHead className="h-10 text-xs font-medium">Type</TableHead>
              <TableHead className="h-10 text-xs font-medium">
                Default
              </TableHead>
              <TableHead className="h-10 text-xs font-medium">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.map((prop) => (
              <TableRow key={prop.name}>
                <TableCell className="py-3 align-top">
                  <DocsCode className="text-[13px]">{prop.name}</DocsCode>
                </TableCell>
                <TableCell className="py-3 align-top whitespace-normal">
                  <DocsCode className="text-foreground/70 text-xs">
                    {prop.type}
                  </DocsCode>
                </TableCell>
                <TableCell className="py-3 align-top">
                  <DocsCode className="text-foreground/70 text-xs whitespace-normal">
                    {prop.default ?? "—"}
                  </DocsCode>
                </TableCell>
                <TableCell className="text-foreground/70 min-w-[180px] py-3 text-sm leading-relaxed whitespace-normal">
                  {prop.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
