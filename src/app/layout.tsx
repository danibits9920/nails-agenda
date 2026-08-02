import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nails Art Yurany — Agenda Online",
    template: "%s · Nails Art Yurany",
  },
  description:
    "Reserva tu cita de manicure, pedicure, gel, acrílico y nail art con Yurany. Agenda online 24/7 en Santiago, Chile.",
  keywords: ["manicure", "pedicure", "gel", "acrílico", "nail art", "uñas", "Santiago", "reserva de citas"],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteUrl,
    siteName: "Nails Art Yurany",
    title: "Nails Art Yurany — Agenda Online",
    description:
      "Reserva tu cita de manicure, pedicure, gel, acrílico y nail art con Yurany. Agenda online 24/7.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nails Art Yurany — Agenda Online",
    description:
      "Reserva tu cita de manicure, pedicure, gel, acrílico y nail art con Yurany. Agenda online 24/7.",
  },
};

export const viewport: Viewport = {
  themeColor: "#EDAAB5",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={cn("h-full", "antialiased", playfair.variable, inter.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" richColors closeButton duration={3500} />
      </body>
    </html>
  );
}
