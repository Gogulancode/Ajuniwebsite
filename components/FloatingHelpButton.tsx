"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface FloatingHelpButtonProps {
  onClick: () => void;
}

export function FloatingHelpButton({ onClick }: FloatingHelpButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.85;
      setVisible(window.scrollY > heroHeight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full btn-gradient shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-shadow"
          aria-label="Open donation modal"
        >
          <Heart className="w-5 h-5 fill-white" />
          <span className="font-semibold text-white text-sm">Help Now</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
