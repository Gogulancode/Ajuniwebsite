"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  X,
  Heart,
  Calendar,
  MapPin,
  Activity,
  ArrowRight,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { DonateModal } from "@/components/DonateModal";
import { ImageLightbox } from "@/components/ImageLightbox";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/useToast";
import { cn, formatDate } from "@/lib/utils";
import { Animal, HealthRecord, RecordStatus } from "@/types";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  HEALTHY: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  ADOPTABLE: "bg-secondary/15 text-primary border-secondary/30",
  URGENT: "bg-rose-500/15 text-rose-600 border-rose-500/30 animate-pulse-glow",
  WATCHING: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  RECOVERING: "bg-teal-500/15 text-teal-600 border-teal-500/30",
};

const recordStatusColor: Record<RecordStatus, string> = {
  ACTIVE: "bg-rose-500",
  URGENT: "bg-rose-500",
  RESOLVED: "bg-teal-500",
  GOOD: "bg-teal-500",
  PLANNED: "bg-amber-500",
};

function getInitials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AnimalProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donateOpen, setDonateOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;

    async function fetchAnimal() {
      try {
        setLoading(true);
        const res = await fetch(`/api/animals/${id}`);
        if (!res.ok) throw new Error("Failed to load animal profile");
        const data = await res.json();
        setAnimal(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchAnimal();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <GlassCard className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-[#1a1a1a] mb-2">
            Could not load profile
          </h2>
          <p className="text-muted-foreground mb-6">
            {error || "Animal not found."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="btn-gradient px-6 py-2.5 rounded-xl font-semibold"
          >
            Go home
          </button>
        </GlassCard>
      </div>
    );
  }

  const healthRecords = (animal.healthRecords || []).slice().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const careTeam = Array.from(
    new Map(
      (animal.feederLogs || [])
        .filter((log) => log.user)
        .map((log) => [log.user.id, log.user])
    ).values()
  );

  const adoptable = animal.adoptable || animal.status === "ADOPTABLE";

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[55vh] min-h-[360px] w-full overflow-hidden">
        <div
          className="relative w-full h-full cursor-pointer"
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setLightboxOpen(true);
          }}
          aria-label={`Open full image of ${animal.name}`}
        >
          <Image
            src={animal.image}
            alt={animal.name}
            fill
            priority
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />

        <button
          onClick={() => router.push("/")}
          className="absolute top-20 right-4 sm:right-8 z-10 p-2.5 rounded-full bg-black/20 backdrop-blur-md border border-black/[0.08] text-white hover:bg-black/[0.05] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-4",
                  statusStyles[animal.status] ||
                    "bg-black/[0.05] text-[#1a1a1a] border-black/[0.08]"
                )}
              >
                <Activity className="w-3.5 h-3.5" />
                {animal.status}
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-2">
                {animal.name}
                {animal.nickname && (
                  <span className="text-2xl sm:text-3xl font-medium text-primary ml-3">
                    “{animal.nickname}”
                  </span>
                )}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/[0.03] border border-black/[0.08] text-sm text-[#1a1a1a]/90">
                  <Calendar className="w-4 h-4 text-primary" />
                  {animal.ageApprox}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/[0.03] border border-black/[0.08] text-sm text-[#1a1a1a]/90">
                  <Heart className="w-4 h-4 text-rose-600" />
                  {animal.gender}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/[0.03] border border-black/[0.08] text-sm text-[#1a1a1a]/90">
                  <MapPin className="w-4 h-4 text-primary" />
                  {animal.zone}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <ScrollReveal>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-bold text-[#1a1a1a] mb-4">
                  About {animal.name}
                </h2>
                <p className="text-[#1a1a1a]/80 leading-relaxed">
                  {animal.description}
                </p>
                {animal.tags && animal.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {animal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </GlassCard>

              <GlassCard className="p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-bold text-[#1a1a1a] mb-6">
                  Health Journey
                </h2>
                {healthRecords.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No health records yet.
                  </p>
                ) : (
                  <div className="relative pl-4">
                    <div className="absolute left-[21px] top-2 bottom-2 w-px bg-black/[0.05]" />
                    <div className="space-y-6">
                      {healthRecords.map((record: HealthRecord) => (
                        <div key={record.id} className="relative flex gap-4">
                          <span
                            className={cn(
                              "relative z-10 mt-1.5 w-3 h-3 rounded-full shrink-0 ring-4 ring-[#0f172a]",
                              recordStatusColor[record.status] || "bg-muted"
                            )}
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground">
                                {formatDate(record.date)}
                              </span>
                              <span
                                className={cn(
                                  "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold",
                                  record.status === "URGENT" ||
                                    record.status === "ACTIVE"
                                    ? "bg-rose-500/15 text-rose-600"
                                    : record.status === "PLANNED"
                                    ? "bg-amber-500/15 text-amber-600"
                                    : "bg-teal-500/15 text-teal-600"
                                )}
                              >
                                {record.status}
                              </span>
                              {record.funded ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600">
                                  <CheckCircle2 className="w-3 h-3" /> Funded
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-600">
                                  <Clock className="w-3 h-3" /> Needs funding
                                </span>
                              )}
                            </div>
                            <p className="text-[#1a1a1a]/90 font-medium">
                              {record.event}
                            </p>
                            {record.cost ? (
                              <p className="text-xs text-muted-foreground mt-1">
                                Est. cost ₹{record.cost.toLocaleString("en-IN")}
                                {record.raised
                                  ? ` · ₹${record.raised.toLocaleString(
                                      "en-IN"
                                    )} raised`
                                  : ""}
                              </p>
                            ) : null}
                            {record.receiptUrl && (
                              <a
                                href={record.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2 text-xs text-primary hover:text-primary transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                View receipt
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>

            <div className="space-y-6">
              <ScrollReveal delay={0.1}>
                <GlassCard className="p-6">
                  <h3 className="font-heading text-lg font-bold text-[#1a1a1a] mb-4">
                    Care Team
                  </h3>
                  {careTeam.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No feeders assigned yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {careTeam.map((user) => (
                        <div key={user.id} className="flex items-center gap-3">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name || "Feeder"}
                              width={40}
                              height={40}
                              unoptimized
                              className="w-10 h-10 rounded-full object-cover border border-black/[0.08]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                              {getInitials(user.name)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#1a1a1a]">
                              {user.name || "Anonymous feeder"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Regular feeder
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <GlassCard className="p-6 text-center">
                  <h3 className="font-heading text-lg font-bold text-[#1a1a1a] mb-2">
                    Want to help {animal.name}?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    {adoptable
                      ? `${animal.name} is looking for a forever home.`
                      : `Your support funds food, medical care, and safety for ${animal.name}.`}
                  </p>
                  {adoptable ? (
                    <button
                      onClick={() => {
                        const el = document.getElementById("adoption-quiz");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full btn-gradient py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      Start Adoption <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setDonateOpen(true)}
                      className="w-full btn-gradient py-3 rounded-xl font-semibold"
                    >
                      Sponsor {animal.name}
                    </button>
                  )}
                </GlassCard>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>

        {adoptable && (
          <ScrollReveal>
            <div id="adoption-quiz">
              <GlassCard className="p-6 sm:p-8 text-center">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-3">
                  Apply to adopt {animal.name}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                  Tell us a little about your home and experience. Our trust will
                  review your application and schedule meet-and-greets.
                </p>
                <button
                  onClick={() => showToast("Adoption application submitted", "success")}
                  className="btn-gradient px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-lg hover:shadow-black/10 transition-shadow"
                >
                  Begin application <ArrowRight className="w-4 h-4" />
                </button>
              </GlassCard>
            </div>
          </ScrollReveal>
        )}
      </main>

      <Footer />

      <DonateModal
        isOpen={donateOpen}
        onClose={() => setDonateOpen(false)}
        animalId={animal.id}
        animalName={animal.name}
        defaultAmount={600}
      />

      <ImageLightbox
        images={[{ src: animal.image, alt: animal.name }]}
        currentIndex={0}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
