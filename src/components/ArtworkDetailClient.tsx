"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Share2, ArrowLeft, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface ArtworkDetail {
  _id: string;
  title: string;
  slug: string;
  description: string;
  story?: string;
  price: number;
  dimensions: string;
  materials: string;
  averageRating: number;
  totalRatings: number;
  featuredImage: string;
  images: string[];
  categoryId?: { _id: string; name: string };
  artistId?: { _id: string; fullName: string };
}

interface Comment {
  _id: string;
  name: string;
  comment: string;
  createdAt: string;
}

// Fallback data
const FALLBACK: ArtworkDetail = {
  _id: "1", title: "Virgin Mary & Child", slug: "virgin-mary-child",
  description: "A beautiful depiction of the Virgin Mary holding baby Jesus, painted with vibrant colors and golden highlights. This piece reflects deep faith, love, and the rich tradition of Ethiopian Orthodox iconography.",
  story: "This icon was painted during the celebration of Timkat (Epiphany) and was inspired by traditional Ethiopian Orthodox iconography from the Gondar period. The artist spent three months in meditation and prayer before beginning this sacred work, following the ancient tradition of Ethiopian iconographers who believe their hands are guided by the Holy Spirit.",
  price: 450, dimensions: "40cm × 60cm", materials: "Acrylic on Canvas",
  averageRating: 4.8, totalRatings: 32,
  featuredImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
  images: [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80",
  ],
  categoryId: { _id: "1", name: "Icons" },
  artistId: { _id: "1", fullName: "Abeba Tesfaye" },
};

