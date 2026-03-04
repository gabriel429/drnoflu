import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Projets | DRNOFLU",
  description:
    "Découvrez les projets financés par les recettes non fiscales du Lualaba. Infrastructure, éducation, santé et développement durable pour la province.",
  keywords: [
    "projets Lualaba",
    "développement",
    "infrastructure",
    "éducation",
    "santé",
    "DRNOFLU",
    "investissements",
  ],
  openGraph: {
    title: "Nos Projets - DRNOFLU",
    description:
      "Projets d'infrastructure et de développement financés par les recettes non fiscales du Lualaba",
    type: "website",
  },
};

export default function ProjetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
