export const isDemoMode =
  !process.env.DATABASE_URL || process.env.DEMO_MODE === "true";

export const demoSecret = "demo-secret-for-client-preview-only";
