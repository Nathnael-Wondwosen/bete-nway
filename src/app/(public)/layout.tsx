import React from "react";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-luxury-dark text-parchment">
      {/* Header navbar (fixed) */}
      <Navbar />
      
      {/* Main content area with top padding for header and bottom padding on mobile for sticky bottom bar */}
      <main className="flex-1 flex flex-col pt-20 pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Sticky Bottom Navigation (Mobile only) */}
      <MobileBottomNav />
      
      {/* Museum style Footer */}
      <Footer />
    </div>
  );
}
