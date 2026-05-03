import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Briefcase,
  Bookmark,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  User,
  FileText,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "En attente", color: "warning", icon: Clock },
  REVIEWED: { label: "Vu", color: "info", icon: CheckCircle },
  SHORTLISTED: { label: "Présélectionné", color: "success", icon: CheckCircle },
  REJECTED: { label: "Refusé", color: "destructive", icon: XCircle },
  HIRED: { label: "Embauché !", color: "success", icon: CheckCircle },
};

export default async function SeekerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const dbUser = await prisma.user.findUnique({
    where: { email: user?.email },
    include: {
      profile: true,
      applications: {
        take: 5,
        orderBy: { appliedAt: "desc" },
        include: { job: { include: { company: { select: { name: true } } } } },
      },
      savedJobs: { include: { job: { include: { company: true } } } },
    },
  });

  const profile = dbUser?.profile;
  const applications = dbUser?.applications || [];
  const savedJobs = dbUser?.savedJobs || [];

  // Profile completeness
  let profileScore = 0;
  if (profile?.firstName) profileScore += 20;
  if (profile?.bio) profileScore += 15;
  if (profile?.cvUrl) profileScore += 25;
  if (profile?.phone) profileScore += 10;
  if (profile?.city) profileScore += 10;
  if (profile?.linkedinUrl) profileScore += 10;
  if (profile?.expectedSalary) profileScore += 10;

  const stats = [
    { label: "Candidatures envoyées", value: applications.length, icon: Send, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "Offres sauvegardées", value: savedJobs.length, icon: Bookmark, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "En attente", value: applications.filter((a) => a.status === "PENDING").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Présélectionné(e)", value: applications.filter((a) => a.status === "SHORTLISTED").length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {profile?.firstName || user?.email?.split("@")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Voici un résumé de votre activité</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications */}
        <div className="lg:col-span-2">
          <Card className="border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Dernières candidatures</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/seeker/applications">Voir tout</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Send className="h-8 w-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Aucune candidature pour le moment</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href="/jobs">Explorer les offres</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => {
                    const config = statusConfig[app.status];
                    return (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {app.job.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {app.job.company.name} · {formatRelativeDate(app.appliedAt)}
                          </p>
                        </div>
                        <Badge variant={config.color as "warning" | "info" | "success" | "destructive"} className="ml-2 flex-shrink-0 text-xs">
                          {config.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Profile completeness */}
          <Card className="border-gray-100">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-brand-600" />
                <span className="font-semibold text-sm">Profil complété</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-gray-900">{profileScore}%</span>
                {profileScore === 100 && (
                  <Badge variant="success" className="text-xs">Complet !</Badge>
                )}
              </div>
              <Progress value={profileScore} className="h-2 mb-3" />
              {profileScore < 100 && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/seeker/profile">
                    <User className="h-4 w-4 mr-2" />
                    Compléter le profil
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* AI Score placeholder */}
          <Card className="border-brand-100 bg-gradient-to-br from-brand-50 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-brand-600" />
                <span className="font-semibold text-sm text-brand-800">Score IA</span>
                <Badge variant="secondary" className="text-xs">Bientôt</Badge>
              </div>
              <p className="text-xs text-brand-600">
                Notre IA analysera votre profil et vous proposera des offres parfaitement adaptées.
              </p>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-gray-100">
            <CardContent className="p-5 space-y-2">
              <p className="text-sm font-semibold text-gray-900 mb-3">Actions rapides</p>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/dashboard/seeker/profile#cv">
                  <FileText className="h-4 w-4 mr-2" />
                  Mettre à jour mon CV
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/jobs">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Explorer les offres
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
