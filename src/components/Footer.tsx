import React from "react";
import Link from "next/link";
import CrossOrnament from "./CrossOrnament";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-luxury-card border-t border-orthodox-gold/15 text-white/70 font-sans mt-auto">
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo and Intro */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <CrossOrnament size={28} />
              <span className="font-serif text-lg font-bold tracking-widest text-orthodox-gold">
                ORTHODOX EXP
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-white/50">
              A premium digital exhibition platform dedicated to documenting, showcasing, and preserving the sacred beauty and profound theology of Ethiopian Orthodox Christian icons, relics, and manuscripts.
            </p>
            <p className="text-xs text-orthodox-gold/60 italic font-serif mt-2">
              &quot;ጥበብ እና እምነት&quot; &mdash; Wisdom and Faith
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-orthodox-gold text-sm tracking-wider uppercase">
              Exhibitions
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-orthodox-gold transition-colors">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link href="/artworks" className="hover:text-orthodox-gold transition-colors">
                  Sacred Gallery
                </Link>
              </li>
              <li>
                <Link href="/artists" className="hover:text-orthodox-gold transition-colors">
                  Master Iconographers
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-orthodox-gold transition-colors">
                  Saved Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-orthodox-gold text-sm tracking-wider uppercase">
              Contact &amp; Hours
            </h3>
            <ul className="flex flex-col gap-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-orthodox-gold shrink-0 mt-0.5" />
                <span>Addis Ababa, Ethiopia &middot; Digital Museum</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-orthodox-gold shrink-0" />
                <span>+251 911 000000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-orthodox-gold shrink-0" />
                <a href="mailto:info@orthodoxart.expo" className="hover:text-orthodox-gold transition-colors">
                  info@orthodoxart.expo
                </a>
              </li>
              <li className="text-[11px] text-white/40 leading-relaxed border-t border-white/5 pt-2 mt-1">
                Virtual exhibition doors are always open. Support desk: Mon - Sat (9 AM - 6 PM EAT).
              </li>
            </ul>
          </div>

          {/* Newsletter / Guestbook Sign up */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-orthodox-gold text-sm tracking-wider uppercase">
              Exhibition Newsletter
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Subscribe to receive updates on new ecclesiastical collections, artist stories, and seasonal exhibitions.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex mt-2">
              <input
                type="email"
                placeholder="Enter email address"
                required
                className="bg-luxury-dark border border-orthodox-gold/30 text-white placeholder-white/30 text-xs px-3 py-2 rounded-l focus:outline-none focus:border-orthodox-gold w-full font-sans"
              />
              <button
                type="submit"
                className="bg-orthodox-gold text-luxury-dark px-3 py-2 rounded-r hover:bg-orthodox-gold-dark transition-colors flex items-center justify-center"
                title="Subscribe"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Decorative center divider */}
      <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto px-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent to-orthodox-gold/20 flex-1" />
        <CrossOrnament size={20} className="opacity-40" />
        <div className="h-[1px] bg-gradient-to-l from-transparent to-orthodox-gold/20 flex-1" />
      </div>

      {/* Lower Footer copyright */}
      <div className="bg-luxury-dark/60 py-6 text-center text-xs text-white/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; {currentYear} Bete Nway Orthodox Art Expo. All rights reserved.</p>
          <div className="flex gap-4 text-[11px]">
            <Link href="/about" className="hover:text-white transition-colors">About the Project</Link>
            <span>&middot;</span>
            <Link href="/contact" className="hover:text-white transition-colors">Visitor Inquiries</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
