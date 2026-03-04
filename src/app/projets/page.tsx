"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Building2,
  MapPin,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createBrowserClient } from "@/lib/supabase";
import { CartographieProjet } from "@/lib/types";

type TerritoireOption = {
  id: string;
  nom: string;
};

const ITEMS_PER_PAGE = 9;

const TYPE_PROJET_OPTIONS = [
  { value: "all", label: "Tous les types" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "education", label: "Éducation" },
  { value: "sante", label: "Santé" },
  { value: "eau", label: "Eau" },
  { value: "electricite", label: "Électricité" },
  { value: "route", label: "Route" },
  { value: "pont", label: "Pont" },
  { value: "marche", label: "Marché" },
  { value: "agriculture", label: "Agriculture" },
  { value: "environnement", label: "Environnement" },
  { value: "social", label: "Social" },
  { value: "autre", label: "Autre" },
];

const STATUT_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: "propose", label: "Proposé" },
  { value: "planifie", label: "Planifié" },
  { value: "en_cours", label: "En cours" },
  { value: "suspendu", label: "Suspendu" },
  { value: "termine", label: "Terminé" },
  { value: "annule", label: "Annulé" },
];

const STATUT_COLORS: Record<string, string> = {
  propose: "bg-gray-100 text-gray-700",
  planifie: "bg-blue-100 text-blue-700",
  en_cours: "bg-yellow-100 text-yellow-700",
  suspendu: "bg-orange-100 text-orange-700",
  termine: "bg-green-100 text-green-700",
  annule: "bg-red-100 text-red-700",
};

