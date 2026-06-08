"use client";
import React, { useState, useEffect } from "react";
import ArtworkForm from "@/components/admin/ArtworkForm";

export default function EditArtworkClient({ id }: { id: string }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/artworks/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.artwork) {
          const a = d.artwork;
          setData({
            ...a,
            categoryId: a.categoryId?._id || a.categoryId || "",
            artistId: a.artistId?._id || a.artistId || "",
            collections: (a.collections || []).map((c: { _id?: string }) => c._id || c),
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-20 text-center"><p className="text-white/40 font-sans animate-pulse">Loading artwork...</p></div>;
  if (!data) return <div className="py-20 text-center"><p className="text-white/40 font-sans">Artwork not found</p></div>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-white font-bold mb-6">Edit Artwork</h1>
      <ArtworkForm initialData={data} artworkId={id} />
    </div>
  );
}
