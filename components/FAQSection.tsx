"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "How are donations used?",
    answer:
      "100% of donations fund food, medical care, sterilization drives, and rescue operations. We publish quarterly impact reports so you can see exactly how your contribution helps the animals of Royal Palms and Aarey Colony.",
  },
  {
    question: "Can I choose which animal to sponsor?",
    answer:
      "Yes. Every resident has a profile where you can donate directly toward their food and medical needs. You can also become a monthly Guardian Donor to support the entire community.",
  },
  {
    question: "What does a feeder volunteer do?",
    answer:
      "Feeders check in daily on animals in their assigned zone, provide meals, report medical concerns, and share photos. We provide guidance, supplies, and a supportive network so you never work alone.",
  },
  {
    question: "How do adoptions work?",
    answer:
      "Start with our matching quiz, then submit a short application. Our trust reviews home suitability, schedules a meet-and-greet, and provides vaccination and lifelong guidance support.",
  },
  {
    question: "Is Ajuni Foundation registered?",
    answer:
      "Yes, Ajuni Foundation is a registered animal welfare trust operating in Royal Palms, Aarey Colony, Mumbai. We are volunteer-run and committed to full transparency.",
  },
  {
    question: "Can I volunteer without feeding animals daily?",
    answer:
      "Absolutely. We need help with rescue coordination, events, foster care, content, and fundraising. Reach out and we will match your skills with a meaningful role.",
  },
];

function FAQItem({ item, isOpen, onToggle }: { item: typeof FAQS[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-black/[0.08] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-heading font-semibold text-[#1a1a1a] group-hover:text-primary transition-colors">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 w-8 h-8 rounded-full bg-black/[0.03] flex items-center justify-center group-hover:bg-primary/10 transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-primary" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className={cn("pb-5 text-muted-foreground leading-relaxed", isOpen && "pr-8")}>
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-14 md:py-[4.5rem] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              Got Questions?
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to know about donating, volunteering, and adopting with Ajuni Foundation.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-white border border-black/[0.08] rounded-2xl shadow-sm px-6 md:px-8">
            {FAQS.map((item, index) => (
              <FAQItem
                key={item.question}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
