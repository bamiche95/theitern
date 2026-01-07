"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  
  // Check if the current path starts with the href (for sub-pages)
  // or is an exact match for the dashboard
  const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? "bg-blue-600 text-white font-semibold" 
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}