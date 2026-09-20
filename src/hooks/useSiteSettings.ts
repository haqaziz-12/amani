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
    // ignore parse errors
  }
  return { logo_url: null, hero_image_url: null };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(getCached);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("logo_url, hero_image_url")
        .limit(1)
        .maybeSingle();

      if (data) {
        const next = {
          logo_url: data.logo_url || null,
          hero_image_url: data.hero_image_url || null,
        };
        setSettings(next);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(next));
        } catch {
          // ignore quota / private mode errors
        }
      }
      setLoaded(true);
    };
    load();
  }, []);

  return { ...settings, loaded };
}
