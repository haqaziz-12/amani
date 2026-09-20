"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Lock,
  LayoutDashboard,
  Image,
  FileText,
  Package,
  HelpCircle,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  // LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-brand-red" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold text-center text-brand-dark mb-2">
            Admin Login
          </h1>
          <p className="text-center text-sm text-brand-muted mb-6">
            Sign in with your Supabase admin account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-red"
                required
                autoComplete="email"
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
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-red text-white font-semibold py-3 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD (logged in)
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
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

      <div className="container-wide py-10 px-4">
        <p className="text-brand-muted mb-8">
          You are logged in. Next we will add Logo / Hero upload and Product management.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Image, title: "Logo & Hero", desc: "Upload or replace logo and hero image", status: "Coming next" },
            { icon: Package, title: "Products", desc: "Add, edit, delete products + images", status: "Coming next" },
            { icon: FileText, title: "About Content", desc: "Edit the About page text", status: "Coming next" },
            { icon: LayoutDashboard, title: "Services", desc: "Update Services page content", status: "Coming next" },
            { icon: Settings, title: "Craftsmanship", desc: "Edit Craftsmanship page", status: "Coming next" },
            { icon: HelpCircle, title: "FAQ", desc: "Manage FAQ questions and answers", status: "Coming next" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-border p-6 shadow-sm"
            >
              <item.icon className="w-8 h-8 text-brand-red mb-3" />
              <h2 className="font-serif text-lg font-semibold text-brand-dark mb-1">{item.title}</h2>
              <p className="text-sm text-brand-muted mb-3">{item.desc}</p>
              <span className="text-xs font-medium text-brand-red">{item.status}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-green-50 rounded-2xl border border-green-200">
          <h3 className="font-semibold text-green-800 mb-1">Login working</h3>
          <p className="text-sm text-green-700">
            Supabase Auth is connected. You can now sign in and sign out successfully.
            Next step: Logo & Hero upload + Product management.
          </p>
        </div>
      </div>
    </div>
  );
}
