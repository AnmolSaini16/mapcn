import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// DocsHeader - Page title and description
interface DocsHeaderProps {
  title: string;
  description: string;
}

export function DocsHeader({ title, description }: DocsHeaderProps) {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground leading-relaxed">
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
}

export function DocsLayout({
  title,
  description,
  children,
  prev,
  next,
}: DocsLayoutProps) {
  return (
    <div>
      <DocsHeader title={title} description={description} />

      <div className="mt-10 space-y-10">{children}</div>

      {(prev || next) && (
        <div className="flex items-center justify-between gap-4 mt-14 pt-8 border-t">
          {prev ? (
            <Link
              href={prev.href}
              className="group flex flex-col items-start gap-1.5"
            >
              <span className="text-xs text-muted-foreground">Previous</span>
              <span className="text-sm font-medium group-hover:underline underline-offset-4">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              href={next.href}
              className="group flex flex-col items-end gap-1.5"
            >
              <span className="text-xs text-muted-foreground">Next</span>
              <span className="text-sm font-medium group-hover:underline underline-offset-4">
                {next.title}
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// DocsSection - Content section with optional title
interface DocsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function DocsSection({ title, children }: DocsSectionProps) {
  return (
    <section className="space-y-5">
      {title && (
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          {title}
        </h2>
      )}
      <div className="text-muted-foreground leading-7 space-y-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2">
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
    <div className="rounded-lg border bg-muted/40 px-5 py-4 leading-relaxed text-sm text-muted-foreground [&>strong]:text-foreground [&>strong]:font-medium">
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
      className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
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
    <div className="rounded-lg border overflow-hidden my-4">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 font-medium">Prop</TableHead>
            <TableHead className="h-11 px-4 font-medium">Type</TableHead>
            <TableHead className="h-11 px-4 font-medium">Default</TableHead>
            <TableHead className="h-11 px-4 font-medium">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell className="px-4 py-3.5 font-mono text-primary align-top">
                <DocsCode className="text-[13px]">{prop.name}</DocsCode>
              </TableCell>
              <TableCell className="px-4 py-3.5 font-mono text-muted-foreground align-top overflow-hidden whitespace-normal">
                <DocsCode className="text-xs">{prop.type}</DocsCode>
              </TableCell>
              <TableCell className="px-4 py-3.5 font-mono text-muted-foreground align-top whitespace-normal">
                <DocsCode className="text-xs">{prop.default ?? "—"}</DocsCode>
              </TableCell>
              <TableCell className="px-4 py-3.5 text-sm text-muted-foreground whitespace-normal min-w-[180px] leading-relaxed">
                {prop.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
