"use client";

import React from "react";
import { Send } from "lucide-react";

export default function NewsletterForm() {
  return (
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
  );
}
