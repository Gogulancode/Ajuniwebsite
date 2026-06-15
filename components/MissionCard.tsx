"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Share2, Heart, Clock, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { DonateModal } from "./DonateModal";
import { ImageLightbox } from "./ImageLightbox";
import { useToast } from "@/hooks/useToast";
import { cn, formatCurrency } from "@/lib/utils";
import { Mission } from "@/types";

interface MissionCardProps {
  mission: Mission;
  className?: string;
}

export function MissionCard({ mission, className }: MissionCardProps) {
  const [donateOpen, setDonateOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { showToast } = useToast();

  const progress = Math.min(100, Math.round((mission.raised / mission.target) * 100));
  const urgent = progress < 40 || mission.daysLeft <= 7;
  const updates = mission.updates?.slice(0, 3) || [];

  async function handleShare() {
    const url = `${window.location.origin}/mission/${mission.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("Mission link copied!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(url, "_blank");
    }
  }

  return (
    <>
      <GlassCard className={cn("overflow-hidden flex flex-col h-full", className)} hover>
        <div
          className="relative aspect-[16/10] overflow-hidden cursor-pointer"
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setLightboxOpen(true);
          }}
          aria-label={`Open image of ${mission.title}`}
        >
          <Image
            src={mission.image}
            alt={mission.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {urgent && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold backdrop-blur-sm">
              <AlertCircle className="w-3.5 h-3.5" />
              Urgent
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-heading text-xl font-bold text-[#1a1a1a] mb-2 line-clamp-1">
            {mission.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {mission.description}
          </p>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-[#1a1a1a]">{formatCurrency(mission.raised)}</span>
              <span className="text-muted-foreground">
                of {formatCurrency(mission.target)} ({progress}%)
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  urgent ? "bg-gradient-to-r from-rose-500 to-amber-500" : "bg-gradient-to-r from-primary to-[#0178c8]"
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {mission.donors} donor{mission.donors !== 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {mission.daysLeft} day{mission.daysLeft !== 1 ? "s" : ""} left
            </div>
          </div>

          {updates.length > 0 && (
            <div className="mb-5 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent updates
              </p>
              <div className="space-y-2">
                {updates.map((update) => (
                  <div key={update.id} className="flex gap-3 text-sm">
                    <div className="mt-1">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[#555555] line-clamp-1">{update.text}</p>
                      <p className="text-xs text-muted-foreground">{update.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => setDonateOpen(true)}
              className={cn(
                "flex-1 btn-gradient py-2.5 rounded-xl text-sm font-semibold transition-shadow",
                "hover:shadow-lg hover:shadow-black/10 flex items-center justify-center gap-2"
              )}
            >
              <Heart className="w-4 h-4" />
              Contribute Now
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-2.5 rounded-xl border border-black/[0.08] text-muted-foreground hover:text-primary hover:bg-black/[0.03] transition-colors"
              aria-label="Share mission"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </GlassCard>

      <DonateModal
        isOpen={donateOpen}
        onClose={() => setDonateOpen(false)}
        missionId={mission.id}
        animalName={mission.animal?.name}
      />

      <ImageLightbox
        images={[{ src: mission.image, alt: mission.title }]}
        currentIndex={0}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
