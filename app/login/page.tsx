"use client";

import { useState, useCallback, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PawPrint,
  Mail,
  Lock,
  User,
  Home,
  ArrowRight,
  Loader2,
  AlertCircle,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";

type Tab = "signin" | "register";

/* ------------------------------------------------------------------ */
/*  Auth error map                                                     */
/* ------------------------------------------------------------------ */
const authErrors: Record<string, string> = {
  CredentialsSignin: "Invalid email or password. Please try again.",
  OAuthSignin: "Could not sign in with Google. Please try again.",
  OAuthCallback: "Google authentication failed. Please try again.",
  OAuthCreateAccount: "Could not create account via Google.",
  EmailCreateAccount: "Could not create account with this email.",
  Callback: "Something went wrong during authentication.",
  Default: "An unexpected error occurred. Please try again.",
};

function getErrorMessage(error: string | null): string | null {
  if (!error) return null;
  return authErrors[error] || authErrors.Default;
}

/* ------------------------------------------------------------------ */
/*  Tower options                                                       */
/* ------------------------------------------------------------------ */
const towers = ["Tower A/B", "Tower C/D", "Near Royal Palms", "Other"];

/* ------------------------------------------------------------------ */
/*  Input component                                                     */
/* ------------------------------------------------------------------ */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  label: string;
  error?: string;
}

