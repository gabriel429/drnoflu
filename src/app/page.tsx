import {
  HeroSection,
  ServicesSection,
  SidebarSection,
  BonASavoirSection,
  CTASection,
  PerformancesSection,
  ProjetsPharesSection,
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

      {/* Section Projets Phares - Notre Impact */}
      <ProjetsPharesSection />

      {/* Section actualités + sidebar avec direction */}
      <SidebarSection />

      {/* Section Nos Performances */}
      <PerformancesSection />

      {/* Présentation des services/types de recettes */}
      <ServicesSection />

      {/* Section Bon à Savoir */}
      <BonASavoirSection />

      {/* Call to Action / Contact */}
      <CTASection />
    </>
  );
}
