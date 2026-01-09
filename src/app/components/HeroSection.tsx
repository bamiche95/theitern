import { Sparkles, ArrowRight } from "lucide-react";

interface Settings {
  hero_title: string;
  hero_subtitle: string;
  hero_tagline_title: string;
}

interface HeroSectionProps {
  settings: Settings;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/uploads/theitern.mp4" type="video/mp4" />
        </video>

        {/* Stronger mobile-safe overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Decorative blobs (hide on small screens) */}
      <div className="hidden sm:block absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-15 animate-pulse z-0" />
      <div className="hidden sm:block absolute -bottom-32 left-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-15 animate-pulse z-0" />

      {/* Content */}
      <div className="relative z-10 min-h-[100svh] flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            {settings.hero_tagline_title}
          </div>

          {/* Title */}
          <h1
            className="
              font-extrabold text-white tracking-tight leading-tight
              text-[clamp(2.25rem,6vw,4.5rem)]
            "
          >
            {settings.hero_title}
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto">
            {settings.hero_subtitle}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
            <a
              href="#courses"
              className="
                w-full sm:w-auto
                px-8 py-4
                bg-blue-600 text-white font-bold
                rounded-xl
                flex items-center justify-center gap-2
                shadow-lg hover:bg-blue-700 transition
              "
            >
              Browse Courses
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="/policies/about"
              className="
                w-full sm:w-auto
                px-8 py-4
                bg-white/90 text-slate-800 font-bold
                rounded-xl
                border border-white/60
                hover:bg-white transition
              "
            >
              Meet the Trainer
            </a>
          </div>
        </div>
      </div>

      {/* Subtle accents (desktop only) */}
      <div className="hidden md:block absolute top-32 right-12 w-24 h-24 bg-blue-400/5 rounded-full blur-2xl z-0" />
      <div className="hidden md:block absolute bottom-20 left-12 w-32 h-32 bg-indigo-400/5 rounded-full blur-3xl z-0" />
    </section>
  );
}
