"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Bookmark,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard/seeker", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/dashboard/seeker/profile", icon: User, label: "Mon profil" },
  { href: "/dashboard/seeker/applications", icon: FileText, label: "Mes candidatures" },
  { href: "/dashboard/seeker/saved", icon: Bookmark, label: "Offres sauvegardées" },
  { href: "/jobs", icon: Briefcase, label: "Chercher un emploi" },
  { href: "/dashboard/seeker/settings", icon: Settings, label: "Paramètres" },
];

export function SeekerSidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <span className="text-brand-600">Khadma.ma</span>
        </Link>
        <p className="text-xs text-gray-500 mt-1">Espace candidat</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-brand-50 text-brand-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
