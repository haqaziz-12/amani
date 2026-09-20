"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Save } from "lucide-react";

export default function ContentEditor({ tab }: { tab: "about" | "services" | "craftsmanship" }) {
  const tableMap = {
    about: "about_content",
    services: "services_content",
    craftsmanship: "craftsmanship_content",
  } as const;
  const table = tableMap[tab];
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [id, setId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from(table).select("*").limit(1).maybeSingle();
      if (data) {
        setId(data.id);
        setTitle(data.title || "");
        setBody(data.body || "");
      } else {
        setId(null);
        setTitle("");
        setBody("");
      }
      setLoading(false);
    };
    load();
  }, [tab, table]);

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      if (id) {
        const { error } = await supabase.from(table).update({
          title,
          body,
          updated_at: new Date().toISOString(),
        } as any).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from(table).insert({
          title,
          body,
        } as any).select("id").single();
        if (error) throw error;
        if (data) setId(data.id);
      }
      setMessage("Saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm max-w-3xl">
      <h2 className="font-serif text-2xl font-bold text-brand-dark mb-6 capitalize">{tab} Content</h2>
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${message.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {message}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-red"
            placeholder="Page title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Body content</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={14}
            className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-red font-mono text-sm"
            placeholder="Write the page content here. You can use plain text or simple HTML."
          />
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-red text-white font-medium px-6 py-3 rounded-lg hover:bg-brand-red-dark disabled:opacity-60"
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Content</>}
        </button>
      </div>
      <p className="mt-4 text-xs text-brand-muted">
        Content is saved to Supabase. Public pages currently show default rich content.
      </p>
    </div>
  );
}
