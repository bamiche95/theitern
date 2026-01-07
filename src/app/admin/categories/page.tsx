"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag, AlertCircle, PlusCircle, Layers, Loader2, Check, Trash2, Pencil, Upload } from "lucide-react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/app/components/Editor"), { ssr: false });

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [name, setName] = useState("");
  const [enrollmentFee, setEnrollmentFee] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [content, setContent] = useState<any>(null);
  const contentRef = useRef(content);
  const [editorKey, setEditorKey] = useState(0);

const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Categories list
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string; payment_link?: string | null; enrollment_fee?: number | null; content?: any }[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

const uploadThumbnail = async (): Promise<string | null> => {
  if (!thumbnailFile) return null;

  const formData = new FormData();
  formData.append("file", thumbnailFile);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
  return data.url;
};


  // Fetch categories on load
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error("Failed to load categories");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Load category data into form
const handleEdit = (cat: any) => {
  setEditingId(cat.id);
  setName(cat.name);
  setEnrollmentFee(cat.enrollment_fee?.toString() || "");
  setPaymentLink(cat.payment_link || "");
  setContent(cat.content);
  setThumbnailPreview(cat.thumbnail || null); // show current image
  setEditorKey(prev => prev + 1);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  // Reset form to add new
  const handleNewCourse = () => {
    setEditingId(null);
    setName("");
    setEnrollmentFee("");
    setPaymentLink("");
    setContent(null);
    setEditorKey(prev => prev + 1);
    setError("");
  };

  // Submit handler for both create and update
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    let thumbnailUrl: string | null = null;

    if (thumbnailFile) {
      // Upload the file and get the URL
      thumbnailUrl = await uploadThumbnail();
    }

    const payload = {
      name: name.trim(),
      enrollment_fee: enrollmentFee.trim() === "" ? null : Number(enrollmentFee),
      payment_link: paymentLink.trim() === "" ? null : paymentLink.trim(),
      content: content ?? null,
      thumbnail: thumbnailUrl, // store the URL instead of base64
    };

    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/categories/${editingId}` : "/api/categories";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      handleNewCourse(); // reset form
      fetchCategories(); // refresh list
    } else {
      setError(data.message || "Failed to save category");
    }
  } catch (err) {
    console.error(err);
    setError("An error occurred during upload");
  } finally {
    setLoading(false);
  }
}



  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This may fail if courses are using this category.")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: FORM (Takes 2 cols on desktop) */}
        <div className="md:col-span-2">
          <Link 
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Link>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <PlusCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {editingId ? "Edit Course" : "Add Course"}
                </h1>
                <p className="text-sm text-slate-500">
                  {editingId ? "Update course details" : "Create a new course group"}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Solutions.."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
<div>
  <label className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors relative overflow-hidden">
    {!thumbnailPreview && (
      <>
        <Upload className="w-8 h-8 text-slate-400 mb-2" />
        <span className="text-sm font-medium text-slate-600">Click to upload or drag</span>
        <span className="text-xs text-slate-400">PNG, JPG, GIF up to 10MB</span>
      </>
    )}

    {thumbnailPreview && (
      <>
        <img
          src={thumbnailPreview}
          alt="Preview"
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering the file input
            setThumbnailFile(null);
            setThumbnailPreview(null);
          }}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full p-1 shadow-md"
        >
          ✕
        </button>
      </>
    )}

    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        setThumbnailFile(file);

        if (file) {
          const reader = new FileReader();
          reader.onload = () => setThumbnailPreview(reader.result as string);
          reader.readAsDataURL(file);
        } else {
          setThumbnailPreview(null);
        }
      }}
      className="hidden"
    />
  </label>
</div>


              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Course Description
                </label>
                <Editor
                  key={editorKey}
                  defaultValue={content}
                  onTextChange={(delta) => setContent(delta)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Enrollment Fee
                </label>
                <input
                  type="text"
                  placeholder="e.g. $199"
                  value={enrollmentFee}
                  onChange={(e) => setEnrollmentFee(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Payment Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://example.com/payment"
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || !name}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingId ? "Update Course" : "Create Course"}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={handleNewCourse}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-fit sticky top-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Layers className="w-5 h-5 text-slate-400" />
              Current Courses
            </div>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
              {categories.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {fetching ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
              </div>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                    editingId === cat.id 
                      ? "border-blue-300 bg-blue-50" 
                      : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Tag className={`w-4 h-4 flex-shrink-0 ${editingId === cat.id ? "text-blue-500" : "text-slate-400"}`} />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-slate-700 truncate">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase truncate">{cat.slug}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button 
                      onClick={() => handleEdit(cat)}
                      className={`p-2 rounded-lg transition-colors ${
                        editingId === cat.id
                          ? "bg-blue-100 text-blue-600"
                          : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 text-sm italic">No Courses created yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}