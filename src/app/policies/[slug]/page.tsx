// src/app/policies/[slug]/page.tsx
import { getSiteSettings } from "@/lib/settings";
import AboutContent from "@/app/components/AboutContent";
import { notFound } from "next/navigation";

const VALID_POLICIES: Record<string, string> = {
  "about": "about_text",
  "privacy": "policy_text",
  "terms": "terms_text",
  "cookies": "cookie_text",
};

// 1. Update the type to Promise
export default async function PolicyPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // 2. Await the params to get the slug
  const { slug } = await params;
  
  // 3. Now you can safely use slug
  const settingKey = VALID_POLICIES[slug];
  if (!settingKey) {
    notFound();
  }

  const settings = await getSiteSettings();
  const content = settings[settingKey];
  
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ') + " Us";

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {slug === 'about' ? 'About Us' : title.replace(' Us', '')}
        </h1>
        <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
      </div>
      
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8 md:p-12">
        {content ? (
          <AboutContent value={content} />
        ) : (
          <p className="text-slate-500 text-center italic">Content is currently being updated...</p>
        )}
      </div>

      {settings.company_reg && slug === 'about' && (
        <p className="mt-8 text-center text-xs text-slate-400">
          Registration: {settings.company_reg}
        </p>
      )}
    </main>
  );
}