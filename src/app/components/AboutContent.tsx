"use client";

import dynamic from 'next/dynamic';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
// We move the dynamic import here, inside a Client Component


export default function AboutContent({ value }: { value: any }) {
  // Convert Delta to static HTML (No Quill instance needed)
  const deltaOps = value?.ops || [];
  const converter = new QuillDeltaToHtmlConverter(deltaOps, {});
  const html = converter.convert();

  return (
    <div 
     
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}