export default function ArtworkDetailClient({ slug }: { slug: string }) {
  const [artwork, setArtwork] = useState<ArtworkDetail>(FALLBACK);
  const [activeImage, setActiveImage] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", comment: "" });
  const [ratingForm, setRatingForm] = useState({ stars: 5, visitorName: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    // Load favorites
    try {
      const stored = JSON.parse(localStorage.getItem("orthodox_favorites") || "[]");
      setIsFav(stored.includes(slug));
    } catch {}

    // Fetch artwork
    fetch(`/api/artworks/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.artwork) {
          setArtwork(data.artwork);
          // Fetch comments for this artwork
          fetch(`/api/comments?productId=${data.artwork._id}`)
            .then((r) => r.json())
            .then((d) => { if (d.comments) setComments(d.comments); })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, [slug]);

  const toggleFav = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("orthodox_favorites") || "[]");
      const updated = isFav ? stored.filter((s: string) => s !== slug) : [...stored, slug];
      localStorage.setItem("orthodox_favorites", JSON.stringify(updated));
      setIsFav(!isFav);
      window.dispatchEvent(new Event("favorites-updated"));
    } catch {}
  };

  const images = artwork.images?.length ? artwork.images : [artwork.featuredImage];

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...commentForm, productId: artwork._id }),
      });
      setCommentForm({ name: "", email: "", comment: "" });
      alert("Comment submitted for moderation!");
    } catch {}
    setSubmitting(false);
  };

  const submitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ratingForm, productId: artwork._id }),
      });
      alert("Thank you for your rating!");
      setRatingForm({ stars: 5, visitorName: "" });
    } catch {}
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <Link href="/artworks" className="inline-flex items-center gap-2 text-white/40 hover:text-orthodox-gold text-sm font-sans transition-colors">
          <ArrowLeft size={16} /> Back to Gallery
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── Image Gallery ── */}
          <div>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden manuscript-frame bg-luxury-card">
              <Image src={images[activeImage]} alt={artwork.title} fill className="object-cover" priority />
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-luxury-dark/70 backdrop-blur-sm p-2 rounded-full text-white hover:text-orthodox-gold transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-luxury-dark/70 backdrop-blur-sm p-2 rounded-full text-white hover:text-orthodox-gold transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeImage ? "bg-orthodox-gold" : "bg-white/30"}`} />
                ))}
              </div>
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden shrink-0 border-2 transition-colors ${i === activeImage ? "border-orthodox-gold" : "border-transparent opacity-50 hover:opacity-80"}`}>
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl md:text-4xl text-white font-bold">{artwork.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm font-sans">
              <span className="text-white/40">{artwork.materials}</span>
              {artwork.artistId && typeof artwork.artistId === "object" && (
                <span className="text-orthodox-gold">By {artwork.artistId.fullName}</span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className={s <= Math.round(artwork.averageRating) ? "text-orthodox-gold" : "text-white/20"} fill={s <= Math.round(artwork.averageRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm font-sans text-white/40">{artwork.averageRating} ({artwork.totalRatings} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-6 font-serif text-3xl text-orthodox-gold font-bold">${artwork.price}</div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="font-serif text-sm text-white/60 uppercase tracking-widest mb-2">Description</h3>
              <p className="font-sans text-white/70 text-sm leading-relaxed">{artwork.description}</p>
            </div>

            {/* Dimensions */}
            <div className="mt-4">
              <h3 className="font-serif text-sm text-white/60 uppercase tracking-widest mb-1">Dimensions</h3>
              <p className="font-sans text-white/70 text-sm">{artwork.dimensions}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8">
              <button onClick={toggleFav}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-sans text-sm uppercase tracking-wider transition-all ${
                  isFav ? "bg-orthodox-gold text-luxury-dark" : "border border-orthodox-gold/30 text-orthodox-gold hover:bg-orthodox-gold/10"
                }`}>
                <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                {isFav ? "Saved" : "Save to Favorites"}
              </button>
              <div className="relative">
                <button onClick={() => setShowShare(!showShare)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-orthodox-gold/20 text-white/60 hover:text-orthodox-gold text-sm font-sans transition-colors">
                  <Share2 size={16} /> Share
                </button>
                {showShare && (
                  <div className="absolute top-full mt-2 right-0 bg-luxury-card border border-orthodox-gold/20 rounded-lg p-3 flex flex-col gap-2 min-w-[160px] z-20">
                    {[
                      { name: "Telegram", url: `https://t.me/share/url?url=${shareUrl}` },
                      { name: "WhatsApp", url: `https://wa.me/?text=${shareUrl}` },
                      { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
                      { name: "X (Twitter)", url: `https://twitter.com/intent/tweet?url=${shareUrl}` },
                    ].map((s) => (
                      <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-sans text-white/60 hover:text-orthodox-gold py-1 transition-colors">{s.name}</a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Story Section ── */}
            {artwork.story && (
              <div className="mt-10 parchment-card rounded-lg p-6">
                <h3 className="font-serif text-lg text-luxury-dark font-semibold mb-3">✦ The Story Behind This Artwork</h3>
                <p className="font-sans text-luxury-dark/70 text-sm leading-relaxed italic">{artwork.story}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews & Ratings ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16">
          {/* Comments */}
          <div>
            <h3 className="font-serif text-xl text-white font-semibold mb-6 flex items-center gap-2">
              <MessageSquare size={18} className="text-orthodox-gold" /> Reviews ({comments.length})
            </h3>
            {comments.length > 0 ? (
              <div className="flex flex-col gap-4">
                {comments.map((c) => (
                  <div key={c._id} className="parchment-card-dark rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans font-semibold text-sm text-parchment">{c.name}</span>
                      <span className="text-xs text-white/30 font-sans">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="font-sans text-white/60 text-sm">{c.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/30 font-sans text-sm">No reviews yet. Be the first!</p>
            )}

            {/* Comment form */}
            <form onSubmit={submitComment} className="mt-6 flex flex-col gap-3">
              <h4 className="font-serif text-sm text-white/60 uppercase tracking-widest">Leave a Review</h4>
              <input value={commentForm.name} onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                placeholder="Your name" required
                className="bg-luxury-card border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-orthodox-gold/50" />
              <input value={commentForm.email} onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                placeholder="Your email" type="email" required
                className="bg-luxury-card border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-orthodox-gold/50" />
              <textarea value={commentForm.comment} onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                placeholder="Share your thoughts..." required rows={3}
                className="bg-luxury-card border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-orthodox-gold/50 resize-none" />
              <button type="submit" disabled={submitting}
                className="self-start bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-xs tracking-widest uppercase px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-serif text-xl text-white font-semibold mb-6">Rate This Artwork</h3>
            <form onSubmit={submitRating} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-sans text-white/40">Your Rating:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRatingForm({ ...ratingForm, stars: s })}
                      className="p-0.5">
                      <Star size={24} className={s <= ratingForm.stars ? "text-orthodox-gold" : "text-white/20"} fill={s <= ratingForm.stars ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <input value={ratingForm.visitorName} onChange={(e) => setRatingForm({ ...ratingForm, visitorName: e.target.value })}
                placeholder="Your name" required
                className="bg-luxury-card border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-orthodox-gold/50" />
              <button type="submit"
                className="self-start bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-xs tracking-widest uppercase px-6 py-2.5 rounded-lg transition-colors">
                Submit Rating
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
