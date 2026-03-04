import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | DRNOFLU",
  description:
    "Contactez la Direction des Recettes Non Fiscales du Lualaba. Adresse, téléphone, email et formulaire de contact pour toutes vos questions.",
  keywords: [
    "contact DRNOFLU",
    "téléphone",
    "email",
    "adresse Kolwezi",
    "Lualaba",
    "recettes non fiscales",
  ],
  openGraph: {
    title: "Contactez-nous - DRNOFLU",
    description:
      "Entrez en contact avec la Direction des Recettes Non Fiscales du Lualaba",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
