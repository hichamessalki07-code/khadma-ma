import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Download, FileText, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

const statusMap: Record<string, { label: string; variant: "warning" | "info" | "success" | "destructive" | "secondary" }> = {
  PENDING: { label: "Nouveau", variant: "warning" },
  REVIEWED: { label: "Vu", variant: "info" },
  SHORTLISTED: { label: "Présélectionné", variant: "success" },
  REJECTED: { label: "Refusé", variant: "destructive" },
  HIRED: { label: "Embauché", variant: "success" },
};

export default async function EmployerApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const dbUser = await prisma.user.findUnique({ where: { email: user?.email } });
  const company = dbUser ? await prisma.company.findUnique({ where: { userId: dbUser.id } }) : null;

  const applications = company
    ? await prisma.application.findMany({
        where: { job: { companyId: company.id } },
        orderBy: { appliedAt: "desc" },
        include: {
          job: { select: { title: true, slug: true } },
          user: {
            include: {
              profile: { select: { firstName: true, lastName: true, phone: true, city: true, cvUrl: true, cvFileName: true } },
            },
          },
        },
      })
    : [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Candidatures reçues</h1>
        <p className="text-gray-500 mt-1">{applications.length} candidature{applications.length > 1 ? "s" : ""}</p>
      </div>

      {applications.length === 0 ? (
        <Card className="border-gray-100">
          <CardContent className="py-16 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-200" />
            <p className="text-gray-500">Aucune candidature reçue pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const profile = app.user.profile;
            const fullName = profile
              ? `${profile.firstName} ${profile.lastName}`
              : app.user.email;
            const s = statusMap[app.status];
            return (
              <Card key={app.id} className="border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-brand-700">
                          {fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{fullName}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span>Pour : {app.job.title}</span>
                          {profile?.city && <><span>·</span><span>{profile.city}</span></>}
                          <span>·</span>
                          <span>{formatDate(app.appliedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={s.variant} className="text-xs">{s.label}</Badge>
                      {profile?.cvUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            CV
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/employer/applications/${app.id}`}>
                          Voir <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {app.coverLetter && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 line-clamp-2">
                      {app.coverLetter}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
