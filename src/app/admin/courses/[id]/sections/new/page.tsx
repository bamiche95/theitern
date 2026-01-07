"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function NewSectionPage({ params }: Props) {
  const router = useRouter();
  const courseId = params.id;

  const [type, setType] = useState("hero");
  const [content, setContent] = useState("{}"); // JSON as string
  const [sectionOrder, setSectionOrder] = useState(1);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch {
      setError("Content must be valid JSON");
      return;
    }

    const res = await fetch(`/api/admin/courses/${courseId}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        section_order: sectionOrder,
        content: parsedContent,
      }),
    });

    const data = await res.json();

    if (data.success) {
      router.push(`/admin/courses/${courseId}`);
    } else {
      setError(data.message);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <h1>New Section</h1>
      <form onSubmit={handleSubmit}>
        <label>Type:</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="hero">Hero</option>
          <option value="introduction">Introduction</option>
          <option value="detailed_description">Detailed Description</option>
          <option value="who_is_course_for">Who is this course for?</option>
          <option value="virtual_learning_info">Virtual Learning Info</option>
          <option value="timeline">Timeline</option>
        </select>
        <br />

        <label>Order:</label>
        <input
          type="number"
          value={sectionOrder}
          onChange={e => setSectionOrder(parseInt(e.target.value))}
          min={1}
        />
        <br />

        <label>Content (JSON):</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={10}
          style={{ width: "100%" }}
        />
        <br />

        <button type="submit">Add Section</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
