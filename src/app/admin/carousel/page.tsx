"use client";

import { useEffect, useState } from "react";
import { Trash2, Eye, EyeOff, Plus, Upload } from "lucide-react";

interface CarouselImage {
  id: number;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_active: number;
}

export default function AdminCarouselPage() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
const [editingId, setEditingId] = useState<number | null>(null);
const [editLink, setEditLink] = useState("");
const [editFile, setEditFile] = useState<File | null>(null);


  const fetchImages = async () => {
    const res = await fetch("/api/carousel");
    const data = await res.json();
    setImages(data.images);
  };

  const startEdit = (img: CarouselImage) => {
  setEditingId(img.id);
  setEditLink(img.link_url || "");
  setEditFile(null);
};

const saveEdit = async (img: CarouselImage) => {
  let imageUrl = img.image_url;

  // Upload new image only if selected
  if (editFile) {
    const formData = new FormData();
    formData.append("file", editFile);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      alert("Image upload failed");
      return;
    }

    const { url } = await uploadRes.json();
    imageUrl = url;
  }

  await fetch(`/api/carousel/${img.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: imageUrl,
      link_url: editLink || null,
      sort_order: img.sort_order,
      is_active: img.is_active,
    }),
  });

  setEditingId(null);
  setEditFile(null);
  setEditLink("");
  fetchImages();
};

const cancelEdit = () => {
  setEditingId(null);
  setEditFile(null);
  setEditLink("");
};


  useEffect(() => {
    fetchImages();
  }, []);

  // ⬆ Upload file + save carousel item
  const addImage = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Upload image
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const { url } = await uploadRes.json();

      // 2️⃣ Save carousel record
      await fetch("/api/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: url, // ✅ /uploads/filename
          link_url: linkUrl || null,
          sort_order: order,
        }),
      });

      // Reset
      setFile(null);
      setLinkUrl("");
      setOrder(0);
      fetchImages();
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // 👁 Toggle visibility
  const toggleActive = async (img: CarouselImage) => {
    await fetch(`/api/carousel/${img.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: img.image_url,
        link_url: img.link_url,
        sort_order: img.sort_order,
        is_active: img.is_active ? 0 : 1,
      }),
    });

    fetchImages();
  };

  // 🗑 Delete
  const deleteImage = async (id: number) => {
    if (!confirm("Delete this image?")) return;

    await fetch(`/api/carousel/${id}`, { method: "DELETE" });
    fetchImages();
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Carousel Manager</h1>
<p className="text-sm text-red-400">Ensure image sizes are consistent (e.g., 500x500px) for optimal display.</p>
      {/* Add Form */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
        <h2 className="font-semibold mb-4">Add Carousel Image</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            type="url"
            placeholder="Optional hyperlink"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <input
            type="number"
            placeholder="Order"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 w-full"
          />

          <button
            onClick={addImage}
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-60"
          >
            <Upload className="w-4 h-4" />
            {loading ? "Uploading..." : "Add"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold">Preview</th>
              <th className="p-4 text-sm font-semibold">Link</th>
              <th className="p-4 text-sm font-semibold">Order</th>
              <th className="p-4 text-sm font-semibold">Status</th>
              <th className="p-4 text-sm font-semibold text-right">Actions</th>
            </tr>
          </thead>
         <tbody>
  {images.map((img) => (
    <tr key={img.id} className="border-b last:border-0">
      {/* Preview / Upload */}
      <td className="p-4">
        {editingId === img.id ? (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
        ) : (
          <img
            src={img.image_url}
            className="h-16 w-28 object-cover rounded-lg border"
          />
        )}
      </td>

      {/* Link */}
      <td className="p-4 text-sm">
        {editingId === img.id ? (
          <input
            type="url"
            value={editLink}
            onChange={(e) => setEditLink(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Optional hyperlink"
          />
        ) : (
          <span className="text-blue-600">
            {img.link_url || "—"}
          </span>
        )}
      </td>

      <td className="p-4">{img.sort_order}</td>

      <td className="p-4">
        {img.is_active ? (
          <span className="text-green-600 font-semibold">Active</span>
        ) : (
          <span className="text-slate-400">Hidden</span>
        )}
      </td>

      {/* Actions */}
      <td className="p-4 text-right space-x-2">
        {editingId === img.id ? (
          <>
            <button
              onClick={() => saveEdit(img)}
              className="px-3 py-2 rounded-lg border text-green-600 hover:bg-green-50"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="px-3 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => startEdit(img)}
              className="p-2 border rounded-lg hover:bg-blue-50 text-blue-600"
            >
              Edit
            </button>

            <button
              onClick={() => toggleActive(img)}
              className="p-2 border rounded-lg hover:bg-slate-100"
            >
              {img.is_active ? (
                <EyeOff className="w-4 h-4 text-amber-600" />
              ) : (
                <Eye className="w-4 h-4 text-green-600" />
              )}
            </button>

            <button
              onClick={() => deleteImage(img.id)}
              className="p-2 border rounded-lg hover:bg-red-50 text-red-600"
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
