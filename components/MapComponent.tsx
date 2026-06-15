"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Zone } from "@/types";

export interface MapComponentProps {
  zones?: Zone[];
  onZoneClick?: (zone: Zone) => void;
  className?: string;
  activeZone?: Zone | null;
}

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full glass animate-pulse flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading map…</p>
    </div>
  ),
});

export default function MapComponent({
  zones = [],
  onZoneClick,
  className,
  activeZone,
}: MapComponentProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl overflow-hidden border border-black/[0.08] shadow-sm",
        className
      )}
      style={{ minHeight: 500 }}
    >
      <MapInner zones={zones} onZoneClick={onZoneClick} activeZone={activeZone} />
    </div>
  );
}
