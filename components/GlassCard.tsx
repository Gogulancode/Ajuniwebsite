import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "bg-white border border-black/[0.08] rounded-2xl shadow-sm",
        hover &&
          "hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg hover:shadow-black/5 transition-all duration-300",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
