import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cartographie des Projets | DRNOFLU",
  description:
    "Visualisez sur la carte interactive tous les projets d'infrastructure et de développement du Lualaba financés par les recettes non fiscales.",
  keywords: [
    "carte projets",
    "cartographie Lualaba",
    "localisation projets",
    "DRNOFLU",
    "développement territorial",
  ],
  openGraph: {
    title: "Cartographie des Projets - DRNOFLU",
    description: "Carte interactive des projets de développement du Lualaba",
    type: "website",
  },
};

export default function CartographieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
