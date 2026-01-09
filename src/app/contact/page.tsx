import { getSiteSettings } from "@/lib/settings";
import { url } from "inspector";
import { Mail, MapPin, Facebook, Linkedin, Instagram, MessageCircle, ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import ContactForm from "@/app/components/ContactForm";
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes slideInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  .animate-fade-in-left {
    animation: fadeInLeft 0.6s ease-out;
  }

  .animate-fade-in-right {
    animation: fadeInRight 0.6s ease-out;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-slide-in-scale {
    animation: slideInScale 0.5s ease-out;
  }

  .contact-item-1 { animation: fadeInLeft 0.6s ease-out 0.1s both; }
  .contact-item-2 { animation: fadeInLeft 0.6s ease-out 0.2s both; }
  .contact-item-3 { animation: fadeInLeft 0.6s ease-out 0.3s both; }
  .form-container { animation: fadeInRight 0.6s ease-out 0.2s both; }
`;

export default async function ContactPage() {
  const settings = await getSiteSettings();

const socialLinks = [
  { id: "social_fb", icon: "/icons/facebook.svg", label: "Facebook" },
  { id: "social_li", icon: "/icons/iconmonstr-linkedin-3.svg", label: "LinkedIn" },
  { id: "social_ig", icon: "/icons/instagram.svg", label: "Instagram" },
  { id: "social_wa", icon: "/icons/googlemessages.svg", label: "iMessage" },
].filter(link => settings[link.id]);


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <style>{styles}</style>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 animate-fade-in-up">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            We'd love to hear from you. Reach out to us via any of the channels below or fill out the form.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side: Contact Info */}
          <div>
            {/* Contact Information Cards */}
            <div className="space-y-6">
              {/* Email Card */}
              <div className="contact-item-1 group bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">Email Us</h3>
                    <a href={`mailto:${settings.site_email}`} className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 group/link">
                      {settings.site_email || "contact@yourdomain.com"}
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="contact-item-2 group bg-white p-8 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">Visit Us</h3>
                    <p className="text-slate-600 whitespace-pre-line text-sm leading-relaxed">
                      {settings.company_address || "No address provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="contact-item-3 bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
                <h3 className="font-bold text-slate-900 text-lg mb-6">Follow Us</h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={link.id}
                      href={settings[link.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 bg-gradient-to-br from-slate-100 to-slate-50 hover:from-blue-600 hover:to-purple-600 text-slate-700 hover:text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-110"
                      title={link.label}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Image
  src={link.icon}
  alt={link.label}
  width={24}
  height={24}
  className="invert-0 group-hover:invert transition"
/>

                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="form-container">
            <div className="relative bg-gradient-to-br from-white to-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
              {/* Background elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>

              <div className="relative">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>

                <ContactForm />


                <p className="text-xs text-slate-500 text-center mt-6">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl text-white animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-3">Prefer to call us?</h3>
            <p className="text-blue-100 mb-6">We're here to help during business hours</p>
            <a href="tel:+1234567890" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-100 transition-all hover:scale-105">
              <Phone className="w-5 h-5" />
              Give us a call
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}