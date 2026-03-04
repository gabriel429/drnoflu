"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Sparkles, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { createBrowserClient } from "@/lib/supabase";
import { CartographieProjet } from "@/lib/types";

const TYPE_PROJET_LABELS: Record<string, string> = {
  infrastructure: "Infrastructure",
  education: "Éducation",
  sante: "Santé",
  eau: "Eau",
  electricite: "Électricité",
  route: "Route",
  pont: "Pont",
  marche: "Marché",
  agriculture: "Agriculture",
  environnement: "Environnement",
  social: "Social",
  autre: "Autre",
};

const STATUT_LABELS: Record<string, { label: string; color: string }> = {
  propose: { label: "Proposé", color: "bg-gray-100 text-gray-700" },
  planifie: { label: "Planifié", color: "bg-blue-100 text-blue-700" },
  en_cours: { label: "En cours", color: "bg-yellow-100 text-yellow-700" },
  suspendu: { label: "Suspendu", color: "bg-orange-100 text-orange-700" },
  termine: { label: "Terminé", color: "bg-green-100 text-green-700" },
  annule: { label: "Annulé", color: "bg-red-100 text-red-700" },
};

export function ProjetsPharesSection() {
  const [projets, setProjets] = useState<CartographieProjet[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjetsPhares = async () => {
      const supabase = createBrowserClient();

      // Fetch background image setting
      const { data: settingData } = await supabase
        .from("site_settings")
        .select("valeur")
        .eq("cle", "projets_phares_background")
        .single();

      if (settingData?.valeur) {
        setBackgroundImage(settingData.valeur);
      }

      const { data, error } = await supabase
        .from("cartographie_projets")
        .select(
          `
          *,
          territoire:cartographie_territoires(nom)
        `,
        )
        .eq("publie", true)
        .eq("est_phare", true)
        .order("ordre_phare", { ascending: true })
        .limit(3);

      if (!error && data) {
        setProjets(data);
      }
      setLoading(false);
    };

    fetchProjetsPhares();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-6 w-32 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-3" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-8 items-center"
              >
                <Skeleton
                  className={`w-full md:w-1/2 aspect-[4/3] rounded-xl ${i % 2 === 0 ? "md:order-2" : ""}`}
                />
                <div className="w-full md:w-1/2 space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't render section if no featured projects
  if (projets.length === 0) {
    return null;
  }

  // Helper function to format project dates
  const formatProjectDates = (projet: CartographieProjet) => {
    const formatDate = (dateStr: string | null | undefined) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const debut = formatDate(projet.date_debut);
    const fin = formatDate(projet.date_fin_prevue);

    if (debut && fin) {
      return `${debut} - ${fin}`;
    } else if (debut) {
      return `${debut} - En cours`;
    } else if (projet.annee) {
      return `Année ${projet.annee}`;
    }
    return null;
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* White background base */}
      <div className="absolute inset-0 bg-white" />

      {/* Watermark-style background image (very faint) */}
      {backgroundImage && (
        <div className="absolute inset-0 opacity-[0.08]">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a8a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Timeline vertical line */}
      <div className="absolute left-1/2 top-48 bottom-32 w-0.5 bg-primary-200 hidden md:block" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">
              Notre Impact
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Nos <span className="text-primary-600">Projets Phares</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chaque franc collecté se transforme en projets concrets pour le
            bien-être des habitants du Lualaba
          </p>
        </motion.div>

        {/* Zigzag Projects */}
        <div className="space-y-12 md:space-y-0">
          {projets.map((projet, index) => {
            const isEven = index % 2 === 1;
            const statutInfo =
              STATUT_LABELS[projet.statut] || STATUT_LABELS.planifie;

            return (
              <motion.div
                key={projet.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline indicator */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-lg z-10">
                    {index + 1}
                  </div>
                </div>

                <div
                  className={`flex flex-col ${isEven ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-16 items-center py-8`}
                >
                  {/* Image side */}
                  <div
                    className={`w-full md:w-5/12 ${isEven ? "md:pl-8" : "md:pr-8"}`}
                  >
                    <Link href={`/projets`}>
                      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-0">
                          <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-50 relative">
                            {projet.image_principale ||
                            (projet.images && projet.images.length > 0) ? (
                              <Image
                                src={
                                  projet.image_principale || projet.images![0]
                                }
                                alt={projet.nom}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="h-16 w-16 text-primary-300" />
                              </div>
                            )}
                            {/* Progress overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                              <div className="flex items-center justify-between text-white text-sm">
                                <span>Avancement</span>
                                <span className="font-bold">
                                  {projet.pourcentage_avancement}%
                                </span>
                              </div>
                              <div className="mt-1 h-2 bg-white/30 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${projet.pourcentage_avancement}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>

                  {/* Content side */}
                  <div
                    className={`w-full md:w-5/12 ${isEven ? "md:pr-8 md:text-right" : "md:pl-8"}`}
                  >
                    {/* Project dates */}
                    {formatProjectDates(projet) && (
                      <p className="text-sm text-primary-600 font-medium mb-2">
                        {formatProjectDates(projet)}
                      </p>
                    )}

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 hover:text-primary-700 transition-colors">
                      <Link href={`/projets`}>{projet.nom}</Link>
                    </h3>

                    <div
                      className={`flex flex-wrap gap-2 mb-3 ${isEven ? "md:justify-end" : ""}`}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-primary-100 text-primary-700"
                      >
                        {TYPE_PROJET_LABELS[projet.type_projet] ||
                          projet.type_projet}
                      </Badge>
                      <Badge className={statutInfo.color}>
                        {statutInfo.label}
                      </Badge>
                      {projet.territoire && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <MapPin className="h-3 w-3" />
                          {
                            (projet.territoire as unknown as { nom: string })
                              .nom
                          }
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {projet.description ||
                        "Ce projet contribue au développement durable de la province du Lualaba."}
                    </p>

                    {/* Stats */}
                    <div
                      className={`flex gap-6 mb-4 ${isEven ? "md:justify-end" : ""}`}
                    >
                      {projet.beneficiaires_prevus && (
                        <p className="text-lg font-semibold text-primary-700">
                          {projet.beneficiaires_prevus.toLocaleString()}{" "}
                          Bénéficiaires
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA to view all projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Link href="/projets" className="flex items-center gap-2">
              Voir tous nos projets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
