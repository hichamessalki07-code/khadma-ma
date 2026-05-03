import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { CONTRACT_LABELS, WORK_MODE_LABELS, formatDate, formatSalary } from "@/lib/utils";
import { AdminJobActions } from "@/components/dashboard/admin-job-actions";

interface AdminJobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminJobDetailPage({ params }: AdminJobDetailPageProps) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!job) notFound();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/dashboard/admin/jobs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Link>
      </Button>

      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <p className="text-gray-500 text-sm mt-1">{job.company.name}</p>
            </div>
            <Badge variant={job.status === "PENDING_REVIEW" ? "warning" : job.status === "PUBLISHED" ? "success" : "destructive"}>
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Ville", value: job.city },
              { label: "Contrat", value: CONTRACT_LABELS[job.contractType] },
              { label: "Mode", value: WORK_MODE_LABELS[job.workMode] },
              { label: "Catégorie", value: job.category },
              { label: "Salaire", value: formatSalary(job.salaryMin, job.salaryMax) },
              { label: "Créée le", value: formatDate(job.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.description}</p>
          </div>

          {job.requirements && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Profil recherché</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          )}

          <Separator />

          <AdminJobActions jobId={job.id} currentStatus={job.status} />
        </CardContent>
      </Card>
    </div>
  );
}
