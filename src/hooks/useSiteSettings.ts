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

export function useSiteSettings() {
  // Logo can safely start from cache (small, changes rarely)
  const cached = getCached();
  const [settings, setSettings] = useState<SiteSettings>({
    logo_url: cached.logo_url,
    hero_image_url: null, // never paint cached hero until network confirms (avoids old→new flash)
  });
  const [loaded, setLoaded] = useState(false);
  const [heroReady, setHeroReady] = useState(false);

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

      setSettings(next);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      setLoaded(true);

      // Preload hero so it appears fully ready (no progressive paint flash)
      if (next.hero_image_url) {
        const img = new window.Image();
        img.onload = () => {
          if (!cancelled) setHeroReady(true);
        };
        img.onerror = () => {
          if (!cancelled) setHeroReady(true); // still show even if error
        };
        img.src = next.hero_image_url;
      } else {
        setHeroReady(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    ...settings,
    loaded,
    heroReady, // true only after network URL is known AND image has been preloaded
  };
}
