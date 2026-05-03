"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { MOROCCAN_CITIES, JOB_CATEGORIES } from "@/lib/utils";

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  };

  const clearAll = () => router.push("/jobs");

  const activeFilters = ["city", "category", "contract", "remote"].filter(
    (f) => searchParams.has(f)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filtres</h3>
        {activeFilters.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-brand-600 hover:underline flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Tout effacer
          </button>
        )}
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeFilters.map((key) => (
            <Badge
              key={key}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => updateFilter(key, "")}
            >
              {searchParams.get(key)}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* City */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Ville</label>
        <Select
          value={searchParams.get("city") || "all"}
          onValueChange={(v) => updateFilter("city", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les villes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {MOROCCAN_CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Catégorie</label>
        <Select
          value={searchParams.get("category") || "all"}
          onValueChange={(v) => updateFilter("category", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {JOB_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contract type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Type de contrat</label>
        <Select
          value={searchParams.get("contract") || "all"}
          onValueChange={(v) => updateFilter("contract", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les contrats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les contrats</SelectItem>
            <SelectItem value="CDI">CDI</SelectItem>
            <SelectItem value="CDD">CDD</SelectItem>
            <SelectItem value="STAGE">Stage</SelectItem>
            <SelectItem value="FREELANCE">Freelance</SelectItem>
            <SelectItem value="ALTERNANCE">Alternance</SelectItem>
            <SelectItem value="INTERIM">Intérim</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work mode */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Mode de travail</label>
        <Select
          value={searchParams.get("remote") || "all"}
          onValueChange={(v) => updateFilter("remote", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les modes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les modes</SelectItem>
            <SelectItem value="ONSITE">Présentiel</SelectItem>
            <SelectItem value="REMOTE">Télétravail</SelectItem>
            <SelectItem value="HYBRID">Hybride</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
