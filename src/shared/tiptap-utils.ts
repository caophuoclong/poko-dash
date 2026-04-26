import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Markdown } from "@tiptap/markdown";
import { Editor } from "@tiptap/core";

const tiptapExtensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3],
    },
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Link.configure({
    openOnClick: false,
  }),
  Underline,
  Markdown.configure({
    markedOptions: {
      gfm: true,
    },
  }),
];

const createTempEditor = () => {
  return new Editor({
    extensions: tiptapExtensions,
  });
};

export function htmlToMarkdown(html: string): string {
  if (!html || html.trim() === "") {
    return "";
  }
  
  const editor = createTempEditor();
  editor.commands.setContent(html);
  const markdown = editor.getMarkdown();
  editor.destroy();
  
  return markdown;
}

export function markdownToHtml(markdown: string): string {
  if (!markdown || markdown.trim() === "") {
    return "";
  }
  
  const editor = createTempEditor();
  editor.commands.setContent(markdown, { contentType: "markdown" });
  const html = editor.getHTML();
  editor.destroy();
  
  return html;
}

export function jsonToHtml(json: string | object): string {
  try {
    const jsonContent = typeof json === "string" ? JSON.parse(json) : json;
    return generateHTML(jsonContent, tiptapExtensions);
  } catch (error) {
    console.error("Error converting JSON to HTML:", error);
    return "";
  }
}

export function jsonToMarkdown(json: string | object): string {
  const editor = createTempEditor();
  try {
    const jsonContent = typeof json === "string" ? JSON.parse(json) : json;
    editor.commands.setContent(jsonContent);
    const markdown = editor.getMarkdown();
    return markdown;
  } catch (error) {
    console.error("Error converting JSON to Markdown:", error);
    return "";
  } finally {
    editor.destroy();
  }
}

export function markdownToJson(markdown: string): object {
  const editor = createTempEditor();
  try {
    editor.commands.setContent(markdown, { contentType: "markdown" });
    return editor.getJSON();
  } catch (error) {
    console.error("Error converting Markdown to JSON:", error);
    return {
      type: "doc",
      content: [],
    };
  } finally {
    editor.destroy();
  }
}

export function isMarkdown(content: string): boolean {
  if (!content || content.trim() === "") return false;
  
  try {
    JSON.parse(content);
    return false;
  } catch {
    const markdownPatterns = [
      /^#{1,6}\s+/m,
      /\*\*.*\*\*/,
      /\*.*\*/,
      /\[.*\]\(.*\)/,
      /^[-*+]\s+/m,
      /^\d+\.\s+/m,
      /^>\s+/m,
      /```/,
    ];
    
    return markdownPatterns.some((pattern) => pattern.test(content));
  }
}

export function isJson(content: string): boolean {
  if (!content || content.trim() === "") return false;
  
  try {
    const parsed = JSON.parse(content);
    return typeof parsed === "object" && parsed.type === "doc";
  } catch {
    return false;
  }
}

export function detectContentType(
  content: string
): "markdown" | "json" | "html" | "unknown" {
  if (!content || content.trim() === "") return "unknown";
  
  if (isJson(content)) return "json";
  if (content.trim().startsWith("<")) return "html";
  if (isMarkdown(content)) return "markdown";
  
  return "unknown";
}
