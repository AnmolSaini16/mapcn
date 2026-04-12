/**
 * Converts a page DOM subtree to Markdown for copying to LLMs.
 * Tailored to site docs (sections, previews, Shiki code, tables) and general pages.
 */

function stripForMarkdownCopy(root: HTMLElement): HTMLElement {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[data-page-markdown-exclude]").forEach((el) => el.remove());
  clone.querySelectorAll("button").forEach((b) => b.remove());
  clone.querySelectorAll("[data-docs-copy-strip]").forEach((el) => el.remove());
  clone.querySelectorAll("[data-docs-live-preview]").forEach((el) => {
    el.replaceChildren(
      document.createTextNode("[Interactive map preview]"),
    );
  });
  return clone;
}

function inlineMarkdown(el: Element): string {
  let result = "";
  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      result += child.textContent ?? "";
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const e = child as Element;
      const tag = e.tagName.toLowerCase();
      if (tag === "code") {
        const t = e.textContent ?? "";
        result += t.includes("`") ? "`" + t.replace(/`/g, "'") + "`" : "`" + t + "`";
      } else if (tag === "a") {
        const label = (e.textContent ?? "").trim();
        const href = e.getAttribute("href") ?? "";
        result += `[${label}](${href})`;
      } else if (tag === "strong" || tag === "b") {
        result += `**${inlineMarkdown(e)}**`;
      } else if (tag === "em" || tag === "i") {
        result += `*${inlineMarkdown(e)}*`;
      } else if (tag === "br") {
        result += "\n";
      } else {
        result += inlineMarkdown(e);
      }
    }
  }
  return result.replace(/\s+/g, " ").trim();
}

function preToMarkdown(pre: HTMLPreElement): string {
  const codeEl = pre.querySelector("code");
  const raw = (codeEl ?? pre).innerText ?? "";
  let lang = "";
  const cls = codeEl?.getAttribute("class") ?? "";
  const m = cls.match(/language-(\w+)/);
  if (m) lang = m[1];
  return "```" + lang + "\n" + raw.replace(/\n$/, "") + "\n```";
}

function tableToMarkdown(table: HTMLTableElement): string {
  const rows = Array.from(table.querySelectorAll("tr"));
  if (rows.length === 0) return "";
  const lines: string[] = [];
  const firstCells = Array.from(rows[0].querySelectorAll("th, td")).map((c) =>
    (c.textContent ?? "").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim(),
  );
  lines.push("| " + firstCells.join(" | ") + " |");
  lines.push("| " + firstCells.map(() => "---").join(" | ") + " |");
  for (let r = 1; r < rows.length; r++) {
    const cells = Array.from(rows[r].querySelectorAll("th, td")).map((c) =>
      (c.textContent ?? "").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim(),
    );
    lines.push("| " + cells.join(" | ") + " |");
  }
  return lines.join("\n");
}

function blockMarkdown(el: Element): string {
  const tag = el.tagName.toLowerCase();

  if (tag === "pre") {
    return preToMarkdown(el as HTMLPreElement);
  }

  if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") {
    const level = Number(tag[1]);
    return `${"#".repeat(level)} ${inlineMarkdown(el)}`;
  }

  if (tag === "p") {
    return inlineMarkdown(el);
  }

  if (tag === "ul") {
    return Array.from(el.querySelectorAll(":scope > li"))
      .map((li) => "- " + blockMarkdown(li))
      .join("\n");
  }

  if (tag === "ol") {
    return Array.from(el.querySelectorAll(":scope > li"))
      .map((li, i) => `${i + 1}. ${blockMarkdown(li)}`)
      .join("\n");
  }

  if (tag === "li") {
    return Array.from(el.childNodes)
      .map((node) => nodeToMarkdown(node))
      .filter(Boolean)
      .join("\n\n");
  }

  if (tag === "table") {
    return tableToMarkdown(el as HTMLTableElement);
  }

  if (tag === "style" || tag === "script" || tag === "svg" || tag === "canvas") {
    return "";
  }

  return Array.from(el.childNodes)
    .map((node) => nodeToMarkdown(node))
    .filter(Boolean)
    .join("\n\n");
}

function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const t = (node.textContent ?? "").replace(/\s+/g, " ").trim();
    return t;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }
  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  if (tag === "pre") {
    return preToMarkdown(el as HTMLPreElement);
  }
  if (
    tag === "h1" ||
    tag === "h2" ||
    tag === "h3" ||
    tag === "h4" ||
    tag === "p" ||
    tag === "ul" ||
    tag === "ol" ||
    tag === "table"
  ) {
    return blockMarkdown(el);
  }
  if (tag === "section" || tag === "article" || tag === "main") {
    return blockMarkdown(el);
  }
  if (tag === "div") {
    return Array.from(el.childNodes)
      .map((n) => nodeToMarkdown(n))
      .filter(Boolean)
      .join("\n\n");
  }
  return blockMarkdown(el);
}

export function docsPageElementToMarkdown(source: HTMLElement): string {
  const clean = stripForMarkdownCopy(source);
  const text = Array.from(clean.childNodes)
    .map((n) => nodeToMarkdown(n))
    .filter(Boolean)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text + "\n";
}
