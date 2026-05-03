import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate, CONTRACT_LABELS } from "@/lib/utils";

interface AdminJobsPageProps {
  searchParams: { status?: string };
}

const statusMap: Record<string, { label: string; variant: "warning" | "success" | "destructive" | "secondary" }> = {
  DRAFT: { label: "Brouillon", variant: "secondary" },
  PENDING_REVIEW: { label: "En attente", variant: "warning" },
  PUBLISHED: { label: "Publiée", variant: "success" },
  EXPIRED: { label: "Expirée", variant: "destructive" },
  REJECTED: { label: "Rejetée", variant: "destructive" },
};

export default async function AdminJobsPage({ searchParams }: AdminJobsPageProps) {
  const statusFilter = searchParams.status === "pending" ? "PENDING_REVIEW" : undefined;

  const jobs = await prisma.job.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: { company: { select: { name: true } } },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modération des offres</h1>
          <p className="text-gray-500 mt-1">{jobs.length} offre{jobs.length > 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <Button variant={!statusFilter ? "default" : "outline"} size="sm" asChild>
            <Link href="/dashboard/admin/jobs">Toutes</Link>
          </Button>
          <Button variant={statusFilter ? "default" : "outline"} size="sm" asChild>
            <Link href="/dashboard/admin/jobs?status=pending">En attente</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => {
          const s = statusMap[job.status];
          return (
            <Card key={job.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <Badge variant={s.variant} className="text-xs">{s.label}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {job.company.name} · {job.city} · {CONTRACT_LABELS[job.contractType]} · {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/admin/jobs/${job.id}`}>Modérer</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/jobs/${job.slug}`} target="_blank">Voir</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {jobs.length === 0 && (
          <p className="text-center text-gray-400 py-12">Aucune offre à afficher</p>
        )}
      </div>
    </div>
  );
}
