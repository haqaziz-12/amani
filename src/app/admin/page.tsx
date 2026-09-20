"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, LayoutDashboard, Image, FileText, Package, HelpCircle, Settings } from "lucide-react";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with real Supabase Auth

  // Placeholder login — replace with supabase.auth.signInWithPassword
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate Supabase Auth
    // const { error } = await supabase.auth.signInWithPassword({ email, password });
    alert("Connect Supabase Auth to enable real login. For now this is a UI skeleton.");
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-brand-red" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold text-center text-brand-dark mb-2">Admin Login</h1>
          <p className="text-center text-sm text-brand-muted mb-6">
            Sign in with your Supabase Auth credentials
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
            <button
              type="submit"
              className="w-full bg-brand-red text-white font-semibold py-3 rounded-lg hover:bg-brand-red-dark transition-colors"
            >
              Sign In
            </button>
          </form>
          <p className="mt-4 text-xs text-center text-brand-muted">
            Create an admin user in your Supabase project → Authentication → Users
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-xl font-bold text-brand-dark">Khalaj Amani Admin</h1>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="text-sm text-brand-muted hover:text-brand-red"
        >
          Sign Out
        </button>
      </header>

      <div className="container-wide py-10 px-4">
        <p className="text-brand-muted mb-8">
          Real-time content management powered by Supabase. Connect your project keys and implement
          the CRUD operations using the schema in <code className="text-brand-red">supabase/schema.sql</code>.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Image, title: "Home / Logo & Hero", desc: "Upload or replace logo and hero image/video", href: "#" },
            { icon: FileText, title: "About Content", desc: "Edit the About page text in real time", href: "#" },
            { icon: Package, title: "Products", desc: "Add, edit, delete products + 3 images each", href: "#" },
            { icon: LayoutDashboard, title: "Services", desc: "Update Services page content", href: "#" },
            { icon: Settings, title: "Craftsmanship", desc: "Edit Craftsmanship page content", href: "#" },
            { icon: HelpCircle, title: "FAQ", desc: "Manage FAQ questions and answers", href: "#" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <item.icon className="w-8 h-8 text-brand-red mb-3" />
              <h2 className="font-serif text-lg font-semibold text-brand-dark mb-1">{item.title}</h2>
              <p className="text-sm text-brand-muted mb-4">{item.desc}</p>
              <span className="text-xs font-medium text-brand-red">Coming with full Supabase wiring</span>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-brand-gold/20 rounded-2xl border border-brand-gold/40">
          <h3 className="font-semibold text-brand-dark mb-2">Next steps for full Admin</h3>
          <ol className="list-decimal list-inside text-sm text-brand-muted space-y-1">
            <li>Create Supabase project and run <code>supabase/schema.sql</code></li>
            <li>Add NEXT_PUBLIC_SUPABASE_URL and ANON_KEY to environment variables</li>
            <li>Create an admin user in Supabase Authentication</li>
            <li>Replace the placeholder login with real <code>supabase.auth.signInWithPassword</code></li>
            <li>Implement upload to Supabase Storage for logo, hero and product images</li>
            <li>Use Supabase Realtime subscriptions so changes appear live on the public site</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
