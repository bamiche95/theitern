'use client';
import { useState, useEffect } from "react";
import { Check, X, Pencil, Loader2, Upload } from "lucide-react"; // Added Upload
import { useRouter } from "next/navigation";

interface Props {
  course: any;
  categories: { id: number; name: string }[];
}
export default function EditableCourseHeader({ course, categories }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // New: for image upload
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: course.title,
    slug: course.slug,
    short_description: course.short_description || "",
    category_id: course.category_id ? String(course.category_id) : "",
   
    thumbnail: course.thumbnail || "" // New: thumbnail state
  });

  useEffect(() => {
    setFormData({
      title: course.title,
      slug: course.slug,
      short_description: course.short_description || "",
      category_id: course.category_id ? String(course.category_id) : "",
    
      thumbnail: course.thumbnail || ""
    });
  }, [course]);

  // NEW: Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData(prev => ({ ...prev, thumbnail: data.url }));
      } else {
        setError("Upload failed");
      }
    } catch (err) {
      setError("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category_id: formData.category_id === "" ? null : Number(formData.category_id)
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="group relative bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-blue-200 transition-all flex gap-6">
        {/* New: Display current thumbnail in View Mode */}
        <div className="w-32 h-32 rounded-xl overflow-hidden border bg-slate-200 flex-shrink-0">
           {formData.thumbnail ? (
             <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Preview" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs text-center p-2">No Image</div>
           )}
        </div>

        <div className="flex-1">
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 bg-white shadow-sm border rounded-full text-blue-600 hover:scale-110 transition-all"
            >
              <Pencil className="w-4 h-4" />
            </button>
            
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{formData.title}</h1>
            <div className="grid grid-cols-2 gap-y-2">
                <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-semibold w-24">Course:</span>
                    <span className="text-sm text-slate-700 font-medium">
                        {categories.find(c => String(c.id) === String(formData.category_id))?.name || "Uncategorized"}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                   
                </div>
            </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in duration-200">
      <div className="space-y-4">

        {/* NEW: Thumbnail Edit Section */}
        <div className="flex items-center gap-6 pb-4 border-b">
          <div className="relative w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden flex-shrink-0 bg-slate-50">
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : formData.thumbnail ? (
              <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Course" />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400"><Upload className="w-6 h-6" /></div>
            )}
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Module Image</label>
            <input 
              type="file" 
              id="edit-thumb-upload" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
            <label 
              htmlFor="edit-thumb-upload" 
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold cursor-pointer transition-colors inline-block"
            >
              Change Image
            </label>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Module Title</label>
          <input 
            className="w-full text-2xl font-bold border-b-2 border-slate-100 focus:border-blue-500 outline-none pb-1"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400">URL Slug</label>
            <input 
              className="w-full p-2 bg-slate-50 border rounded-lg text-sm font-mono"
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-400">Course</label>
            <select 
              className="w-full p-2 bg-slate-50 border rounded-lg text-sm"
              value={formData.category_id}
              onChange={e => setFormData({...formData, category_id: e.target.value})}
            >
              <option value="">Uncategorized</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Short Description</label>
          <textarea 
            rows={3}
            className="w-full p-3 bg-slate-50 border rounded-lg text-sm resize-none"
            value={formData.short_description}
            onChange={e => setFormData({...formData, short_description: e.target.value})}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
<div className="grid grid-cols-2 gap-4">
     
    
      </div>
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button"
            onClick={() => {
              setIsEditing(false);
              setError(null);
            }}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button 
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}