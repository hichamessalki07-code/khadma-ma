import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Briefcase, Users, Eye, TrendingUp, PlusCircle, Clock } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

export default async function EmployerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const dbUser = await prisma.user.findUnique({ where: { email: user?.email } });
  const company = dbUser
    ? await prisma.company.findUnique({
        where: { userId: dbUser.id },
        include: {
          jobs: {
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { applications: true } } },
          },
          _count: {
            select: {
              jobs: { where: { status: "PUBLISHED" } },
            },
          },
        },
      })
    : null;

  const totalApplications = company
    ? await prisma.application.count({
        where: { job: { companyId: company.id } },
      })
    : 0;

  const totalViews = company
    ? await prisma.job.aggregate({
        where: { companyId: company.id },
        _sum: { viewCount: true },
      })
    : { _sum: { viewCount: 0 } };

  const stats = [
    { label: "Offres publiées", value: company?._count.jobs || 0, icon: Briefcase, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "Candidatures reçues", value: totalApplications, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Vues totales", value: totalViews._sum.viewCount || 0, icon: Eye, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Offres en attente", value: company?.jobs.filter((j) => j.status === "PENDING_REVIEW").length || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  if (!company) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center mt-16">
        <div className="h-16 w-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <Briefcase className="h-8 w-8 text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Configurez votre entreprise
        </h1>
        <p className="text-gray-500 mb-6">
          Créez le profil de votre entreprise pour commencer à publier des offres d&apos;emploi.
        </p>
        <Button size="lg" asChild>
          <Link href="/dashboard/employer/company">
            <PlusCircle className="h-5 w-5 mr-2" />
            Créer le profil entreprise
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
          <p className="text-gray-500 mt-1">Bienvenue dans votre espace recruteur</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/employer/jobs/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle offre
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-gray-100">
            <CardContent className="p-5">
              <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent jobs */}
      <Card className="border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Dernières offres</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/employer/jobs">Voir tout</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {company.jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm mb-3">Aucune offre publiée</p>
              <Button size="sm" asChild>
                <Link href="/dashboard/employer/jobs/new">Publier une offre</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {company.jobs.map((job) => {
                const statusMap: Record<string, { label: string; variant: "warning" | "success" | "destructive" | "secondary" }> = {
                  DRAFT: { label: "Brouillon", variant: "secondary" },
                  PENDING_REVIEW: { label: "En attente", variant: "warning" },
                  PUBLISHED: { label: "Publiée", variant: "success" },
                  EXPIRED: { label: "Expirée", variant: "destructive" },
                  REJECTED: { label: "Rejetée", variant: "destructive" },
                };
                const s = statusMap[job.status];
                return (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{job.title}</p>
                      <p className="text-xs text-gray-500">
                        {job._count.applications} candidature{job._count.applications > 1 ? "s" : ""} · {formatRelativeDate(job.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Badge variant={s.variant} className="text-xs">{s.label}</Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/employer/jobs/${job.id}`}>Gérer</Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
