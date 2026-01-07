"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export default function MobileMenu({ navItems }: { navItems: any[] }) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
  }, [open]);

  return (
    <>
      {/* Toggle */}
      <button
        className="md:hidden p-2 text-slate-700"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed top-16 left-0 w-screen h-[calc(100vh-64px)] bg-white z-50 overflow-y-auto">
          <nav className="p-4">
            {navItems.map((item) => (
              <div key={item.id} className="border-b last:border-0">
                {item.children?.length ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.id ? null : item.id
                        )
                      }
                      className="w-full flex items-center justify-between py-4 font-medium"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openDropdown === item.id && (
                      <div className="bg-slate-50 rounded-lg mb-4">
                        {item.children.map((child: any) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            onClick={() => setOpen(false)}
                            className="block px-4 py-3 text-sm"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className="block py-4 font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
