"use client";

import { ScrollReveal } from "./ScrollReveal";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { Heart, Stethoscope, Home } from "lucide-react";

const STORIES = [
  {
    name: "Bruno",
    tagline: "From scared and injured to the friendliest guard on the block.",
    beforeImage: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop",
    stats: [
      { icon: Stethoscope, label: "Treated for wounds" },
      { icon: Heart, label: "Vaccinated & sterilized" },
      { icon: Home, label: "Loved by Tower C feeders" },
    ],
  },
  {
    name: "Milo & Lily",
    tagline: "Two abandoned kittens, nursed back to health and adopted together.",
    beforeImage: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop",
    stats: [
      { icon: Stethoscope, label: "Bottle-fed & treated" },
      { icon: Heart, label: "Spayed & vaccinated" },
      { icon: Home, label: "Adopted as a pair" },
    ],
  },
];

export function RescueStoriesSection() {
  return (
    <section id="rescue-stories" className="py-14 md:py-[4.5rem] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-warm text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-4">
              Rescue Stories
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
              Second Chances
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Drag the slider to see the transformation your support makes possible.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {STORIES.map((story) => (
            <ScrollReveal key={story.name} delay={0.1}>
              <div className="bg-white border border-black/[0.08] rounded-3xl shadow-sm overflow-hidden">
                <BeforeAfterSlider
                  beforeImage={story.beforeImage}
                  afterImage={story.afterImage}
                  beforeAlt={`${story.name} before rescue`}
                  afterAlt={`${story.name} after rescue`}
                />
                <div className="p-6 md:p-8">
                  <h3 className="font-heading text-2xl font-bold text-[#1a1a1a] mb-2">
                    {story.name}&rsquo;s Journey
                  </h3>
                  <p className="text-muted-foreground mb-6">{story.tagline}</p>
                  <div className="flex flex-wrap gap-3">
                    {story.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20"
                      >
                        <stat.icon className="w-3.5 h-3.5" />
                        {stat.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
