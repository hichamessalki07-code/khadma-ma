import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, Building2, Briefcase, Send, Eye, TrendingUp,
} from "lucide-react";

export default async function AdminAnalyticsPage() {
  const [
    totalUsers, seekers, employers,
    totalCompanies, verifiedCompanies,
    totalJobs, publishedJobs, pendingJobs,
    totalApplications, totalViews,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "SEEKER" } }),
    prisma.user.count({ where: { role: "EMPLOYER" } }),
    prisma.company.count(),
    prisma.company.count({ where: { isVerified: true } }),
    prisma.job.count(),
    prisma.job.count({ where: { status: "PUBLISHED" } }),
    prisma.job.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.application.count(),
    prisma.job.aggregate({ _sum: { viewCount: true } }),
  ]);

  const groups = [
    {
      title: "Utilisateurs",
      icon: Users,
      color: "text-brand-600",
      bg: "bg-brand-50",
      stats: [
        { label: "Total", value: totalUsers },
        { label: "Candidats", value: seekers },
        { label: "Recruteurs", value: employers },
      ],
    },
    {
      title: "Entreprises",
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-50",
      stats: [
        { label: "Total", value: totalCompanies },
        { label: "Vérifiées", value: verifiedCompanies },
        { label: "Non vérifiées", value: totalCompanies - verifiedCompanies },
      ],
    },
    {
      title: "Offres",
      icon: Briefcase,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      stats: [
        { label: "Total", value: totalJobs },
        { label: "Publiées", value: publishedJobs },
        { label: "En attente", value: pendingJobs },
      ],
    },
    {
      title: "Activité",
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
      stats: [
        { label: "Candidatures", value: totalApplications },
        { label: "Vues totales", value: totalViews._sum.viewCount || 0 },
        { label: "Moy. vues/offre", value: publishedJobs > 0 ? Math.round((totalViews._sum.viewCount || 0) / publishedJobs) : 0 },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytiques</h1>
        <p className="text-gray-500 mt-1">Vue d&apos;ensemble des performances de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map(({ title, icon: Icon, color, bg, stats }) => (
          <Card key={title} className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {stats.map(({ label, value }) => (
                  <div key={label} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
