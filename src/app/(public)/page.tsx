import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/jobs/search-bar";
import { JobCard } from "@/components/jobs/job-card";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Zap,
  Globe,
} from "lucide-react";
import { JOB_CATEGORIES } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Khadma.ma – Offres d'emploi au Maroc",
  description:
    "Trouvez votre emploi idéal au Maroc. Des milliers d'offres CDI, CDD, Stage et Freelance.",
};

async function getHomeData() {
  try {
    const [featuredJobs, totalJobs, totalCompanies, totalApplications] =
      await Promise.all([
        prisma.job.findMany({
          where: { status: "PUBLISHED" },
          take: 6,
          orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
          include: { company: { select: { name: true, logoUrl: true, isVerified: true } } },
        }),
        prisma.job.count({ where: { status: "PUBLISHED" } }),
        prisma.company.count({ where: { isVerified: true } }),
        prisma.application.count(),
      ]);
    return { featuredJobs, totalJobs, totalCompanies, totalApplications };
  } catch {
    return {
      featuredJobs: [],
      totalJobs: 0,
      totalCompanies: 0,
      totalApplications: 0,
    };
  }
}

const stats = [
  { icon: Briefcase, label: "Offres actives", value: "2 500+", color: "text-brand-600" },
  { icon: Building2, label: "Entreprises", value: "850+", color: "text-emerald-600" },
  { icon: Users, label: "Candidats inscrits", value: "18 000+", color: "text-purple-600" },
  { icon: TrendingUp, label: "Embauches réussies", value: "4 200+", color: "text-amber-600" },
];

const features = [
  {
    icon: Zap,
    title: "Candidature rapide",
    desc: "Postulez en un clic avec votre profil Khadma.ma ou via WhatsApp.",
  },
  {
    icon: Star,
    title: "Offres vérifiées",
    desc: "Toutes les offres sont modérées par notre équipe pour garantir leur qualité.",
  },
  {
    icon: Globe,
    title: "Tout le Maroc",
    desc: "Des offres dans toutes les villes : Casablanca, Rabat, Marrakech et plus.",
  },
  {
    icon: CheckCircle,
    title: "Suivi en temps réel",
    desc: "Suivez l'état de vos candidatures directement depuis votre tableau de bord.",
  },
];

export default async function HomePage() {
  const { featuredJobs, totalJobs, totalCompanies } = await getHomeData();

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm px-4 py-1.5">
              🇲🇦 &nbsp; La plateforme #1 de l&apos;emploi au Maroc
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Trouvez votre{" "}
              <span className="text-blue-200">emploi idéal</span>
              <br />
              au Maroc
            </h1>

            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Des milliers d&apos;offres CDI, CDD, Stage et Freelance dans toutes
              les villes marocaines. Connectez-vous aux meilleures entreprises.
            </p>

            <SearchBar className="max-w-4xl mx-auto" />

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm text-blue-200">
              <span>Recherches populaires :</span>
              {["Développeur", "Commercial", "Comptable", "Stage", "Télétravail"].map(
                (term) => (
                  <Link
                    key={term}
                    href={`/jobs?q=${term}`}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full px-3 py-1 transition-colors"
                  >
                    {term}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {stats.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex flex-col items-center py-8 px-4 text-center">
                <Icon className={`h-6 w-6 mb-2 ${color}`} />
                <div className="text-3xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED JOBS ===== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Offres à la une
              </h2>
              <p className="text-gray-500 mt-1">
                {totalJobs.toLocaleString()} offres disponibles
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/jobs">
                Voir toutes les offres
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Les offres apparaîtront ici une fois la base de données configurée.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Explorer par secteur
            </h2>
            <p className="text-gray-500">
              Trouvez des offres dans votre domaine d&apos;expertise
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {JOB_CATEGORIES.slice(0, 7).map((cat) => (
              <Link key={cat} href={`/jobs?category=${encodeURIComponent(cat)}`}>
                <Card className="card-hover text-center cursor-pointer border-gray-100 hover:border-brand-200 hover:bg-brand-50 group">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-brand-700 transition-colors">
                      {cat}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pourquoi choisir Khadma.ma ?
            </h2>
            <p className="text-gray-500">Tout ce dont vous avez besoin pour trouver un emploi</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-gray-100 card-hover">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA EMPLOYERS ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl gradient-hero p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Vous recrutez ?
              </h2>
              <p className="text-blue-100 max-w-lg">
                Publiez vos offres et accédez à des milliers de candidats qualifiés au Maroc. Premier mois offert.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Button size="lg" variant="outline" className="bg-white text-brand-700 border-white hover:bg-blue-50" asChild>
                <Link href="/pricing">Voir les tarifs</Link>
              </Button>
              <Button size="lg" className="bg-blue-500 hover:bg-blue-400 text-white" asChild>
                <Link href="/auth/register?role=employer">
                  Publier une offre gratuite
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
