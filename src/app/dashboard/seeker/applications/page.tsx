import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Send, Clock, CheckCircle, XCircle, Briefcase, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

const statusConfig: Record<string, { label: string; variant: "warning" | "info" | "success" | "destructive" | "secondary" }> = {
  PENDING: { label: "En attente", variant: "warning" },
  REVIEWED: { label: "Vu par l'employeur", variant: "info" },
  SHORTLISTED: { label: "Présélectionné(e)", variant: "success" },
  REJECTED: { label: "Non retenu(e)", variant: "destructive" },
  HIRED: { label: "Embauché(e) !", variant: "success" },
};

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const dbUser = await prisma.user.findUnique({ where: { email: user?.email } });
  const applications = await prisma.application.findMany({
    where: { userId: dbUser?.id },
    orderBy: { appliedAt: "desc" },
    include: {
      job: {
        include: {
          company: { select: { name: true, logoUrl: true } },
        },
      },
    },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes candidatures</h1>
        <p className="text-gray-500 mt-1">{applications.length} candidature{applications.length > 1 ? "s" : ""}</p>
      </div>

      {applications.length === 0 ? (
        <Card className="border-gray-100">
          <CardContent className="py-16 text-center">
            <Send className="h-12 w-12 mx-auto mb-4 text-gray-200" />
            <h3 className="font-semibold text-gray-700 mb-2">Aucune candidature</h3>
            <p className="text-gray-500 text-sm mb-4">Vous n&apos;avez pas encore postulé à une offre.</p>
            <Button asChild>
              <Link href="/jobs">Explorer les offres</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const config = statusConfig[app.status];
            return (
              <Card key={app.id} className="border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-gray-400 text-lg">
                        {app.job.company.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-gray-900">{app.job.title}</h3>
                          <p className="text-sm text-gray-500">{app.job.company.name}</p>
                        </div>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>Candidature du {formatDate(app.appliedAt)}</span>
                        {app.reviewedAt && (
                          <span>Vu le {formatDate(app.reviewedAt)}</span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/jobs/${app.job.slug}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
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
