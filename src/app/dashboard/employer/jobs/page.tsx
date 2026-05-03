import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, PlusCircle, Edit, Trash2, Eye, Users } from "lucide-react";
import { formatRelativeDate, CONTRACT_LABELS } from "@/lib/utils";

const statusMap: Record<string, { label: string; variant: "warning" | "success" | "destructive" | "secondary" }> = {
  DRAFT: { label: "Brouillon", variant: "secondary" },
  PENDING_REVIEW: { label: "En attente", variant: "warning" },
  PUBLISHED: { label: "Publiée", variant: "success" },
  EXPIRED: { label: "Expirée", variant: "destructive" },
  REJECTED: { label: "Rejetée", variant: "destructive" },
};

export default async function EmployerJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const dbUser = await prisma.user.findUnique({ where: { email: user?.email } });
  const company = dbUser ? await prisma.company.findUnique({ where: { userId: dbUser.id } }) : null;

  const jobs = company
    ? await prisma.job.findMany({
        where: { companyId: company.id },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { applications: true } } },
      })
    : [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes offres d&apos;emploi</h1>
          <p className="text-gray-500 mt-1">{jobs.length} offre{jobs.length > 1 ? "s" : ""}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/employer/jobs/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle offre
          </Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="border-gray-100">
          <CardContent className="py-16 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-200" />
            <h3 className="font-semibold text-gray-700 mb-2">Aucune offre publiée</h3>
            <p className="text-gray-500 text-sm mb-4">Commencez par publier votre première offre d&apos;emploi.</p>
            <Button asChild>
              <Link href="/dashboard/employer/jobs/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Publier une offre
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const s = statusMap[job.status];
            return (
              <Card key={job.id} className="border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <Badge variant={s.variant} className="text-xs">{s.label}</Badge>
                        {job.isFeatured && <Badge variant="info" className="text-xs">En vedette</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{job.city}</span>
                        <span>·</span>
                        <span>{CONTRACT_LABELS[job.contractType]}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {job._count.applications} candidature{job._count.applications > 1 ? "s" : ""}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {job.viewCount} vues
                        </span>
                        <span>·</span>
                        <span>{formatRelativeDate(job.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/employer/jobs/${job.id}`}>
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Modifier
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/jobs/${job.slug}`} target="_blank">
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
