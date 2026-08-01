import { Check, Copy } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

import { CodeSurface } from "@/components/code-surface";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { copyText } from "@/lib/clipboard";
import { highlightCode } from "@/lib/highlight";
import { cn } from "@/lib/utils";

const CODE_LINE_HEIGHT = 20;

interface CodeBlockProps {
  code: string;
  language?: string;
  showCopyButton?: boolean;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "tsx",
  showCopyButton = true,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const codeLines = useMemo(
    () => code.split("\n").map(tokenizeTypeScriptLine),
    [code],
  );

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    let isCurrent = true;

    void highlightCode(code, language)
      .then((html) => {
        if (isCurrent) setHighlighted(html);
      })
      .catch(() => {
        if (isCurrent) setHighlighted(null);
      });

    return () => {
      isCurrent = false;
    };
  }, [code, language]);

  const copy = useCallback(async () => {
    try {
      await copyText(code);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  }, [code]);

  return (
    <View className="border-border bg-code w-full overflow-hidden rounded-xl border">
      <View className="bg-surface border-border h-11 flex-row items-center border-b px-3">
        <Text className="text-muted-foreground flex-1 font-mono text-xs font-medium uppercase tracking-wider">
          {language}
        </Text>
        {showCopyButton ? (
          <Button
            variant="ghost"
            size="icon"
            onPress={() => {
              void copy();
            }}
            accessibilityLabel={copied ? "Copied" : "Copy code"}
            className="text-muted-foreground size-8 rounded-md"
          >
            <Icon
              as={copied ? Check : Copy}
              size={15}
            />
          </Button>
        ) : null}
      </View>
      {Platform.OS === "web" && highlighted ? (
        <CodeSurface
          className="max-h-[30rem] overflow-auto"
          html={highlighted}
        />
      ) : (
        <View className="bg-code flex-row">
          {showLineNumbers ? (
            <View className="border-border bg-code z-10 border-r px-3 py-4">
              {codeLines.map((_, index) => (
                <View
                  key={index}
                  style={styles.line}
                >
                  <Text className="text-code-number font-mono text-xs tabular-nums">
                    {index + 1}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
          <ScrollView
            horizontal
            className="min-w-0 flex-1"
            contentContainerClassName="min-w-full px-4 py-4"
            showsHorizontalScrollIndicator={false}
          >
            <View>
              {codeLines.map((line, lineIndex) => (
                <View
                  key={lineIndex}
                  style={styles.line}
                >
                  <Text
                    selectable
                    className="text-foreground font-mono text-xs"
                  >
                    {line.map((token, tokenIndex) => (
                      <Text
                        key={tokenIndex}
                        className={cn(token.className, "text-xs")}
                      >
                        {token.value || " "}
                      </Text>
                    ))}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    height: CODE_LINE_HEIGHT,
    justifyContent: "center",
  },
});

const TYPESCRIPT_KEYWORDS = new Set([
  "abstract",
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "declare",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "finally",
  "for",
  "from",
  "function",
  "get",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "keyof",
  "let",
  "namespace",
  "new",
  "of",
  "private",
  "protected",
  "public",
  "readonly",
  "return",
  "satisfies",
  "set",
  "static",
  "super",
  "switch",
  "throw",
  "try",
  "type",
  "typeof",
  "var",
  "void",
  "while",
  "yield",
]);

const TYPESCRIPT_TYPES = new Set([
  "any",
  "bigint",
  "boolean",
  "never",
  "number",
  "object",
  "string",
  "symbol",
  "unknown",
]);

const TYPESCRIPT_LITERALS = new Set([
  "false",
  "Infinity",
  "NaN",
  "null",
  "true",
  "undefined",
]);

const TOKEN_PATTERN =
  /\/\/.*$|\/\*[\s\S]*?\*\/|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b/g;

interface CodeToken {
  value: string;
  className: string;
}

function tokenizeTypeScriptLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  TOKEN_PATTERN.lastIndex = 0;
  while ((match = TOKEN_PATTERN.exec(line))) {
    if (match.index > cursor) {
      tokens.push({
        value: line.slice(cursor, match.index),
        className: "text-foreground",
      });
    }

    const value = match[0];
    tokens.push({
      value,
      className: getTokenClassName(value, line.slice(TOKEN_PATTERN.lastIndex)),
    });
    cursor = TOKEN_PATTERN.lastIndex;
  }

  if (cursor < line.length || tokens.length === 0) {
    tokens.push({ value: line.slice(cursor), className: "text-foreground" });
  }

  return tokens;
}

function getTokenClassName(value: string, remainingLine: string): string {
  if (value.startsWith("//") || value.startsWith("/*")) {
    return "text-code-comment";
  }

  if (value.startsWith('"') || value.startsWith("'") || value.startsWith("`")) {
    return "text-code-string";
  }

  if (/^\d/.test(value) || TYPESCRIPT_LITERALS.has(value)) {
    return "text-code-literal";
  }

  if (TYPESCRIPT_KEYWORDS.has(value)) {
    return "text-code-keyword";
  }

  if (TYPESCRIPT_TYPES.has(value) || /^[A-Z]/.test(value)) {
    return "text-code-type";
  }

  if (/^\s*(?:<[^>]*>)?\s*\(/.test(remainingLine)) {
    return "text-code-function";
  }

  return "text-foreground";
}
