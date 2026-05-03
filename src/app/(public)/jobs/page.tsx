import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/jobs/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { SearchBar } from "@/components/jobs/search-bar";
import { Button } from "@/components/ui/button";
import { Briefcase, SlidersHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Offres d'emploi au Maroc",
  description:
    "Parcourez des milliers d'offres d'emploi au Maroc. CDI, CDD, Stage, Freelance dans toutes les villes.",
};

interface JobsPageProps {
  searchParams: {
    q?: string;
    city?: string;
    category?: string;
    contract?: string;
    remote?: string;
    page?: string;
  };
}

const PAGE_SIZE = 12;

async function getJobs(searchParams: JobsPageProps["searchParams"]) {
  const page = parseInt(searchParams.page || "1");
  const skip = (page - 1) * PAGE_SIZE;

  const where: Record<string, unknown> = { status: "PUBLISHED" };

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
      { company: { name: { contains: searchParams.q, mode: "insensitive" } } },
    ];
  }
  if (searchParams.city) where.city = searchParams.city;
  if (searchParams.category) where.category = searchParams.category;
  if (searchParams.contract) where.contractType = searchParams.contract;
  if (searchParams.remote) where.workMode = searchParams.remote;

  try {
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
        include: {
          company: { select: { name: true, logoUrl: true, isVerified: true } },
        },
      }),
      prisma.job.count({ where }),
    ]);
    return { jobs, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
  } catch {
    return { jobs: [], total: 0, page: 1, totalPages: 0 };
  }
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const { jobs, total, page, totalPages } = await getJobs(searchParams);
  const hasFilters = Object.values(searchParams).some(Boolean);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {searchParams.q
                ? `Résultats pour "${searchParams.q}"`
                : "Toutes les offres d'emploi"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {total.toLocaleString()} offre{total > 1 ? "s" : ""} trouvée{total > 1 ? "s" : ""}
            </p>
          </div>
          <Suspense>
            <SearchBar compact className="max-w-2xl" />
          </Suspense>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
              <Suspense>
                <JobFilters />
              </Suspense>
            </div>
          </aside>

          {/* Jobs Grid */}
          <div className="flex-1 min-w-0">
            {jobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-200" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Aucune offre trouvée
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Essayez d&apos;autres filtres ou revenez plus tard.
                </p>
                <Button variant="outline" asChild>
                  <a href="/jobs">Effacer les filtres</a>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {page > 1 && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`/jobs?${new URLSearchParams({
                            ...searchParams,
                            page: String(page - 1),
                          })}`}
                        >
                          Précédent
                        </a>
                      </Button>
                    )}
                    <span className="text-sm text-gray-500 px-4">
                      Page {page} sur {totalPages}
                    </span>
                    {page < totalPages && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`/jobs?${new URLSearchParams({
                            ...searchParams,
                            page: String(page + 1),
                          })}`}
                        >
                          Suivant
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
