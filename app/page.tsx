"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  Heart,
  Shield,
  Home,
  Users,
  AlertCircle,
  CheckCircle2,
  Award,
  Medal,
  Trophy,
  Star,
  ArrowRight,
  UtensilsCrossed,
  HandHeart,
  Search,
  Calendar,
  TrendingUp,
  Stethoscope,
  HeartHandshake,
  FileText,
  Mail,
  Send,
  ShieldCheck,
  ScrollText,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";
import MapComponent from "@/components/MapComponent";
import { AnimalCard } from "@/components/AnimalCard";
import { MissionCard } from "@/components/MissionCard";
import { Quiz, QuizQuestion } from "@/components/Quiz";
import { Footer } from "@/components/Footer";
import { DonateModal } from "@/components/DonateModal";
import { FAQSection } from "@/components/FAQSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { RescueStoriesSection } from "@/components/RescueStoriesSection";
import { FloatingHelpButton } from "@/components/FloatingHelpButton";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { Animal, Mission, Zone, QuizAnswer } from "@/types";

const ZONES: Zone[] = [
  { name: "Tower Cluster A", lat: 19.154, lng: 72.878, status: "green", animalCount: 12, feederCount: 3 },
  { name: "Back Gate", lat: 19.153, lng: 72.877, status: "amber", animalCount: 8, feederCount: 2 },
  { name: "Parking Bay", lat: 19.1525, lng: 72.8765, status: "red", animalCount: 6, feederCount: 4 },
  { name: "Aarey Edge", lat: 19.1515, lng: 72.8755, status: "amber", animalCount: 10, feederCount: 2 },
  { name: "Central Green", lat: 19.1535, lng: 72.8775, status: "green", animalCount: 11, feederCount: 3 },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "tower",
    question: "Which tower are you closest to?",
    options: [
      { value: "Tower A/B", label: "Tower A/B" },
      { value: "Tower C/D", label: "Tower C/D" },
      { value: "Near Royal Palms", label: "Near Royal Palms" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    id: "experience",
    question: "What is your pet experience?",
    options: [
      { value: "First-time", label: "First-time owner" },
      { value: "Had as child", label: "Had pets as a child" },
      { value: "Current pets", label: "Have pets currently" },
      { value: "Rescue expert", label: "Rescue expert" },
    ],
  },
  {
    id: "activity",
    question: "What is your activity level?",
    options: [
      { value: "Couch potato", label: "Couch potato" },
      { value: "Evening walks", label: "Evening walks" },
      { value: "Morning jogs", label: "Morning jogs" },
      { value: "Weekend hikes", label: "Weekend hikes" },
    ],
  },
  {
    id: "personality",
    question: "What personality do you prefer?",
    options: [
      { value: "Calm", label: "Calm" },
      { value: "Playful", label: "Playful" },
      { value: "Protective", label: "Protective" },
      { value: "Cuddly", label: "Cuddly" },
    ],
  },
];

const FEEDER_BADGES = [
  {
    title: "Neighborhood Legend",
    icon: Trophy,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    description: "100+ feeds · Trusted by every animal in the zone",
  },
  {
    title: "Gold Guardian",
    icon: Medal,
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    description: "50+ feeds · A reliable daily feeder",
  },
  {
    title: "Silver Feeder",
    icon: Award,
    color: "text-slate-600",
    bg: "bg-slate-50 border-slate-200",
    description: "20+ feeds · Building strong bonds",
  },
  {
    title: "Bronze Beginner",
    icon: Star,
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
    description: "First feeds · Every journey starts here",
  },
];

const HELP_CARDS = [
  {
    icon: Heart,
    title: "Donate",
    description: "Fund food, medicine, and rescue missions for the animals in our care.",
    cta: "Donate Now",
    action: "donate",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop",
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-200",
  },
  {
    icon: UtensilsCrossed,
    title: "Become a Feeder",
    description: "Join 40+ residents feeding our community animals daily across Royal Palms.",
    cta: "Join as Feeder",
    action: "feeders",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop",
    color: "text-[#1a1a1a]",
    bg: "bg-warm border-warm/50",
  },
  {
    icon: Home,
    title: "Adopt",
    description: "Give a forever home to a rescued dog or cat waiting for a family.",
    cta: "Meet Residents",
    action: "residents",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: HandHeart,
    title: "Foster / Volunteer",
    description: "Temporarily foster an animal or help with rescue operations and events.",
    cta: "Volunteer",
    action: "volunteer",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
  },
];

const IMPACT_BREAKDOWN = [
  { label: "Food & Nutrition", percent: 60, color: "#01589f", icon: UtensilsCrossed },
  { label: "Medical & Vet Care", percent: 25, color: "#ffefbc", icon: Stethoscope },
  { label: "Sterilization", percent: 10, color: "#14b8a6", icon: ShieldCheck },
  { label: "Operations", percent: 5, color: "#94a3b8", icon: TrendingUp },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [isInView, value, count, rounded]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/5"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: Math.random() * 4 + 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle, align = "center" }: { eyebrow: string; title: string; subtitle?: string; align?: "center" | "left" }) {
  return (
    <div className={cn("max-w-3xl mb-10 md:mb-12", align === "center" ? "text-center mx-auto" : "text-left")}>
      <span className="inline-block px-3 py-1 rounded-full bg-warm text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-4">
        {eyebrow}
      </span>
      <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
        {title}
      </h2>
      {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
    </div>
  );
}

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-80 rounded-2xl bg-muted border border-black/[0.05] animate-pulse"
        />
      ))}
    </div>
  );
}

