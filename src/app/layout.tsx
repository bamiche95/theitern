import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Mail, Headset, Menu } from "lucide-react";
import { getBootstrapData } from "@/lib/bootstrap";
import Navbar from "@/app/components/NavBar";
import Footer from "./components/FooterComponent";
import Image from "next/image";
import MobileMenu from "./components/MobileMenu";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // optional but recommended
  display: "swap",
});
/**
 * Dynamic Metadata
 * Runs on the server
 * Uses the SAME cached data as the layout
 */

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getBootstrapData();

  return {
    title: settings.site_title || "The Itern",
    description: settings.site_description || "Company Description",
    icons: {
      icon: settings.icon_url || "/favicon.ico",
    },
  };
}

/**
 * Root Layout
 * Server Component
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ONE fetch, cached, shared with metadata
  const { settings, nav } = await getBootstrapData();
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased text-slate-900 bg-white`}
      >
        {/* Header */}
<header className=" sticky top-0 bg-white/80 backdrop-blur z-50 shadow-sm">
  <div className="max-w-10xl mx-auto px-6 h-16 flex items-center justify-between">
    
    {/* Logo */}
    <a href="/" className="flex items-center">
      <Image
        src={settings.logo_url}
        alt="Company Logo"
        width={180}
        height={60}
        className="h-12 w-auto object-contain"
        priority
      />
    </a>

    {/* Desktop nav */}
    <Navbar navItems={nav} />

    {/* Mobile toggle */}
    <MobileMenu navItems={nav} />
  </div>
</header>


        {/* Page content */}
        <main>{children}</main>

        {/* Footer */}
    <Footer settings={settings} />
      </body>
    </html>
  );
}
