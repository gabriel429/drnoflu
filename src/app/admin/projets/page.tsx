"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  StarOff,
  Building2,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUpload } from "@/components/admin";
import { createBrowserClient } from "@/lib/supabase";
import { CartographieProjet } from "@/lib/types";

type TerritoireOption = {
  id: string;
  nom: string;
};

const TYPE_PROJET_OPTIONS = [
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
  { value: "propose", label: "Proposé", color: "bg-gray-100 text-gray-700" },
  { value: "planifie", label: "Planifié", color: "bg-blue-100 text-blue-700" },
  {
    value: "en_cours",
    label: "En cours",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "suspendu",
    label: "Suspendu",
    color: "bg-orange-100 text-orange-700",
  },
  { value: "termine", label: "Terminé", color: "bg-green-100 text-green-700" },
  { value: "annule", label: "Annulé", color: "bg-red-100 text-red-700" },
];

export default function AdminProjetsPage() {
  const [projets, setProjets] = useState<CartographieProjet[]>([]);
  const [territoires, setTerritoires] = useState<TerritoireOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statutFilter, setStatutFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProjet, setEditingProjet] = useState<CartographieProjet | null>(
    null,
  );
  const [deletingProjet, setDeletingProjet] =
    useState<CartographieProjet | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    territoire_id: "",
    latitude: "",
    longitude: "",
    type_projet: "infrastructure",
    date_debut: "",
    date_fin_prevue: "",
    annee: new Date().getFullYear(),
    statut: "planifie",
    pourcentage_avancement: 0,
    cout_estime_usd: "",
    source_financement: "",
    beneficiaires_prevus: "",
    maitre_ouvrage: "",
    entrepreneur: "",
    publie: false,
    image_principale: "",
  });

  const fetchData = async () => {
    const supabase = createBrowserClient();

    const { data: projetsData } = await supabase
      .from("cartographie_projets")
      .select(
        `
        *,
        territoire:cartographie_territoires(id, nom)
      `,
      )
      .order("created_at", { ascending: false });

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

  // Featured projects
  const projetsPhares = projets
    .filter((p) => p.est_phare)
    .sort((a, b) => (a.ordre_phare || 0) - (b.ordre_phare || 0));

  // Filter projects
  const filteredProjets = projets.filter((projet) => {
    const matchesSearch =
      projet.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projet.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatut =
      statutFilter === "all" || projet.statut === statutFilter;
    return matchesSearch && matchesStatut;
  });

  const handleEdit = (projet: CartographieProjet) => {
    setEditingProjet(projet);
    setFormData({
      nom: projet.nom,
      description: projet.description || "",
      territoire_id: projet.territoire_id || "",
      latitude: projet.latitude?.toString() || "",
      longitude: projet.longitude?.toString() || "",
      type_projet: projet.type_projet,
      date_debut: projet.date_debut || "",
      date_fin_prevue: projet.date_fin_prevue || "",
      annee: projet.annee,
      statut: projet.statut,
      pourcentage_avancement: projet.pourcentage_avancement,
      cout_estime_usd: projet.cout_estime_usd?.toString() || "",
      source_financement: projet.source_financement || "",
      beneficiaires_prevus: projet.beneficiaires_prevus?.toString() || "",
      maitre_ouvrage: projet.maitre_ouvrage || "",
      entrepreneur: projet.entrepreneur || "",
      publie: projet.publie,
      image_principale: projet.image_principale || "",
    });
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setEditingProjet(null);
    setFormData({
      nom: "",
      description: "",
      territoire_id: "",
      latitude: "",
      longitude: "",
      type_projet: "infrastructure",
      date_debut: "",
      date_fin_prevue: "",
      annee: new Date().getFullYear(),
      statut: "planifie",
      pourcentage_avancement: 0,
      cout_estime_usd: "",
      source_financement: "",
      beneficiaires_prevus: "",
      maitre_ouvrage: "",
      entrepreneur: "",
      publie: false,
      image_principale: "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nom || !formData.latitude || !formData.longitude) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    setSaving(true);
    const supabase = createBrowserClient();

    const projetData = {
      nom: formData.nom,
      description: formData.description || null,
      territoire_id: formData.territoire_id || null,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      type_projet: formData.type_projet,
      date_debut: formData.date_debut || null,
      date_fin_prevue: formData.date_fin_prevue || null,
      annee: formData.annee,
      statut: formData.statut,
      pourcentage_avancement: formData.pourcentage_avancement,
      cout_estime_usd: formData.cout_estime_usd
        ? parseFloat(formData.cout_estime_usd)
        : null,
      source_financement: formData.source_financement || null,
      beneficiaires_prevus: formData.beneficiaires_prevus
        ? parseInt(formData.beneficiaires_prevus)
        : null,
      maitre_ouvrage: formData.maitre_ouvrage || null,
      entrepreneur: formData.entrepreneur || null,
      publie: formData.publie,
      image_principale: formData.image_principale || null,
    };

    if (editingProjet) {
      await supabase
        .from("cartographie_projets")
        .update(projetData)
        .eq("id", editingProjet.id);
    } else {
      await supabase.from("cartographie_projets").insert(projetData);
    }

    setSaving(false);
    setIsDialogOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deletingProjet) return;

    const supabase = createBrowserClient();
    await supabase
      .from("cartographie_projets")
      .delete()
      .eq("id", deletingProjet.id);

    setIsDeleteDialogOpen(false);
    setDeletingProjet(null);
    fetchData();
  };

  const togglePublie = async (projet: CartographieProjet) => {
    const supabase = createBrowserClient();
    await supabase
      .from("cartographie_projets")
      .update({ publie: !projet.publie })
      .eq("id", projet.id);
    fetchData();
  };

  const toggleFeatured = async (projet: CartographieProjet) => {
    const supabase = createBrowserClient();

    if (projet.est_phare) {
      // Remove from featured
      await supabase
        .from("cartographie_projets")
        .update({ est_phare: false, ordre_phare: null })
        .eq("id", projet.id);
    } else {
      // Check if we already have 3 featured
      if (projetsPhares.length >= 3) {
        alert(
          "Vous avez déjà 3 projets phares. Veuillez d'abord en retirer un.",
        );
        return;
      }
      // Add to featured
      const nextOrder = projetsPhares.length + 1;
      await supabase
        .from("cartographie_projets")
        .update({ est_phare: true, ordre_phare: nextOrder })
        .eq("id", projet.id);
    }
    fetchData();
  };

  const updateFeaturedOrder = async (projetId: string, newOrder: number) => {
    const supabase = createBrowserClient();
    await supabase
      .from("cartographie_projets")
      .update({ ordre_phare: newOrder })
      .eq("id", projetId);
    fetchData();
  };

  const getStatutBadge = (statut: string) => {
    const statutInfo = STATUT_OPTIONS.find((s) => s.value === statut);
    return (
      <Badge className={statutInfo?.color || "bg-gray-100"}>
        {statutInfo?.label || statut}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    return TYPE_PROJET_OPTIONS.find((t) => t.value === type)?.label || type;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Projets
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les projets financés par les recettes non fiscales
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Projet
        </Button>
      </div>

      {/* Featured Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Projets Phares (Page d&apos;accueil)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projetsPhares.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Aucun projet phare sélectionné</p>
              <p className="text-sm">
                Cliquez sur l&apos;étoile dans le tableau pour ajouter un projet
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {projetsPhares.map((projet) => (
                <Card key={projet.id} className="relative">
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-700"
                    >
                      #{projet.ordre_phare}
                    </Badge>
                    <Select
                      value={projet.ordre_phare?.toString()}
                      onValueChange={(v) =>
                        updateFeaturedOrder(projet.id, parseInt(v))
                      }
                    >
                      <SelectTrigger className="w-16 h-6 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1er</SelectItem>
                        <SelectItem value="2">2ème</SelectItem>
                        <SelectItem value="3">3ème</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-100 rounded mb-3 relative overflow-hidden">
                      {projet.images && projet.images.length > 0 ? (
                        <Image
                          src={projet.images[0]}
                          alt={projet.nom}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-1">
                      {projet.nom}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatutBadge(projet.statut)}
                      <span className="text-xs text-gray-500">
                        {projet.pourcentage_avancement}%
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => toggleFeatured(projet)}
                    >
                      <StarOff className="h-4 w-4 mr-1" />
                      Retirer des phares
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {projetsPhares.length > 0 && projetsPhares.length < 3 && (
            <p className="text-sm text-amber-600 mt-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Vous pouvez encore ajouter {3 - projetsPhares.length} projet(s)
              phare(s)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary-700">
              {projets.length}
            </div>
            <p className="text-sm text-gray-500">Total Projets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {projets.filter((p) => p.statut === "en_cours").length}
            </div>
            <p className="text-sm text-gray-500">En cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {projets.filter((p) => p.statut === "termine").length}
            </div>
            <p className="text-sm text-gray-500">Terminés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {projets.filter((p) => p.publie).length}
            </div>
            <p className="text-sm text-gray-500">Publiés</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {STATUT_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">Phare</TableHead>
                  <TableHead className="w-16">Photo</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Avancement
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Territoire
                  </TableHead>
                  <TableHead>Publié</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-500"
                    >
                      Aucun projet trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjets.map((projet) => (
                    <TableRow key={projet.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => toggleFeatured(projet)}
                          disabled={!projet.publie}
                          title={
                            !projet.publie ? "Publiez d'abord le projet" : ""
                          }
                        >
                          {projet.est_phare ? (
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <Star className="h-5 w-5 text-gray-300" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {projet.image_principale ? (
                            <Image
                              src={projet.image_principale}
                              alt={projet.nom}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{projet.nom}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {projet.description}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">
                          {getTypeLabel(projet.type_projet)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatutBadge(projet.statut)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="w-24">
                          <div className="text-xs text-gray-500 mb-1">
                            {projet.pourcentage_avancement}%
                          </div>
                          <Progress
                            value={projet.pourcentage_avancement}
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {projet.territoire ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {
                              (projet.territoire as unknown as { nom: string })
                                .nom
                            }
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublie(projet)}
                        >
                          {projet.publie ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(projet)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setDeletingProjet(projet);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProjet ? "Modifier le projet" : "Nouveau projet"}
            </DialogTitle>
            <DialogDescription>
              {editingProjet
                ? "Modifiez les informations du projet"
                : "Créez un nouveau projet"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom du projet *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                placeholder="Ex: Construction école primaire"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description du projet..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Image principale</Label>
              <ImageUpload
                value={formData.image_principale}
                onChange={(url) =>
                  setFormData({ ...formData, image_principale: url })
                }
                folder="projets"
                className="aspect-video max-w-sm"
              />
              <p className="text-xs text-gray-500">
                Cette image sera affichée dans la section Projets Phares et la
                page du projet
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type de projet</Label>
                <Select
                  value={formData.type_projet}
                  onValueChange={(v) =>
                    setFormData({ ...formData, type_projet: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_PROJET_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(v) => setFormData({ ...formData, statut: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUT_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="territoire">Territoire</Label>
                <Select
                  value={formData.territoire_id}
                  onValueChange={(v) =>
                    setFormData({ ...formData, territoire_id: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {territoires.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="annee">Année</Label>
                <Input
                  id="annee"
                  type="number"
                  value={formData.annee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      annee: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  placeholder="-10.7167"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  placeholder="25.4667"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avancement">
                Avancement: {formData.pourcentage_avancement}%
              </Label>
              <Input
                id="avancement"
                type="range"
                min="0"
                max="100"
                value={formData.pourcentage_avancement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pourcentage_avancement: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date_debut">Date de début</Label>
                <Input
                  id="date_debut"
                  type="date"
                  value={formData.date_debut}
                  onChange={(e) =>
                    setFormData({ ...formData, date_debut: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date_fin">Date de fin prévue</Label>
                <Input
                  id="date_fin"
                  type="date"
                  value={formData.date_fin_prevue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date_fin_prevue: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cout">Coût estimé (USD)</Label>
                <Input
                  id="cout"
                  type="number"
                  value={formData.cout_estime_usd}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cout_estime_usd: e.target.value,
                    })
                  }
                  placeholder="100000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="beneficiaires">Bénéficiaires prévus</Label>
                <Input
                  id="beneficiaires"
                  type="number"
                  value={formData.beneficiaires_prevus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaires_prevus: e.target.value,
                    })
                  }
                  placeholder="5000"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="source">Source de financement</Label>
              <Input
                id="source"
                value={formData.source_financement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    source_financement: e.target.value,
                  })
                }
                placeholder="Recettes non fiscales provinciales"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="publie"
                checked={formData.publie}
                onChange={(e) =>
                  setFormData({ ...formData, publie: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="publie">Publier ce projet</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le projet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le projet &ldquo;
              {deletingProjet?.nom}&rdquo; ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