function ImpactDonut() {
  const gradient = IMPACT_BREAKDOWN.map((item, index, arr) => {
    const previous = arr.slice(0, index).reduce((sum, i) => sum + i.percent, 0);
    return `${item.color} ${previous}% ${previous + item.percent}%`;
  }).join(", ");

  return (
    <div className="relative w-56 h-56 md:w-64 md:h-64 mx-auto">
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `conic-gradient(${gradient})`,
        }}
      />
      <div className="absolute inset-0 m-auto w-36 h-36 md:w-40 md:h-40 rounded-full bg-white flex flex-col items-center justify-center border border-black/[0.08] shadow-sm">
        <span className="text-3xl font-heading font-bold text-[#1a1a1a]">100%</span>
        <span className="text-xs text-muted-foreground">for animals</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [donateOpen, setDonateOpen] = useState(false);
  const [activeZone, setActiveZone] = useState<Zone | null>(null);

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalsLoading, setAnimalsLoading] = useState(true);
  const [animalsError, setAnimalsError] = useState<string | null>(null);
  const [animalFilter, setAnimalFilter] = useState<"ALL" | "DOG" | "CAT" | "ADOPTABLE">("ALL");

  const [missions, setMissions] = useState<Mission[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(true);
  const [missionsError, setMissionsError] = useState<string | null>(null);

  const [quizResult, setQuizResult] = useState<Animal | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  const [leaderboard, setLeaderboard] = useState<
    { tower: string; coverage: number; feederCount: number; animalCount?: number; feedCount?: number }[]
  >([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  useEffect(() => {
    async function fetchAnimals() {
      try {
        setAnimalsLoading(true);
        const params = new URLSearchParams();
        if (animalFilter === "DOG" || animalFilter === "CAT") params.set("type", animalFilter);
        if (animalFilter === "ADOPTABLE") params.set("adoptable", "true");
        const res = await fetch(`/api/animals?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch residents");
        const data = await res.json();
        setAnimals(data);
      } catch (err) {
        setAnimalsError(err instanceof Error ? err.message : "Could not load residents");
      } finally {
        setAnimalsLoading(false);
      }
    }
    fetchAnimals();
  }, [animalFilter]);

  useEffect(() => {
    async function fetchMissions() {
      try {
        setMissionsLoading(true);
        const res = await fetch("/api/missions");
        if (!res.ok) throw new Error("Failed to fetch missions");
        const data = await res.json();
        setMissions(data);
      } catch (err) {
        setMissionsError(err instanceof Error ? err.message : "Could not load missions");
      } finally {
        setMissionsLoading(false);
      }
    }
    fetchMissions();
  }, []);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLeaderboardLoading(true);
        const res = await fetch("/api/feeders/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        setLeaderboardError(err instanceof Error ? err.message : "Could not load leaderboard");
      } finally {
        setLeaderboardLoading(false);
      }
    }
    fetchLeaderboard();

    // Refresh leaderboard every 30 seconds so it stays current
    // as new feeder logs come in
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleQuizComplete(answers: Record<string, string>) {
    setQuizLoading(true);
    setQuizError(null);
    try {
      const payload: QuizAnswer = {
        tower: answers.tower,
        experience: answers.experience,
        activity: answers.activity,
        personality: answers.personality,
      };
      const res = await fetch("/api/adoption/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      if (!res.ok) throw new Error("Failed to find a match");
      const matches: Animal[] = await res.json();
      setQuizResult(matches[0] || null);
    } catch (err) {
      setQuizError(err instanceof Error ? err.message : "Could not find a match");
    } finally {
      setQuizLoading(false);
    }
  }

  function handleZoneClick(zone: Zone) {
    setActiveZone(zone);
    // eslint-disable-next-line no-console
    console.log("Selected zone:", zone.name);
  }

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setNewsletterEmail("");
    showToast("Thanks for signing up!", "success");
    setTimeout(() => setNewsletterSuccess(false), 4000);
  }

  const filteredAnimals = animals;

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20 pb-12 lg:pt-0 lg:pb-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,239,188,0.5),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(1,88,159,0.05),transparent_50%)]" />
        <FloatingParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left py-6 lg:py-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/[0.08] shadow-sm mb-8">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-[#555555]">
                  Registered Animal Welfare Trust · Royal Palms, Aarey Colony
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1a1a] mb-6 leading-tight">
                No Street Animal Sleeps Hungry.
                <br />
                <span className="text-gradient">No Paw Walks Alone.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto lg:mx-0 mb-10">
                Ajuni Foundation is a community-powered animal welfare trust dedicated to feeding, healing, and homing the street animals of Royal Palms and Aarey Colony. Together with residents, feeders, and donors, we build a safety net where every life matters.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDonateOpen(true)}
                  className="btn-gradient px-8 py-4 rounded-full font-semibold text-base transition-shadow hover:shadow-lg hover:shadow-primary/25 flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Heart className="w-5 h-5" />
                  Donate Now
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href="#feeders"
                  className="px-8 py-4 rounded-full font-semibold text-base border border-black/[0.08] text-[#1a1a1a] hover:bg-black/[0.03] transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  Join as Feeder
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href="#adopt"
                  className="px-8 py-4 rounded-full font-semibold text-base border border-black/[0.08] text-[#1a1a1a] hover:bg-black/[0.03] transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Home className="w-5 h-5" />
                  Adopt a Friend
                </motion.a>
              </div>

              <div className="mb-8">
                <a
                  href="#map"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Explore the Network
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <p className="text-sm text-muted-foreground mb-12">
                <span className="text-primary font-medium">100% of donations</span> fund food, medical care, and sterilization.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-black/[0.08] shadow-2xl shadow-black/5">
                <Image
                  src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&auto=format&fit=crop"
                  alt="Rescue dog looking hopeful"
                  fill
                  className="object-cover"
                  priority
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl shadow-black/5 p-5 border border-black/[0.08] max-w-[220px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-warm flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-[#1a1a1a]">47 animals</p>
                    <p className="text-xs text-muted-foreground">in our care network</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto lg:mx-0 -mt-8 lg:-mt-16 mb-8 lg:mb-0"
          >
            {[
              { label: "Animals in care", value: 47, icon: Heart },
              { label: "Sterilized", value: 32, icon: Shield },
              { label: "Adopted", value: 14, icon: Home },
              { label: "Active feeders", value: 43, icon: Users },
            ].map((stat) => (
              <GlassCard
                key={stat.label}
                className="p-5 text-center"
                hover={false}
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <p className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-1">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </GlassCard>
            ))}
          </motion.div>
        </div>

        <motion.a
          href="#mission"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors hidden lg:block"
          aria-label="Scroll to mission"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.a>
      </section>

      {/* Mission */}
      <section id="mission" className="py-14 md:py-[4.5rem] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <ScrollReveal>
              <div className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden border border-black/[0.08] shadow-lg shadow-black/5">
                <Image
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"
                  alt="Volunteer caring for a street dog"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass px-4 py-3 inline-flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-medium text-[#1a1a1a]">For every life on our streets</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <SectionHeading
                eyebrow="Our Mission"
                title="Care, Compassion, Community"
                subtitle="We exist to turn everyday kindness into lasting protection for the animals who share our neighborhood."
                align="left"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    icon: UtensilsCrossed,
                    title: "Feed Daily",
                    description: "Reliable meals for every animal in our care zones.",
                  },
                  {
                    icon: Stethoscope,
                    title: "Heal & Vaccinate",
                    description: "Medical treatment, anti-rabies shots, and sterilization drives.",
                  },
                  {
                    icon: Home,
                    title: "Find Homes",
                    description: "Adoption matching for suitable street animals and foster support.",
                  },
                ].map((pillar) => (
                  <GlassCard key={pillar.title} className="p-5 text-center" hover>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                      <pillar.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-[#1a1a1a] mb-2">{pillar.title}</h3>
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  </GlassCard>
                ))}
              </div>

              <a
                href="#help"
                className="btn-gradient px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2 hover:shadow-lg hover:shadow-black/10 transition-shadow"
              >
                Learn more about our work
                <ArrowRight className="w-5 h-5" />
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Ways to Help */}
      <section id="help" className="py-14 md:py-[4.5rem] relative bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="How You Can Help"
              title="Be the Reason a Tail Wags"
              subtitle="There is a place for everyone in this movement. Choose how you want to make a difference today."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HELP_CARDS.map((card) => (
                <GlassCard key={card.title} className="overflow-hidden" hover>
                  <div className="relative h-40 w-full">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm", card.bg)}>
                        <card.icon className={cn("w-6 h-6", card.color)} />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold text-[#1a1a1a] mb-3">{card.title}</h3>
                    <p className="text-muted-foreground mb-6">{card.description}</p>
                    {card.action === "donate" ? (
                      <button
                        onClick={() => setDonateOpen(true)}
                        className="btn-gradient px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-black/10 transition-shadow w-full sm:w-auto"
                      >
                        {card.cta}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : card.action === "volunteer" ? (
                      <button
                        onClick={() => showToast("Coming soon!", "info")}
                        className="px-6 py-3 rounded-xl border border-black/[0.08] text-[#1a1a1a] hover:bg-black/[0.03] transition-colors inline-flex items-center justify-center gap-2 font-semibold w-full sm:w-auto"
                      >
                        {card.cta}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <a
                        href={`#${card.action}`}
                        className="px-6 py-3 rounded-xl border border-black/[0.08] text-[#1a1a1a] hover:bg-black/[0.03] transition-colors inline-flex items-center justify-center gap-2 font-semibold w-full sm:w-auto"
                      >
                        {card.cta}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Live Map */}
      <section id="map" className="py-14 md:py-[4.5rem] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Live Map"
              title="The Neighborhood Network"
              subtitle="Real-time zones showing animal density, feeder coverage, and care status across Royal Palms."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
              <div className="lg:col-span-3">
                <MapComponent
                  zones={ZONES}
                  onZoneClick={handleZoneClick}
                  activeZone={activeZone}
                  className="h-[500px] lg:h-[600px]"
                />
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap gap-3 mb-2">
                  {[
                    { color: "bg-emerald-500", label: "Well covered" },
                    { color: "bg-amber-500", label: "Needs support" },
                    { color: "bg-rose-500", label: "Urgent coverage" },
                  ].map((legend) => (
                    <div key={legend.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={cn("w-2.5 h-2.5 rounded-full", legend.color)} />
                      {legend.label}
                    </div>
                  ))}
                </div>

                {ZONES.map((zone) => {
                  const statusColors: Record<string, string> = {
                    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
                    amber: "bg-amber-100 text-amber-700 border-amber-200",
                    red: "bg-rose-100 text-rose-700 border-rose-200",
                  };
                  const isActive = activeZone?.name === zone.name;
                  const coverage = Math.min(100, Math.round((zone.feederCount / Math.max(1, zone.animalCount / 3)) * 100));

                  return (
                    <GlassCard
                      key={zone.name}
                      onClick={() => handleZoneClick(zone)}
                      className={cn(
                        "p-4 cursor-pointer transition-all",
                        isActive && "border-primary/40 shadow-lg shadow-primary/10"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-heading font-bold text-[#1a1a1a]">{zone.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {zone.animalCount} animals · {zone.feederCount} feeders
                          </p>
                        </div>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            statusColors[zone.status]
                          )}
                        >
                          {zone.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              zone.status === "green" && "bg-emerald-500",
                              zone.status === "amber" && "bg-amber-500",
                              zone.status === "red" && "bg-rose-500"
                            )}
                            style={{ width: `${coverage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{coverage}%</span>
                      </div>
                    </GlassCard>
                  );
                })}

                <GlassCard className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20" hover={false}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-warm flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-bold text-[#1a1a1a] mb-1">Want to cover a zone?</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Become a feeder and claim your tower. We provide guidance, supplies, and a community that has your back.
                      </p>
                      <a
                        href="#feeders"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        Join the Network
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Residents */}
      <section id="residents" className="py-14 md:py-[4.5rem] relative bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 md:mb-12">
              <div className="max-w-2xl">
                <span className="inline-block px-3 py-1 rounded-full bg-warm text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-4">
                  Animal Residents
                </span>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
                  Meet the Residents
                </h2>
                <p className="text-muted-foreground text-lg">
                  Every animal in our network has a name, a story, and a community looking out for them. Adopt a companion or sponsor one until they find their forever home.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setDonateOpen(true)}
                  className="px-6 py-3 rounded-full border border-black/[0.08] text-[#1a1a1a] hover:text-primary hover:bg-black/[0.03] transition-colors font-medium inline-flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Sponsor an Animal
                </button>
                <button
                  onClick={() => router.push("/residents")}
                  className="btn-gradient px-6 py-3 rounded-full font-semibold inline-flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-black/10 transition-shadow"
                >
                  View All Residents
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { key: "ALL", label: "All" },
                { key: "DOG", label: "Dogs" },
                { key: "CAT", label: "Cats" },
                { key: "ADOPTABLE", label: "Adoptable" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setAnimalFilter(tab.key as typeof animalFilter)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                    animalFilter === tab.key
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white border border-black/[0.08] text-muted-foreground hover:text-primary hover:border-primary/30"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            {animalsLoading ? (
              <SkeletonGrid count={6} />
            ) : animalsError ? (
              <div className="text-center py-12 glass rounded-2xl">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <p className="text-[#1a1a1a] text-lg font-medium mb-2">Unable to load residents</p>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">{animalsError}</p>
                <button
                  onClick={() => setAnimalFilter((f) => f)}
                  className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-2"
                >
                  Try again
                </button>
              </div>
            ) : filteredAnimals.length === 0 ? (
              <div className="text-center py-12 glass rounded-2xl">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-[#1a1a1a] text-lg font-medium mb-2">No residents found</p>
                <p className="text-muted-foreground">Try a different filter or check back soon.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAnimals.slice(0, 6).map((animal) => (
                    <AnimalCard key={animal.id} animal={animal} />
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={() => router.push("/residents")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/[0.08] text-[#1a1a1a] hover:text-primary hover:bg-black/[0.03] transition-colors font-medium"
                  >
                    View all residents
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Rescue Missions */}
      <section id="rescue" className="py-14 md:py-[4.5rem] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Rescue Missions"
              title="Active Rescue Missions"
              subtitle="Every mission is documented, every rupee is tracked, and every donor receives updates. Urgent cases need you now."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            {missionsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-96 rounded-2xl bg-muted border border-black/[0.05] animate-pulse" />
                <div className="h-96 rounded-2xl bg-muted border border-black/[0.05] animate-pulse" />
              </div>
            ) : missionsError ? (
              <div className="text-center py-12 glass rounded-2xl">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <p className="text-[#1a1a1a] text-lg font-medium mb-2">Unable to load missions</p>
                <p className="text-muted-foreground">{missionsError}</p>
              </div>
            ) : missions.length === 0 ? (
              <div className="text-center py-12 glass rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <p className="text-[#1a1a1a] text-lg font-medium mb-2">No active rescue missions right now</p>
                <p className="text-muted-foreground">All animals are safe. We will post new cases as they arise.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {missions.slice(0, 2).map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            )}
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <GlassCard className="mt-10 p-8 md:p-10 bg-gradient-to-br from-primary/5 via-transparent to-warm/30 border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    Monthly Giving
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
                    Become a Guardian Donor
                  </h3>
                  <p className="text-muted-foreground max-w-xl">
                    A small monthly gift keeps our feeders stocked and our medical fund ready for the next emergency. Cancel anytime.
                  </p>
                </div>
                <button
                  onClick={() => setDonateOpen(true)}
                  className="btn-gradient px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-black/10 transition-shadow flex-shrink-0"
                >
                  <Heart className="w-5 h-5" />
                  Start Monthly Giving
                </button>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Adoption Quiz */}
      <section id="adopt" className="py-14 md:py-[4.5rem] relative bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Find Your Perfect Match"
              title="Find Your Perfect Match"
              subtitle="Responsible adoption starts with the right fit. Answer four quick questions and we will match you with a resident waiting for a home."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <div className="max-w-3xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Home check recommended
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Vaccination support included
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Lifetime guidance provided
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-w-6xl mx-auto">
              <div className="hidden lg:block relative aspect-[3/4] rounded-3xl overflow-hidden border border-black/[0.08] shadow-lg shadow-black/5">
                <Image
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop"
                  alt="Friendly puppy waiting for adoption"
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-heading font-bold text-xl">Ready to meet your match?</p>
                  <p className="text-white/80 text-sm">Every answer helps us find the right companion for you.</p>
                </div>
              </div>
              <div className="lg:col-span-2">
                {quizError && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 text-sm text-center">
                    {quizError}
                  </div>
                )}
                <Quiz
                  questions={QUIZ_QUESTIONS}
                  onComplete={handleQuizComplete}
                  result={quizResult}
                  isLoading={quizLoading}
                  onRetake={() => setQuizResult(null)}
                  onViewProfile={(animal) => router.push(`/animal/${animal.id}`)}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Feeder Network */}
      <section id="feeders" className="py-14 md:py-[4.5rem] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Feeder Network"
              title="The Heroes Behind Every Meal"
              subtitle="The everyday people who make sure no stomach in Royal Palms goes empty."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 items-center">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-black/[0.08] shadow-lg shadow-black/5">
                <Image
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop"
                  alt="Community volunteers working together"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass inline-flex items-center gap-2 px-4 py-3">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-[#1a1a1a]">40+ feeders strong</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Active feeders", value: 43, suffix: "+", icon: Users },
                  { label: "Zones covered", value: 5, suffix: "", icon: MapPin },
                  { label: "Monthly feeds", value: 1200, suffix: "+", icon: UtensilsCrossed },
                ].map((stat) => (
                  <GlassCard key={stat.label} className="p-6 text-center" hover>
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                    <p className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-1">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <GlassCard className="p-6 mb-10 bg-gradient-to-br from-warm/30 to-transparent border-warm/50">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-[#1a1a1a] mb-3">
                    Join as a Feeder in 3 Simple Steps
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">1</span>
                      Sign up
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">2</span>
                      Choose your zone
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">3</span>
                      Check in daily
                    </div>
                  </div>
                </div>
                <a
                  href="/feeders"
                  className="btn-gradient px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-black/10 transition-shadow flex-shrink-0"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  Join as Feeder
                </a>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {FEEDER_BADGES.map((badge) => (
                <GlassCard key={badge.title} className="p-5 text-center" hover>
                  <div className={cn("w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center border", badge.bg)}>
                    <badge.icon className={cn("w-6 h-6", badge.color)} />
                  </div>
                  <h3 className="font-heading font-bold text-[#1a1a1a] mb-1">{badge.title}</h3>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <GlassCard className="overflow-hidden" hover={false}>
              <div className="p-6 border-b border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-heading text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  Zone Leaderboard
                </h3>
                <span className="text-xs text-muted-foreground">Coverage based on weekly feeds</span>
              </div>

              {leaderboardLoading ? (
                <div className="p-6 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : leaderboardError ? (
                <div className="p-8 text-center">
                  <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">{leaderboardError}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-black/[0.08]">
                        <th className="px-6 py-4 font-medium">Rank</th>
                        <th className="px-6 py-4 font-medium">Tower</th>
                        <th className="px-6 py-4 font-medium">Feeders</th>
                        <th className="px-6 py-4 font-medium">Coverage</th>
                        <th className="px-6 py-4 font-medium">Medal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((row, index) => {
                        const rank = index + 1;
                        const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "🏅";
                        return (
                          <tr
                            key={row.tower}
                            className="border-b border-black/[0.05] hover:bg-black/[0.02] transition-colors"
                          >
                            <td className="px-6 py-4 font-heading font-bold text-[#1a1a1a]">#{rank}</td>
                            <td className="px-6 py-4 text-[#1a1a1a]">{row.tower}</td>
                            <td className="px-6 py-4 text-muted-foreground">{row.feederCount}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full",
                                      row.coverage >= 90 ? "bg-emerald-500" : row.coverage >= 75 ? "bg-primary" : "bg-amber-500"
                                    )}
                                    style={{ width: `${row.coverage}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">{row.coverage}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-lg">{medal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Rescue Stories */}
      <RescueStoriesSection />

      {/* Impact / Transparency */}
      <section id="impact" className="py-14 md:py-[4.5rem] relative bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Impact & Transparency"
              title="Every Rupee Reaches an Animal"
              subtitle="We are committed to complete transparency. Here is how your contribution is put to work."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
              <div>
                <ImpactDonut />
              </div>
              <div className="space-y-5">
                {IMPACT_BREAKDOWN.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div
                      className="w-3 h-12 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-[#1a1a1a]">{item.label}</span>
                        </div>
                        <span className="font-heading font-bold text-[#1a1a1a]">{item.percent}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {[
                { icon: ScrollText, title: "Transparent Reports", description: "Quarterly updates on funds and outcomes." },
                { icon: Calendar, title: "Monthly Updates", description: "Mission progress and new rescues in your inbox." },
                { icon: HeartHandshake, title: "Volunteer Run", description: "Powered by neighbors, not overhead." },
              ].map((badge) => (
                <GlassCard key={badge.title} className="p-6 text-center" hover>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <badge.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-[#1a1a1a] mb-2">{badge.title}</h3>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="text-center">
              <a
                href="#newsletter"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-black/[0.08] text-[#1a1a1a] hover:text-primary hover:bg-black/[0.03] transition-colors font-medium"
              >
                <FileText className="w-5 h-5" />
                Read Financial Report
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* Newsletter */}
      <section id="newsletter" className="py-14 md:py-[4.5rem] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&auto=format&fit=crop"
                  alt="Happy dog with owner"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-primary/80" />
              </div>
              <div className="relative p-8 md:p-12 lg:p-16">
                <div className="max-w-2xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-4">
                    <Mail className="w-3.5 h-3.5" />
                    Stay Connected
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                    Join the Ajuni Circle
                  </h2>
                  <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                    Get monthly rescue stories, impact reports, and opportunities to help delivered straight to your inbox.
                  </p>

                  {newsletterSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-6 rounded-xl bg-white/20 border border-white/20"
                    >
                      <CheckCircle2 className="w-8 h-8 text-white mx-auto mb-3" />
                      <p className="text-white font-medium mb-1">Welcome to the Ajuni Circle!</p>
                      <p className="text-sm text-white/80">Thank you for staying connected.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 bg-white/20 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-white/60 focus:outline-none focus:border-white/40 transition-colors"
                      />
                      <button
                        type="submit"
                        className="bg-white text-primary px-8 py-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:bg-warm transition-colors flex-shrink-0"
                      >
                        Subscribe
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}

                  <p className="text-xs text-white/60 text-center mt-4">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
      <Footer />
      <FloatingHelpButton onClick={() => setDonateOpen(true)} />
    </div>
  );
}
