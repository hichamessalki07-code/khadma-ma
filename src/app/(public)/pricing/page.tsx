import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Tarifs – Publiez vos offres d'emploi",
  description:
    "Choisissez le plan qui correspond à vos besoins de recrutement au Maroc.",
};

const plans = [
  {
    name: "Gratuit",
    price: "0",
    period: "pour toujours",
    description: "Parfait pour commencer",
    badge: null,
    features: [
      "3 offres actives",
      "Profil entreprise",
      "Candidatures illimitées",
      "Accès aux CV",
      "Support email",
    ],
    missing: [
      "Offres en vedette",
      "Statistiques avancées",
      "Badge vérifié",
      "Support prioritaire",
    ],
    cta: "Commencer gratuitement",
    href: "/auth/register?role=employer&plan=free",
    variant: "outline" as const,
  },
  {
    name: "Starter",
    price: "299",
    period: "par mois",
    description: "Pour les PME en croissance",
    badge: "Populaire",
    features: [
      "10 offres actives",
      "2 offres en vedette",
      "Profil entreprise enrichi",
      "Candidatures illimitées",
      "Téléchargement de CV",
      "Statistiques de base",
      "Support prioritaire",
    ],
    missing: ["Badge vérifié", "API d'intégration"],
    cta: "Démarrer l'essai gratuit",
    href: "/auth/register?role=employer&plan=starter",
    variant: "default" as const,
  },
  {
    name: "Pro",
    price: "699",
    period: "par mois",
    description: "Pour les grandes entreprises",
    badge: "Meilleur rapport qualité/prix",
    features: [
      "Offres illimitées",
      "5 offres en vedette",
      "Badge entreprise vérifiée",
      "Profil premium",
      "Statistiques avancées",
      "Export des candidatures",
      "API d'intégration",
      "Account manager dédié",
      "Support 24/7",
    ],
    missing: [],
    cta: "Contacter les ventes",
    href: "/contact?subject=Plan%20Pro",
    variant: "brand" as const,
  },
];

const faqs = [
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Aucun engagement minimum.",
  },
  {
    q: "Comment fonctionne l'essai gratuit ?",
    a: "Le plan Starter inclut 14 jours d'essai gratuit sans carte bancaire. À la fin de l'essai, vous choisissez de continuer ou de passer au plan gratuit.",
  },
  {
    q: "Les offres sont-elles modérées ?",
    a: "Oui, toutes les offres publiées sont vérifiées par notre équipe avant publication pour garantir leur qualité et authenticité.",
  },
  {
    q: "Puis-je upgrader mon plan ?",
    a: "Absolument. Vous pouvez changer de plan à tout moment depuis votre tableau de bord. Le changement prend effet immédiatement.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4" variant="secondary">Tarification simple et transparente</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Des tarifs adaptés à votre croissance
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Commencez gratuitement et évoluez selon vos besoins. Accédez aux meilleurs talents du Maroc.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative border-2 ${
                  plan.name === "Pro"
                    ? "border-brand-500 shadow-xl shadow-brand-100"
                    : "border-gray-100"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand-600 text-white border-0 text-xs px-3">
                      <Zap className="h-3 w-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price} MAD
                    </span>
                    <span className="text-sm text-gray-400 ml-2">
                      / {plan.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant={plan.variant}
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                  <div className="space-y-2">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{f}</span>
                      </div>
                    ))}
                    {plan.missing.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm opacity-40">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-500 line-through">{f}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Encore des questions ?
          </h2>
          <p className="text-gray-500 mb-6">
            Notre équipe est disponible pour vous accompagner.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
