import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  Briefcase,
  Building2,
  DollarSign,
  Star,
  Share2,
  Bookmark,
  ExternalLink,
  CheckCircle,
  ArrowLeft,
  Wifi,
  MessageCircle,
} from "lucide-react";
import {
  CONTRACT_LABELS,
  WORK_MODE_LABELS,
  EXPERIENCE_LABELS,
  formatRelativeDate,
  formatSalary,
} from "@/lib/utils";
import { JobCard } from "@/components/jobs/job-card";

interface JobDetailPageProps {
  params: { slug: string };
}

async function getJob(slug: string) {
  const job = await prisma.job.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      company: true,
    },
  });
  return job;
}

async function getSimilarJobs(job: NonNullable<Awaited<ReturnType<typeof getJob>>>) {
  return prisma.job.findMany({
    where: {
      status: "PUBLISHED",
      category: job.category,
      id: { not: job.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: {
      company: { select: { name: true, logoUrl: true, isVerified: true } },
    },
  });
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = await getJob(params.slug);
  if (!job) return { title: "Offre introuvable" };
  return {
    title: `${job.title} – ${job.company.name}`,
    description: job.description.slice(0, 160),
    openGraph: {
      title: `${job.title} – ${job.company.name} | Khadma.ma`,
      description: job.description.slice(0, 160),
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const job = await getJob(params.slug);
  if (!job) notFound();

  const similarJobs = await getSimilarJobs(job);

  // Increment view count
  await prisma.job.update({
    where: { id: job.id },
    data: { viewCount: { increment: 1 } },
  });

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back */}
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/jobs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux offres
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-16 w-16 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {job.company.logoUrl ? (
                      <Image
                        src={job.company.logoUrl}
                        alt={job.company.name}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        {job.company.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {job.title}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                          <Link
                            href={`/companies/${job.company.slug}`}
                            className="text-brand-600 hover:underline font-medium"
                          >
                            {job.company.name}
                          </Link>
                          {job.company.isVerified && (
                            <Star className="h-4 w-4 text-brand-500 fill-brand-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meta badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="info">
                    <MapPin className="h-3 w-3 mr-1" />
                    {job.city}
                  </Badge>
                  <Badge variant="success">
                    {CONTRACT_LABELS[job.contractType]}
                  </Badge>
                  <Badge variant="secondary">
                    <Wifi className="h-3 w-3 mr-1" />
                    {WORK_MODE_LABELS[job.workMode]}
                  </Badge>
                  {salary !== "Salaire non précisé" && (
                    <Badge variant="warning">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {salary}
                    </Badge>
                  )}
                  {job.isUrgent && (
                    <Badge variant="destructive">Urgent</Badge>
                  )}
                  {job.isFeatured && (
                    <Badge>
                      <Star className="h-3 w-3 mr-1" />
                      En vedette
                    </Badge>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Publiée {formatRelativeDate(job.publishedAt || job.createdAt)}
                  </span>
                  <span>{job.viewCount} vues</span>
                  <span>{EXPERIENCE_LABELS[job.experienceLevel]}</span>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Description du poste
                </h2>
                <div
                  className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, "<br/>") }}
                />
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card className="border-gray-100">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Profil recherché
                  </h2>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                    {job.requirements}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && (
              <Card className="border-gray-100">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Avantages
                  </h2>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                    {job.benefits}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.skills.length > 0 && (
              <Card className="border-gray-100">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Compétences requises
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                        <CheckCircle className="h-3 w-3 mr-1 text-brand-500" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Offres similaires
                </h2>
                <div className="space-y-3">
                  {similarJobs.map((j) => (
                    <JobCard key={j.id} job={j} compact />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply card */}
            <Card className="border-brand-100 bg-gradient-to-br from-brand-50 to-white sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-500 mb-1">Salaire</div>
                  <div className="text-xl font-bold text-gray-900">
                    {salary}
                  </div>
                  <div className="text-xs text-gray-400">par mois</div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/jobs/${job.slug}/apply`}>
                      <Briefcase className="h-5 w-5 mr-2" />
                      Postuler maintenant
                    </Link>
                  </Button>

                  {job.whatsappApply && (
                    <Button
                      variant="outline"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50"
                      size="lg"
                      asChild
                    >
                      <a
                        href={`https://wa.me/${job.whatsappApply.replace(/\D/g, "")}?text=Bonjour, je suis intéressé(e) par le poste de ${job.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Postuler via WhatsApp
                      </a>
                    </Button>
                  )}

                  {job.applyUrl && (
                    <Button variant="outline" className="w-full" size="lg" asChild>
                      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Site de l&apos;entreprise
                      </a>
                    </Button>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  {[
                    { label: "Type de contrat", value: CONTRACT_LABELS[job.contractType] },
                    { label: "Lieu", value: job.city },
                    { label: "Mode", value: WORK_MODE_LABELS[job.workMode] },
                    { label: "Expérience", value: EXPERIENCE_LABELS[job.experienceLevel] },
                    { label: "Catégorie", value: job.category },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company card */}
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  À propos de l&apos;entreprise
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center">
                    {job.company.logoUrl ? (
                      <Image src={job.company.logoUrl} alt={job.company.name} width={48} height={48} className="object-contain" />
                    ) : (
                      <span className="font-bold text-gray-400">{job.company.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{job.company.name}</p>
                    {job.company.industry && (
                      <p className="text-xs text-gray-500">{job.company.industry}</p>
                    )}
                  </div>
                </div>
                {job.company.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {job.company.description}
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/companies/${job.company.slug}`}>
                    <Building2 className="h-4 w-4 mr-2" />
                    Voir le profil entreprise
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
