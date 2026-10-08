/**
 * Root layout for the App Router.
 *
 * Server Component, copied from Agent Harnesses Explained (itself from transformer-explainer):
 * HTML scaffold, the global stylesheet, the site header and footer. Dark mode follows the
 * system setting (`darkMode: "media"` in tailwind.config.ts).
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SITE_URL } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HW Design-Space Agent",
    template: "%s · HW Design-Space Agent",
  },
  description:
    "An agent optimised for hardware development: trade-off exploration. One spec, explored by a LangGraph agent over tested hardware models, with every number from a recorded run.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
