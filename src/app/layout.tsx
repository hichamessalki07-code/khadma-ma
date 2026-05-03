import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://khadma.ma"
  ),
  title: {
    default: "Khadma.ma – Offres d'emploi au Maroc",
    template: "%s | Khadma.ma",
  },
  description:
    "Trouvez votre emploi idéal au Maroc. Des milliers d'offres CDI, CDD, Stage et Freelance dans toutes les villes marocaines.",
  keywords: [
    "emploi maroc",
    "offres emploi",
    "recrutement maroc",
    "stage maroc",
    "CDI CDD",
    "khadma",
    "travail maroc",
  ],
  authors: [{ name: "Khadma.ma" }],
  creator: "Khadma.ma",
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: "https://khadma.ma",
    siteName: "Khadma.ma",
    title: "Khadma.ma – Offres d'emploi au Maroc",
    description:
      "Trouvez votre emploi idéal au Maroc. Des milliers d'offres dans toutes les villes marocaines.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khadma.ma – Emploi au Maroc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khadma.ma – Offres d'emploi au Maroc",
    description: "Trouvez votre emploi idéal au Maroc.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Cairo:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
