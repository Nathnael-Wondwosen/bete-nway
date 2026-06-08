"use client";
import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Collection { _id: string; name: string; slug: string; description?: string; featuredImage?: string; }

export default function AdminCollectionsPage() {
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", featuredImage: "" });

  const fetchItems = () => {
    setLoading(true);
    fetch("/api/collections").then(r => r.json()).then(d => { setItems(d.collections || []); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditId(null); setForm({ name: "", slug: "", description: "", featuredImage: "" }); setShowForm(true); };
  const openEdit = (c: Collection) => { setEditId(c._id); setForm({ name: c.name, slug: c.slug, description: c.description || "", featuredImage: c.featuredImage || "" }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const body = { ...form, slug };
    if (editId) {
      await fetch(`/api/collections/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/collections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setShowForm(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    await fetch(`/api/collections/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const inputClass = "w-full bg-luxury-dark border border-orthodox-gold/20 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-orthodox-gold/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-white font-bold">Collections</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-xs tracking-widest uppercase px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} /> Add Collection
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-luxury-card border border-orthodox-gold/20 rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-white font-semibold">{editId ? "Edit" : "New"} Collection</h3>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs text-white/50 font-sans uppercase tracking-wider mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Easter Exhibition 2026" className={inputClass} /></div>
              <div><label className="block text-xs text-white/50 font-sans uppercase tracking-wider mb-1">Slug</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" className={inputClass} /></div>
              <div><label className="block text-xs text-white/50 font-sans uppercase tracking-wider mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className={inputClass + " resize-none"} /></div>
              <div><label className="block text-xs text-white/50 font-sans uppercase tracking-wider mb-1">Featured Image URL</label>
                <input value={form.featuredImage} onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))} placeholder="https://..." className={inputClass} /></div>
              <button type="submit" className="w-full bg-orthodox-gold hover:bg-orthodox-gold-dark text-luxury-dark font-sans font-semibold text-sm py-2.5 rounded-lg transition-colors">
                {editId ? "Update" : "Create"} Collection
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-luxury-card h-14 rounded-lg animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 parchment-card-dark rounded-lg"><p className="text-white/30 font-serif text-lg">No collections yet</p></div>
      ) : (
        <div className="bg-luxury-card rounded-lg border border-orthodox-gold/10 overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead><tr className="border-b border-orthodox-gold/10 text-white/40 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left hidden sm:table-cell">Slug</th><th className="px-4 py-3 text-left hidden md:table-cell">Description</th><th className="px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody>{items.map(c => (
              <tr key={c._id} className="border-b border-orthodox-gold/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                <td className="px-4 py-3 text-white/40 hidden sm:table-cell">{c.slug}</td>
                <td className="px-4 py-3 text-white/40 hidden md:table-cell truncate max-w-[200px]">{c.description || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(c)} className="p-1.5 text-white/30 hover:text-blue-400 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(c._id)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors ml-1"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
