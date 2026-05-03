import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Star, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Entreprises qui recrutent au Maroc",
  description:
    "Découvrez les meilleures entreprises qui recrutent au Maroc sur Khadma.ma.",
};

async function getCompanies() {
  try {
    return prisma.company.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: {
        _count: { select: { jobs: { where: { status: "PUBLISHED" } } } },
      },
    });
  } catch {
    return [];
  }
}

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Entreprises qui recrutent
          </h1>
          <p className="text-gray-500 mb-6">
            {companies.length} entreprise{companies.length > 1 ? "s" : ""} inscrite{companies.length > 1 ? "s" : ""}
          </p>
          <div className="max-w-md mx-auto">
            <Input placeholder="Rechercher une entreprise..." className="h-11" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {companies.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-200" />
            <p className="text-gray-500">Aucune entreprise pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {companies.map((company) => (
              <Link key={company.id} href={`/companies/${company.slug}`}>
                <Card className="card-hover border-gray-100 h-full group cursor-pointer">
                  <CardContent className="p-5">
                    {/* Cover */}
                    <div className="h-20 rounded-lg bg-gradient-to-br from-brand-50 to-brand-100 mb-4 flex items-center justify-center overflow-hidden">
                      {company.coverUrl ? (
                        <Image
                          src={company.coverUrl}
                          alt=""
                          width={300}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-brand-300" />
                      )}
                    </div>

                    {/* Logo */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl border border-gray-100 bg-white shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {company.logoUrl ? (
                          <Image
                            src={company.logoUrl}
                            alt={company.name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <span className="font-bold text-gray-400 text-lg">
                            {company.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                            {company.name}
                          </h3>
                          {company.isVerified && (
                            <Star className="h-3.5 w-3.5 text-brand-500 fill-brand-500 flex-shrink-0" />
                          )}
                        </div>
                        {company.industry && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {company.industry}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="space-y-1.5">
                      {company.city && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{company.city}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>
                          {company._count.jobs} offre{company._count.jobs > 1 ? "s" : ""} active{company._count.jobs > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {company.isFeatured && (
                      <Badge className="mt-3 text-xs" variant="info">
                        Partenaire Khadma
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
