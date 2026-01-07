"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Navbar({ navItems }: { navItems: any[] }) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map((item) => (
        <div
          key={item.id}
          className="relative py-4"
          onMouseEnter={() => setOpenDropdown(item.id)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {item.children?.length ? (
            <>
              <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600">
                {item.label}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openDropdown === item.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === item.id && (
                <div className="absolute top-full left-0 w-48 pt-2">
                  <div className="bg-white rounded-xl shadow-xl border py-2">
                    {item.children.map((child: any) => (
                      <Link
                        key={child.id}
                        href={child.url}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link
              href={item.url}
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
