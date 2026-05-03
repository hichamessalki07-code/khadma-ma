"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Filter } from "lucide-react";
import { MOROCCAN_CITIES, JOB_CATEGORIES } from "@/lib/utils";

interface SearchBarProps {
  compact?: boolean;
  className?: string;
}

export function SearchBar({ compact, className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (city && city !== "all") params.set("city", city);
    if (category && category !== "all") params.set("category", category);
    router.push(`/jobs?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch} className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Poste, compétence..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Rechercher</Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-2 ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-2">
        {/* Keyword */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Poste, compétence, entreprise..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-12 h-12 border-0 shadow-none text-base focus-visible:ring-0 bg-transparent"
          />
        </div>

        <div className="h-px md:h-auto md:w-px bg-gray-100" />

        {/* City */}
        <div className="relative flex-1 min-w-0">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="pl-12 h-12 border-0 shadow-none text-base focus:ring-0 bg-transparent w-full">
              <SelectValue placeholder="Ville" />
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

        <div className="h-px md:h-auto md:w-px bg-gray-100" />

        {/* Category */}
        <div className="relative flex-1 min-w-0">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="pl-12 h-12 border-0 shadow-none text-base focus:ring-0 bg-transparent w-full">
              <SelectValue placeholder="Catégorie" />
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

        <Button
          type="submit"
          size="lg"
          className="h-12 px-8 rounded-xl font-semibold"
        >
          <Search className="h-5 w-5 mr-2" />
          Rechercher
        </Button>
      </div>
    </form>
  );
}
