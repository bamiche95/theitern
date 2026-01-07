'use client'

import { useState, useEffect, useRef } from 'react';
import { Upload, Edit2, Trash2, User } from 'lucide-react';
// Add this component outside your main TutorsPage component
function TutorAvatar({ src, name }: { src: string, name: string }) {
  const [error, setError] = useState(false);

  // If no src or a previous error occurred, show the initial
  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-blue-100">
        <span className="text-lg font-bold text-blue-600">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name} 
      className="w-full h-full object-cover"
      onError={() => setError(true)} // ✅ Safely update state instead of DOM
    />
  );
}
export default function TutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', bio: '', expertise: '', profile_image: ''
  });

  const BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;
  useEffect(() => { fetchTutors(); }, []);

  async function fetchTutors() {
    const res = await fetch('/api/tutors');
    const data = await res.json();
    setTutors(data);
    setLoading(false);
  }

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${BASE_URL}${imagePath}`;
  };

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.set("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.url) {
        setFormData({ ...formData, profile_image: result.url });
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...formData, id: editingId } : formData;

    const res = await fetch('/api/tutors', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setFormData({ name: '', email: '', bio: '', expertise: '', profile_image: '' });
      setEditingId(null);
      fetchTutors();
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this tutor?")) return;
    const res = await fetch(`/api/tutors?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchTutors();
  }

  const handleEdit = (tutor: any) => {
    setEditingId(tutor.id);
    setFormData({
      name: tutor.name,
      email: tutor.email,
      expertise: tutor.expertise || '',
      bio: tutor.bio || '',
      profile_image: tutor.profile_image || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600 text-lg">Loading tutors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Manage Tutors</h1>
          <p className="text-slate-600">Add, edit, or remove tutors from your platform</p>
        </div>

        {/* CREATE/EDIT FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {editingId ? 'Update Tutor Profile' : 'Add New Tutor'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Profile Image Upload */}
            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <div className="relative w-28 h-28 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                {formData.profile_image ? (
                  <img 
                    src={getImageUrl(formData.profile_image)} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400"><svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg></div>';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-100">
                    <User className="w-10 h-10 text-slate-400" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 mb-3">Tutor Profile Picture</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {formData.profile_image ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {formData.profile_image && (
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, profile_image: ''})} 
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900">Full Name *</label>
                <input 
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  placeholder="e.g. John Doe" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900">Email Address *</label>
                <input 
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-900">Expertise / Title</label>
                <input 
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  placeholder="e.g. Senior Software Engineer" 
                  value={formData.expertise} 
                  onChange={e => setFormData({...formData, expertise: e.target.value})} 
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-900">Bio</label>
                <textarea 
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" 
                  placeholder="Describe the tutor's background and qualifications..." 
                  rows={4} 
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})} 
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button 
                type="submit" 
                disabled={uploading} 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold transition-colors shadow-md"
              >
                {editingId ? 'Update Tutor' : 'Save Tutor'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { 
                    setEditingId(null); 
                    setFormData({name:'', email:'', bio:'', expertise:'', profile_image:''}) 
                  }} 
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TUTORS LIST */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Existing Tutors</h2>
          <div className="space-y-4">
            {tutors.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-500 text-lg">No tutors yet. Add one above to get started!</p>
              </div>
            ) : (
              tutors.map((tutor) => (
                <div 
                  key={tutor.id} 
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  {/* Tutor Avatar */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border-2 border-slate-200 shadow-sm">
              <TutorAvatar src={tutor.profile_image} name={tutor.name} />
                  </div>

                  {/* Tutor Info */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{tutor.name}</h3>
                      {tutor.expertise && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
                          {tutor.expertise}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-600 font-medium mb-2">{tutor.email}</p>
                    {tutor.bio && (
                      <p className="text-sm text-slate-600 line-clamp-2">{tutor.bio}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => handleEdit(tutor)} 
                      className="flex-1 md:w-24 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(tutor.id)} 
                      className="flex-1 md:w-24 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}