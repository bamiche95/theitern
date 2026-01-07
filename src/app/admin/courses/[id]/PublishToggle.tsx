"use client";

import { useState } from "react";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PublishToggle({ 
  courseId, 
  initialStatus 
}: { 
  courseId: number; 
  initialStatus: boolean 
}) {
  const [isPublished, setIsPublished] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !isPublished }),
      });

      if (res.ok) {
        setIsPublished(!isPublished);
        router.refresh(); // Refresh server data
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isPublished 
          ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200" 
          : "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
      } disabled:opacity-70`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isPublished ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <Circle className="w-4 h-4" />
      )}
      {isPublished ? "Published" : "Draft"}
    </button>
  );
}