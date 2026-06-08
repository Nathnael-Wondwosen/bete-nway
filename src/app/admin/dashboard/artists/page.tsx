"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Artist { _id: string; fullName: string; biography: string; photo: string; socialLinks?: { telegram?: string; facebook?: string; instagram?: string; twitter?: string; }; }

export default function AdminArtistsPage() {
  const [items, setItems] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", biography: "", photo: "", telegram: "", facebook: "", instagram: "", twitter: "" });

  const fetchItems = () => {
    setLoading(true);
    fetch("/api/artists").then(r => r.json()).then(d => { setItems(d.artists || []); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditId(null); setForm({ fullName: "", biography: "", photo: "", telegram: "", facebook: "", instagram: "", twitter: "" }); setShowForm(true); };
  const openEdit = (a: Artist) => {
    setEditId(a._id);
    setForm({ fullName: a.fullName, biography: a.biography, photo: a.photo, telegram: a.socialLinks?.telegram || "", facebook: a.socialLinks?.facebook || "", instagram: a.socialLinks?.instagram || "", twitter: a.socialLinks?.twitter || "" });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { fullName: form.fullName, biography: form.biography, photo: form.photo, socialLinks: { telegram: form.telegram, facebook: form.facebook, instagram: form.instagram, twitter: form.twitter } };
    if (editId) {
      await fetch(`/api/artists/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/artists", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setShowForm(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this artist?")) return;
    await fetch(`/api/artists/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const inputClass = "w-full bg-luxury-dark border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-orthodox-gold/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-white font-bold">Artists</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-xs tracking-widest uppercase px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} /> Add Artist
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-luxury-card border border-orthodox-gold/20 rounded-lg p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-white font-semibold">{editId ? "Edit" : "New"} Artist</h3>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs text-white/50 font-sans uppercase tracking-wider mb-1">Full Name *</label>
                <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required className={inputClass} /></div>
              <div><label className="block text-xs text-white/50 font-sans uppercase tracking-wider mb-1">Biography *</label>
                <textarea value={form.biography} onChange={e => setForm(f => ({ ...f, biography: e.target.value }))} required rows={3} className={inputClass + " resize-none"} /></div>
              <div><label className="block text-xs text-white/50 font-sans uppercase tracking-wider mb-1">Photo URL *</label>
                <input value={form.photo} onChange={e => setForm(f => ({ ...f, photo: e.target.value }))} required placeholder="https://..." className={inputClass} /></div>
              <p className="text-xs text-white/30 font-sans uppercase tracking-wider pt-2">Social Links</p>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.telegram} onChange={e => setForm(f => ({ ...f, telegram: e.target.value }))} placeholder="Telegram URL" className={inputClass} />
                <input value={form.facebook} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))} placeholder="Facebook URL" className={inputClass} />
                <input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="Instagram URL" className={inputClass} />
                <input value={form.twitter} onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))} placeholder="X (Twitter) URL" className={inputClass} />
              </div>
              <button type="submit" className="w-full bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-sm py-2.5 rounded-lg transition-colors">
                {editId ? "Update" : "Create"} Artist
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-luxury-card h-32 rounded-lg animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 parchment-card-dark rounded-lg"><p className="text-white/30 font-serif text-lg">No artists yet</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(a => (
            <div key={a._id} className="bg-luxury-card border border-orthodox-gold/10 rounded-lg p-5 hover:border-orthodox-gold/25 transition-colors">
              <div className="flex items-start gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-orthodox-gold/20">
                  <Image src={a.photo} alt={a.fullName} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-base text-white font-semibold">{a.fullName}</h3>
                  <p className="font-sans text-xs text-white/40 mt-1 line-clamp-2">{a.biography}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 border-t border-orthodox-gold/5 pt-3">
                <button onClick={() => openEdit(a)} className="p-1.5 text-white/30 hover:text-blue-400 transition-colors"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(a._id)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
