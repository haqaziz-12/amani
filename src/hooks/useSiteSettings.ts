"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  logo_url: string | null;
  hero_image_url: string | null;
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    logo_url: null,
    hero_image_url: null,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("logo_url, hero_image_url")
        .limit(1)
        .maybeSingle();
      if (data) {
        setSettings({
          logo_url: data.logo_url || null,
          hero_image_url: data.hero_image_url || null,
        });
      }
      setLoaded(true);
    };
    load();
  }, []);

  return { ...settings, loaded };
}
