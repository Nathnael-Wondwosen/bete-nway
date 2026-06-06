"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CrossOrnament from "@/components/CrossOrnament";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-luxury-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <CrossOrnament size={40} className="text-orthodox-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-white font-bold">Admin Portal</h1>
          <p className="font-sans text-white/40 text-sm mt-1">Bete Nway Exhibition Management</p>
        </div>

        <div className="parchment-card-dark rounded-lg p-8">
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm font-sans">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="admin@orthodoxart.expo"
                className="w-full bg-luxury-dark border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/20 focus:outline-none focus:border-orthodox-gold/50" />
            </div>
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-wider mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full bg-luxury-dark border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/20 focus:outline-none focus:border-orthodox-gold/50" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-sm tracking-widest uppercase py-3 rounded-lg transition-colors disabled:opacity-50 mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-white/20 text-xs font-sans">
          &copy; {new Date().getFullYear()} Bete Nway. All rights reserved.
        </p>
      </div>
    </div>
  );
}
