import {
  HeroSection,
  ServicesSection,
  SidebarSection,
  BonASavoirSection,
  CTASection,
} from "@/components/sections";

/**
 * Page d'accueil du site DRNOFLU
 * Présentation institutionnelle avec sections principales
 */
export default function HomePage() {
  return (
    <>
      {/* Section Hero avec image du bâtiment */}
      <HeroSection />

      {/* Section actualités + sidebar avec direction - right after hero */}
      <SidebarSection />

      {/* Présentation des services/types de recettes */}
      <ServicesSection />

      {/* Section Bon à Savoir */}
      <BonASavoirSection />

      {/* Call to Action / Contact */}
      <CTASection />
    </>
  );
}
