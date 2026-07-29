"use client";

import { Check, Copy } from "lucide-react-native";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeCopyButtonProps {
  text: string;
  onCopy?: () => void;
  className?: string;
}

export function CodeCopyButton({
  text,
  onCopy,
  className,
}: CodeCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    onCopy?.();
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn("text-muted-foreground bg-code", className)}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}
