"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

export default function AdminFeatures() {
  const [features, setFeatures] = useState([]);
  const [editing, setEditing] = useState<any>(null);

  // Default icons for the admin to choose from
  const iconOptions = ["GraduationCap", "Zap", "Award", "Users", "ShieldCheck", "BarChart3", "BookOpen", "Globe", "credit-card", "headset"];
  const colorOptions = ["blue", "purple", "orange", "green", "slate", "indigo", "blueviolet"];

  useEffect(() => {
    fetch("/api/features").then(res => res.json()).then(setFeatures);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/features", {
      method: "POST",
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      window.location.reload();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this feature?")) return;
    await fetch("/api/admin/features", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    window.location.reload();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage "Why Choose Us"</h1>
        <button 
          onClick={() => setEditing({ title: "", description: "", icon_name: "Zap", gradient_key: "blue", display_order: 0 })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Feature
        </button>
      </div>

      {/* Editor Modal/Form */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing.id ? "Edit Feature" : "New Feature"}</h2>
            
            <div className="space-y-4">
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Title"
                value={editing.title} 
                onChange={e => setEditing({...editing, title: e.target.value})}
                required 
              />
              <textarea 
                className="w-full border p-2 rounded" 
                placeholder="Description"
                value={editing.description} 
                onChange={e => setEditing({...editing, description: e.target.value})}
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                   className="border p-2 rounded"
                   value={editing.icon_name}
                   onChange={e => setEditing({...editing, icon_name: e.target.value})}
                >
                  {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
                <select 
                   className="border p-2 rounded"
                   value={editing.gradient_key}
                   onChange={e => setEditing({...editing, gradient_key: e.target.value})}
                >
                  {colorOptions.map(color => <option key={color} value={color}>{color}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                <Save size={18} /> Save
              </button>
              <button type="button" onClick={() => setEditing(null)} className="flex-1 bg-slate-100 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="grid gap-4">
        {features.map((f: any) => (
          <div key={f.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
            <div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.icon_name} • {f.gradient_key}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(f)} className="p-2 hover:bg-slate-100 rounded-lg text-blue-600"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(f.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}