function InputField({ icon, label, error, className, type = "text", ...props }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#555555]">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
        <input
          type={inputType}
          className={cn(
            "w-full pl-10 pr-3 py-2.5 rounded-xl border bg-white/80",
            "text-sm text-[#1a1a1a] placeholder:text-muted-foreground/60",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
            "transition-all duration-200",
            error ? "border-destructive/50 focus:ring-destructive/20 focus:border-destructive/50" : "border-black/[0.08]",
            isPassword && "pr-10",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#555555] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Select component                                                    */
/* ------------------------------------------------------------------ */
function TowerSelect({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#555555]">Tower / Building</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Home className="w-4 h-4" />
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full pl-10 pr-10 py-2.5 rounded-xl border bg-white/80 text-left",
            "text-sm text-[#1a1a1a]",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
            "transition-all duration-200 flex items-center justify-between",
            error ? "border-destructive/50" : "border-black/[0.08]",
            !value && "text-muted-foreground/60"
          )}
        >
          {value || "Select your tower"}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 mt-1 w-full bg-white border border-black/[0.08] rounded-xl shadow-lg overflow-hidden"
            >
              {towers.map((tower) => (
                <button
                  key={tower}
                  type="button"
                  onClick={() => {
                    onChange(tower);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-sm text-left text-[#1a1a1a] hover:bg-primary/5 transition-colors",
                    value === tower && "bg-primary/5 font-medium text-primary"
                  )}
                >
                  {tower}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Divider component                                                   */
/* ------------------------------------------------------------------ */
function Divider() {
  return (
    <div className="relative flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-black/[0.08]" />
      <span className="text-xs text-muted-foreground font-medium">or</span>
      <div className="flex-1 h-px bg-black/[0.08]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inner component — uses useSearchParams                               */
/* ------------------------------------------------------------------ */
function LoginPageContent() {
  const searchParams = useSearchParams();
  const urlError = searchParams?.get("error");
  const urlCallback = searchParams?.get("callbackUrl") || "/";

  const [tab, setTab] = useState<Tab>("signin");

  /* Sign in state */
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siLoading, setSiLoading] = useState(false);

  /* Register state */
  const [rgName, setRgName] = useState("");
  const [rgEmail, setRgEmail] = useState("");
  const [rgPassword, setRgPassword] = useState("");
  const [rgConfirm, setRgConfirm] = useState("");
  const [rgTower, setRgTower] = useState("");
  const [rgLoading, setRgLoading] = useState(false);
  const [rgSuccess, setRgSuccess] = useState(false);

  /* Client-side validation errors */
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /* Sign in handler */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!siEmail.trim()) errors.siEmail = "Email is required";
    if (!siPassword) errors.siPassword = "Password is required";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setSiLoading(true);
    await signIn("credentials", {
      email: siEmail,
      password: siPassword,
      callbackUrl: urlCallback,
    });
    setSiLoading(false);
  };

  /* Register handler */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!rgName.trim()) errors.rgName = "Name is required";
    if (!rgEmail.trim()) errors.rgEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rgEmail))
      errors.rgEmail = "Please enter a valid email";
    if (!rgPassword) errors.rgPassword = "Password is required";
    else if (rgPassword.length < 6)
      errors.rgPassword = "Password must be at least 6 characters";
    if (rgPassword !== rgConfirm) errors.rgConfirm = "Passwords do not match";
    if (!rgTower) errors.rgTower = "Please select your tower";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setRgLoading(true);
    setFieldErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rgName.trim(),
          email: rgEmail.trim(),
          password: rgPassword,
          tower: rgTower,
        }),
      });

      const data = await res.json().catch(() => ({ error: "Something went wrong" }));

      if (!res.ok) {
        setFieldErrors({ rgGeneral: data.error || "Registration failed. Please try again." });
      } else {
        setRgSuccess(true);
        // Auto sign-in after successful registration
        await signIn("credentials", {
          email: rgEmail.trim(),
          password: rgPassword,
          callbackUrl: urlCallback,
        });
      }
    } catch {
      setFieldErrors({ rgGeneral: "Network error. Please check your connection and try again." });
    } finally {
      setRgLoading(false);
    }
  };

  /* Google sign in */
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: urlCallback });
  };

  const errorMessage = getErrorMessage(urlError);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-warm rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="p-3 rounded-2xl bg-warm text-primary group-hover:bg-primary group-hover:text-white transition-colors"
            >
              <PawPrint className="w-8 h-8" />
            </motion.div>
            <span className="font-heading font-bold text-2xl text-[#1a1a1a]">
              Ajuni Foundation
            </span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome to the Royal Palms community network
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard hover={false} className="overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-black/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setTab("signin");
                  setFieldErrors({});
                }}
                className={cn(
                  "flex-1 py-3.5 text-sm font-semibold text-center transition-all relative",
                  tab === "signin"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-[#555555]"
                )}
              >
                Sign In
                {tab === "signin" && (
                  <motion.div
                    layoutId="login-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setFieldErrors({});
                }}
                className={cn(
                  "flex-1 py-3.5 text-sm font-semibold text-center transition-all relative",
                  tab === "register"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-[#555555]"
                )}
              >
                New Resident
                {tab === "register" && (
                  <motion.div
                    layoutId="login-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            </div>

            {/* Error from URL */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pt-4"
                >
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {errorMessage}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* ======== SIGN IN TAB ======== */}
                {tab === "signin" && (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <InputField
                        icon={<Mail className="w-4 h-4" />}
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={siEmail}
                        onChange={(e) => {
                          setSiEmail(e.target.value);
                          clearFieldError("siEmail");
                        }}
                        error={fieldErrors.siEmail}
                        autoComplete="email"
                      />
                      <InputField
                        icon={<Lock className="w-4 h-4" />}
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={siPassword}
                        onChange={(e) => {
                          setSiPassword(e.target.value);
                          clearFieldError("siPassword");
                        }}
                        error={fieldErrors.siPassword}
                        autoComplete="current-password"
                      />

                      {/* General error */}
                      <AnimatePresence>
                        {fieldErrors.siGeneral && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            {fieldErrors.siGeneral}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={siLoading}
                        className={cn(
                          "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl",
                          "bg-primary text-white text-sm font-semibold",
                          "shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90",
                          "transition-all duration-200",
                          "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                        )}
                      >
                        {siLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </form>

                    <Divider />

                    {/* Google */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleGoogleSignIn}
                      className={cn(
                        "w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl",
                        "bg-white border border-black/[0.08] text-[#1a1a1a] text-sm font-medium",
                        "hover:bg-black/[0.02] hover:border-black/[0.12]",
                        "transition-all duration-200"
                      )}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
                          fill="#EA4335"
                        />
                      </svg>
                      Continue with Google
                    </motion.button>
                  </motion.div>
                )}

                {/* ======== REGISTER TAB ======== */}
                {tab === "register" && (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    {rgSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-8 text-center space-y-3"
                      >
                        <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                          <PawPrint className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-[#1a1a1a]">
                          Account Created!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Welcome to the Ajuni community. Signing you in...
                        </p>
                        <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto mt-2" />
                      </motion.div>
                    ) : (
                      <form onSubmit={handleRegister} className="space-y-4">
                        <InputField
                          icon={<User className="w-4 h-4" />}
                          label="Full Name"
                          placeholder="Your full name"
                          value={rgName}
                          onChange={(e) => {
                            setRgName(e.target.value);
                            clearFieldError("rgName");
                          }}
                          error={fieldErrors.rgName}
                          autoComplete="name"
                        />
                        <InputField
                          icon={<Mail className="w-4 h-4" />}
                          label="Email"
                          type="email"
                          placeholder="you@example.com"
                          value={rgEmail}
                          onChange={(e) => {
                            setRgEmail(e.target.value);
                            clearFieldError("rgEmail");
                          }}
                          error={fieldErrors.rgEmail}
                          autoComplete="email"
                        />
                        <InputField
                          icon={<Lock className="w-4 h-4" />}
                          label="Password"
                          type="password"
                          placeholder="Min. 6 characters"
                          value={rgPassword}
                          onChange={(e) => {
                            setRgPassword(e.target.value);
                            clearFieldError("rgPassword");
                          }}
                          error={fieldErrors.rgPassword}
                          autoComplete="new-password"
                        />
                        <InputField
                          icon={<Lock className="w-4 h-4" />}
                          label="Confirm Password"
                          type="password"
                          placeholder="Re-enter your password"
                          value={rgConfirm}
                          onChange={(e) => {
                            setRgConfirm(e.target.value);
                            clearFieldError("rgConfirm");
                          }}
                          error={fieldErrors.rgConfirm}
                          autoComplete="new-password"
                        />
                        <TowerSelect
                          value={rgTower}
                          onChange={(v) => {
                            setRgTower(v);
                            clearFieldError("rgTower");
                          }}
                          error={fieldErrors.rgTower}
                        />

                        {/* General error */}
                        <AnimatePresence>
                          {fieldErrors.rgGeneral && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-sm text-destructive flex items-center gap-1"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              {fieldErrors.rgGeneral}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          disabled={rgLoading}
                          className={cn(
                            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl",
                            "bg-primary text-white text-sm font-semibold",
                            "shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90",
                            "transition-all duration-200",
                            "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                          )}
                        >
                          {rgLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              Create Account
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </motion.button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>

        {/* Back to home */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-sm text-muted-foreground"
        >
          <Link
            href="/"
            className="text-primary font-medium hover:underline underline-offset-4 transition-all"
          >
            &larr; Back to homepage
          </Link>
        </motion.p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading fallback                                                    */
/* ------------------------------------------------------------------ */
function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Branding skeleton */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-warm">
              <PawPrint className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <span className="font-heading font-bold text-2xl text-[#1a1a1a]">
              Ajuni Foundation
            </span>
          </div>
          <div className="h-4 w-48 bg-muted rounded mx-auto animate-pulse" />
        </div>
        {/* Card skeleton */}
        <div className="bg-white border border-black/[0.08] rounded-2xl shadow-sm p-6 space-y-4">
          <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
          <div className="space-y-3 pt-2">
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
          </div>
          <div className="h-10 w-full bg-primary/20 rounded-xl animate-pulse mt-4" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Default export — wraps content in Suspense                          */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginPageContent />
    </Suspense>
  );
}
