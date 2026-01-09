"use client";

import { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null); // <--- form ref

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      form.reset(); // <--- now safe
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
    }
  }
  return (
   <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="group">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Name
        </label>
        <input
          name="name"
          type="text"
          required
          placeholder="Your name"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-slate-400"
        />
      </div>

      {/* Email Field */}
      <div className="group">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="your@email.com"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-slate-400"
        />
      </div>

      {/* Subject Field */}
      <div className="group">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Subject
        </label>
        <input
          name="subject"
          type="text"
          placeholder="How can we help?"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-slate-400"
        />
      </div>

      {/* Message Field */}
      <div className="group">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Message
        </label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Tell us more about your inquiry..."
          className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none group-hover:border-slate-400"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Status Messages */}
      {success && (
        <p className="text-green-600 text-sm text-center">
          Message sent successfully!
        </p>
      )}
      {error && (
        <p className="text-red-600 text-sm text-center">{error}</p>
      )}
    </form>
  );
}
