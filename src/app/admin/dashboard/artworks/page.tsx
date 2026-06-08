"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";

interface Artwork {
  _id: string; title: string; slug: string; price: number;
  featuredImage: string; status: string; featured: boolean;
  averageRating: number; totalRatings: number;
  artistId?: { fullName: string };
  categoryId?: { name: string };
}

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArtworks = () => {
    setLoading(true);
    fetch("/api/artworks?admin=true")
      .then(r => r.json())
      .then(d => { setArtworks(d.artworks || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchArtworks(); }, []);

  const toggleFeatured = async (id: string, current: boolean) => {
    await fetch(`/api/artworks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !current }),
    });
    fetchArtworks();
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "active" ? "archived" : "active";
    await fetch(`/api/artworks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    fetchArtworks();
  };

  const deleteArtwork = async (id: string) => {
    if (!confirm("Delete this artwork permanently?")) return;
    await fetch(`/api/artworks/${id}`, { method: "DELETE" });
    fetchArtworks();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-white font-bold">Artworks</h1>
        <Link href="/admin/dashboard/artworks/new"
          className="flex items-center gap-2 bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-xs tracking-widest uppercase px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} /> Add Artwork
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-luxury-card rounded-lg h-16 animate-pulse" />)}
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-20 parchment-card-dark rounded-lg">
          <p className="font-serif text-xl text-white/30">No artworks yet</p>
          <Link href="/admin/dashboard/artworks/new" className="inline-block mt-4 text-orthodox-gold text-sm font-sans hover:underline">Add your first artwork →</Link>
        </div>
      ) : (
        <div className="bg-luxury-card rounded-lg border border-orthodox-gold/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-orthodox-gold/10 text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Artwork</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Artist</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Rating</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map((art) => (
                  <tr key={art._id} className="border-b border-orthodox-gold/5 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                          <Image src={art.featuredImage || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=80"} alt={art.title} fill className="object-cover" />
                        </div>
                        <span className="text-white font-medium truncate max-w-[120px]">{art.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50 hidden md:table-cell">{typeof art.categoryId === "object" ? art.categoryId?.name : "—"}</td>
                    <td className="px-4 py-3 text-white/50 hidden lg:table-cell">{typeof art.artistId === "object" ? art.artistId?.fullName : "—"}</td>
                    <td className="px-4 py-3 text-orthodox-gold font-semibold">${art.price}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-white/50">
                        <Star size={12} className="text-orthodox-gold" fill="currentColor" />
                        {art.averageRating} ({art.totalRatings})
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-sans ${art.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/30"}`}>
                        {art.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleFeatured(art._id, art.featured)} title={art.featured ? "Unfeature" : "Feature"}
                          className={`p-1.5 rounded transition-colors ${art.featured ? "text-orthodox-gold" : "text-white/30 hover:text-orthodox-gold"}`}>
                          <Star size={15} fill={art.featured ? "currentColor" : "none"} />
                        </button>
                        <button onClick={() => toggleStatus(art._id, art.status)} title="Toggle status"
                          className="p-1.5 rounded text-white/30 hover:text-white transition-colors">
                          {art.status === "active" ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <Link href={`/admin/dashboard/artworks/edit/${art._id}`}
                          className="p-1.5 rounded text-white/30 hover:text-blue-400 transition-colors">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => deleteArtwork(art._id)}
                          className="p-1.5 rounded text-white/30 hover:text-red-400 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
