"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { Upload, FileText, User, Briefcase, GraduationCap, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<ProfileInput | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile);
          reset(data.profile);
        }
      });
  }, [reset]);

  const onSubmit = async (data: ProfileInput) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, String(v));
      });
      if (cvFile) formData.append("cv", cvFile);

      const res = await fetch("/api/profile", { method: "PUT", body: formData });
      if (!res.ok) throw new Error();

      toast({ title: "Profil mis à jour !" });
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de mettre à jour le profil." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-500 mt-1">Complétez votre profil pour augmenter vos chances</p>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info">
            <User className="h-4 w-4 mr-2" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="cv">
            <FileText className="h-4 w-4 mr-2" />
            CV
          </TabsTrigger>
          <TabsTrigger value="experience">
            <Briefcase className="h-4 w-4 mr-2" />
            Expériences
          </TabsTrigger>
          <TabsTrigger value="education">
            <GraduationCap className="h-4 w-4 mr-2" />
            Formation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border-gray-100">
              <CardHeader>
                <CardTitle className="text-base">Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input {...register("firstName")} className={errors.firstName ? "border-red-400" : ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input {...register("lastName")} className={errors.lastName ? "border-red-400" : ""} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input {...register("phone")} placeholder="+212 6 00 00 00 00" />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input {...register("whatsappNumber")} placeholder="+212 6 00 00 00 00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input {...register("city")} placeholder="Casablanca" />
                </div>
                <div className="space-y-2">
                  <Label>Bio / Présentation</Label>
                  <Textarea
                    {...register("bio")}
                    placeholder="Décrivez-vous en quelques mots..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Salaire souhaité (MAD)</Label>
                    <Input type="number" {...register("expectedSalary")} placeholder="8000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Années d'expérience</Label>
                    <Input type="number" {...register("experienceYears")} placeholder="3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input {...register("linkedinUrl")} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-2">
                  <Label>Portfolio URL</Label>
                  <Input {...register("portfolioUrl")} placeholder="https://..." />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="cv">
          <Card className="border-gray-100" id="cv">
            <CardHeader>
              <CardTitle className="text-base">Mon CV</CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.cvUrl && (
                <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-xl mb-4">
                  <FileText className="h-8 w-8 text-brand-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-900">CV actuel</p>
                    <a href={profile.cvUrl as string} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">
                      Voir le CV
                    </a>
                  </div>
                </div>
              )}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
                {cvFile ? (
                  <div className="flex items-center justify-center gap-2 text-brand-600">
                    <FileText className="h-6 w-6" />
                    <span className="font-medium">{cvFile.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 mb-2">
                      Déposez votre CV PDF ici ou{" "}
                      <label className="text-brand-600 cursor-pointer hover:underline">
                        cliquez pour choisir
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-400">PDF — max 5 Mo</p>
                  </>
                )}
              </div>
              {cvFile && (
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={async () => {
                      setLoading(true);
                      const fd = new FormData();
                      fd.append("cv", cvFile);
                      await fetch("/api/profile", { method: "PUT", body: fd });
                      toast({ title: "CV mis à jour !" });
                      setLoading(false);
                      setCvFile(null);
                    }}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Télécharger le CV"}
                  </Button>
                  <Button variant="ghost" onClick={() => setCvFile(null)}>Annuler</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card className="border-gray-100">
            <CardHeader>
              <CardTitle className="text-base">Expériences professionnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 text-center py-8">
                Fonctionnalité disponible prochainement. Complétez votre profil via l&apos;onglet Informations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card className="border-gray-100">
            <CardHeader>
              <CardTitle className="text-base">Formation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 text-center py-8">
                Fonctionnalité disponible prochainement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
