import Link from "next/link";

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-foreground decoration-foreground/25 hover:decoration-foreground/60 underline underline-offset-4 transition-colors"
    >
      {children}
    </Link>
  );
}
