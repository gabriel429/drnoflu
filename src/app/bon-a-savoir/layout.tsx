import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bon à Savoir | DRNOFLU",
  description:
    "Informations utiles sur les recettes non fiscales du Lualaba. FAQ, procédures, délais et conseils pratiques pour les contribuables.",
  keywords: [
    "bon à savoir",
    "FAQ DRNOFLU",
    "informations pratiques",
    "procédures",
    "recettes non fiscales",
    "Lualaba",
  ],
  openGraph: {
    title: "Bon à Savoir - DRNOFLU",
    description:
      "Informations pratiques sur les recettes non fiscales du Lualaba",
    type: "website",
  },
};

export default function BonASavoirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
