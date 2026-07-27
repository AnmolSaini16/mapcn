import { codeToHtml } from "shiki";

export async function highlightCode(
  code: string,
  lang = "tsx",
): Promise<string> {
  return codeToHtml(code, {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  });
}
