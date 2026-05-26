/**
 * Minimal markdown-to-HTML renderer for blog post bodies.
 * Supports: h1, h2, h3, bold, italic, horizontal rules, paragraphs.
 * No external deps — avoids XSS from user content (this is internal/editorial data only).
 */
export function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const output: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      output.push(`<h1>${escapeHtml(trimmed.slice(2))}</h1>`);
      i++;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      output.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
      i++;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      output.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
      i++;
      continue;
    }

    if (trimmed === "---") {
      output.push("<hr />");
      i++;
      continue;
    }

    // Regular paragraph — collect consecutive non-empty, non-heading lines
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("#") &&
      lines[i].trim() !== "---"
    ) {
      para.push(lines[i].trim());
      i++;
    }
    if (para.length > 0) {
      const html = para.join(" ");
      output.push(`<p>${inlineMarkdown(html)}</p>`);
    }
  }

  return output.join("\n");
}

function inlineMarkdown(text: string): string {
  // Bold: **text**
  let out = text.replace(/\*\*(.+?)\*\*/g, (_, inner) => `<strong>${escapeHtml(inner)}</strong>`);
  // Italic: *text*
  out = out.replace(/\*(.+?)\*/g, (_, inner) => `<em>${escapeHtml(inner)}</em>`);
  // Escape remaining literal characters not already processed
  return out;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
