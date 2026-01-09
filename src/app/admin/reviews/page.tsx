"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit2 } from "lucide-react";
import ReviewFormWrapper from "@/app/components/ReviewFormWrapper";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");

  const fetchReviews = async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data.reviews);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  const startEditing = (id: number, content: string) => {
    setEditingId(id);
    setEditingContent(content);
  };

  const saveEdit = async (id: number) => {
    if (!editingContent.trim()) return alert("Content cannot be empty");

    await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ content: editingContent, is_approved: 1 }),
      headers: { "Content-Type": "application/json" },
    });

    setEditingId(null);
    setEditingContent("");
    fetchReviews();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6 justify-between">
        <h1 className="text-2xl font-bold mb-6">Review Management</h1>
        <span className="text-sm text-slate-500 mb-4 block">
          <ReviewFormWrapper />
        </span>
      </div>

      <div>
        <p className="text-sm text-red-500 mb-4">
          Please refresh to see the latest reviews after submissions or edits.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-sm">Student</th>
              <th className="p-4 font-semibold text-sm">Review</th>
              <th className="p-4 font-semibold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r: any) => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-medium text-slate-900">{r.full_name}</div>
                  <div className="text-xs text-slate-500">{r.email}</div>
                </td>

                <td className="p-4 max-w-md text-sm text-slate-600 italic">
                  {editingId === r.id ? (
                    <textarea
                      className="w-full p-2 border rounded-md resize-none"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      rows={3}
                    />
                  ) : (
                    `"${r.content}"`
                  )}
                </td>

                <td className="p-4 text-right space-x-2">
                  {editingId === r.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(r.id)}
                        className="p-2 text-green-600 rounded-lg border hover:bg-green-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-gray-600 rounded-lg border hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(r.id, r.content)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => deleteReview(r.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
