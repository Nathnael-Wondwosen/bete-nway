"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface Artist {
  _id: string;
  fullName: string;
  biography: string;
  photo: string;
}

const SAMPLE_ARTISTS: Artist[] = [
  { _id: "1", fullName: "Abeba Tesfaye", biography: "A master of Ethiopian Orthodox iconography with over 20 years of experience in sacred art.", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { _id: "2", fullName: "Dawit Mekonnen", biography: "Specializing in ancient manuscript illumination and Ge'ez calligraphy traditions.", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { _id: "3", fullName: "Tigist Hailu", biography: "A celebrated cross artisan preserving the Lalibela tradition of hand-crafted processional crosses.", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
];

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(SAMPLE_ARTISTS);

  useEffect(() => {
    fetch("/api/artists")
      .then((r) => r.json())
      .then((data) => { if (data.artists?.length) setArtists(data.artists); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-luxury-card to-luxury-dark py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-5xl text-white font-bold mb-2">Our Artists</h1>
          <p className="font-sans text-white/40 text-sm">Masters preserving sacred Ethiopian Orthodox artistic traditions</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist, i) => (
            <motion.div key={artist._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link href={`/artists/${artist._id}`} className="group flex flex-col items-center text-center parchment-card-dark rounded-lg p-8 hover:border-orthodox-gold/30 transition-all duration-500">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-orthodox-gold/30 mb-5 group-hover:border-orthodox-gold transition-colors">
                  <Image src={artist.photo} alt={artist.fullName} fill className="object-cover" />
                </div>
                <h2 className="font-serif text-lg text-parchment font-semibold group-hover:text-orthodox-gold transition-colors">{artist.fullName}</h2>
                <p className="font-sans text-xs text-white/40 mt-2 line-clamp-3">{artist.biography}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
