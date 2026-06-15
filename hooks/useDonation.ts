"use client";

import { useSession } from "next-auth/react";

export type DonationType = "ONE_TIME" | "MONTHLY";

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color: string;
  };
}

export interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface CreateOrderInput {
  amount: number; // in INR
  type: DonationType;
  animalId?: string;
  missionId?: string;
  animalName?: string;
}

export interface OrderResponse {
  id: string;
  amount: number; // in paisa
  currency: string;
}

export interface VerifyPaymentInput {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  amount: number; // in INR
  type: DonationType;
  animalId?: string;
  missionId?: string;
  animalName?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
}

export function useDonation() {
  const { data: session } = useSession();

  async function createOrder(input: CreateOrderInput): Promise<OrderResponse> {
    const response = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        amount: Math.round(input.amount * 100), // convert INR to paisa
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to create order");
    }

    return response.json();
  }

  async function verifyPayment(
    input: VerifyPaymentInput
  ): Promise<VerifyPaymentResponse> {
    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        amount: Math.round(input.amount * 100),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Payment verification failed");
    }

    return response.json();
  }

  function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  }

  return {
    createOrder,
    verifyPayment,
    loadRazorpayScript,
    session,
  };
}
