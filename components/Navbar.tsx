"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PawPrint,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DonateModal } from "./DonateModal";

const navLinks = [
  { label: "Mission", href: "#mission" },
  { label: "Live Map", href: "#map" },
  { label: "Help", href: "#help" },
  { label: "Residents", href: "#residents" },
  { label: "Rescue", href: "#rescue" },
  { label: "Adopt", href: "#adopt" },
  { label: "Feeders", href: "#feeders" },
  { label: "Impact", href: "#impact" },
];

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="relative text-sm font-medium text-[#555555] hover:text-primary transition-colors group py-1"
    >
      {label}
      <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const user = session?.user;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-black/[0.08] py-3 shadow-sm"
            : "bg-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 group"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="p-2 rounded-xl bg-warm text-primary group-hover:bg-primary group-hover:text-white transition-colors"
            >
              <PawPrint className="w-6 h-6" />
            </motion.div>
            <span className="font-heading font-bold text-lg md:text-xl text-[#1a1a1a]">
              Ajuni Foundation
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
            {session?.user?.role === "ADMIN" && (
              <NavLink href="/admin" label="Admin" />
            )}
            {session?.user?.role === "FEEDER" && (
              <NavLink href="/feeders" label="My Dashboard" />
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDonateOpen(true)}
              className={cn(
                "bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold",
                "shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90 transition-all"
              )}
            >
              Donate Now
            </motion.button>

            {status === "authenticated" && user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={36}
                        height={36}
                        unoptimized
                        className="w-9 h-9 rounded-full object-cover border border-black/[0.08]"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center border border-black/[0.08]">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="bg-white border border-black/[0.08] rounded-2xl shadow-xl p-1 min-w-[180px] z-50"
                  >
                    <div className="px-3 py-2 text-sm text-muted-foreground border-b border-black/[0.08] mb-1">
                      <p className="font-medium text-[#1a1a1a] truncate">
                        {user.name || "Resident"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <p className="text-[10px] text-primary uppercase tracking-wider mt-0.5">
                        {(user as any).role || "Resident"}
                      </p>
                    </div>
                    <DropdownMenu.Item
                      onSelect={() => signOut()}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[#1a1a1a] hover:bg-black/[0.03] rounded-lg outline-none cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="relative text-sm font-medium text-[#555555] hover:text-primary transition-colors group py-1"
              >
                Sign in
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-[#555555] hover:text-primary"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white border-l border-black/[0.08] shadow-xl p-6 md:hidden"
          >
            <div className="flex items-center justify-between mb-10">
              <span className="font-heading font-bold text-lg text-[#1a1a1a]">
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#555555] hover:text-primary"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-[#555555] hover:text-primary hover:bg-black/[0.03] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {session?.user?.role === "ADMIN" && (
                <a
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-primary font-medium hover:bg-primary/5 transition-colors"
                >
                  Admin
                </a>
              )}
              {session?.user?.role === "FEEDER" && (
                <a
                  href="/feeders"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-primary font-medium hover:bg-primary/5 transition-colors"
                >
                  My Dashboard
                </a>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setDonateOpen(true);
                }}
                className="bg-primary text-white w-full py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Donate Now
              </button>
              {status === "authenticated" ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut();
                  }}
                  className="w-full py-3 rounded-xl text-sm font-medium text-[#555555] hover:text-primary hover:bg-black/[0.03] transition-colors"
                >
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signIn("google");
                  }}
                  className="w-full py-3 rounded-xl text-sm font-medium text-[#555555] hover:text-primary hover:bg-black/[0.03] transition-colors"
                >
                  Sign in
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}
