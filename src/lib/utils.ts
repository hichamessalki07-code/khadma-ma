import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale/fr";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy", { locale: fr });
}

export function formatSalary(
  min?: number | null,
  max?: number | null,
  currency = "MAD"
): string {
  if (!min && !max) return "Salaire non précisé";
  if (min && max) return `${min.toLocaleString()} – ${max.toLocaleString()} ${currency}`;
  if (min) return `À partir de ${min.toLocaleString()} ${currency}`;
  if (max) return `Jusqu'à ${max.toLocaleString()} ${currency}`;
  return "Salaire non précisé";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export const CONTRACT_LABELS: Record<string, string> = {
  CDI: "CDI",
  CDD: "CDD",
  STAGE: "Stage",
  FREELANCE: "Freelance",
  ALTERNANCE: "Alternance",
  INTERIM: "Intérim",
};

export const WORK_MODE_LABELS: Record<string, string> = {
  ONSITE: "Présentiel",
  REMOTE: "Télétravail",
  HYBRID: "Hybride",
};

export const EXPERIENCE_LABELS: Record<string, string> = {
  JUNIOR: "Junior (0-2 ans)",
  MID: "Intermédiaire (2-5 ans)",
  SENIOR: "Sénior (5-10 ans)",
  LEAD: "Lead (10+ ans)",
  EXECUTIVE: "Directeur / Cadre",
};

export const JOB_CATEGORIES = [
  "Informatique & Tech",
  "Finance & Comptabilité",
  "Marketing & Communication",
  "Commerce & Ventes",
  "Ressources Humaines",
  "Ingénierie",
  "Santé & Médical",
  "Éducation & Formation",
  "Juridique",
  "Logistique & Transport",
  "BTP & Architecture",
  "Tourisme & Hôtellerie",
  "Agriculture",
  "Autre",
];

export const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Safi",
  "Mohammadia",
  "Khouribga",
  "El Jadida",
  "Béni Mellal",
  "Nador",
  "Taza",
  "Settat",
  "Larache",
  "Ksar El Kebir",
  "Khémisset",
  "Guelmim",
  "Berrechid",
  "Khénifra",
  "Dakhla",
  "Laâyoune",
  "Télétravail / Remote",
];
