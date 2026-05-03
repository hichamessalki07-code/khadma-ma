"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Send, Upload, FileText } from "lucide-react";

interface ApplyPageProps {
  params: { slug: string };
}

export default function ApplyPage({ params }: ApplyPageProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("jobSlug", params.slug);
      formData.append("coverLetter", coverLetter);
      if (cvFile) formData.append("cv", cvFile);

      const res = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la candidature");
      }

      toast({
        title: "Candidature envoyée !",
        description: "Votre candidature a bien été transmise à l'employeur.",
      });
      router.push("/dashboard/seeker/applications");
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err instanceof Error ? err.message : "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href={`/jobs/${params.slug}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l&apos;offre
          </Link>
        </Button>

        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl">Postuler à cette offre</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cover">Lettre de motivation (optionnelle)</Label>
                <Textarea
                  id="cover"
                  placeholder="Présentez-vous et expliquez pourquoi ce poste vous intéresse..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  {coverLetter.length}/2000 caractères
                </p>
              </div>

              <div className="space-y-2">
                <Label>CV (PDF, max 5 Mo)</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-300 transition-colors">
                  {cvFile ? (
                    <div className="flex items-center justify-center gap-2 text-brand-600">
                      <FileText className="h-5 w-5" />
                      <span className="text-sm font-medium">{cvFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        Déposez votre CV ou{" "}
                        <label className="text-brand-600 cursor-pointer hover:underline">
                          cliquez pour choisir
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) =>
                              setCvFile(e.target.files?.[0] || null)
                            }
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PDF uniquement</p>
                    </>
                  )}
                </div>
                {cvFile && (
                  <button
                    type="button"
                    className="text-xs text-red-500 hover:underline"
                    onClick={() => setCvFile(null)}
                  >
                    Supprimer le fichier
                  </button>
                )}
              </div>

              <div className="bg-brand-50 rounded-xl p-4 text-sm text-brand-700">
                <p className="font-medium mb-1">Votre profil sera joint automatiquement</p>
                <p className="text-brand-600 text-xs">
                  Vos informations de profil, compétences et expériences seront partagées avec l&apos;employeur.{" "}
                  <Link href="/dashboard/seeker/profile" className="underline">
                    Mettre à jour mon profil
                  </Link>
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Envoyer ma candidature
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
