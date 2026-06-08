"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Star, Heart, LayoutGrid, GalleryHorizontalEnd, SlidersHorizontal, X } from "lucide-react";

interface Artwork {
  _id: string;
  title: string;
  slug: string;
  price: number;
  materials: string;
  averageRating: number;
  totalRatings: number;
  featuredImage: string;
  images: string[];
  categoryId?: { _id: string; name: string } | string;
  artistId?: { _id: string; fullName: string } | string;
  status: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

// Fallback sample data when API is unavailable
const SAMPLE_ARTWORKS: Artwork[] = [
  { _id: "1", title: "Virgin Mary & Child", slug: "virgin-mary-child", price: 450, materials: "Acrylic on Canvas", averageRating: 4.8, totalRatings: 32, featuredImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80", images: [], status: "active" },
  { _id: "2", title: "Ethiopian Cross", slug: "ethiopian-cross", price: 320, materials: "Brass", averageRating: 4.6, totalRatings: 18, featuredImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80", images: [], status: "active" },
  { _id: "3", title: "St. George Icon", slug: "st-george-icon", price: 560, materials: "Acrylic on Wood", averageRating: 4.9, totalRatings: 41, featuredImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80", images: [], status: "active" },
  { _id: "4", title: "Ancient Manuscript", slug: "ancient-manuscript", price: 780, materials: "Gouache on Parchment", averageRating: 4.7, totalRatings: 27, featuredImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80", images: [], status: "active" },
  { _id: "5", title: "Lalibela Cross", slug: "lalibela-cross", price: 420, materials: "Silver", averageRating: 4.5, totalRatings: 15, featuredImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80", images: [], status: "active" },
  { _id: "6", title: "Holy Trinity Triptych", slug: "holy-trinity-triptych", price: 1200, materials: "Tempera on Wood", averageRating: 5.0, totalRatings: 9, featuredImage: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80", images: [], status: "active" },
];

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>(SAMPLE_ARTWORKS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [view, setView] = useState<"grid" | "gallery">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    try {
      const stored = localStorage.getItem("orthodox_favorites");
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}

    // Fetch artworks from API
    fetch("/api/artworks")
      .then((r) => r.json())
      .then((data) => {
        if (data.artworks?.length) setArtworks(data.artworks);
      })
      .catch(() => {});

    // Fetch categories
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.categories?.length) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("orthodox_favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites-updated"));
  };

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategory) {
        const catName = typeof a.categoryId === "object" && a.categoryId ? a.categoryId.name : "";
        if (catName.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
      return true;
    });
  }, [artworks, search, selectedCategory]);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-luxury-card to-luxury-dark py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl md:text-5xl text-white font-bold mb-2">Sacred Gallery</h1>
          <p className="font-sans text-white/40 text-sm">Discover Ethiopian Orthodox masterpieces</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artworks..."
              className="w-full bg-luxury-card border border-orthodox-gold/20 rounded-lg pl-10 pr-4 py-2.5 text-sm font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-orthodox-gold/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="md:hidden flex items-center gap-2 text-xs text-orthodox-gold border border-orthodox-gold/30 px-3 py-2 rounded-lg font-sans uppercase tracking-wider"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>

            {/* Category pills (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`text-xs px-3 py-1.5 rounded-full font-sans tracking-wider transition-all ${
                  !selectedCategory ? "bg-orthodox-gold text-luxury-dark" : "border border-orthodox-gold/30 text-white/60 hover:text-orthodox-gold"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`text-xs px-3 py-1.5 rounded-full font-sans tracking-wider transition-all ${
                    selectedCategory === c.name ? "bg-orthodox-gold text-luxury-dark" : "border border-orthodox-gold/30 text-white/60 hover:text-orthodox-gold"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center border border-orthodox-gold/20 rounded-lg overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`p-2 transition-colors ${view === "grid" ? "bg-orthodox-gold text-luxury-dark" : "text-white/40 hover:text-orthodox-gold"}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView("gallery")}
                className={`p-2 transition-colors ${view === "gallery" ? "bg-orthodox-gold text-luxury-dark" : "text-white/40 hover:text-orthodox-gold"}`}
              >
                <GalleryHorizontalEnd size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {filtersOpen && (
          <div className="md:hidden mb-6 p-4 bg-luxury-card rounded-lg border border-orthodox-gold/10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-sm text-white/60 uppercase tracking-wider">Categories</span>
              <button onClick={() => setFiltersOpen(false)} className="text-white/40"><X size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setSelectedCategory(""); setFiltersOpen(false); }}
                className={`text-xs px-3 py-1.5 rounded-full font-sans ${!selectedCategory ? "bg-orthodox-gold text-luxury-dark" : "border border-orthodox-gold/30 text-white/60"}`}>
                All
              </button>
              {categories.map((c) => (
                <button key={c._id} onClick={() => { setSelectedCategory(c.name); setFiltersOpen(false); }}
                  className={`text-xs px-3 py-1.5 rounded-full font-sans ${selectedCategory === c.name ? "bg-orthodox-gold text-luxury-dark" : "border border-orthodox-gold/30 text-white/60"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="font-sans text-xs text-white/30 mb-6">{filtered.length} artwork{filtered.length !== 1 ? "s" : ""} found</p>

        {/* ── GRID VIEW ── */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((art, i) => (
              <motion.div key={art._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                <Link href={`/artworks/${art.slug}`} className="group block">
                  <div className="parchment-card rounded-lg overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] group-hover:-translate-y-1">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image src={art.featuredImage} alt={art.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <button onClick={(e) => { e.preventDefault(); toggleFavorite(art._id); }}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${favorites.includes(art._id) ? "bg-orthodox-gold text-luxury-dark" : "bg-luxury-dark/60 text-white/70 hover:text-orthodox-gold"}`}>
                        <Heart size={16} fill={favorites.includes(art._id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-base font-semibold text-luxury-dark truncate">{art.title}</h3>
                      <p className="font-sans text-xs text-luxury-dark/50 mt-0.5">{art.materials}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-serif text-lg font-bold text-luxury-dark">${art.price}</span>
                        <div className="flex items-center gap-1 text-orthodox-gold-dark">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-sans text-luxury-dark/60">{art.averageRating} ({art.totalRatings})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── GALLERY VIEW ── */}
        {view === "gallery" && (
          <div className="flex flex-col gap-8">
            {filtered.map((art, i) => (
              <motion.div key={art._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                <Link href={`/artworks/${art.slug}`} className="group flex flex-col md:flex-row gap-6 parchment-card-dark rounded-lg overflow-hidden p-4 hover:border-orthodox-gold/30 transition-all duration-500">
                  <div className="relative w-full md:w-64 aspect-square md:aspect-[3/4] rounded-lg overflow-hidden shrink-0">
                    <Image src={art.featuredImage} alt={art.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="font-serif text-xl text-parchment font-semibold mb-1 group-hover:text-orthodox-gold transition-colors">{art.title}</h3>
                    <p className="font-sans text-xs text-white/40 mb-3">{art.materials}</p>
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-2xl font-bold text-orthodox-gold">${art.price}</span>
                      <div className="flex items-center gap-1 text-orthodox-gold/60">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-sans">{art.averageRating} ({art.totalRatings} reviews)</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); toggleFavorite(art._id); }}
                      className={`mt-4 self-start flex items-center gap-2 text-xs font-sans uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${
                        favorites.includes(art._id) ? "bg-orthodox-gold text-luxury-dark border-orthodox-gold" : "border-orthodox-gold/30 text-orthodox-gold hover:bg-orthodox-gold/10"
                      }`}>
                      <Heart size={12} fill={favorites.includes(art._id) ? "currentColor" : "none"} />
                      {favorites.includes(art._id) ? "Saved" : "Save"}
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-xl text-white/30">No artworks found</p>
            <p className="font-sans text-sm text-white/20 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
