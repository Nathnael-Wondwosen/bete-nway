"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star } from "lucide-react";

interface Artist { _id: string; fullName: string; biography: string; photo: string; socialLinks?: Record<string, string>; }
interface Artwork { _id: string; title: string; slug: string; price: number; materials: string; featuredImage: string; averageRating: number; totalRatings: number; }

export default function ArtistDetailClient({ id }: { id: string }) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    fetch(`/api/artists/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data.artist) setArtist(data.artist); })
      .catch(() => {});
    fetch(`/api/artworks?artist=${id}`)
      .then((r) => r.json())
      .then((data) => { if (data.artworks) setArtworks(data.artworks); })
      .catch(() => {});
  }, [id]);

  if (!artist) return <div className="min-h-screen flex items-center justify-center"><p className="text-white/40 font-sans">Loading artist...</p></div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 pt-4 pb-2">
        <Link href="/artists" className="inline-flex items-center gap-2 text-white/40 hover:text-orthodox-gold text-sm font-sans transition-colors">
          <ArrowLeft size={16} /> Back to Artists
        </Link>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-orthodox-gold/40 shrink-0">
            <Image src={artist.photo} alt={artist.fullName} fill className="object-cover" />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-white font-bold">{artist.fullName}</h1>
            <p className="font-sans text-white/60 text-sm mt-3 leading-relaxed max-w-xl">{artist.biography}</p>
            {artist.socialLinks && (
              <div className="flex gap-4 mt-4">
                {Object.entries(artist.socialLinks).filter(([, v]) => v).map(([k, v]) => (
                  <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="text-xs text-orthodox-gold font-sans uppercase tracking-wider hover:text-white transition-colors">{k}</a>
                ))}
              </div>
            )}
          </div>
        </div>

        <h2 className="font-serif text-2xl text-white font-semibold mt-12 mb-6">Artworks by {artist.fullName}</h2>
        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <Link key={art._id} href={`/artworks/${art.slug}`} className="group block">
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
            ))}
          </div>
        ) : (
          <p className="text-white/30 font-sans text-sm">No artworks found for this artist yet.</p>
        )}
      </div>
    </div>
  );
}
