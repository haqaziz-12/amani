"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, Upload, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

export default function ContentEditor({ tab }: { tab: "about" | "services" | "craftsmanship" }) {
  const tableMap = {
    about: "about_content",
    services: "services_content",
    craftsmanship: "craftsmanship_content",
  } as const;
  const table = tableMap[tab];
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from(table).select("*").limit(1).maybeSingle();
      if (data) {
        setId(data.id);
        setTitle(data.title || "");
        setBody(data.body || "");
        setImageUrl(data.image_url || null);
      } else {
        setId(null);
        setTitle("");
        setBody("");
        setImageUrl(null);
      }
      setLoading(false);
    };
    load();
  }, [tab, table]);

  const uploadAboutImage = async (file: File) => {
    setUploading(true);
    setMessage("");
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `about-${Date.now()}.${ext}`;
      // Reuse products bucket (already public) or logos
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage.from("products").getPublicUrl(fileName);
      const url = publicData.publicUrl;
      setImageUrl(url);

      // Persist immediately if row exists
      if (id) {
        await supabase
          .from(table)
          .update({ image_url: url, updated_at: new Date().toISOString() } as any)
          .eq("id", id);
      }
      setMessage("Image uploaded! Click Save Content to keep title/body changes.");
      setTimeout(() => setMessage(""), 4000);
    } catch (err: any) {
      setMessage(`Error: ${err.message || "Upload failed"}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    setImageUrl(null);
    if (id) {
      await supabase
        .from(table)
        .update({ image_url: null, updated_at: new Date().toISOString() } as any)
        .eq("id", id);
    }
    setMessage("Image removed.");
    setTimeout(() => setMessage(""), 3000);
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const payload: Record<string, unknown> = {
        title,
        body,
        updated_at: new Date().toISOString(),
      };
      if (tab === "about") {
        payload.image_url = imageUrl;
      }

      if (id) {
        const { error } = await supabase.from(table).update(payload as any).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from(table)
          .insert(payload as any)
          .select("id")
          .single();
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
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
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

        {/* About-only image upload */}
        {tab === "about" && (
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-2">
              About page image
            </label>
            <p className="text-xs text-brand-muted mb-3">
              Shown next to “Our Roots in Kabul”. Upload a workshop photo, team photo, or carpet
              detail — more valuable than the logo alone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-48 aspect-square bg-muted rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="About"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="text-center text-brand-muted text-sm p-4">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No image
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadAboutImage(f);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 bg-brand-red text-white font-medium px-4 py-2.5 rounded-lg hover:bg-brand-red-dark disabled:opacity-60 text-sm"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Upload image
                    </>
                  )}
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center justify-center gap-2 border border-border text-brand-muted font-medium px-4 py-2.5 rounded-lg hover:bg-muted text-sm"
                  >
                    <X className="w-4 h-4" /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Body content</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={14}
            className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-red font-mono text-sm"
            placeholder="Write the page content here."
          />
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-red text-white font-medium px-6 py-3 rounded-lg hover:bg-brand-red-dark disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Content
            </>
          )}
        </button>
      </div>
      <p className="mt-4 text-xs text-brand-muted">
        Content is saved to Supabase and shown on the public page after refresh.
      </p>
    </div>
  );
}
