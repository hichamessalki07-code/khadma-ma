"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { companySchema, type CompanyInput } from "@/lib/validations";
import { Loader2, Building2 } from "lucide-react";

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
  });

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((data) => {
        if (data.company) reset(data.company);
      });
  }, [reset]);

  const onSubmit = async (data: CompanyInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Profil entreprise sauvegardé !" });
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de sauvegarder." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profil entreprise</h1>
        <p className="text-gray-500 mt-1">Ces informations apparaîtront sur votre page entreprise</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-600" />
              Informations de l&apos;entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de l&apos;entreprise *</Label>
              <Input {...register("name")} placeholder="Ex: TechMaroc SARL" className={errors.name ? "border-red-400" : ""} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Secteur d&apos;activité</Label>
                <Input {...register("industry")} placeholder="Informatique, Finance..." />
              </div>
              <div className="space-y-2">
                <Label>Taille</Label>
                <Input {...register("size")} placeholder="1-10, 11-50, 51-200..." />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description")} rows={4} placeholder="Décrivez votre entreprise..." className="resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input {...register("city")} placeholder="Casablanca" />
              </div>
              <div className="space-y-2">
                <Label>Site web</Label>
                <Input {...register("website")} type="url" placeholder="https://..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email de contact</Label>
                <Input {...register("email")} type="email" placeholder="rh@entreprise.ma" />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input {...register("phone")} placeholder="+212 5 00 00 00 00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>WhatsApp recrutement</Label>
              <Input {...register("whatsappNumber")} placeholder="+212 6 00 00 00 00" />
            </div>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sauvegarder
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
