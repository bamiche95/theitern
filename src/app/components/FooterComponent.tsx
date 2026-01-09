import { Mail, Headset, MapPin } from 'lucide-react';
import { getSiteSettings } from '@/lib/settings';
import Image from 'next/image';
interface Settings {
  company_reg?: string;
  logo_url?: string;
  site_email?: string;
  phone_number?: string;
  company_address?: string;
  footer_about_text?: string;
  social_ig?: string;
  social_li?: string;
  social_wa?: string;
  social_fb?: string;
  // This line allows indexing with any string key
  [key: string]: string | undefined; 
}

interface FooterProps {
  settings: Settings;
}

export default function Footer({ settings }: FooterProps) {
  const socialLinks = [
    { id: "social_fb", icon: "/icons/facebook.svg", label: "Facebook" },
    { id: "social_li", icon: "/icons/iconmonstr-linkedin-3.svg", label: "LinkedIn" },
    { id: "social_ig", icon: "/icons/instagram.svg", label: "Instagram" },
    { id: "social_wa", icon: "/icons/googlemessages.svg", label: "iMessage" },
];


  return (
    <footer className="bg-gray-950 border-t border-slate-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo Section */}
          <div>
            {settings.company_reg && settings.footer_logo_url && (
              <img src={settings.footer_logo_url} alt="Company Logo" className="h-12 mb-4 w-auto" />
            )}
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <p>
                {settings.footer_about_text}
              </p>
            </div>
          </div>

          {/* Help and Support */}
          <div>
            <h3 className="text-lg font-bold text-gray-300 mb-4">Help and Support</h3>
            <nav className="flex flex-col gap-3">
              <a href="/contact" className="text-gray-300 hover:text-blue-300 transition">
                Contact us
              </a>
              <a href="/allcourses" className="text-gray-300 hover:text-blue-300 transition">
                Courses
              </a>
              <a href="/about" className="text-gray-300 hover:text-blue-300 transition">
                About us
              </a>
            </nav>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-300 mb-4">Contact</h3>
            <div className="flex items-center gap-4 text-gray-300 mb-2">
              <Mail size={18} />
              <a href={`mailto:${settings.site_email}`} className="hover:text-blue-300 transition">
                {settings.site_email}
              </a>
            </div>
            <div className="flex items-center gap-4 text-gray-300 mb-2">
              <Headset size={18} />
              <a href={`tel:${settings.phone_number}`} className="hover:text-blue-300 transition">
                {settings.phone_number}
              </a>
            </div>
            <div className="flex items-center gap-4 text-gray-300 mb-6">
              <MapPin size={18} />
              <span className="hover:text-blue-300 transition">
                {settings.company_address}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((link) => {
                const url = settings[link.id];
                return url ? (
                  <a
                    key={link.id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 bg-gradient-to-br from-slate-100 to-slate-400 hover:from-blue-600 hover:to-purple-600 text-slate-300 hover:text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-110"
                    title={link.label}
                  >
                      <Image
  src={link.icon}
  alt={link.label}
  width={24}
  height={24}
  className="invert-0 group-hover:invert transition"
/>                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-slate-100 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Company Registration */}
            {settings.company_reg && (
              <p className="text-sm text-slate-600">
                {settings.company_reg}
              </p>
            )}

            {/* Policies Links */}
            <div className="flex gap-6">
              <a href="/policies/privacy" className="text-sm text-slate-600 hover:text-blue-300 transition">
                Privacy Policy
              </a>
              <a href="/policies/terms" className="text-sm text-slate-600 hover:text-blue-300 transition">
                Terms of Service
              </a>
              <a href="/policies/cookies" className="text-sm text-slate-600 hover:text-blue-300 transition">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}