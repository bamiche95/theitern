// src/app/about/page.tsx
import { getSiteSettings } from "@/lib/settings";
import AboutContent from "@/app/components/AboutContent";
import * as Icons from "lucide-react";
import ReviewForm from "../components/ReviewForm";
export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-950 text-white py-24 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Our Training
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {settings.hero_subtitle}
          </p>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white p-8 md:p-12 shadow-2xl shadow-blue-100 rounded-3xl border border-slate-100 mb-20">
          <h2 className="text-3xl font-bold mb-10 text-slate-900 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
            Meet our Trainer
          </h2>

          {/* This wrapper ensures the HTML inside is styled by Poppins and Prose */}
          <AboutContent value={settings.about_text} />
        </div>

        {/* --- CONTACT INFO GRID --- */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <Icons.MapPin className="text-blue-600 w-8 h-8 mb-4" />
            <h4 className="font-bold text-xl mb-2">Our Location</h4>
            <p className="text-slate-600 leading-relaxed">
              {settings.company_address}
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <Icons.Mail className="text-blue-600 w-8 h-8 mb-4" />
            <h4 className="font-bold text-xl mb-2">Get in Touch</h4>
            <p className="text-slate-600 mb-1">{settings.site_email}</p>
            <p className="text-slate-600 font-medium">{settings.phone_number}</p>
          </div>
        </div>
      </div>
      
    </main>
  );
}