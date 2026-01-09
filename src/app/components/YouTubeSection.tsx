import { Play } from "lucide-react";
import YouTubeEmbed from "@/app/components/YoutubeEmbed";

export default function YouTubeSection({ settings }: { settings: any }) {
  return (
    <section id="youtube" className="py-24 px-6 w-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-0">
            <div className="flex-1">
           
              <h2 className="text-4xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
                {settings.youtube_section_headline}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                {settings.youtube_section_subheadline}
              </p>
            </div>
            <div className="hidden lg:block h-px w-24 bg-gradient-to-r from-slate-200 to-transparent" />
          </div>
        </div>

        {/* Video Container */}
        {settings.youtube_default_url ? (
          <div className="group relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />
            
            {/* Video wrapper */}
            <div className="relative">
              <YouTubeEmbed
                url={settings.youtube_default_url}
                title="Typical training session"
              />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-5" />
            <div className="relative bg-white border-2 border-dashed border-slate-200 rounded-2xl py-24 text-center">
              <Play className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No video available at the moment!</p>
              <p className="text-slate-300 text-sm mt-2">Check back soon for training content</p>
            </div>
          </div>
        )}

        {/* Bottom accent */}
        <div className="mt-12 flex justify-center">
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full" />
        </div>
      </div>
    </section>
  );
}