"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapComponentProps } from "./MapComponent";
import { Zone } from "@/types";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

const STATUS_COLORS: Record<Zone["status"], string> = {
  green: "#14b8a6",
  amber: "#f59e0b",
  red: "#f43f5e",
};

const STATUS_LABELS: Record<Zone["status"], string> = {
  green: "Safe",
  amber: "Needs care",
  red: "Urgent",
};

const DEFAULT_CENTER: L.LatLngExpression = [19.153, 72.877];
const DEFAULT_ZOOM = 15;

function createZoneIcon(status: Zone["status"], urgent: boolean) {
  const color = STATUS_COLORS[status];

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8">
      ${urgent ? `<span class="absolute inset-0 rounded-full animate-ping opacity-40" style="background:${color};"></span>` : ""}
      <span class="relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 border-white" style="background:${color};box-shadow:0 2px 10px rgba(0,0,0,0.25);">
        <span class="block w-2 h-2 rounded-full bg-white"></span>
      </span>
    </div>
  `;

  return L.divIcon({
    className: "bg-transparent",
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function Legend() {
  return (
    <div className="absolute bottom-4 left-4 z-[400] glass px-4 py-3 space-y-2">
      <p className="text-xs font-semibold text-[#1a1a1a]/80 uppercase tracking-wider">
        Zone Status
      </p>
      {(Object.keys(STATUS_COLORS) as Zone["status"][]).map((status) => (
        <div key={status} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[status] }}
          />
          {STATUS_LABELS[status]}
        </div>
      ))}
    </div>
  );
}

interface MapControllerProps {
  activeZone?: Zone | null;
}

function MapController({ activeZone }: MapControllerProps) {
  const map = useMap();
  const lastZoneRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeZone && activeZone.name !== lastZoneRef.current) {
      lastZoneRef.current = activeZone.name;
      map.flyTo([activeZone.lat, activeZone.lng], 17, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [activeZone, map]);

  return null;
}

function ResetViewButton() {
  const map = useMap();

  return (
    <button
      onClick={() => map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1 })}
      className="absolute top-4 right-4 z-[400] glass px-3 py-2 rounded-xl text-xs font-semibold text-[#555555] hover:text-primary hover:bg-white transition-colors flex items-center gap-2 shadow-sm"
      aria-label="Reset map view"
    >
      <RotateCcw className="w-3.5 h-3.5" />
      Reset View
    </button>
  );
}

interface MapInnerProps extends MapComponentProps {
  activeZone?: Zone | null;
}

export default function MapInner({ zones = [], onZoneClick, activeZone }: MapInnerProps) {
  return (
    <>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="h-[500px] w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        <MapController activeZone={activeZone} />
        <ResetViewButton />
        {zones.map((zone, index) => {
          const urgent = zone.status === "red" || zone.status === "amber";
          const isActive = activeZone?.name === zone.name;
          return (
            <Marker
              key={`${zone.name}-${index}`}
              position={[zone.lat, zone.lng]}
              icon={createZoneIcon(zone.status, urgent)}
              eventHandlers={{
                click: () => {
                  onZoneClick?.(zone);
                },
              }}
              opacity={isActive ? 1 : 0.85}
            >
              <Popup>
                <div className="p-1 min-w-[170px]">
                  <h3 className="font-heading font-semibold text-[#1a1a1a] mb-1">
                    {zone.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {zone.animalCount} animals · {zone.feederCount} feeders
                  </p>
                  <button
                    onClick={() => onZoneClick?.(zone)}
                    className={cn(
                      "w-full btn-gradient py-1.5 rounded-lg text-sm font-medium transition-shadow",
                      "hover:shadow-lg hover:shadow-black/10"
                    )}
                  >
                    View Zone
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <Legend />
    </>
  );
}
