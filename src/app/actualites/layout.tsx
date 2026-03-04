import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités | DRNOFLU",
  description:
    "Suivez les dernières actualités de la Direction des Recettes Non Fiscales du Lualaba. Événements, annonces et informations importantes.",
  keywords: [
    "actualités DRNOFLU",
    "nouvelles Lualaba",
    "événements",
    "annonces",
    "recettes non fiscales",
  ],
  openGraph: {
    title: "Actualités - DRNOFLU",
    description:
      "Les dernières nouvelles de la Direction des Recettes Non Fiscales du Lualaba",
    type: "website",
  },
};

export default function ActualitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
