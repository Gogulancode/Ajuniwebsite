"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    quote:
      "Ajuni Foundation turned our neighborhood into a family. Knowing that every street dog has food, care, and someone watching out for them changes how we see Royal Palms.",
    author: "Priya Mehta",
    role: "Resident, Tower A",
    avatar: "PM",
  },
  {
    quote:
      "I started as a feeder two years ago. Today, I have helped rescue, treat, and rehome dozens of animals. The trust and community support here is unlike anything else.",
    author: "Rahul Nair",
    role: "Volunteer Feeder",
    avatar: "RN",
  },
  {
    quote:
      "Adopting Milo through Ajuni was seamless. They checked our home, guided us through vaccinations, and still stay in touch. We cannot imagine life without him.",
    author: "The Sharma Family",
    role: "Adopters",
    avatar: "SS",
  },
  {
    quote:
      "As a donor, I love the transparency. I get updates on missions, see where funds go, and feel truly connected to the animals I am helping.",
    author: "Ananya Das",
    role: "Monthly Guardian Donor",
    avatar: "AD",
  },
];

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const current = TESTIMONIALS[index];

  return (
    <section id="testimonials" className="py-14 md:py-[4.5rem] relative bg-muted overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-warm text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-4">
              Community Voices
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
              Stories from the Neighborhood
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from residents, feeders, adopters, and donors who make Ajuni Foundation possible.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="relative bg-white border border-black/[0.08] rounded-3xl shadow-sm p-8 md:p-12">
            <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />

            <div className="min-h-[200px] flex flex-col items-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.author}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg md:text-xl text-[#1a1a1a] leading-relaxed mb-8 max-w-3xl">
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold border border-primary/20">
                      {current.avatar}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-[#1a1a1a]">{current.author}</p>
                      <p className="text-sm text-muted-foreground">{current.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={prev}
                className="p-2.5 rounded-full border border-black/[0.08] text-[#555555] hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === index ? "bg-primary w-5" : "bg-black/15 hover:bg-black/25"
                    )}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-2.5 rounded-full border border-black/[0.08] text-[#555555] hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
