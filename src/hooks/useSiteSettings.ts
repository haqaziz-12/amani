"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  logo_url: string | null;
  hero_image_url: string | null;
};

const CACHE_KEY = "khalaj_amani_site_settings";

function getCached(): SiteSettings {
  if (typeof window === "undefined") {
    return { logo_url: null, hero_image_url: null };
  }
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        logo_url: parsed.logo_url || null,
        hero_image_url: parsed.hero_image_url || null,
      };
    }
  } catch {
    // ignore
  }
  return { logo_url: null, hero_image_url: null };
}

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // still resolve so UI doesn't hang
    img.src = url;
  });
}

export function useSiteSettings() {
  // Start from cache so logo + hero appear instantly on return visits
  const [settings, setSettings] = useState<SiteSettings>(getCached);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("logo_url, hero_image_url")
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      const next: SiteSettings = {
        logo_url: data?.logo_url || null,
        hero_image_url: data?.hero_image_url || null,
      };

      const currentHero = settings.hero_image_url;

      // If hero URL changed, preload the new image first, then swap
      // (prevents old→new flash and also avoids empty burgundy gap)
      if (next.hero_image_url && next.hero_image_url !== currentHero) {
        await preloadImage(next.hero_image_url);
        if (cancelled) return;
      }

      setSettings(next);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      setLoaded(true);
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...settings, loaded };
}
