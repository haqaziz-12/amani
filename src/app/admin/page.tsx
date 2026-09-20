"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  Lock,
  Image as ImageIcon,
  Package,
  FileText,
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  Loader2,
  Upload,
  CheckCircle2,
  X,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

type Tab = "dashboard" | "logo-hero" | "products" | "about" | "services" | "craftsmanship" | "faq";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  // Logo & Hero state
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        // Load current logo & hero from site_settings
        const { data } = await supabase
          .from("site_settings")
          .select("logo_url, hero_image_url")
          .limit(1)
          .maybeSingle();

        if (data) {
          setLogoUrl(data.logo_url);
          setHeroUrl(data.hero_image_url);
        }
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveTab("dashboard");
  };

  const uploadFile = async (
    file: File,
    bucket: "logos" | "heroes",
    setUploading: (v: boolean) => void,
    setUrl: (url: string) => void,
    column: "logo_url" | "hero_image_url"
  ) => {
    setUploading(true);
    setUploadMessage("");

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${column}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      const publicUrl = publicData.publicUrl;

      // Save URL to site_settings (upsert)
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        await supabase
          .from("site_settings")
          .update({ [column]: publicUrl, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase.from("site_settings").insert({
          [column]: publicUrl,
        });
      }

      setUrl(publicUrl);
      setUploadMessage("Uploaded successfully!");
      setTimeout(() => setUploadMessage(""), 3000);
    } catch (err: any) {
      setUploadMessage(`Error: ${err.message || "Upload failed"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file, "logos", setUploadingLogo, setLogoUrl, "logo_url");
    }
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file, "heroes", setUploadingHero, setHeroUrl, "hero_image_url");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  // LOGIN
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-brand-red" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold text-center text-brand-dark mb-2">Admin Login</h1>
          <p className="text-center text-sm text-brand-muted mb-6">Sign in with your Supabase admin account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-red"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-red"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-red text-white font-semibold py-3 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD + TABS
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b border-border px-4 md:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-bold text-brand-dark">Khalaj Amani Admin</h1>
          <p className="text-xs text-brand-muted">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-red transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>

      <div className="container-wide py-8 px-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
            { id: "logo-hero" as Tab, label: "Logo & Hero", icon: ImageIcon },
            { id: "products" as Tab, label: "Products", icon: Package },
            { id: "about" as Tab, label: "About", icon: FileText },
            { id: "services" as Tab, label: "Services", icon: Settings },
            { id: "craftsmanship" as Tab, label: "Craftsmanship", icon: Settings },
            { id: "faq" as Tab, label: "FAQ", icon: HelpCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-brand-red text-white"
                  : "bg-white text-brand-dark border border-border hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ImageIcon, title: "Logo & Hero", desc: "Upload or replace logo and hero image", tab: "logo-hero" as Tab },
              { icon: Package, title: "Products", desc: "Add, edit, delete products + images", tab: "products" as Tab },
              { icon: FileText, title: "About Content", desc: "Edit the About page text", tab: "about" as Tab },
              { icon: LayoutDashboard, title: "Services", desc: "Update Services page content", tab: "services" as Tab },
              { icon: Settings, title: "Craftsmanship", desc: "Edit Craftsmanship page", tab: "craftsmanship" as Tab },
              { icon: HelpCircle, title: "FAQ", desc: "Manage FAQ questions and answers", tab: "faq" as Tab },
            ].map((item) => (
              <button
                key={item.title}
                onClick={() => setActiveTab(item.tab)}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm text-left hover:shadow-md transition-shadow"
              >
                <item.icon className="w-8 h-8 text-brand-red mb-3" />
                <h2 className="font-serif text-lg font-semibold text-brand-dark mb-1">{item.title}</h2>
                <p className="text-sm text-brand-muted">{item.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* LOGO & HERO TAB */}
        {activeTab === "logo-hero" && (
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm max-w-3xl">
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-6">Logo & Hero Image</h2>

            {uploadMessage && (
              <div className={`mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
                uploadMessage.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
              }`}>
                {uploadMessage.startsWith("Error") ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {uploadMessage}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Logo */}
              <div>
                <h3 className="font-semibold text-brand-dark mb-3">Website Logo</h3>
                <div className="aspect-square bg-muted rounded-xl border-2 border-dashed border-border flex items-center justify-center mb-4 overflow-hidden">
                  {logoUrl ? (
                    <Image src={logoUrl} alt="Current logo" width={200} height={200} className="object-contain" />
                  ) : (
                    <div className="text-center text-brand-muted text-sm">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      No logo uploaded yet
                    </div>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="w-full flex items-center justify-center gap-2 bg-brand-red text-white font-medium py-3 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-60"
                >
                  {uploadingLogo ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Upload New Logo</>
                  )}
                </button>
                <p className="text-xs text-brand-muted mt-2">Recommended: square image (PNG or JPG)</p>
              </div>

              {/* Hero */}
              <div>
                <h3 className="font-semibold text-brand-dark mb-3">Hero Image</h3>
                <div className="aspect-video bg-muted rounded-xl border-2 border-dashed border-border flex items-center justify-center mb-4 overflow-hidden">
                  {heroUrl ? (
                    <Image src={heroUrl} alt="Current hero" width={400} height={225} className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-center text-brand-muted text-sm">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      No hero image uploaded yet
                    </div>
                  )}
                </div>
                <input
                  ref={heroInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeroChange}
                  className="hidden"
                />
                <button
                  onClick={() => heroInputRef.current?.click()}
                  disabled={uploadingHero}
                  className="w-full flex items-center justify-center gap-2 bg-brand-red text-white font-medium py-3 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-60"
                >
                  {uploadingHero ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Upload New Hero Image</>
                  )}
                </button>
                <p className="text-xs text-brand-muted mt-2">Recommended: wide image (16:9)</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800">
              <strong>Note:</strong> After uploading, the public website still uses the static logo for now.
              In the next update I will connect the uploaded logo/hero so the public pages automatically use them.
            </div>
          </div>
        )}

        {/* OTHER TABS - placeholders for now */}
        {(activeTab === "products" || activeTab === "about" || activeTab === "services" || activeTab === "craftsmanship" || activeTab === "faq") && (
          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm text-center">
            <Package className="w-12 h-12 text-brand-red mx-auto mb-4 opacity-60" />
            <h2 className="font-serif text-xl font-bold text-brand-dark mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h2>
            <p className="text-brand-muted">
              This section is coming in the next update. Logo & Hero upload is ready above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
