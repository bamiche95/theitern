// Editor.tsx
"use client";

import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface EditorProps {
  readOnly?: boolean;
  defaultValue?: any;
  onTextChange?: (content: any) => void;
  onSelectionChange?: (...args: any[]) => void;
}

const Editor = forwardRef<Quill, EditorProps>(
  ({ readOnly = false, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useImperativeHandle(ref, () => quillRef.current!, []);

    useEffect(() => {
      if (!containerRef.current) return;

      containerRef.current.innerHTML = "";
      const editorDiv = document.createElement("div");
      containerRef.current.appendChild(editorDiv);

      const quill = new Quill(editorDiv, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            ["link", "image", "video", "formula"],
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
          ],
        },
      });

      quillRef.current = quill;

      if (defaultValue) {
        quill.setContents(defaultValue);
      }

      quill.on("text-change", () => {
        onTextChangeRef.current?.(quill.getContents());
      });

      quill.on("selection-change", (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        quillRef.current = null;
        if (containerRef.current) containerRef.current.innerHTML = "";
      };
    }, []);

    useEffect(() => {
      if (quillRef.current && defaultValue) {
        const currentContents = quillRef.current.getContents();
        if (quillRef.current.getLength() <= 1) {
          quillRef.current.setContents(defaultValue);
        }
      }
    }, [defaultValue]);

    useEffect(() => {
      quillRef.current?.enable(!readOnly);
    }, [readOnly]);

    return (
      <div
        ref={containerRef}
        className="editor-container border border-slate-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-6"
      />
    );
  }
);

Editor.displayName = "Editor";
export default Editor;

// Add this to your globals.css or a CSS file
