"use client";
import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.bubble.css"; // Use bubble theme for clean reading

export default function ReadOnlyEditor({ value }: { value: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && value) {
      containerRef.current.innerHTML = "";
      const quill = new Quill(containerRef.current, {
        theme: "bubble",
        readOnly: true,
        modules: { toolbar: false },
      });
      quill.setContents(value);
    }
  }, [value]);

  return <div ref={containerRef} className="quill-content-only" />;
}