"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  AlertCircle,
  UploadCloud,
  PawPrint,
  TrendingUp,
  Award,
  Navigation,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { Animal } from "@/types";

export const dynamic = "force-dynamic";

function calculateStreak(logs: any[]): number {
  if (!logs.length) return 0;
  const dates = Array.from(new Set(logs.map((l) => {
    const d = new Date(l.date);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }))].sort().reverse();

  let streak = 0;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const yesterdayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate() - 1}`;

  // Check if active today or yesterday
  const hasToday = dates.includes(todayStr);
  const hasYesterday = dates.includes(yesterdayStr);
  if (!hasToday && !hasYesterday) return 0;

  // Count streak
  const checkDate = new Date(today);
  while (true) {
    const dateStr = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    if (dates.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function calculateBadge(totalFeeds: number) {
  if (totalFeeds >= 100) return { badgeTitle: "Neighborhood Legend", badgeProgress: 100 };
  if (totalFeeds >= 50) return { badgeTitle: "Gold Guardian", badgeProgress: Math.round(((totalFeeds - 50) / 50) * 100) };
  if (totalFeeds >= 20) return { badgeTitle: "Silver Feeder", badgeProgress: Math.round(((totalFeeds - 20) / 30) * 100) };
  return { badgeTitle: "Bronze Beginner", badgeProgress: Math.round((totalFeeds / 20) * 100) };
}

function getNextBadgeMessage(totalFeeds: number) {
  if (totalFeeds >= 100) return "You've reached the highest badge!";
  if (totalFeeds >= 50) return `${100 - totalFeeds} more visits to unlock Neighborhood Legend.`;
  if (totalFeeds >= 20) return `${50 - totalFeeds} more visits to unlock Gold Guardian.`;
  return `${20 - totalFeeds} more visits to unlock Silver Feeder.`;
}

const mockRoutes = [
  { id: "r1", name: "Tower A — Morning round", time: "07:00 AM", animals: 6, checked: false },
  { id: "r2", name: "Tower C — Midday check", time: "12:30 PM", animals: 4, checked: true },
  { id: "r3", name: "Green patch — Evening feed", time: "06:00 PM", animals: 8, checked: false },
  { id: "r4", name: "Parking basement patrol", time: "09:00 PM", animals: 3, checked: false },
];

export default function FeederDashboardPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [medicalCases, setMedicalCases] = useState<Animal[]>([]);
  const [routes, setRoutes] = useState(mockRoutes);

  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [feederStats, setFeederStats] = useState({
    visitsThisMonth: 0,
    uniqueAnimalsFed: 0,
    photosShared: 0,
    streakDays: 0,
    badgeProgress: 0,
    badgeTitle: "Bronze Beginner",
    totalFeeds: 0,
  });

  function getErrorMessage(err: unknown) {
    return err instanceof Error ? err.message : "Something went wrong";
  }

  useEffect(() => {
    async function fetchAnimals() {
      try {
        const res = await fetch("/api/animals");
        if (!res.ok) throw new Error("Failed to fetch animals");
        const data = await res.json();
        setAnimals(data);
        setMedicalCases(
          data.filter(
            (a: Animal) => a.status === "URGENT" || a.status === "RECOVERING"
          )
        );
      } catch (err) {
        console.error(err);
      }
    }
    fetchAnimals();
  }, []);

  useEffect(() => {
    async function fetchFeederStats() {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/feeders/logs?userId=${session.user.id}`);
        if (!res.ok) return;
        const logs = await res.json();

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        // This month's logs
        const monthLogs = logs.filter((l: any) => {
          const d = new Date(l.date);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        });

        const visitsThisMonth = monthLogs.length;
        const uniqueAnimalsFed = new Set(monthLogs.map((l: any) => l.animalId)).size;
        const photosShared = monthLogs.filter((l: any) => l.photoUrl).length;
        const totalFeeds = logs.length;

        // Calculate streak (consecutive days with feeds)
        const streakDays = calculateStreak(logs);

        // Calculate badge progress
        const { badgeTitle, badgeProgress } = calculateBadge(totalFeeds);

        setFeederStats({
          visitsThisMonth,
          uniqueAnimalsFed,
          photosShared,
          streakDays,
          badgeProgress,
          badgeTitle,
          totalFeeds,
        });
      } catch (err) {
        console.error("Failed to fetch feeder stats:", err);
      }
    }

    if (status === "authenticated") {
      fetchFeederStats();
    }
  }, [session, status]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      setMessage({ type: "error", text: "Cloudinary cloud name is not configured. Paste a URL instead." });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ajuni_feeder_photos");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setPhotoUrl(data.secure_url);
        setMessage({ type: "success", text: "Photo uploaded successfully." });
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setUploading(false);
    }
  }

  function captureLocation() {
    if (!navigator.geolocation) {
      setMessage({ type: "error", text: "Geolocation is not supported by your browser." });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setMessage({ type: "error", text: "Could not capture location." });
        setLocating(false);
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAnimal || !photoUrl) {
      setMessage({ type: "error", text: "Please select an animal and provide a photo." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/feeders/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animalId: selectedAnimal,
          photoUrl,
          notes,
          latitude: location?.lat,
          longitude: location?.lng,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit log");
      setMessage({ type: "success", text: "Feeding log submitted." });
      showToast("Check-in submitted", "success");
      setSelectedAnimal("");
      setNotes("");
      setPhotoUrl("");
      setLocation(null);
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <GlassCard className="p-8 text-center max-w-sm">
          <PawPrint className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-[#1a1a1a] mb-2">Feeder Access</h2>
          <p className="text-muted-foreground text-sm mb-6">Please sign in to access the feeder dashboard.</p>
          <a href="/login" className="btn-gradient px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </a>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                Feeder Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {session?.user?.name || "feeder"}. Plan your day and log visits.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Award className="w-4 h-4" />
              {feederStats.badgeTitle} — {feederStats.badgeProgress}%
            </div>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal>
              <GlassCard className="p-6">
                <h2 className="font-heading text-xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary" />
                  Today&apos;s Schedule
                </h2>
                <div className="space-y-3">
                  {routes.map((route) => (
                    <div
                      key={route.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-black/[0.03] border border-black/[0.08]"
                    >
                      <div>
                        <p className="font-medium text-[#1a1a1a]">{route.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {route.time} · {route.animals} animals
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setRoutes((prev) =>
                            prev.map((r) =>
                              r.id === route.id ? { ...r, checked: !r.checked } : r
                            )
                          )
                        }
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                          route.checked
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        )}
                      >
                        {route.checked ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Checked in
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" /> Check in
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal>
              <GlassCard className="p-6">
                <h2 className="font-heading text-xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Log a Feeding Visit
                </h2>

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "mb-4 p-3 rounded-lg text-sm flex items-center gap-2",
                      message.type === "success"
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-rose-500/15 text-rose-600"
                    )}
                  >
                    {message.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {message.text}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Animal
                    </label>
                    <select
                      value={selectedAnimal}
                      onChange={(e) => setSelectedAnimal(e.target.value)}
                      className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] focus:outline-none focus:border-primary/50"
                    >
                      <option value="" className="bg-card">
                        Select an animal
                      </option>
                      {animals.map((animal) => (
                        <option key={animal.id} value={animal.id} className="bg-card">
                          {animal.name} {animal.nickname ? `“${animal.nickname}”` : ""} — {animal.zone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Photo
                    </label>
                    {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                      <label className="flex items-center justify-center gap-2 w-full px-4 py-8 rounded-xl border border-dashed border-black/[0.12] bg-black/[0.03] hover:bg-black/[0.05] cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        {uploading ? (
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        ) : photoUrl ? (
                          <span className="text-sm text-emerald-600 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Photo ready
                          </span>
                        ) : (
                          <>
                            <UploadCloud className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Upload feeding photo
                            </span>
                          </>
                        )}
                      </label>
                    ) : (
                      <input
                        type="url"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="Paste image URL"
                        className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                      />
                    )}
                    {photoUrl && (
                      <div className="mt-3 relative w-full h-40 rounded-xl overflow-hidden border border-black/[0.08]">
                        <Image
                          src={photoUrl}
                          alt="Preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="How did the animal look? Any concerns?"
                      className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Location
                    </label>
                    <button
                      type="button"
                      onClick={captureLocation}
                      disabled={locating}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors",
                        location
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600"
                          : "bg-black/[0.03] border-black/[0.08] text-[#1a1a1a]/80 hover:bg-black/[0.05]"
                      )}
                    >
                      {locating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      {location
                        ? `Location captured (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
                        : "Capture geolocation"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !selectedAnimal || !photoUrl}
                    className="w-full btn-gradient py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                      </span>
                    ) : (
                      "Submit feeding log"
                    )}
                  </button>
                </form>
              </GlassCard>
            </ScrollReveal>
          </div>

          <div className="space-y-6">
            <ScrollReveal delay={0.1}>
              <GlassCard className="p-6">
                <h3 className="font-heading text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  This Month
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Visits logged</span>
                    <span className="text-[#1a1a1a] font-semibold">{feederStats.visitsThisMonth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Animals fed</span>
                    <span className="text-[#1a1a1a] font-semibold">{feederStats.uniqueAnimalsFed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Photos shared</span>
                    <span className="text-[#1a1a1a] font-semibold">{feederStats.photosShared}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Streak</span>
                    <span className="text-primary font-semibold">{feederStats.streakDays} days</span>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <GlassCard className="p-6">
                <h3 className="font-heading text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  Active Medical Cases
                </h3>
                {medicalCases.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No active medical cases flagged right now.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {medicalCases.map((animal) => (
                      <a
                        key={animal.id}
                        href={`/animal/${animal.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-black/[0.03] border border-black/[0.08] hover:border-primary/30 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={animal.image}
                            alt={animal.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1a1a1a] truncate">
                            {animal.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {animal.status} · {animal.zone}
                          </p>
                        </div>
                        <PawPrint className="w-4 h-4 text-muted-foreground/60" />
                      </a>
                    ))}
                  </div>
                )}
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <GlassCard className="p-6">
                <h3 className="font-heading text-lg font-bold text-[#1a1a1a] mb-3">
                  Badge Progress
                </h3>
                <div className="w-full h-3 rounded-full bg-black/[0.05] overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${feederStats.badgeProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {getNextBadgeMessage(feederStats.totalFeeds)}
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
