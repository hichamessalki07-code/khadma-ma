import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, Building2, Briefcase, FileCheck, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalCompanies,
    totalJobs,
    pendingJobs,
    totalApplications,
    recentJobs,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.job.count(),
    prisma.job.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.application.count(),
    prisma.job.findMany({
      where: { status: "PENDING_REVIEW" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { company: { select: { name: true } } },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = [
    { label: "Utilisateurs", value: totalUsers, icon: Users, color: "text-brand-600", bg: "bg-brand-50", href: "/dashboard/admin/users" },
    { label: "Entreprises", value: totalCompanies, icon: Building2, color: "text-purple-600", bg: "bg-purple-50", href: "/dashboard/admin/companies" },
    { label: "Offres totales", value: totalJobs, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50", href: "/dashboard/admin/jobs" },
    { label: "En attente", value: pendingJobs, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", href: "/dashboard/admin/jobs?status=pending" },
    { label: "Candidatures", value: totalApplications, icon: FileCheck, color: "text-pink-600", bg: "bg-pink-50", href: "/dashboard/admin/analytics" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-500 mt-1">Vue d&apos;ensemble de la plateforme Khadma.ma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href}>
            <Card className="border-gray-200 card-hover cursor-pointer">
              <CardContent className="p-4">
                <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center mb-2`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Alert pending jobs */}
      {pendingJobs > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-800">
              {pendingJobs} offre{pendingJobs > 1 ? "s" : ""} en attente de modération
            </p>
          </div>
          <Button size="sm" variant="outline" className="border-amber-300 text-amber-700" asChild>
            <Link href="/dashboard/admin/jobs?status=pending">Modérer</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Jobs */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Offres à modérer</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/admin/jobs">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentJobs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                Aucune offre en attente
              </p>
            ) : (
              <div className="space-y-2">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.company.name} · {formatRelativeDate(job.createdAt)}</p>
                    </div>
                    <div className="flex gap-1.5 ml-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs text-green-700 border-green-300 hover:bg-green-50" asChild>
                        <Link href={`/dashboard/admin/jobs/${job.id}`}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Revoir
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Nouveaux utilisateurs</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/admin/users">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand-700">
                        {u.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[160px]">{u.email}</p>
                      <p className="text-xs text-gray-400">{formatRelativeDate(u.createdAt)}</p>
                    </div>
                  </div>
                  <Badge variant={u.role === "EMPLOYER" ? "info" : "secondary"} className="text-xs">
                    {u.role === "EMPLOYER" ? "Recruteur" : u.role === "ADMIN" ? "Admin" : "Candidat"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
