"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle, Tag, Upload, Loader2, X } from "lucide-react";

export default function NewCoursePage() {
  const router = useRouter();
  
  // Existing State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugModified, setSlugModified] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [loading, setLoading] = useState(false);
const [price, setPrice] = useState(""); 
  const [paymentLink, setPaymentLink] = useState(""); 
  
  // --- NEW STATE FOR CATEGORIES ---
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [categoryId, setCategoryId] = useState("");


  const [uploading, setUploading] = useState(false);

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Optional: Basic client-side validation
  if (file.size > 5 * 1024 * 1024) {
    setError("File is too large (Max 5MB)");
    return;
  }

  setUploading(true);
  setError(""); // Clear previous errors
  
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    
    const data = await res.json();
    
    if (res.ok && data.url) {
      setThumbnail(data.url);
    } else {
      setError(data.error || "Upload failed");
    }
  } catch (err) {
    setError("An error occurred during upload");
  } finally {
    setUploading(false);
  }
};


  // Fetch categories on mount
  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error("Failed to load categories");
      }
    }
    fetchCats();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slugModified) {
      const generatedSlug = newTitle.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      setSlug(generatedSlug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugModified(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          short_description: shortDescription,
          thumbnail,
          published,
          category_id: categoryId || null, // --- SENDING CATEGORY ID ---
        
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/admin/courses/${data.course.id}`);
      } else {
        setError(data.message || "Failed to create course");
      }
    } catch (err) {
      setError("An error occurred while creating the course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Modules
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Create New Module</h1>
            <p className="text-slate-600">Fill in the details to create a new Module</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Slug (Omitted for brevity, keep your existing inputs here) */}
  {/* Course Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Module Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Linux"
                value={title}
                onChange={handleTitleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-sm text-slate-500 mt-1">Give your module a descriptive title</p>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Slug *
              </label>
              <input
                type="text"
                placeholder="course-slug"
                value={slug}
                onChange={handleSlugChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
              />
              <p className="text-sm text-slate-500 mt-1">
                {slugModified 
                  ? "You can manually edit this" 
                  : "Auto-generated from title. Click to edit."}
              </p>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Short Description
              </label>
              <textarea
                placeholder="Brief overview of the module content"
                value={shortDescription}
                onChange={e => setShortDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
              <p className="text-sm text-slate-500 mt-1">Maximum 200 characters recommended</p>
            </div>

            {/* Thumbnail URL */}
   <div className="space-y-3">
  <label className="block text-sm font-semibold text-slate-900">
    Module Thumbnail
  </label>

  {!thumbnail ? (
    <div className="relative group">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="thumb-upload"
        disabled={uploading}
      />
      <label
        htmlFor="thumb-upload"
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all
          ${uploading ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-300 hover:border-blue-400 hover:bg-blue-50/30'}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-slate-500 font-medium">Processing image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Click to upload thumbnail</p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG or WebP (Max 5MB)</p>
          </div>
        )}
      </label>
    </div>
  ) : (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-md aspect-video bg-slate-100 group">
      <img 
        src={thumbnail} 
        alt="Thumbnail preview" 
        className="w-full h-full object-cover" 
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button 
          type="button"
          onClick={() => setThumbnail("")}
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
          title="Remove image"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  )}
</div>

{/* --- NEW PRICE & PAYMENT LINK FIELDS --- */}

            {/* Published Toggle */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={e => setPublished(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    published ? "bg-green-500" : "bg-slate-300"
                  }`} />
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    published ? "translate-x-6" : ""
                  }`} />
                </div>
                <span className="font-semibold text-slate-900">
                  {published ? "Published" : "Draft"}
                </span>
              </label>
              {published ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : null}
            </div>

            {/* --- NEW CATEGORY SELECT FIELD --- */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                Select a Course for this Module *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select a Course</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

         
            
            <div className="flex gap-4 pt-6 border-t border-slate-200">
               <button type="button" onClick={() => router.back()} className="px-6 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold flex items-center gap-2">
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? "Creating..." : "Create Module"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}