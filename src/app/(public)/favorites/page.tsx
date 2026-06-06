"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Trash2 } from "lucide-react";
import CrossOrnament from "@/components/CrossOrnament";

interface Artwork {
  _id: string;
  title: string;
  slug: string;
  price: number;
  materials: string;
  featuredImage: string;
  averageRating: number;
  totalRatings: number;
}

const SAMPLE_MAP: Record<string, Artwork> = {
  "virgin-mary-child": { _id: "1", title: "Virgin Mary & Child", slug: "virgin-mary-child", price: 450, materials: "Acrylic on Canvas", featuredImage: "https://images.unsplash.com/photo-1577083165299-6f4ea30e4b72?w=600&q=80", averageRating: 4.8, totalRatings: 32 },
  "ethiopian-cross": { _id: "2", title: "Ethiopian Cross", slug: "ethiopian-cross", price: 320, materials: "Brass", featuredImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80", averageRating: 4.6, totalRatings: 18 },
};

export default function FavoritesPage() {
  const [favSlugs, setFavSlugs] = useState<string[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("orthodox_favorites") || "[]");
      setFavSlugs(stored);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!favSlugs.length) { setArtworks([]); return; }
    // Try API first, fall back to sample data
    fetch(`/api/artworks`)
      .then((r) => r.json())
      .then((data) => {
        if (data.artworks?.length) {
          setArtworks(data.artworks.filter((a: Artwork) => favSlugs.includes(a.slug)));
        } else {
          setArtworks(favSlugs.map((s) => SAMPLE_MAP[s]).filter(Boolean));
        }
      })
      .catch(() => {
        setArtworks(favSlugs.map((s) => SAMPLE_MAP[s]).filter(Boolean));
      });
  }, [favSlugs]);

  const removeFav = (slug: string) => {
    const updated = favSlugs.filter((s) => s !== slug);
    setFavSlugs(updated);
    localStorage.setItem("orthodox_favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites-updated"));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-white/40 font-sans">Loading...</p></div>;

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-luxury-card to-luxury-dark py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Heart size={32} className="text-orthodox-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl md:text-5xl text-white font-bold mb-2">Your Favorites</h1>
          <p className="font-sans text-white/40 text-sm">Artworks you&apos;ve saved for later</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <div key={art.slug} className="group relative">
                <Link href={`/artworks/${art.slug}`} className="block">
                  <div className="parchment-card rounded-lg overflow-hidden group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] group-hover:-translate-y-1 transition-all duration-500">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image src={art.featuredImage} alt={art.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-base font-semibold text-luxury-dark truncate">{art.title}</h3>
                      <p className="text-xs font-sans text-luxury-dark/50">{art.materials}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-serif text-lg font-bold text-luxury-dark">${art.price}</span>
                        <div className="flex items-center gap-1"><Star size={12} fill="currentColor" className="text-orthodox-gold-dark" /><span className="text-xs text-luxury-dark/50 font-sans">{art.averageRating}</span></div>
                      </div>
                    </div>
                  </div>
                </Link>
                <button onClick={() => removeFav(art.slug)}
                  className="absolute top-3 right-3 bg-red-900/80 backdrop-blur-sm p-2 rounded-full text-white hover:bg-red-700 transition-colors z-10">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <CrossOrnament size={48} className="text-orthodox-gold/20 mx-auto mb-6" />
            <p className="font-serif text-xl text-white/30">No favorites saved yet</p>
            <p className="font-sans text-sm text-white/20 mt-2 mb-8">Browse the gallery and save artworks you love</p>
            <Link href="/artworks" className="inline-flex items-center gap-2 bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-sm tracking-widest uppercase px-6 py-3 rounded transition-colors">
              Explore Gallery
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
