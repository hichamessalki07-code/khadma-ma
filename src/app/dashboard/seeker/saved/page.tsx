import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/jobs/job-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bookmark } from "lucide-react";

export default async function SavedJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const dbUser = await prisma.user.findUnique({ where: { email: user?.email } });
  const savedJobs = dbUser
    ? await prisma.savedJob.findMany({
        where: { userId: dbUser.id },
        orderBy: { savedAt: "desc" },
        include: {
          job: { include: { company: { select: { name: true, logoUrl: true, isVerified: true } } } },
        },
      })
    : [];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Offres sauvegardées</h1>
        <p className="text-gray-500 mt-1">{savedJobs.length} offre{savedJobs.length > 1 ? "s" : ""}</p>
      </div>

      {savedJobs.length === 0 ? (
        <Card className="border-gray-100">
          <CardContent className="py-16 text-center">
            <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-200" />
            <h3 className="font-semibold text-gray-700 mb-2">Aucune offre sauvegardée</h3>
            <p className="text-gray-500 text-sm mb-4">Sauvegardez des offres pour les retrouver facilement.</p>
            <Button asChild><Link href="/jobs">Explorer les offres</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((s) => (
            <JobCard key={s.id} job={s.job} saved />
          ))}
        </div>
      )}
    </div>
  );
}
