import Image from "next/image";
import Navbar from "./NavBar";
import MobileMenu from "./MobileMenu";
export default function Header({ settings, nav }: any) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-10xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <a href="/" className="flex items-center">
          {settings.logo_url ? (
            <Image
              src={settings.logo_url}
              alt="Company Logo"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          ) : (
            <span className="text-xl font-bold">
              {settings.site_title}
            </span>
          )}
        </a>

        {/* Desktop navigation */}
        <Navbar navItems={nav} />

        {/* Mobile navigation */}
        <MobileMenu navItems={nav} />
      </div>
    </header>
  );
}
