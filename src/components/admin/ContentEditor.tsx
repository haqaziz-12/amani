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
        setImageUrl((data as any).image_url || null);
      } else {
        setId(null);
        setTitle("");
        setBody("");
        setImageUrl(null);
      }

      // Fallback: about image also stored on site_settings
      if (tab === "about" && !(data as any)?.image_url) {
        const { data: settings } = await supabase
          .from("site_settings")
          .select("*")
          .limit(1)
          .maybeSingle();
        if ((settings as any)?.about_image_url) {
          setImageUrl((settings as any).about_image_url);
        }
      }

      setLoading(false);
    };
    load();
  }, [tab, table]);

  const persistAboutImage = async (url: string | null) => {
    // 1) about_content.image_url (if column exists)
    if (id) {
      const { error } = await supabase
        .from("about_content")
        .update({ image_url: url, updated_at: new Date().toISOString() } as any)
        .eq("id", id);
      if (error) {
        console.warn("about_content.image_url update:", error.message);
      }
    }

    // 2) Always also store on site_settings (reliable, same as logo)
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from("site_settings")
        .update({ about_image_url: url, updated_at: new Date().toISOString() } as any)
        .eq("id", existing.id);
      if (error) {
        // Column may not exist yet — try without failing the upload UX
        console.warn("site_settings.about_image_url update:", error.message);
        return error.message;
      }
    } else {
      await supabase.from("site_settings").insert({ about_image_url: url } as any);
    }
    return null;
  };

  const uploadAboutImage = async (file: File) => {
    setUploading(true);
    setMessage("");
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `about-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from("products").getPublicUrl(fileName);
      const url = publicData.publicUrl;
      setImageUrl(url);

      const dbErr = await persistAboutImage(url);
      if (dbErr) {
        setMessage(
          `Image uploaded to storage, but DB save failed: ${dbErr}. Run the SQL below in Supabase, then click Save Content.`
        );
      } else {
        setMessage("Image uploaded and saved! Refresh the About page to see it.");
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message || "Upload failed"}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    setImageUrl(null);
    await persistAboutImage(null);
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

      if (id) {
        // Try with image_url; if column missing, retry without it
        let { error } = await supabase
          .from(table)
          .update(
            tab === "about" ? { ...payload, image_url: imageUrl } : payload
          as any)
          .eq("id", id);

        if (error && tab === "about" && /image_url/i.test(error.message)) {
          ({ error } = await supabase.from(table).update(payload as any).eq("id", id));
        }
        if (error) throw error;
      } else {
        const insertPayload =
          tab === "about" ? { ...payload, image_url: imageUrl } : payload;
        let { data, error } = await supabase
          .from(table)
          .insert(insertPayload as any)
          .select("id")
          .single();

        if (error && tab === "about" && /image_url/i.test(error.message)) {
          ({ data, error } = await supabase
            .from(table)
            .insert(payload as any)
            .select("id")
            .single());
        }
        if (error) throw error;
        if (data) setId(data.id);
      }

      if (tab === "about") {
        await persistAboutImage(imageUrl);
      }

      setMessage("Saved successfully! Hard-refresh the public About page.");
      setTimeout(() => setMessage(""), 4000);
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
            message.startsWith("Error") || message.includes("failed")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {tab === "about" && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <strong>Required once:</strong> In Supabase → SQL Editor, run:
          <pre className="mt-2 p-2 bg-white rounded text-[11px] overflow-x-auto">{`ALTER TABLE about_content ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_image_url text;`}</pre>
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

        {tab === "about" && (
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-2">
              About page image
            </label>
            <p className="text-xs text-brand-muted mb-3">
              Shown next to “Our Roots in Kabul”. Workshop, team, or carpet photo works best.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-48 aspect-square bg-muted rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative">
                {imageUrl ? (
                  <Image src={imageUrl} alt="About" fill className="object-cover" unoptimized />
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
            {imageUrl && (
              <p className="mt-2 text-xs text-brand-muted break-all">URL: {imageUrl}</p>
            )}
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
    </div>
  );
}
