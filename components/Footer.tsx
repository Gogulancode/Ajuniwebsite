"use client";

import { PawPrint, Heart, MapPin, Mail, Phone, AtSign, MessageCircle, Send } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  organization: [
    { label: "About Us", href: "#mission" },
    { label: "Our Impact", href: "#impact" },
    { label: "Transparency", href: "#impact" },
    { label: "Newsletter", href: "#newsletter" },
  ],
  getInvolved: [
    { label: "Donate", href: "#donate" },
    { label: "Adopt", href: "#adopt" },
    { label: "Become a Feeder", href: "#feeders" },
    { label: "Volunteer", href: "#help" },
  ],
  explore: [
    { label: "Live Map", href: "#map" },
    { label: "Residents", href: "#residents" },
    { label: "Rescue Missions", href: "#rescue" },
    { label: "Feeder Network", href: "#feeders" },
  ],
};

const socialLinks = [
  { label: "Instagram", icon: AtSign, href: "#" },
  { label: "Facebook", icon: MessageCircle, href: "#" },
  { label: "Twitter", icon: Send, href: "#" },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="relative inline-block text-sm text-[#555555] hover:text-primary transition-colors group py-0.5"
    >
      {label}
      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-black/[0.08] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <a href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="p-2 rounded-xl bg-warm text-primary group-hover:bg-primary group-hover:text-white transition-colors"
              >
                <PawPrint className="w-6 h-6" />
              </motion.div>
              <span className="font-heading font-bold text-xl text-[#1a1a1a]">
                Ajuni Foundation
              </span>
            </a>
            <p className="text-[#555555] leading-relaxed max-w-sm">
              A registered animal welfare trust serving the street animals of Royal Palms, Aarey Colony. We believe no paw should walk alone.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-black/[0.03] border border-black/[0.08] flex items-center justify-center text-[#555555] hover:text-primary hover:bg-warm hover:border-warm transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-[#1a1a1a] mb-4">Organization</h4>
            <ul className="space-y-3">
              {footerLinks.organization.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-[#1a1a1a] mb-4">Get Involved</h4>
            <ul className="space-y-3">
              {footerLinks.getInvolved.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-[#1a1a1a] mb-4">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-[#1a1a1a] mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#555555]">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                Royal Palms, Aarey Colony, Mumbai
              </li>
              <li>
                <a
                  href="mailto:hello@ajunifoundation.org"
                  className="relative inline-flex items-center gap-2 text-sm text-[#555555] hover:text-primary transition-colors group py-0.5"
                >
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  hello@ajunifoundation.org
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="relative inline-flex items-center gap-2 text-sm text-[#555555] hover:text-primary transition-colors group py-0.5"
                >
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  +91 98765 43210
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-black/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for the animals of Royal Palms
          </p>
          <p>© {new Date().getFullYear()} Ajuni Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
