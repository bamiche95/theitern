"use client";
import { useEffect, useState } from "react";
import { Check, Trash2, Clock, ShieldCheck } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data.reviews);
  };

  useEffect(() => { fetchReviews(); }, []);

  const toggleApproval = async (id: number, currentStatus: boolean) => {
    await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_approved: !currentStatus })
    });
    fetchReviews();
  };

  const deleteReview = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Review Moderation</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-sm">Student</th>
              <th className="p-4 font-semibold text-sm">Review</th>
              <th className="p-4 font-semibold text-sm">Status</th>
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
                <td className="p-4 max-w-md text-sm text-slate-600 italic">"{r.content}"</td>
                <td className="p-4">
                  {r.is_approved ? (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase">
                      <ShieldCheck className="w-4 h-4" /> Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-500 text-xs font-bold uppercase">
                      <Clock className="w-4 h-4" /> Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => toggleApproval(r.id, r.is_approved)}
                    className={`p-2 rounded-lg border transition-colors ${r.is_approved ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                  >
                    {r.is_approved ? "Hide" : "Approve"}
                  </button>
                  <button onClick={() => deleteReview(r.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}