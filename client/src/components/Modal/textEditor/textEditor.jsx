/* eslint-disable react-hooks/exhaustive-deps */
import { FormControl, FormLabel } from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import "./textEditor.css";
import ToolBar from "./toolBar/toolBar";

const TextEditor = memo(({ setData, editContent }) => {
  const [content, setContent] = useState(editContent || "");

  useEffect(() => {
    setData((prevData) => ({ ...prevData, content: content }));
  }, [content]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            style: "line-height: 1.5rem",
          },
        },
        orderedList: {
          HTMLAttributes: {
            style: "padding-left: 20px; list-style-type: decimal;",
          },
        },
        bulletList: {
          HTMLAttributes: {
            style: "padding-left: 20px; list-style-type: decimal;",
          },
        },
      }),
      Underline,
      Highlight,
      // Add other extensions like Heading, TextAlign if needed
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <FormControl>
      <FormLabel>Nội dung</FormLabel>
      <div className="tiptap-wrapper">
        <ToolBar editor={editor} />
        <div
          className="content-wrapper"
          onClick={() => editor.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </FormControl>
  );
});
TextEditor.displayName = "TextEditor";
export default TextEditor;
