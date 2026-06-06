"use client";

import React, { useEffect, useState } from "react";
import { Image as ImageIcon, FolderOpen, Layers, MessageSquare, Star } from "lucide-react";

interface Stats {
  artworks: number;
  categories: number;
  collections: number;
  pendingComments: number;
  avgRating: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ artworks: 0, categories: 0, collections: 0, pendingComments: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/artworks").then((r) => r.json()).catch(() => ({ artworks: [] })),
      fetch("/api/categories").then((r) => r.json()).catch(() => ({ categories: [] })),
      fetch("/api/collections").then((r) => r.json()).catch(() => ({ collections: [] })),
      fetch("/api/comments?all=true").then((r) => r.json()).catch(() => ({ comments: [] })),
    ]).then(([artData, catData, colData, comData]) => {
      const artworks = artData.artworks || [];
      const comments = comData.comments || [];
      const pending = comments.filter((c: { approved: boolean }) => !c.approved).length;
      const avg = artworks.length > 0
        ? (artworks.reduce((s: number, a: { averageRating: number }) => s + (a.averageRating || 0), 0) / artworks.length).toFixed(1)
        : "0";
      setStats({
        artworks: artworks.length,
        categories: (catData.categories || []).length,
        collections: (colData.collections || []).length,
        pendingComments: pending,
        avgRating: Number(avg),
      });
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: "Total Artworks", value: stats.artworks, icon: ImageIcon, color: "text-orthodox-gold" },
    { label: "Categories", value: stats.categories, icon: FolderOpen, color: "text-blue-400" },
    { label: "Collections", value: stats.collections, icon: Layers, color: "text-emerald-400" },
    { label: "Pending Comments", value: stats.pendingComments, icon: MessageSquare, color: "text-amber-400" },
    { label: "Avg. Rating", value: stats.avgRating, icon: Star, color: "text-yellow-400" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-white font-bold mb-6">Dashboard Overview</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-luxury-card border border-orthodox-gold/10 rounded-lg p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="bg-luxury-card border border-orthodox-gold/10 rounded-lg p-5 hover:border-orthodox-gold/25 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <c.icon size={20} className={c.color} />
              </div>
              <p className="font-serif text-2xl text-white font-bold">{c.value}</p>
              <p className="font-sans text-xs text-white/40 mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 parchment-card-dark rounded-lg p-6">
        <h3 className="font-serif text-lg text-parchment font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Add Artwork", href: "/admin/dashboard/artworks/new" },
            { label: "Manage Categories", href: "/admin/dashboard/categories" },
            { label: "Moderate Comments", href: "/admin/dashboard/comments" },
            { label: "Edit Homepage", href: "/admin/dashboard/content" },
            { label: "Seed Database", href: "#seed" },
          ].map((a) => (
            <a key={a.label} href={a.href}
              onClick={a.href === "#seed" ? async (e) => { e.preventDefault(); await fetch("/api/seed", { method: "POST" }); alert("Database seeded!"); window.location.reload(); } : undefined}
              className="text-xs font-sans text-orthodox-gold border border-orthodox-gold/30 hover:bg-orthodox-gold/10 px-4 py-2 rounded-lg transition-colors uppercase tracking-wider">
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
