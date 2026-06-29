"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import * as confetti from "canvas-confetti";
import { cn, formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { useDonation, DonationType, RazorpayOptions } from "@/hooks/useDonation";

export interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
  animalId?: string;
  missionId?: string;
  animalName?: string;
}

const PRESET_AMOUNTS = [250, 600, 1200];

export function DonateModal({
  isOpen,
  onClose,
  defaultAmount = 250,
  animalId,
  missionId,
  animalName,
}: DonateModalProps) {
  const [selected, setSelected] = useState<number | null>(defaultAmount);
  const [custom, setCustom] = useState("");
  const [isMonthly, setIsMonthly] = useState(true);
  const [loading, setLoading] = useState(false);

  const { createOrder, verifyPayment, loadRazorpayScript, session } = useDonation();
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setSelected(defaultAmount);
      setCustom("");
      setIsMonthly(true);
      setLoading(false);
    }
  }, [isOpen, defaultAmount]);

  const activeAmount = selected ?? (custom ? Number(custom) : 0);

  function triggerConfetti() {
    const end = Date.now() + 1000;
    const colors = ["#01589f", "#ffefbc", "#14b8a6", "#f43f5e"];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  async function handleDonate() {
    if (Number.isNaN(activeAmount) || activeAmount <= 0) return;

    setLoading(true);
    showToast("Donation initiated", "info");
    try {
      await loadRazorpayScript();

      const type: DonationType = isMonthly ? "MONTHLY" : "ONE_TIME";
      const order = await createOrder({
        amount: activeAmount,
        type,
        animalId,
        missionId,
        animalName,
      });

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "Ajuni Foundation",
        description: `${type === "MONTHLY" ? "Monthly" : "One-time"} donation${
          animalName ? ` for ${animalName}` : ""
        }`,
        order_id: order.id,
        handler: async (response) => {
          await verifyPayment({
            ...response,
            amount: activeAmount,
            type,
            animalId,
            missionId,
            animalName,
          });
          triggerConfetti();
          showToast("Thank you for your donation!", "success");
          onClose();
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#01589f",
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error("Donation failed:", error);
      showToast("Could not start the donation. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white border border-black/[0.08] rounded-2xl shadow-2xl p-6 md:p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#1a1a1a]">
                  Make a Donation
                </h2>
                {animalName && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Supporting{" "}
                    <span className="font-medium text-primary">{animalName}</span>
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-[#1a1a1a] hover:bg-black/[0.03] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelected(amount);
                    setCustom("");
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center py-3 rounded-xl border text-sm font-semibold transition-all",
                    selected === amount
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-black/[0.08] text-[#555555] hover:border-primary/30 hover:text-primary"
                  )}
                >
                  {formatCurrency(amount)}
                  <span className="text-[10px] font-normal text-muted-foreground">
                    /month
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Custom amount (₹)
              </label>
              <input
                type="number"
                min={10}
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setSelected(null);
                }}
                placeholder="Enter amount"
                className="w-full bg-muted border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <label className="flex items-center gap-2 mb-6 text-sm text-[#555555] cursor-pointer">
              <input
                type="checkbox"
                checked={isMonthly}
                onChange={(e) => setIsMonthly(e.target.checked)}
                className="rounded border-black/[0.15] bg-muted text-primary focus:ring-primary focus:ring-offset-0"
              />
              Make it a monthly donation
            </label>

            <button
              type="button"
              onClick={handleDonate}
              disabled={Number.isNaN(activeAmount) || activeAmount <= 0 || loading}
              className={cn(
                "w-full btn-gradient py-3 rounded-xl font-semibold transition-all",
                "hover:shadow-lg hover:shadow-black/10",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              )}
            >
              {loading
                ? "Processing…"
                : `Donate ${formatCurrency(activeAmount)}${
                    isMonthly ? "/month" : ""
                  }`}
            </button>

            <p className="mt-5 text-xs text-muted-foreground leading-relaxed text-center">
              <span className="font-medium text-[#555555]">
                Where your money goes:
              </span>{" "}
              100% of donations fund food, medical care, sterilization, and
              rescue operations for street animals in Royal Palms & Aarey
              Colony.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
