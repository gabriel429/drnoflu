import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadre Juridique | DRNOFLU",
  description:
    "Découvrez le cadre juridique et réglementaire des recettes non fiscales au Lualaba. Lois, décrets, arrêtés et textes de référence.",
  keywords: [
    "cadre juridique",
    "lois fiscales",
    "réglementation",
    "DRNOFLU",
    "textes légaux",
    "Lualaba",
  ],
  openGraph: {
    title: "Cadre Juridique - DRNOFLU",
    description: "Le cadre juridique des recettes non fiscales du Lualaba",
    type: "website",
  },
};

export default function JuridiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
