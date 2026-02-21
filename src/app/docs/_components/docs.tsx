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
    <div className="space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-base text-muted-foreground leading-relaxed">
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
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 max-w-3xl mx-auto pt-10 pb-20">
        <DocsTitle title={title} description={description} />

        <div className="mt-12 space-y-12">{children}</div>

        {(prev || next) && (
          <div className="flex items-center justify-between gap-4 mt-16">
            {prev ? (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-auto py-2 -ml-2"
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
                className="h-auto py-2 -mr-2"
              >
                <Link href={next.href}>
                  {next.title} <ChevronRight />
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <aside className="hidden xl:block w-44 shrink-0">
        <nav className="sticky top-24">
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
    <section className="space-y-5 scroll-mt-24" id={id}>
      {title && (
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      )}
      <div className="text-base text-foreground/80 leading-7 space-y-4 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_li]:leading-7 [&_strong]:text-foreground [&_strong]:font-medium [&_em]:text-muted-foreground">
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
    <div className="rounded-lg border bg-muted/30 px-5 py-4 text-[14px] leading-relaxed text-foreground/70 [&_strong]:text-foreground [&_strong]:font-medium">
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
      className="font-medium text-foreground underline underline-offset-4 transition-colors"
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
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
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
    <div className="rounded-lg border overflow-hidden my-6">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/30">
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
                <DocsCode className="text-xs text-muted-foreground">
                  {prop.type}
                </DocsCode>
              </TableCell>
              <TableCell className="px-4 py-3 align-top">
                <DocsCode className="text-xs text-muted-foreground whitespace-normal">
                  {prop.default ?? "—"}
                </DocsCode>
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-foreground/70 whitespace-normal min-w-[180px] leading-relaxed">
                {prop.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
