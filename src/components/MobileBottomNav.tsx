"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Users, Heart, ShieldAlert } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [favCount, setFavCount] = useState(0);

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
    window.addEventListener("favorites-updated", updateFavCount);
    window.addEventListener("storage", updateFavCount);

    return () => {
      window.removeEventListener("favorites-updated", updateFavCount);
      window.removeEventListener("storage", updateFavCount);
    };
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Gallery", href: "/artworks", icon: Compass },
    { name: "Artists", href: "/artists", icon: Users },
    {
      name: "Saved",
      href: "/favorites",
      icon: Heart,
      badge: true,
    },
    { name: "Admin", href: "/admin/login", icon: ShieldAlert },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-luxury-card/95 border-t border-orthodox-gold/20 shadow-2xl backdrop-blur-md pb-safe-bottom">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Exact match or sub-paths for active state
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full relative transition-colors duration-300 ${
                isActive ? "text-orthodox-gold" : "text-white/60 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? "stroke-[2.25px]" : "stroke-[1.75px]"} />
                {item.badge && favCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-orthodox-gold text-luxury-dark text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-luxury-card shadow-[0_0_4px_#d4af37]">
                    {favCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-sans tracking-wide mt-1 select-none">
                {item.name}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-[2px] bg-orthodox-gold rounded-full shadow-[0_0_6px_#d4af37]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
