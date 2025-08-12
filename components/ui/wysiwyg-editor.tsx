// components/WysiwygEditor.tsx
"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface WysiwygEditorProps {
  content: string;
  setContent: (html: string) => void;
  placeholder?: string;
}

const WysiwygEditor = ({
  content,
  setContent,
  placeholder,
}: WysiwygEditorProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Only render editor after client-side hydration
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] w-full bg-transparent px-3 py-1 text-base outline-none placeholder:text-muted-foreground focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  if (!isClient || !editor) return null;

  return (
    <div
      className={`
        flex flex-col gap-1 rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]
        focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]
        dark:bg-input/30
      `}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-input text-sm">
        <WysiwygButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </WysiwygButton>
        <WysiwygButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </WysiwygButton>
        <WysiwygButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </WysiwygButton>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="w-full" />
    </div>
  );
};

const WysiwygButton = ({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2 py-1 rounded-md transition text-sm hover:bg-accent hover:text-accent-foreground ${
      isActive ? "bg-green-600 text-white" : ""
    }`}
  >
    {children}
  </button>
);

export default WysiwygEditor;
