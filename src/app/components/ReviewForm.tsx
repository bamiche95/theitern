// src/app/components/ReviewForm.tsx
"use client";
import { useState } from "react";
import { Send, CheckCircle, Loader2, Star, X } from "lucide-react";

const styles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }

  .animate-slide-in-up {
    animation: slideInUp 0.6s ease-out;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slide-down {
    animation: slideDown 0.3s ease-out;
  }

  .form-input {
    transition: all 0.3s ease;
  }

  .form-input:focus {
    transform: translateY(-2px);
  }

  .modal-overlay {
    backdrop-filter: blur(4px);
  }
`;

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewForm({ isOpen, onClose }: ReviewFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [rating, setRating] = useState(5);
 const [formData, setFormData] = useState({
  full_name: "",
  position: "",
  content: ""
});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ ...formData, rating }),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ full_name: "", position: "", content: "" });
        setRating(5);
        setTimeout(() => {
          setStatus("idle");
          onClose();
        }, 2000);
      }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  const handleClose = () => {
    if (status !== "loading") {
      setStatus("idle");
      setFormData({ full_name: "", position: "", content: "" });
      setRating(5);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 modal-overlay z-40 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div 
          className="animate-slide-in-up bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
           
            className="absolute top-6 right-6 p-2 text-red-400 hover:text-slate-100 hover:bg-red-600 rounded-full transition-colors disabled:opacity-100 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {status === "success" ? (
            // Success State
            <div className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-500/20 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">Review Submitted!</h3>
              <p className="text-green-700">Thank you for sharing your experience! Your review will appear after moderator approval.</p>
            </div>
          ) : (
            // Form State
            <div className="p-8 md:p-10">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Share Your Experience</h2>
                <p className="text-slate-600">Help other learners by sharing your thoughts about this course</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Rating Section */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-all duration-200 hover:scale-125"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Full Name *</label>
                    <input 
                      placeholder="John Doe"
                      required
                      value={formData.full_name}
                      className="form-input w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-50 hover:bg-white"
                      onChange={e => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                         <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Position</label>
                    <input 
                      placeholder="e.g. Product Designer"
                      value={formData.position}
                      className="form-input w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-50 hover:bg-white"
                      onChange={e => setFormData({...formData, position: e.target.value})}
                    />
                  </div>
                </div>

      
                {/* Review Content */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Your Review *</label>
                  <textarea 
                    placeholder="Share your experience with this course. What did you learn? How has it helped you?"
                    required
                    rows={4}
                    value={formData.content}
                    className="form-input w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-slate-50 hover:bg-white"
                    onChange={e => setFormData({...formData, content: e.target.value})}
                  />
                </div>

                {/* Error Message */}
                {status === "error" && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                    Something went wrong. Please try again.
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Review
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-500 text-center">
                  * Required fields. Your review will be moderated before appearing on the site.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}