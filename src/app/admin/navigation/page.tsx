"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash2, Edit2, Save, Loader2, Link as LinkIcon } from "lucide-react";

interface NavItem {
  id: number;
  label: string;
  url: string;
  parent_id: number | null;
  display_order: number;
}

export default function NavigationManager() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<{ label: string; url: string }[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<{ label: string; url: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    url: "",
    parent_id: ""
  });

  useEffect(() => {
    fetchItems();
    fetch("/api/admin/link-suggestions")
      .then(res => res.json())
      .then(data => setSuggestions(data));
  }, []);

  async function fetchItems() {
    const res = await fetch("/api/admin/navigation");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  const openEditModal = (item: NavItem) => {
    setFormData({
      label: item.label,
      url: item.url,
      parent_id: item.parent_id ? item.parent_id.toString() : ""
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ label: "", url: "", parent_id: "" });
  };

  const handleUrlChange = (value: string) => {
    setFormData({ ...formData, url: value });
    if (value.length > 0) {
      const filtered = suggestions.filter(s =>
        s.label.toLowerCase().includes(value.toLowerCase()) ||
        s.url.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isEditing = editingId !== null;
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch("/api/navigation", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        ...formData,
        parent_id: formData.parent_id === "" ? null : Number(formData.parent_id),
        display_order: isEditing ? undefined : items.length
      }),
    });

    if (res.ok) {
      closeModal();
      fetchItems();
    }
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/navigation?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setItemToDelete(null);
      fetchItems();
    }
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = newItems.map((item, index) => ({
      ...item,
      display_order: index,
    }));
    setItems(updatedItems);
  };

  async function handleSaveOrder() {
    await fetch("/api/navigation/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    alert("Order saved!");
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
      <p className="text-slate-500">Loading menu...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Navigation Manager</h1>
          <p className="text-slate-500">Manage your site's menu structure</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Link
          </button>
          <button onClick={handleSaveOrder} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-all">
            <Save className="w-4 h-4" /> Save Order
          </button>
        </div>
      </div>

      {/* Drag and Drop List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="nav-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm group transition-all ${item.parent_id ? "ml-10 border-l-4 border-l-blue-400 bg-slate-50/50" : ""
                        }`}
                    >
                      <div {...provided.dragHandleProps} className="text-slate-400 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* START OF INTEGRATED DISPLAY LOGIC */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800">{item.label}</p>
                          {item.parent_id ? (
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase font-bold">Child</span>
                          ) : (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">Main Link</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" /> {item.url}
                        </p>
                      </div>
                      {/* END OF INTEGRATED DISPLAY LOGIC */}

                      <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setItemToDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{editingId ? "Edit Link" : "Add Navigation Link"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
                <input required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Courses" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">URL / Link</label>
                <input required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Start typing page name..." value={formData.url} onChange={e => handleUrlChange(e.target.value)} onFocus={() => formData.url && setShowSuggestions(true)} />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-[120] left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl">
{filteredSuggestions.map((s, index) => (
  <button
    key={index}
    type="button"
    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors flex flex-col border-b border-slate-50 last:border-0"
    onClick={() => {
      // 1. Clean up the label by removing "Category: " or "Course: "
      const cleanedLabel = s.label
        .replace(/^Category:\s*/, "")
        .replace(/^Course:\s*/, "");

      setFormData({
        ...formData,
        url: s.url,
        // 2. Only auto-fill the label if the user hasn't typed a custom one yet
        label: formData.label === "" ? cleanedLabel : formData.label,
      });
      
      setShowSuggestions(false);
    }}
  >
    <span className="font-medium text-slate-800">{s.label}</span>
    <span className="text-xs text-slate-400">{s.url}</span>
  </button>
))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Parent Item (Optional)</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.parent_id} onChange={e => setFormData({ ...formData, parent_id: e.target.value })}>
                  <option value="">None (Top Level)</option>
                  {items.filter(i => !i.parent_id && i.id !== editingId).map(parent => (
                    <option key={parent.id} value={parent.id}>{parent.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">{editingId ? "Save Changes" : "Create Item"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8" /></div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Delete this link?</h2>
            <p className="text-slate-500 mb-6 text-sm">Deleting a parent item will also remove all of its sub-menu items.</p>
            <div className="flex gap-3">
              <button onClick={() => setItemToDelete(null)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium">Cancel</button>
              <button onClick={() => handleDelete(itemToDelete)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium shadow-lg shadow-red-200">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}