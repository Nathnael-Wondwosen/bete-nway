"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Heart, User, Menu, X, ArrowRight } from "lucide-react";
import CrossOrnament from "./CrossOrnament";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favCount, setFavCount] = useState(0);

  // Scroll handler for background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync favorites badge count
  useEffect(() => {
    const updateFavCount = () => {
      try {
        const stored = localStorage.getItem("orthodox_favorites");
        if (stored) {
          const parsed = JSON.parse(stored);
          setFavCount(Array.isArray(parsed) ? parsed.length : 0);
        } else {
          setFavCount(0);
        }
      } catch (e) {
        setFavCount(0);
      }
    };

    updateFavCount();
    // Listen to custom event for dynamic updates when adding/removing favorites
    window.addEventListener("favorites-updated", updateFavCount);
    window.addEventListener("storage", updateFavCount);
    
    return () => {
      window.removeEventListener("favorites-updated", updateFavCount);
      window.removeEventListener("storage", updateFavCount);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/artworks?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Artworks", href: "/artworks" },
    { name: "Artists", href: "/artists" },
    { name: "Favorites", href: "/favorites" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-luxury-dark/95 border-b border-orthodox-gold/20 shadow-lg backdrop-blur-md py-3"
          : "bg-gradient-to-b from-luxury-dark via-luxury-dark/60 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <CrossOrnament size={32} className="transition-transform duration-500 group-hover:rotate-45" />
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-bold tracking-widest text-orthodox-gold group-hover:text-white transition-colors duration-300">
                ORTHODOX ART
              </span>
              <span className="text-[9px] tracking-[0.25em] text-white/60 font-sans uppercase -mt-1">
                Expo Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative font-sans text-sm tracking-widest uppercase transition-colors duration-300 py-1 ${
                    isActive
                      ? "text-orthodox-gold font-semibold"
                      : "text-white/80 hover:text-orthodox-gold"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-orthodox-gold shadow-[0_0_8px_#d4af37]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-6">
            {/* Search Icon & Box */}
            <div className="relative flex items-center">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search sacred relics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-luxury-card text-white text-xs border border-orthodox-gold/40 rounded-l-md px-3 py-1.5 focus:outline-none focus:border-orthodox-gold w-48 font-sans"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-orthodox-gold text-luxury-dark rounded-r-md px-2.5 py-1.5 hover:bg-orthodox-gold-dark transition-colors"
                  >
                    <Search size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-white/60 hover:text-white ml-2"
                  >
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-white/80 hover:text-orthodox-gold transition-colors p-1"
                  title="Search"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Favorites Button */}
            <Link
              href="/favorites"
              className="text-white/80 hover:text-orthodox-gold transition-colors relative p-1"
              title="Saved Favorites"
            >
              <Heart size={18} />
              {favCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orthodox-gold text-luxury-dark text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-luxury-dark shadow-[0_0_5px_#d4af37]">
                  {favCount}
                </span>
              )}
            </Link>

            {/* Admin Dashboard / Login Link */}
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 text-xs text-orthodox-gold border border-orthodox-gold/30 hover:border-orthodox-gold bg-orthodox-gold/5 hover:bg-orthodox-gold/10 px-3.5 py-1.5 rounded transition-all duration-300 font-sans tracking-wider uppercase"
            >
              <User size={14} />
              Dashboard
            </Link>
          </div>

          {/* Mobile Actions and Hamburger (Tablet & below) */}
          <div className="flex md:hidden items-center gap-4">
            {/* Mobile Search Button (Direct redirection) */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (!searchOpen) {
                  // Focus search input
                }
              }}
              className="text-white/80 hover:text-orthodox-gold transition-colors"
            >
              <Search size={18} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/80 hover:text-orthodox-gold p-1"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expand */}
        {searchOpen && (
          <div className="md:hidden mt-3 pb-2">
            <form onSubmit={handleSearchSubmit} className="flex w-full">
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-luxury-card text-white text-sm border border-orthodox-gold/40 rounded-l-md px-3 py-2 w-full focus:outline-none focus:border-orthodox-gold font-sans"
              />
              <button
                type="submit"
                className="bg-orthodox-gold text-luxury-dark rounded-r-md px-4 py-2 hover:bg-orthodox-gold-dark transition-colors"
              >
                <Search size={16} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bottom-0 bg-luxury-dark/98 z-40 border-t border-orthodox-gold/10 px-6 py-8 flex flex-col justify-between overflow-y-auto animate-fade-in">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-serif text-xl tracking-widest uppercase py-2 border-b border-orthodox-gold/5 flex items-center justify-between ${
                  pathname === link.href ? "text-orthodox-gold" : "text-white/95"
                }`}
              >
                {link.name}
                <ArrowRight size={16} className="text-orthodox-gold/50" />
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-12 pb-16">
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 text-center text-orthodox-gold border border-orthodox-gold/40 hover:border-orthodox-gold bg-orthodox-gold/5 py-3 rounded-md font-sans tracking-widest uppercase text-sm"
            >
              <User size={16} />
              Admin Portal
            </Link>
            <p className="text-center text-xs text-white/40 font-sans font-light">
              Preserving Sacred Art &middot; Bete Nway
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
