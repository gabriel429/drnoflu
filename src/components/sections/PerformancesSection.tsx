"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Building2,
  Award,
  MapPin,
  Briefcase,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { createBrowserClient } from "@/lib/supabase";

interface PerformanceItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  suffix?: string;
}

export function PerformancesSection() {
  const [stats, setStats] = useState({
    projets: 0,
    beneficiaires: 0,
    services: 0,
    territoires: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createBrowserClient();

      // Fetch projects count and total beneficiaries
      const { data: projetsData } = await supabase
        .from("cartographie_projets")
        .select("beneficiaires_prevus")
        .eq("publie", true);

      // Fetch services count
      const { count: servicesCount } = await supabase
        .from("services")
        .select("*", { count: "exact", head: true })
        .eq("actif", true);

      // Fetch territories count
      const { count: territoiresCount } = await supabase
        .from("cartographie_territoires")
        .select("*", { count: "exact", head: true });

      const totalBeneficiaires =
        projetsData?.reduce(
          (sum, p) => sum + (p.beneficiaires_prevus || 0),
          0,
        ) || 0;

      setStats({
        projets: projetsData?.length || 0,
        beneficiaires: totalBeneficiaires,
        services: servicesCount || 12,
        territoires: territoiresCount || 5,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const performances: PerformanceItem[] = [
    {
      icon: <Building2 className="h-8 w-8" />,
      value: loading ? "..." : stats.projets.toString(),
      label: "Projets financés",
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: loading
        ? "..."
        : stats.beneficiaires > 1000
          ? `${(stats.beneficiaires / 1000).toFixed(0)}K`
          : stats.beneficiaires.toString(),
      label: "Bénéficiaires",
      suffix: stats.beneficiaires > 1000 ? "+" : "",
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      value: loading ? "..." : stats.services.toString(),
      label: "Services opérationnels",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      value: loading ? "..." : stats.territoires.toString(),
      label: "Territoires couverts",
    },
  ];

  if (loading) {
    return (
      <section className="py-12 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Skeleton className="h-6 w-32 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-10 w-48 mx-auto mb-3 bg-white/20" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl bg-white/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-12 bg-primary-900 text-white relative overflow-hidden">
      {/* Pattern de fond */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <TrendingUp className="h-5 w-5 text-primary-300" />
            <span className="text-sm font-medium text-primary-200">
              Notre Impact
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-3">Nos Performances</h2>
          <p className="text-primary-200 max-w-2xl mx-auto">
            La DRNOFLU s&apos;engage à offrir un service de qualité aux
            contribuables du Nord-Kivu
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {performances.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/30 text-primary-200 mb-4">
                  {item.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-1">
                  {item.value}
                  {item.suffix && (
                    <span className="text-2xl">{item.suffix}</span>
                  )}
                </div>
                <p className="text-primary-200 text-sm">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-2 text-primary-300">
            <Award className="h-5 w-5" />
            <span className="text-sm">
              Au service du développement provincial
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
