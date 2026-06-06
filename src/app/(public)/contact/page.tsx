"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import CrossOrnament from "@/components/CrossOrnament";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-luxury-card to-luxury-dark py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <CrossOrnament size={32} className="text-orthodox-gold/60 mx-auto mb-4" />
          <h1 className="font-serif text-3xl md:text-5xl text-white font-bold mb-2">Contact Us</h1>
          <p className="font-sans text-white/40 text-sm">We&apos;d love to hear from you</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl text-white font-semibold mb-6">Get in Touch</h2>
            <p className="font-sans text-white/50 text-sm leading-relaxed mb-8">
              Whether you&apos;re interested in acquiring a piece, collaborating with our artists, or simply learning more about Ethiopian Orthodox art, we welcome your inquiry.
            </p>
            <div className="flex flex-col gap-6">
              {[
                { icon: Mail, label: "Email", value: "info@orthodoxart.expo" },
                { icon: Phone, label: "Phone", value: "+251 911 000 000" },
                { icon: MapPin, label: "Location", value: "Addis Ababa, Ethiopia" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orthodox-gold/10 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-orthodox-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-xs text-white/40 uppercase tracking-wider">{item.label}</p>
                    <p className="font-sans text-white/80 text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              {["Telegram", "Facebook", "Instagram"].map((s) => (
                <a key={s} href="#" className="text-xs font-sans text-orthodox-gold uppercase tracking-wider hover:text-white transition-colors border border-orthodox-gold/20 px-3 py-1.5 rounded-full">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="parchment-card-dark rounded-lg p-6 md:p-8">
            <h3 className="font-serif text-lg text-parchment font-semibold mb-4">Send a Message</h3>
            {sent && (
              <div className="bg-orthodox-gold/10 border border-orthodox-gold/30 rounded-lg p-3 mb-4">
                <p className="text-orthodox-gold text-sm font-sans">Message sent successfully! We&apos;ll respond soon.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name" required
                className="bg-luxury-dark border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-orthodox-gold/50" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Your email" type="email" required
                className="bg-luxury-dark border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-orthodox-gold/50" />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your message..." required rows={5}
                className="bg-luxury-dark border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-orthodox-gold/50 resize-none" />
              <button type="submit"
                className="self-start flex items-center gap-2 bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-xs tracking-widest uppercase px-6 py-2.5 rounded-lg transition-colors">
                <Send size={14} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
