"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Briefcase, Eye, EyeOff, Loader2, User, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"SEEKER" | "EMPLOYER">("SEEKER");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "SEEKER" },
  });

  const handleRoleChange = (newRole: "SEEKER" | "EMPLOYER") => {
    setRole(newRole);
    setValue("role", newRole);
  };

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
          },
        },
      });
      if (authError) throw authError;

      // Create user in our DB
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: authData.user?.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
        }),
      });

      toast({
        title: "Compte créé !",
        description: "Vérifiez votre email pour confirmer votre compte.",
      });

      router.push(
        data.role === "EMPLOYER" ? "/dashboard/employer" : "/dashboard/seeker"
      );
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: err instanceof Error ? err.message : "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-brand-600">Khadma</span>
          <span className="text-2xl font-light text-gray-400">.ma</span>
        </Link>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Créer un compte</CardTitle>
            <CardDescription>Rejoignez des milliers d&apos;utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { value: "SEEKER", icon: User, label: "Je cherche un emploi" },
                { value: "EMPLOYER", icon: Building2, label: "Je recrute" },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRoleChange(value as "SEEKER" | "EMPLOYER")}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    role === value
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  )}
                >
                  {role === value && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-brand-600 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium text-center">{label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    placeholder="Prénom"
                    {...register("firstName")}
                    className={errors.firstName ? "border-red-400" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    placeholder="Nom"
                    {...register("lastName")}
                    className={errors.lastName ? "border-red-400" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  {...register("email")}
                  className={errors.email ? "border-red-400" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="8 caractères minimum"
                    {...register("password")}
                    className={errors.password ? "border-red-400 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Confirmer le mot de passe</Label>
                <Input
                  type="password"
                  placeholder="Répétez votre mot de passe"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-400" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <input type="hidden" {...register("role")} value={role} />

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer mon compte
              </Button>

              <p className="text-center text-xs text-gray-400">
                En vous inscrivant, vous acceptez nos{" "}
                <Link href="/legal/terms" className="text-brand-600 hover:underline">
                  Conditions d&apos;utilisation
                </Link>
              </p>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Déjà un compte ?{" "}
              <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
