"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { jobSchema, type JobInput } from "@/lib/validations";
import { MOROCCAN_CITIES, JOB_CATEGORIES } from "@/lib/utils";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: { workMode: "ONSITE", contractType: "CDI", experienceLevel: "MID" },
  });

  const onSubmit = async (data: JobInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      toast({ title: "Offre créée !", description: "Votre offre est en attente de validation." });
      router.push("/dashboard/employer/jobs");
    } catch (err: unknown) {
      toast({ variant: "destructive", title: "Erreur", description: err instanceof Error ? err.message : "Erreur inconnue" });
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof JobInput, val: string) => setValue(key, val as JobInput[typeof key]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/employer/jobs"><ArrowLeft className="h-4 w-4 mr-1" />Retour</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Publier une offre</h1>
          <p className="text-gray-500 text-sm">Votre offre sera vérifiée avant publication</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <Card className="border-gray-100">
          <CardHeader><CardTitle className="text-base">Informations générales</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Titre du poste *</Label>
              <Input {...register("title")} placeholder="Ex: Développeur Full-Stack React/Node.js" className={errors.title ? "border-red-400" : ""} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ville *</Label>
                <Select onValueChange={(v) => field("city", v)}>
                  <SelectTrigger className={errors.city ? "border-red-400" : ""}><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>{MOROCCAN_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select onValueChange={(v) => field("category", v)}>
                  <SelectTrigger className={errors.category ? "border-red-400" : ""}><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>{JOB_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type de contrat *</Label>
                <Select defaultValue="CDI" onValueChange={(v) => field("contractType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["CDI","CDD","STAGE","FREELANCE","ALTERNANCE","INTERIM"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mode de travail *</Label>
                <Select defaultValue="ONSITE" onValueChange={(v) => field("workMode", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONSITE">Présentiel</SelectItem>
                    <SelectItem value="REMOTE">Télétravail</SelectItem>
                    <SelectItem value="HYBRID">Hybride</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Niveau d&apos;expérience</Label>
                <Select defaultValue="MID" onValueChange={(v) => field("experienceLevel", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JUNIOR">Junior</SelectItem>
                    <SelectItem value="MID">Intermédiaire</SelectItem>
                    <SelectItem value="SENIOR">Sénior</SelectItem>
                    <SelectItem value="LEAD">Lead</SelectItem>
                    <SelectItem value="EXECUTIVE">Cadre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Salaire min (MAD)</Label>
                <Input type="number" {...register("salaryMin")} placeholder="5000" />
              </div>
              <div className="space-y-2">
                <Label>Salaire max (MAD)</Label>
                <Input type="number" {...register("salaryMax")} placeholder="12000" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-gray-100">
          <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Description du poste *</Label>
              <Textarea {...register("description")} rows={8} placeholder="Décrivez le poste, les missions, l'environnement de travail..." className={`resize-none ${errors.description ? "border-red-400" : ""}`} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Profil recherché</Label>
              <Textarea {...register("requirements")} rows={5} placeholder="Qualifications, compétences, expériences requises..." className="resize-none" />
            </div>
            <div className="space-y-2">
              <Label>Avantages</Label>
              <Textarea {...register("benefits")} rows={3} placeholder="Mutuelle, tickets resto, télétravail, formation..." className="resize-none" />
            </div>
          </CardContent>
        </Card>

        {/* Contact / Apply */}
        <Card className="border-gray-100">
          <CardHeader><CardTitle className="text-base">Comment postuler ?</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Compétences (séparées par des virgules)</Label>
              <Input {...register("skills")} placeholder="React, Node.js, TypeScript, PostgreSQL..." />
            </div>
            <div className="space-y-2">
              <Label>URL de candidature externe (optionnel)</Label>
              <Input {...register("applyUrl")} type="url" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Numéro WhatsApp pour candidature (optionnel)</Label>
              <Input {...register("whatsappApply")} placeholder="+212 6 00 00 00 00" />
            </div>
            <div className="space-y-2">
              <Label>Date d&apos;expiration (optionnel)</Label>
              <Input {...register("expiresAt")} type="date" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" size="lg" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Soumettre pour validation
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
