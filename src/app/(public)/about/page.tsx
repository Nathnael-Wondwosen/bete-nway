import React from "react";
import Image from "next/image";
import CrossOrnament from "@/components/CrossOrnament";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=80" alt="Ancient manuscripts" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark/90 to-luxury-dark" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <CrossOrnament size={40} className="text-orthodox-gold/60 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">About Bete Nway</h1>
          <p className="font-sans text-white/50 text-sm leading-relaxed">
            A digital sanctuary dedicated to preserving and celebrating the rich artistic heritage of Ethiopian Orthodox Christianity.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="parchment-card rounded-lg p-8 md:p-12 mb-12">
          <h2 className="font-serif text-2xl text-luxury-dark font-bold mb-4">Our Mission</h2>
          <p className="font-sans text-luxury-dark/70 text-sm leading-relaxed mb-4">
            Bete Nway — meaning &ldquo;House of Art&rdquo; — is a premium digital exhibition platform that bridges ancient sacred artistry with modern technology. We believe that Ethiopian Orthodox art is among the most breathtaking and spiritually profound artistic traditions in the world, yet it remains largely undiscovered by global audiences.
          </p>
          <p className="font-sans text-luxury-dark/70 text-sm leading-relaxed">
            Our platform serves as a virtual museum, connecting collectors, believers, and art enthusiasts with the extraordinary narratives woven into every icon, manuscript, cross, and tapestry. Each piece on our platform tells a story of faith, devotion, and centuries-old artistic mastery passed down through generations of Ethiopian artisans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Preservation", desc: "Documenting and digitizing sacred artworks to ensure their stories endure for future generations." },
            { title: "Connection", desc: "Linking Ethiopian artists with a global audience that appreciates the depth of Orthodox sacred art." },
            { title: "Education", desc: "Sharing the theological and cultural context behind each masterpiece through storytelling." },
          ].map((item) => (
            <div key={item.title} className="parchment-card-dark rounded-lg p-6 text-center">
              <h3 className="font-serif text-lg text-orthodox-gold font-semibold mb-2">{item.title}</h3>
              <p className="font-sans text-white/50 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <CrossOrnament size={28} className="text-orthodox-gold/30 mx-auto mb-4" />
          <p className="font-sans text-white/30 text-xs italic">
            &ldquo;Art is the highest form of prayer.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
