"use client";

import { useState } from "react";
import { Lock, Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        window.location.href = "/admin";
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full mb-4">
              <Lock className="w-7 h-7 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
            <p className="text-blue-100 mt-2 text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-10 space-y-6">
            {/* Email Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                  emailFocused
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-200"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <Mail className="w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                  className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                  passwordFocused
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-200"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <Lock className="w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-in shake duration-300">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 font-medium text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                loading || !email || !password
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-slate-600 text-sm">
              🔒 Authorized access only
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-slate-300 mt-8 text-sm font-medium">
          Admin Dashboard
        </p>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}