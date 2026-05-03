import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JobCard } from "@/components/jobs/job-card";
import { MapPin, Globe, Users, Star, Briefcase, ArrowLeft } from "lucide-react";

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

async function getCompany(slug: string) {
  return prisma.company.findUnique({
    where: { slug },
    include: {
      jobs: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: {
          company: { select: { name: true, logoUrl: true, isVerified: true } },
        },
      },
    },
  });
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) return { title: "Entreprise introuvable" };
  return {
    title: `${company.name} – Offres d'emploi`,
    description: company.description?.slice(0, 160),
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover */}
      <div className="h-48 bg-gradient-to-br from-brand-600 to-brand-800 relative overflow-hidden">
        {company.coverUrl && (
          <Image src={company.coverUrl} alt="" fill className="object-cover opacity-30" />
        )}
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10" asChild>
            <Link href="/companies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Toutes les entreprises
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="border-gray-100 sticky top-24">
              <CardContent className="p-6">
                {/* Logo */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="h-20 w-20 rounded-2xl border border-gray-200 bg-white shadow-md flex items-center justify-center overflow-hidden -mt-14 mb-3">
                    {company.logoUrl ? (
                      <Image src={company.logoUrl} alt={company.name} width={80} height={80} className="object-contain" />
                    ) : (
                      <span className="text-3xl font-bold text-gray-300">{company.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
                    {company.isVerified && <Star className="h-5 w-5 text-brand-500 fill-brand-500" />}
                  </div>
                  {company.industry && <p className="text-sm text-gray-500 mt-1">{company.industry}</p>}
                </div>

                <Separator className="mb-4" />

                <div className="space-y-3 text-sm">
                  {company.city && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{company.city}</span>
                    </div>
                  )}
                  {company.size && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{company.size}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:underline truncate"
                      >
                        {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span>{company.jobs.length} offre{company.jobs.length > 1 ? "s" : ""} active{company.jobs.length > 1 ? "s" : ""}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {company.description && (
              <Card className="border-gray-100">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">À propos</h2>
                  <p className="text-gray-600 leading-relaxed text-sm">{company.description}</p>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Offres disponibles ({company.jobs.length})
              </h2>
              {company.jobs.length === 0 ? (
                <Card className="border-gray-100">
                  <CardContent className="py-12 text-center text-gray-400">
                    <Briefcase className="h-8 w-8 mx-auto mb-3 opacity-30" />
                    <p>Aucune offre disponible pour le moment</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {company.jobs.map((job) => (
                    <JobCard key={job.id} job={job} compact />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
