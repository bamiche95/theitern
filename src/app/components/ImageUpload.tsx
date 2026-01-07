"use client";
import { useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Convert to Base64 for the API
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await fetch("/api/upload/logo", {
        method: "POST",
        body: JSON.stringify({
          file: reader.result,
          fileName: `${Date.now()}-${file.name}`,
        }),
      });
      const data = await res.json();
      if (data.url) onChange(data.url);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="flex items-start gap-4">
        {/* Preview Area */}
        <div className="relative w-32 h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden">
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-contain" />
              <button 
                onClick={() => onChange("")}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-300" />
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
            <Upload className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Choose File</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
          <p className="text-xs text-slate-400 mt-2">Recommended: PNG or SVG with transparent background.</p>
        </div>
      </div>
    </div>
  );
}