import Link from "next/link";
import { Briefcase, Mail, Phone, MapPin, Facebook, Linkedin, Twitter, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  platform: {
    title: "Plateforme",
    links: [
      { href: "/jobs", label: "Offres d'emploi" },
      { href: "/companies", label: "Entreprises" },
      { href: "/pricing", label: "Tarifs" },
      { href: "/contact", label: "Contact" },
    ],
  },
  candidates: {
    title: "Candidats",
    links: [
      { href: "/auth/register?role=seeker", label: "Créer un compte" },
      { href: "/dashboard/seeker", label: "Mon tableau de bord" },
      { href: "/jobs", label: "Rechercher un emploi" },
    ],
  },
  employers: {
    title: "Recruteurs",
    links: [
      { href: "/auth/register?role=employer", label: "Publier une offre" },
      { href: "/dashboard/employer", label: "Espace recruteur" },
      { href: "/pricing", label: "Nos offres" },
    ],
  },
  legal: {
    title: "Légal",
    links: [
      { href: "/legal/privacy", label: "Politique de confidentialité" },
      { href: "/legal/terms", label: "Conditions d'utilisation" },
      { href: "/legal/cookies", label: "Cookies" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span className="text-white">Khadma</span>
              <span className="text-gray-500 font-light">.ma</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              La plateforme de référence pour l&apos;emploi au Maroc. Connectez les meilleurs talents avec les meilleures entreprises.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-400" />
                <span>Casablanca, Maroc</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-400" />
                <a href="mailto:contact@khadma.ma" className="hover:text-white transition-colors">
                  contact@khadma.ma
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-400" />
                <span>+212 6 00 00 00 00</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-white font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-gray-800 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Khadma.ma — Tous droits réservés
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">Rejoignez-nous</span>
            {[
              { icon: Facebook, href: "#", label: "Facebook" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Instagram, href: "#", label: "Instagram" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-brand-600 hover:text-white transition-all"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
