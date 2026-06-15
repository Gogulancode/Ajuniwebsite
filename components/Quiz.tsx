"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, RotateCcw, User, Sparkles, CalendarHeart, PawPrint } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";
import { Animal } from "@/types";

export interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (answers: Record<string, string>) => void;
  result?: Animal | null;
  isLoading?: boolean;
  onRetake?: () => void;
  onViewProfile?: (animal: Animal) => void;
}

export function Quiz({
  questions,
  onComplete,
  result,
  isLoading,
  onRetake,
  onViewProfile,
}: QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = questions[step];
  const selected = current ? answers[current.id] : undefined;
  const isLast = step === questions.length - 1;

  function handleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function handleContinue() {
    if (!selected) return;
    if (isLast) {
      onComplete(answers);
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleRetake() {
    setStep(0);
    setAnswers({});
    onRetake?.();
  }

  if (result) {
    return (
      <GlassCard className="p-6 md:p-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm text-[#1a1a1a] text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Best Match
        </div>
        <div className="relative w-40 h-40 mx-auto mb-6 rounded-2xl overflow-hidden border border-black/[0.08]">
          <Image
            src={result.image}
            alt={result.name}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="font-heading text-3xl font-bold text-[#1a1a1a] mb-2">{result.name}</h3>
        {result.nickname && (
          <p className="text-muted-foreground italic mb-4">&ldquo;{result.nickname}&rdquo;</p>
        )}
        <p className="text-muted-foreground mb-2">
          {result.ageApprox} · {result.gender} · {result.zone}
        </p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 line-clamp-3">
          {result.description}
        </p>
        <div className="flex flex-col gap-3 justify-center">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onViewProfile?.(result)}
              className="btn-gradient px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-black/10 transition-shadow flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              View Profile
            </button>
            <a
              href="mailto:hello@ajunifoundation.org?subject=Meet%20%26%20Greet%20Request"
              className="px-6 py-3 rounded-xl border border-black/[0.08] text-[#555555] hover:text-primary hover:bg-black/[0.03] transition-colors flex items-center justify-center gap-2"
            >
              <CalendarHeart className="w-4 h-4" />
              Schedule a Meet & Greet
            </a>
          </div>
          <a
            href="#residents"
            className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <PawPrint className="w-4 h-4" />
            View all adoptable animals
          </a>
          <button
            onClick={handleRetake}
            className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-[#1a1a1a] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === step
                  ? "w-8 bg-primary"
                  : index < step
                  ? "w-2 bg-primary"
                  : "w-2 bg-black/[0.08]"
              )}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          Step {step + 1} of {questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-6">
            {current.question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {current.options.map((option) => {
              const isSelected = selected === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "text-left p-4 rounded-xl border transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(1,88,159,0.1)]"
                      : "border-black/[0.08] bg-white hover:border-primary/30 hover:bg-black/[0.02]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                        isSelected ? "border-primary" : "border-black/[0.15]"
                      )}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className={cn("font-semibold", isSelected ? "text-primary" : "text-[#1a1a1a]")}>
                        {option.label}
                      </p>
                      {option.description && (
                        <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selected || isLoading}
          className={cn(
            "btn-gradient px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2",
            "hover:shadow-lg hover:shadow-black/10",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          )}
        >
          {isLoading ? (
            "Matching…"
          ) : isLast ? (
            <>Find Match <Sparkles className="w-4 h-4" /></>
          ) : (
            <>Continue <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </GlassCard>
  );
}
