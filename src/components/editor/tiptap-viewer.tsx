import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Markdown } from "@tiptap/markdown";

interface TiptapViewerProps {
  content: string;
}

export default function TiptapViewer({ content }: TiptapViewerProps) {
  const editor = useEditor({
    extensions: [
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
        HTMLAttributes: {
          class: "text-accent-blue hover:underline cursor-pointer",
        },
      }),
      Underline,
      Markdown.configure({
        markedOptions: {
          gfm: true,
        },
      }),
    ],
    content,
    contentType: "markdown",
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none text-near-white [&>p]:mb-3 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-frost [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-text [&>a]:text-accent-blue [&>a]:hover:underline [&>ul>li]:my-1 [&>ol>li]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
