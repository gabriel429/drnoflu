"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DIRECTION_INFO, CATEGORIES_ACTUALITES } from "@/lib/config";
import { createBrowserClient } from "@/lib/supabase";
import { Actualite } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

// Liens rapides
const liensRapides = [
  { label: "Formulaires à télécharger", href: "/juridique#formulaires" },
  { label: "Tarification des services", href: "/services#tarification" },
  { label: "Procédures de paiement", href: "/services#procedures" },
  { label: "Questions fréquentes", href: "/bon-a-savoir#faq" },
  { label: "Structure organisationnelle", href: "/structure" },
];

/**
 * Sidebar droite avec actualités et informations
 */
export function SidebarSection() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("actualites")
      .select("*")
      .eq("publie", true)
      .order("date_publication", { ascending: false })
      .limit(4);

    if (!error && data) {
      setActualites(data);
    }
    setLoading(false);
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne principale: Actualités */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                {t("news", "title")}
              </h2>
              <Link
                href="/actualites"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
              >
                {t("news", "viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? (
                // Skeleton loaders
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Skeleton className="w-full aspect-square" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : actualites.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">
                    Aucune actualité pour le moment
                  </p>
                </Card>
              ) : (
                actualites.map((actu, index) => {
                  const categorie = CATEGORIES_ACTUALITES.find(
                    (c) => c.id === actu.categorie,
                  );
                  return (
                    <motion.div
                      key={actu.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/actualites/${actu.slug}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                          <CardContent className="p-0">
                            {/* Image carrée en haut */}
                            <div className="w-full aspect-square bg-gray-200 relative">
                              {actu.image_url ? (
                                <Image
                                  src={actu.image_url}
                                  alt={actu.titre}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-primary-200 flex items-center justify-center">
                                  <span className="text-primary-600 text-sm">
                                    Image
                                  </span>
                                </div>
                              )}
                            </div>
                            {/* Texte en bas */}
                            <div className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-primary-100 text-primary-700"
                                >
                                  {categorie?.label || "Actualité"}
                                </Badge>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(
                                    actu.date_publication || actu.created_at,
                                  ).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </span>
                              </div>
                              <h3 className="font-semibold text-gray-900 hover:text-primary-700 transition-colors line-clamp-2 mb-1 text-sm">
                                {actu.titre}
                              </h3>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {actu.extrait}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar droite */}
          <div className="space-y-4">
            {/* Directeur Provincial - Section principale */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <CardContent className="p-0">
                  {/* Photo du directeur - grande et bien visible */}
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={DIRECTION_INFO.directeur.photo}
                      alt={DIRECTION_INFO.directeur.nom}
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  </div>
                  {/* Infos du directeur */}
                  <div className="p-5">
                    <p className="text-xs text-primary-300 font-medium uppercase tracking-wide mb-1">
                      {DIRECTION_INFO.directeur.titre}
                    </p>
                    <h4 className="font-bold text-lg mb-3">
                      {DIRECTION_INFO.directeur.nom}
                    </h4>
                    <blockquote className="text-sm text-gray-300 italic border-l-2 border-primary-500 pl-3">
                      &ldquo;{DIRECTION_INFO.directeur.slogan}&rdquo;
                    </blockquote>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 border-gray-600 text-white hover:bg-white/10"
                    >
                      <Link href="/direction">En savoir plus</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Liens rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary-600 rounded-full" />
                    Accès Rapides
                  </h3>
                  <ul className="space-y-2">
                    {liensRapides.map((lien) => (
                      <li key={lien.href}>
                        <Link
                          href={lien.href}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700 py-1.5 transition-colors group"
                        >
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                          {lien.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Gouverneure */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden bg-gradient-to-br from-primary-50 to-white border-primary-100">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-200">
                      <Image
                        src={DIRECTION_INFO.gouverneure.photo}
                        alt={DIRECTION_INFO.gouverneure.nom}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                        {DIRECTION_INFO.gouverneure.titre}
                      </p>
                      <h4 className="font-semibold text-gray-900">
                        {DIRECTION_INFO.gouverneure.nom}
                      </h4>
                    </div>
                  </div>
                  <blockquote className="text-sm text-gray-600 italic border-l-2 border-primary-300 pl-3">
                    &ldquo;{DIRECTION_INFO.gouverneure.slogan}&rdquo;
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>

            {/* Ministre Provincial des Finances */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden bg-gradient-to-br from-gray-100 to-white border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                      <Image
                        src={DIRECTION_INFO.ministre.photo}
                        alt={DIRECTION_INFO.ministre.nom}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                        {DIRECTION_INFO.ministre.titre}
                      </p>
                      <h4 className="font-semibold text-gray-900">
                        {DIRECTION_INFO.ministre.nom}
                      </h4>
                    </div>
                  </div>
                  <blockquote className="text-sm text-gray-600 italic border-l-2 border-gray-400 pl-3">
                    &ldquo;{DIRECTION_INFO.ministre.slogan}&rdquo;
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
