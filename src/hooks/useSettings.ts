import { useState, useEffect } from 'react';

export interface Settings {
  siteName: string;
  reservationsEnabled: boolean;
  maxGalleryItems: number;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'JAH SURF Peru',
    reservationsEnabled: true,
    maxGalleryItems: 12,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/store/settings');
        if (res.ok) {
          const data = await res.json();
          if (data) setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Settings load failed:', err);
      }
    };
    load();
  }, []);

  return { settings };
}
