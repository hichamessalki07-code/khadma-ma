"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileCheck,
  BarChart3,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard/admin", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/dashboard/admin/jobs", icon: FileCheck, label: "Modération offres" },
  { href: "/dashboard/admin/users", icon: Users, label: "Utilisateurs" },
  { href: "/dashboard/admin/companies", icon: Building2, label: "Entreprises" },
  { href: "/dashboard/admin/analytics", icon: BarChart3, label: "Analytiques" },
  { href: "/dashboard/admin/settings", icon: Settings, label: "Paramètres" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  return (
    <aside className="w-64 bg-gray-950 text-gray-300 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-white">Admin</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Khadma.ma — Administration</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-brand-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
