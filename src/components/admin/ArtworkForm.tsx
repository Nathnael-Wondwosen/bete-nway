"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Star } from "lucide-react";

interface SelectOption { _id: string; name: string; }

interface ArtworkFormProps {
  initialData?: Record<string, unknown>;
  artworkId?: string;
}

export default function ArtworkForm({ initialData, artworkId }: ArtworkFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "", slug: "", price: "", description: "", story: "",
    dimensions: "", materials: "", featured: false, status: "active",
    categoryId: "", artistId: "", collections: [] as string[],
  });
  const [images, setImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [artists, setArtists] = useState<SelectOption[]>([]);
  const [collections, setCollections] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.categories || []));
    fetch("/api/artists").then(r => r.json()).then(d => setArtists(d.artists || []));
    fetch("/api/collections").then(r => r.json()).then(d => setCollections(d.collections || []));

    if (initialData) {
      setForm({
        title: (initialData.title as string) || "",
        slug: (initialData.slug as string) || "",
        price: String(initialData.price || ""),
        description: (initialData.description as string) || "",
        story: (initialData.story as string) || "",
        dimensions: (initialData.dimensions as string) || "",
        materials: (initialData.materials as string) || "",
        featured: Boolean(initialData.featured),
        status: (initialData.status as string) || "active",
        categoryId: (initialData.categoryId as string) || "",
        artistId: (initialData.artistId as string) || "",
        collections: (initialData.collections as string[]) || [],
      });
      setImages((initialData.images as string[]) || []);
      setFeaturedImage((initialData.featuredImage as string) || "");
    }
  }, []);

  const autoSlug = (title: string) =>
    title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (v: string) => {
    setForm(f => ({ ...f, title: v, slug: f.slug || autoSlug(v) }));
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setImages(prev => {
          const updated = [...prev, data.url];
          if (!featuredImage) setFeaturedImage(data.url);
          return updated;
        });
      }
    }
    setUploading(false);
  };

  const removeImage = (url: string) => {
    setImages(prev => prev.filter(i => i !== url));
    if (featuredImage === url) setFeaturedImage(images.find(i => i !== url) || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images.length) return alert("Please upload at least one image.");
    setSaving(true);
    const body = { ...form, price: Number(form.price), images, featuredImage: featuredImage || images[0] };
    const url = artworkId ? `/api/artworks/${artworkId}` : "/api/artworks";
    const method = artworkId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setSaving(false);
    if (data.artwork || data.success) router.push("/admin/dashboard/artworks");
    else alert(data.error || "Failed to save artwork");
  };

  const inputClass = "w-full bg-luxury-dark border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-orthodox-gold/50";
  const labelClass = "block font-sans text-xs text-white/50 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title *</label>
          <input value={form.title} onChange={e => handleTitleChange(e.target.value)} required placeholder="Artwork title" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated-from-title" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Price (USD) *</label>
          <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min="0" placeholder="450" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required className={inputClass + " bg-luxury-dark"}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Artist *</label>
          <select value={form.artistId} onChange={e => setForm(f => ({ ...f, artistId: e.target.value }))} required className={inputClass + " bg-luxury-dark"}>
            <option value="">Select artist</option>
            {artists.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Dimensions</label>
          <input value={form.dimensions} onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))} placeholder="40cm × 60cm" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Materials</label>
          <input value={form.materials} onChange={e => setForm(f => ({ ...f, materials: e.target.value }))} placeholder="Acrylic on Canvas" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputClass + " bg-luxury-dark"}>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Collections multi-select */}
      <div>
        <label className={labelClass}>Collections</label>
        <div className="flex flex-wrap gap-2">
          {collections.map(c => (
            <button type="button" key={c._id}
              onClick={() => setForm(f => ({ ...f, collections: f.collections.includes(c._id) ? f.collections.filter(x => x !== c._id) : [...f.collections, c._id] }))}
              className={`text-xs px-3 py-1.5 rounded-full font-sans transition-all ${form.collections.includes(c._id) ? "bg-orthodox-gold text-luxury-dark" : "border border-orthodox-gold/30 text-white/50 hover:text-orthodox-gold"}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={3} placeholder="Describe the artwork..." className={inputClass + " resize-none"} />
      </div>

      {/* Story */}
      <div>
        <label className={labelClass}>Artwork Story</label>
        <textarea value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))} rows={5} placeholder="The deeper narrative, spiritual context, and creation story of this artwork..." className={inputClass + " resize-none"} />
      </div>

      {/* Image Upload */}
      <div>
        <label className={labelClass}>Images *</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-orthodox-gold/20 rounded-lg p-8 text-center cursor-pointer hover:border-orthodox-gold/40 transition-colors"
        >
          <Upload size={28} className="text-orthodox-gold/40 mx-auto mb-2" />
          <p className="font-sans text-sm text-white/40">Drop images here or click to browse</p>
          <p className="font-sans text-xs text-white/20 mt-1">JPEG, PNG, WebP — max 10MB each</p>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleUpload(e.target.files)} />
        </div>
        {uploading && <p className="text-orthodox-gold text-xs font-sans mt-2 animate-pulse">Uploading to Cloudinary…</p>}

        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
            {images.map(url => (
              <div key={url} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 transition-colors"
                  style={{ borderColor: featuredImage === url ? "#d4af37" : "transparent" }}>
                  <Image src={url} alt="" fill className="object-cover" />
                </div>
                <button type="button" onClick={() => setFeaturedImage(url)}
                  className={`absolute top-1 left-1 p-1 rounded-full transition-colors ${featuredImage === url ? "bg-orthodox-gold text-luxury-dark" : "bg-black/60 text-white/60 hover:text-orthodox-gold"}`}>
                  <Star size={11} fill={featuredImage === url ? "currentColor" : "none"} />
                </button>
                <button type="button" onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-red-900/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
        {images.length > 0 && <p className="text-xs text-white/30 font-sans mt-2">★ Click the star to set featured image</p>}
      </div>

      {/* Featured toggle */}
      <div className="flex items-center gap-3">
        <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
          className="w-4 h-4 accent-orthodox-gold" />
        <label htmlFor="featured" className="font-sans text-sm text-white/60">Feature this artwork on the homepage</label>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={saving}
          className="bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-sm tracking-widest uppercase px-8 py-3 rounded-lg transition-colors disabled:opacity-50">
          {saving ? "Saving…" : artworkId ? "Update Artwork" : "Create Artwork"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-orthodox-gold/20 text-white/50 hover:text-white font-sans text-sm px-6 py-3 rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
