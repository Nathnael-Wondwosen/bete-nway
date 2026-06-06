"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Image as ImageIcon, FolderOpen, Layers, Users, MessageSquare,
  FileText, LogOut, Menu, X,
} from "lucide-react";
import CrossOrnament from "@/components/CrossOrnament";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Artworks", href: "/admin/dashboard/artworks", icon: ImageIcon },
  { name: "Categories", href: "/admin/dashboard/categories", icon: FolderOpen },
  { name: "Collections", href: "/admin/dashboard/collections", icon: Layers },
  { name: "Artists", href: "/admin/dashboard/artists", icon: Users },
  { name: "Comments", href: "/admin/dashboard/comments", icon: MessageSquare },
  { name: "Homepage Content", href: "/admin/dashboard/content", icon: FileText },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => { if (d.admin) setAdminName(d.admin.fullName); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-luxury-dark flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-luxury-card border-r border-orthodox-gold/10 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-orthodox-gold/10">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <CrossOrnament size={24} className="text-orthodox-gold" />
            <span className="font-serif text-lg text-orthodox-gold font-bold tracking-wider">Bete Nway</span>
          </Link>
          <p className="text-[10px] font-sans text-white/30 uppercase tracking-widest mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-sans transition-all ${
                  isActive ? "bg-orthodox-gold/10 text-orthodox-gold" : "text-white/50 hover:text-white hover:bg-white/5"
                }`}>
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-orthodox-gold/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-orthodox-gold/20 flex items-center justify-center">
              <span className="text-orthodox-gold font-serif text-sm font-bold">{adminName.charAt(0)}</span>
            </div>
            <div>
              <p className="text-xs font-sans text-white/80">{adminName}</p>
              <p className="text-[10px] font-sans text-white/30">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-400/5 text-sm font-sans transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-luxury-dark/95 backdrop-blur-md border-b border-orthodox-gold/10 px-4 py-3 flex items-center gap-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/60 hover:text-orthodox-gold">
            <Menu size={22} />
          </button>
          <h2 className="font-serif text-lg text-white/80 font-semibold capitalize">
            {NAV_ITEMS.find((n) => pathname === n.href || (n.href !== "/admin/dashboard" && pathname.startsWith(n.href)))?.name || "Dashboard"}
          </h2>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
