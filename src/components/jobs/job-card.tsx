import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Bookmark,
  BookmarkCheck,
  Zap,
  Star,
  Wifi,
} from "lucide-react";
import {
  CONTRACT_LABELS,
  WORK_MODE_LABELS,
  formatRelativeDate,
  formatSalary,
  cn,
} from "@/lib/utils";

interface JobCardProps {
  job: {
    id: string;
    slug: string;
    title: string;
    city: string;
    contractType: string;
    workMode: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    isFeatured?: boolean;
    isUrgent?: boolean;
    publishedAt?: Date | string | null;
    createdAt: Date | string;
    company: {
      name: string;
      logoUrl?: string | null;
      isVerified?: boolean;
    };
  };
  saved?: boolean;
  onSave?: (jobId: string) => void;
  compact?: boolean;
}

export function JobCard({ job, saved, onSave, compact }: JobCardProps) {
  const contractLabel = CONTRACT_LABELS[job.contractType] || job.contractType;
  const workModeLabel = WORK_MODE_LABELS[job.workMode] || job.workMode;
  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const date = formatRelativeDate(job.publishedAt || job.createdAt);

  const contractColors: Record<string, string> = {
    CDI: "bg-green-50 text-green-700 border-green-200",
    CDD: "bg-orange-50 text-orange-700 border-orange-200",
    STAGE: "bg-purple-50 text-purple-700 border-purple-200",
    FREELANCE: "bg-blue-50 text-blue-700 border-blue-200",
    ALTERNANCE: "bg-pink-50 text-pink-700 border-pink-200",
    INTERIM: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <Card
      className={cn(
        "group relative card-hover border border-gray-100",
        job.isFeatured && "ring-2 ring-brand-200 border-brand-100"
      )}
    >
      {job.isFeatured && (
        <div className="absolute -top-px left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
      )}
      <CardContent className={cn("p-5", compact && "p-4")}>
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
              {job.company.logoUrl ? (
                <Image
                  src={job.company.logoUrl}
                  alt={job.company.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <span className="text-lg font-bold text-gray-400">
                  {job.company.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <Link href={`/jobs/${job.slug}`} className="group">
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1 text-base">
                    {job.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm text-gray-500">{job.company.name}</span>
                  {job.company.isVerified && (
                    <Star className="h-3.5 w-3.5 text-brand-500 fill-brand-500" />
                  )}
                </div>
              </div>

              {/* Save button */}
              {onSave && (
                <button
                  onClick={() => onSave(job.id)}
                  className="text-gray-400 hover:text-brand-600 transition-colors mt-0.5"
                  aria-label={saved ? "Retirer des favoris" : "Sauvegarder"}
                >
                  {saved ? (
                    <BookmarkCheck className="h-5 w-5 text-brand-600" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span>{job.city}</span>
              </div>
              <span className="text-gray-200">•</span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{date}</span>
              </div>
              {job.workMode === "REMOTE" && (
                <>
                  <span className="text-gray-200">•</span>
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <Wifi className="h-3.5 w-3.5" />
                    <span>{workModeLabel}</span>
                  </div>
                </>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  contractColors[job.contractType] ||
                    "bg-gray-50 text-gray-700 border-gray-200"
                )}
              >
                {contractLabel}
              </span>
              {job.workMode !== "ONSITE" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {workModeLabel}
                </span>
              )}
              {salary !== "Salaire non précisé" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  {salary}
                </span>
              )}
              {job.isUrgent && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                  <Zap className="h-3 w-3" />
                  Urgent
                </span>
              )}
              {job.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
                  <Star className="h-3 w-3" />
                  En vedette
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        {!compact && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-400">
              {salary !== "Salaire non précisé" ? salary : ""}
            </div>
            <Button size="sm" asChild>
              <Link href={`/jobs/${job.slug}`}>Voir l&apos;offre</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