export default function ProjetsPage() {
  const [projets, setProjets] = useState<CartographieProjet[]>([]);
  const [territoires, setTerritoires] = useState<TerritoireOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statutFilter, setStatutFilter] = useState("all");
  const [territoireFilter, setTerritoireFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchData = async () => {
    const supabase = createBrowserClient();

    // Fetch projects
    const { data: projetsData } = await supabase
      .from("cartographie_projets")
      .select(
        `
        *,
        territoire:cartographie_territoires(id, nom)
      `,
      )
      .eq("publie", true)
      .order("created_at", { ascending: false });

    // Fetch territories for filter
    const { data: territoiresData } = await supabase
      .from("cartographie_territoires")
      .select("id, nom")
      .order("nom");

    if (projetsData) setProjets(projetsData);
    if (territoiresData) setTerritoires(territoiresData as TerritoireOption[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter projects
  const filteredProjets = projets.filter((projet) => {
    const matchesSearch =
      projet.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projet.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" || projet.type_projet === typeFilter;
    const matchesStatut =
      statutFilter === "all" || projet.statut === statutFilter;
    const matchesTerritoire =
      territoireFilter === "all" || projet.territoire_id === territoireFilter;
    return matchesSearch && matchesType && matchesStatut && matchesTerritoire;
  });

  // Stats
  const stats = {
    total: projets.length,
    enCours: projets.filter((p) => p.statut === "en_cours").length,
    termines: projets.filter((p) => p.statut === "termine").length,
    totalBeneficiaires: projets.reduce(
      (sum, p) => sum + (p.beneficiaires_prevus || 0),
      0,
    ),
  };

  // Pagination
  const totalPages = Math.ceil(filteredProjets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjets = filteredProjets.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, statutFilter, territoireFilter]);

  const ProjectCard = ({ projet }: { projet: CartographieProjet }) => {
    const typeLabel =
      TYPE_PROJET_OPTIONS.find((t) => t.value === projet.type_projet)?.label ||
      projet.type_projet;
    const statutLabel =
      STATUT_OPTIONS.find((s) => s.value === projet.statut)?.label ||
      projet.statut;

    if (viewMode === "list") {
      return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 h-32 md:h-auto bg-gradient-to-br from-primary-100 to-primary-50 relative flex-shrink-0">
                {projet.image_principale ||
                (projet.images && projet.images.length > 0) ? (
                  <Image
                    src={projet.image_principale || projet.images![0]}
                    alt={projet.nom}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="h-10 w-10 text-primary-300" />
                  </div>
                )}
              </div>
              <div className="p-4 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary-100 text-primary-700"
                  >
                    {typeLabel}
                  </Badge>
                  <Badge className={STATUT_COLORS[projet.statut]}>
                    {statutLabel}
                  </Badge>
                  {projet.territoire && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <MapPin className="h-3 w-3" />
                      {(projet.territoire as unknown as { nom: string }).nom}
                    </Badge>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{projet.nom}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {projet.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {projet.annee}
                  </div>
                  {projet.beneficiaires_prevus && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {projet.beneficiaires_prevus.toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Avancement</span>
                    <span>{projet.pourcentage_avancement}%</span>
                  </div>
                  <Progress
                    value={projet.pourcentage_avancement}
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
        <CardContent className="p-0">
          <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-50 relative">
            {projet.image_principale ||
            (projet.images && projet.images.length > 0) ? (
              <Image
                src={projet.image_principale || projet.images![0]}
                alt={projet.nom}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-primary-300" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge className={STATUT_COLORS[projet.statut]}>
                {statutLabel}
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge
                variant="secondary"
                className="bg-primary-100 text-primary-700 text-xs"
              >
                {typeLabel}
              </Badge>
              {projet.territoire && (
                <Badge
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3" />
                  {(projet.territoire as unknown as { nom: string }).nom}
                </Badge>
              )}
            </div>
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
              {projet.nom}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {projet.description}
            </p>
            <div className="mt-auto">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Avancement</span>
                <span className="font-semibold">
                  {projet.pourcentage_avancement}%
                </span>
              </div>
              <Progress value={projet.pourcentage_avancement} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Projets</h1>
            <p className="text-xl text-primary-100">
              Découvrez les projets financés par les recettes non fiscales pour
              le développement du Lualaba
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <p className="text-3xl font-bold text-primary-700">
                {stats.total}
              </p>
              <p className="text-sm text-gray-600">Total Projets</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50">
              <p className="text-3xl font-bold text-yellow-700">
                {stats.enCours}
              </p>
              <p className="text-sm text-gray-600">En cours</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <p className="text-3xl font-bold text-green-700">
                {stats.termines}
              </p>
              <p className="text-sm text-gray-600">Terminés</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <p className="text-3xl font-bold text-blue-700">
                {stats.totalBeneficiaires > 1000
                  ? `${(stats.totalBeneficiaires / 1000).toFixed(0)}K`
                  : stats.totalBeneficiaires}
              </p>
              <p className="text-sm text-gray-600">Bénéficiaires</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white sticky top-16 z-20 border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_PROJET_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {STATUT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {territoires.length > 0 && (
                <Select
                  value={territoireFilter}
                  onValueChange={setTerritoireFilter}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Territoire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les territoires</SelectItem>
                    {territoires.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* View mode toggle */}
              <Tabs
                value={viewMode}
                onValueChange={(v) => setViewMode(v as "grid" | "list")}
              >
                <TabsList>
                  <TabsTrigger value="grid">
                    <LayoutGrid className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Skeleton
                      className={viewMode === "grid" ? "aspect-[4/3]" : "h-32"}
                    />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjets.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600">
                {searchQuery || typeFilter !== "all" || statutFilter !== "all"
                  ? "Aucun projet ne correspond à vos critères"
                  : "Aucun projet pour le moment"}
              </h3>
              <p className="text-gray-500 mt-2">
                {searchQuery || typeFilter !== "all" || statutFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Les projets seront bientôt disponibles"}
              </p>
            </div>
          ) : (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {paginatedProjets.map((projet) => (
                  <ProjectCard key={projet.id} projet={projet} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600 px-4">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Link to cartography */}
      <section className="bg-white py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">
            Visualisez l&apos;emplacement de tous nos projets sur la carte
            interactive
          </p>
          <Button asChild variant="outline">
            <Link href="/cartographie" className="flex items-center gap-2">
              Voir sur la carte
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
