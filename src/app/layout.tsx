import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HDFC Bank — Active vs. Passive Portfolio Management | Apex Institutional Workstation",
  description:
    "Institutional banking analytics workstation for portfolio managers, equity research analysts, and investment committees. Real audited financials, quantitative factor models, and stress scenario engine.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}