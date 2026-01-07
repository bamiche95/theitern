"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Save, Globe, Mail, ShieldCheck, Share2, Loader2, CheckCircle } from "lucide-react";
import ImageUpload from "@/app/components/ImageUpload";

const InputField = ({ label, id, type = "text", value, onChange, onSave, isSaving }: any) => (
  <div className="mb-5">
    <label className="block text-sm font-semibold text-slate-700 mb-3">{label}</label>
    <div className="flex gap-2">
      <input
        type={type}
        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        value={value || ""}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      <button 
        onClick={() => onSave(id, value)}
        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg transition-all font-medium flex items-center justify-center min-w-[44px]"
        title="Save changes"
      >
        {isSaving === id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

const Editor = dynamic(() => import("@/app/components/Editor"), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-100 animate-pulse border border-slate-200 rounded-lg" />
});

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        const parsed = { ...data };
        Object.keys(parsed).forEach(key => {
          try { parsed[key] = JSON.parse(parsed[key]); } catch (e) {}
        });
        setSettings(parsed);
        setLoading(false);
      });
  }, []);

  const handleLocalChange = (id: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [id]: value }));
  };

  const saveSetting = async (key: string, value: any) => {
    setSaving(key);
    await fetch("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify({ key, value }),
    });
    setSaving(null);
    setSavedFeedback(key);
    setTimeout(() => setSavedFeedback(null), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Site Settings</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your website configuration and content</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-white rounded-lg border border-slate-200 p-1 w-fit">
          {[
            { id: 'general', label: 'General Settings', icon: Globe },
            { id: 'social', label: 'Social Links', icon: Share2 },
            { id: 'legal', label: 'Policies & Content', icon: ShieldCheck },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-all ${
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Branding Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">🎨</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Identity & Branding</h2>
                  <p className="text-sm text-slate-500">Upload your company's visual identity</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageUpload 
                  label="Site Logo" 
                  value={settings.logo_url} 
                  onChange={(url) => {
                    setSettings((prev: any) => ({ ...prev, logo_url: url }));
                    saveSetting("logo_url", url);
                  }} 
                />
                <ImageUpload 
                  label="Site Icon (Favicon)" 
                  value={settings.icon_url} 
                  onChange={(url) => {
                    setSettings((prev: any) => ({ ...prev, icon_url: url }));
                    saveSetting("icon_url", url);
                  }} 
                />
                     <ImageUpload 
                  label="Footer Logo" 
                  value={settings.footer_logo_url} 
                  onChange={(url) => {
                    setSettings((prev: any) => ({ ...prev, footer_logo_url: url }));
                    saveSetting("footer_logo_url", url);
                  }} 
                />
              </div>
              <div className="mt-6">
                <InputField 
                  label="Company Registration Info" 
                  id="company_reg" 
                  value={settings.company_reg} 
                  onChange={handleLocalChange}
                  onSave={saveSetting}
                  isSaving={saving}
                />
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
                  <p className="text-sm text-slate-500">Your public contact details displayed on the website</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField 
                  label="Public Email" 
                  id="site_email" 
                  type="email" 
                  value={settings.site_email} 
                  onChange={handleLocalChange}
                  onSave={saveSetting}
                  isSaving={saving}
                />
                <InputField 
                  label="Public Phone Number" 
                  id="phone_number" 
                  value={settings.phone_number} 
                  onChange={handleLocalChange}
                  onSave={saveSetting}
                  isSaving={saving}
                />
                <div className="md:col-span-2">
                  <InputField 
                    label="Company Address" 
                    id="company_address" 
                    value={settings.company_address} 
                    onChange={handleLocalChange}
                    onSave={saveSetting}
                    isSaving={saving}
                  />
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-600">✨</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Homepage Hero Section</h2>
                  <p className="text-sm text-slate-500">Customize your hero and footer content</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField 
                  label="Hero Title" 
                  id="hero_title"
                  value={settings.hero_title} 
                  onChange={handleLocalChange}
                  onSave={saveSetting}
                  isSaving={saving}
                />
                <InputField 
                  label="Hero Subtitle" 
                  id="hero_subtitle" 
                  value={settings.hero_subtitle} 
                  onChange={handleLocalChange}
                  onSave={saveSetting}
                  isSaving={saving}
                />
                <div className="md:col-span-2">
                  <InputField 
                    label="Footer About Text" 
                    id="footer_about_text" 
                    value={settings.footer_about_text} 
                    onChange={handleLocalChange}
                    onSave={saveSetting}
                    isSaving={saving}
                  />
                </div>
                <div className="md:col-span-2">
                  <InputField 
                    label="Site description for SEO" 
                    id="site_description" 
                    value={settings.site_description} 
                    onChange={handleLocalChange}
                    onSave={saveSetting}
                    isSaving={saving}
                  />
                </div>
                   <div className="md:col-span-2">
                  <InputField 
                    label="Site title for SEO" 
                    id="site_title" 
                    value={settings.site_title} 
                    onChange={handleLocalChange}
                    onSave={saveSetting}
                    isSaving={saving}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Social Media Links</h2>
                <p className="text-sm text-slate-500">Add URLs to your social media profiles</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <InputField label="Facebook URL" id="social_fb" value={settings.social_fb} onChange={handleLocalChange} onSave={saveSetting} isSaving={saving} />
              <InputField label="LinkedIn URL" id="social_li" value={settings.social_li} onChange={handleLocalChange} onSave={saveSetting} isSaving={saving} />
              <InputField label="Instagram URL" id="social_ig" value={settings.social_ig} onChange={handleLocalChange} onSave={saveSetting} isSaving={saving} />
              <InputField label="TikTok URL" id="social_tk" value={settings.social_tk} onChange={handleLocalChange} onSave={saveSetting} isSaving={saving} />
              <InputField label="WhatsApp Number" id="social_wa" value={settings.social_wa} onChange={handleLocalChange} onSave={saveSetting} isSaving={saving} />
              <InputField label="YouTube URL" id="social_yt" value={settings.social_yt} onChange={handleLocalChange} onSave={saveSetting} isSaving={saving} />
            </div>
          </div>
        )}

        {/* Legal Tab */}
        {activeTab === 'legal' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {[
              { id: 'about_text', label: 'About Us Page', icon: '📖' },
              { id: 'policy_text', label: 'Privacy Policy', icon: '🔒' },
              { id: 'terms_text', label: 'Terms & Conditions', icon: '⚖️' },
              { id: 'cookie_text', label: 'Cookie Policy', icon: '🍪' },
            ].map(section => (
              <div key={section.id} className="bg-white rounded-lg border border-slate-200 p-8">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{section.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{section.label}</h3>
                      <p className="text-sm text-slate-500">Edit the content displayed on your website</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => saveSetting(section.id, settings[section.id])}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg font-medium transition-all whitespace-nowrap"
                  >
                    {saving === section.id ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    Save
                  </button>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <Editor 
                    defaultValue={settings[section.id]} 
                    onTextChange={(content) => setSettings((prev: any) => ({...prev, [section.id]: content}))}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Feedback Toast */}
      {savedFeedback && (
        <div className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Changes saved successfully</span>
        </div>
      )}
    </div>
  );
}