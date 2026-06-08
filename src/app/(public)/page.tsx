"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, ChevronDown, Heart } from "lucide-react";
import CrossOrnament from "@/components/CrossOrnament";

/* ── Sample data (replaced by API once DB is seeded) ── */
const FEATURED_ARTWORKS = [
  { id: "1", title: "Virgin Mary & Child", slug: "virgin-mary-child", price: 450, material: "Acrylic on Canvas", rating: 4.8, reviews: 32, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80" },
  { id: "2", title: "Ethiopian Processional Cross", slug: "ethiopian-processional-cross", price: 320, material: "Brass", rating: 4.6, reviews: 18, image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80" },
  { id: "3", title: "Saint George Icon", slug: "saint-george-icon", price: 560, material: "Acrylic on Wood", rating: 4.9, reviews: 41, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80" },
  { id: "4", title: "Ancient Manuscript", slug: "ancient-manuscript", price: 780, material: "Gouache on Parchment", rating: 4.7, reviews: 27, image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80" },
];

const CATEGORIES = [
  { name: "Icons", slug: "icons", icon: "🎨", count: 24 },
  { name: "Manuscripts", slug: "manuscripts", icon: "📜", count: 12 },
  { name: "Processional Crosses", slug: "crosses", icon: "✝️", count: 18 },
  { name: "Tapestries", slug: "tapestries", icon: "🪡", count: 8 },
];

const ARTISTS = [
  { name: "Abeba Tesfaye", specialty: "Iconography", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" },
  { name: "Dawit Mekonnen", specialty: "Manuscript Art", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { name: "Tigist Hailu", specialty: "Cross Craft", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const } }),
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ════════ HERO SECTION ════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&q=80"
            alt="Ethiopian Orthodox Art Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark/80 via-luxury-dark/60 to-luxury-dark" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-sans text-orthodox-gold text-xs tracking-[0.4em] uppercase mb-4"
          >
            ጥበብ እና እምነት
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-4"
          >
            Preserving{" "}
            <span className="text-orthodox-gold">Sacred Art</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-lg md:text-xl text-white/70 tracking-widest uppercase mb-2"
          >
            Through Digital Exhibition
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-sans text-white/50 max-w-xl mx-auto mb-10 text-sm md:text-base"
          >
            Discover the timeless beauty of Ethiopian Orthodox artwork. Each piece tells a story of faith, tradition, and divine inspiration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link
              href="/artworks"
              className="inline-flex items-center gap-3 bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-sm tracking-widest uppercase px-8 py-3.5 rounded transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]"
            >
              Explore Artworks
              <CrossOrnament size={16} />
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 flex flex-col items-center gap-2 text-white/30"
          >
            <CrossOrnament size={20} className="text-orthodox-gold/40" />
            <span className="text-xs font-sans tracking-widest uppercase">Scroll to Discover</span>
            <ChevronDown size={16} className="animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ════════ FEATURED ARTWORKS ════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-luxury-dark to-luxury-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-white font-bold tracking-wide">
                Featured Artworks
              </h2>
              <p className="font-sans text-white/40 mt-2 text-sm">
                Curated pieces from talented Ethiopian Orthodox artists
              </p>
            </div>
            <Link
              href="/artworks"
              className="hidden md:flex items-center gap-2 text-orthodox-gold text-sm font-sans tracking-wider uppercase hover:text-white transition-colors"
            >
              View All <CrossOrnament size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_ARTWORKS.map((art, i) => (
              <motion.div
                key={art.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link href={`/artworks/${art.slug}`} className="group block">
                  <div className="parchment-card rounded-lg overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] group-hover:-translate-y-1">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Favorite button */}
                      <button
                        onClick={(e) => { e.preventDefault(); }}
                        className="absolute top-3 right-3 bg-luxury-dark/60 backdrop-blur-sm p-2 rounded-full text-white/70 hover:text-orthodox-gold transition-colors"
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-base font-semibold text-luxury-dark truncate">
                        {art.title}
                      </h3>
                      <p className="font-sans text-xs text-luxury-dark/50 mt-0.5">{art.material}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-serif text-lg font-bold text-luxury-dark">
                          ${art.price}
                        </span>
                        <div className="flex items-center gap-1 text-orthodox-gold-dark">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-sans text-luxury-dark/60">
                            {art.rating} ({art.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CATEGORIES ════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-dark">
        <div className="max-w-5xl mx-auto text-center">
          <CrossOrnament size={32} className="text-orthodox-gold/60 mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mb-4">
            Browse by Category
          </h2>
          <p className="font-sans text-white/40 max-w-lg mx-auto text-sm mb-12">
            Explore our collection organized by traditional Orthodox art forms
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  href={`/artworks?category=${cat.slug}`}
                  className="parchment-card-dark rounded-lg p-6 flex flex-col items-center gap-3 transition-all duration-500 hover:border-orthodox-gold/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] group"
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <h3 className="font-serif text-sm font-semibold text-parchment tracking-wider uppercase group-hover:text-orthodox-gold transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-sans text-white/30">{cat.count} pieces</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FEATURED ARTISTS ════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-luxury-dark to-luxury-card">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mb-4">
            Featured Artists
          </h2>
          <p className="font-sans text-white/40 max-w-lg mx-auto text-sm mb-12">
            Masters preserving the ancient Orthodox artistic traditions
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {ARTISTS.map((artist, i) => (
              <motion.div
                key={artist.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col items-center group"
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-orthodox-gold/30 mb-4 group-hover:border-orthodox-gold transition-colors duration-500">
                  <Image src={artist.image} alt={artist.name} fill className="object-cover" />
                </div>
                <h3 className="font-serif text-lg text-white font-semibold group-hover:text-orthodox-gold transition-colors">
                  {artist.name}
                </h3>
                <p className="font-sans text-xs text-white/40 tracking-wider uppercase mt-1">
                  {artist.specialty}
                </p>
              </motion.div>
            ))}
          </div>

          <Link
            href="/artists"
            className="inline-flex items-center gap-2 mt-10 text-orthodox-gold font-sans text-sm tracking-wider uppercase hover:text-white transition-colors"
          >
            View All Artists <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ════════ CONTACT / CTA ════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-dark relative">
        <div className="max-w-3xl mx-auto text-center">
          <CrossOrnament size={40} className="text-orthodox-gold/50 mx-auto mb-8" />
          <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mb-4">
            Visit Our Exhibition
          </h2>
          <p className="font-sans text-white/50 mb-8">
            Step into a world of sacred artistry. Our digital exhibition platform brings Ethiopian
            Orthodox masterpieces to collectors, believers, and art enthusiasts worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/artworks"
              className="inline-flex items-center justify-center gap-2 bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-sm tracking-widest uppercase px-8 py-3.5 rounded transition-all duration-300"
            >
              Browse Collection <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-orthodox-gold/40 text-orthodox-gold hover:bg-orthodox-gold/10 font-sans text-sm tracking-widest uppercase px-8 py-3.5 rounded transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
