import * as Icons from "lucide-react";
import { getSiteFeatures } from "@/lib/settings";

// Map your gradient keys to Tailwind classes
const gradients: Record<string, string> = {
  blue: "from-blue-500 to-cyan-500",
  purple: "from-purple-500 to-pink-500",
  orange: "from-orange-500 to-red-500",
  green: "from-green-500 to-emerald-500",
  slate: "from-slate-700 to-slate-900",
  indigo: "from-indigo-500 to-blue-600",
};

export default async function WhyChooseUs() {
  const features = await getSiteFeatures();
  if (features.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">
            The Learning Advantage
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Why thousands of students <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">trust our platform</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature: any) => {
            // Dynamically select the icon component
            const IconComponent = (Icons as any)[feature.icon_name] || Icons.HelpCircle;
            const gradientClass = gradients[feature.gradient_key] || gradients.blue;

            return (
              <div key={feature.id} className="group p-8 bg-white rounded-3xl border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}