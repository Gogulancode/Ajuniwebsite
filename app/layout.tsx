import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { ScrollProgress } from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Ajuni Foundation | Royal Palms Street Animal Network",
  description:
    "A community-driven street animal welfare platform for Royal Palms, Aarey Colony, Mumbai. Adopt, sponsor, feed, and protect our neighborhood animals.",
  keywords: [
    "Ajuni Foundation",
    "street animals",
    "animal welfare",
    "Royal Palms",
    "Aarey Colony",
    "Mumbai",
    "adopt",
    "donate",
    "feeders",
  ],
  openGraph: {
    title: "Ajuni Foundation | Royal Palms Street Animal Network",
    description:
      "Join the neighborhood network caring for street animals in Royal Palms, Aarey Colony.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
