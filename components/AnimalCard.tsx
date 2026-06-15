"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Activity } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { ImageLightbox } from "./ImageLightbox";
import { cn } from "@/lib/utils";
import { Animal } from "@/types";

interface AnimalCardProps {
  animal: Animal;
  className?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  HEALTHY: { label: "Healthy", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  ADOPTABLE: { label: "Adoptable", color: "bg-primary/10 text-primary border-primary/20" },
  URGENT: { label: "Urgent", color: "bg-rose-100 text-rose-700 border-rose-200" },
  WATCHING: { label: "Watching", color: "bg-amber-100 text-amber-700 border-amber-200" },
  RECOVERING: { label: "Recovering", color: "bg-teal-100 text-teal-700 border-teal-200" },
};

export function AnimalCard({ animal, className }: AnimalCardProps) {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const status = statusConfig[animal.status] || statusConfig.HEALTHY;
  const tags = animal.tags.slice(0, 3);

  return (
    <>
      <GlassCard
        className={cn("group overflow-hidden cursor-pointer", className)}
        onClick={() => router.push(`/animal/${animal.id}`)}
      >
        <div
          className="relative aspect-[4/3] overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              setLightboxOpen(true);
            }
          }}
          aria-label={`Open image of ${animal.name}`}
        >
          <Image
            src={animal.image}
            alt={animal.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm",
                status.color
              )}
            >
              {status.label}
            </span>
            {animal.adoptable && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-warm text-[#1a1a1a] border-warm/30 backdrop-blur-sm flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Ready for home
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-1.5 text-xs text-white/90 mb-1">
              <MapPin className="w-3 h-3 text-warm" />
              {animal.zone}
            </div>
            <h3 className="font-heading text-xl font-bold text-white">{animal.name}</h3>
            {animal.nickname && (
              <p className="text-sm text-white/80 italic">&ldquo;{animal.nickname}&rdquo;</p>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-muted-foreground">{animal.ageApprox}</span>
            <span className="text-muted-foreground capitalize">{animal.gender}</span>
          </div>

          {animal.healthRecords && animal.healthRecords.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {animal.healthRecords.length} health record
                {animal.healthRecords.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-[#555555] border border-black/[0.05]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      <ImageLightbox
        images={[{ src: animal.image, alt: animal.name }]}
        currentIndex={0}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
