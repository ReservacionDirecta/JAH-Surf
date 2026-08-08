import { useState, useEffect } from 'react';

interface ContentData {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  aboutTitle?: string;
  aboutText?: string;
  aboutImageUrl?: string;
  experienceImages?: Array<{ id: string; src: string; alt: string }>;
  videoLinks?: Array<{ id: string; url: string; title?: string }>;
  [key: string]: unknown;
}

export function useContent() {
  const [content, setContent] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/store/content');
        if (res.ok) {
          const data = await res.json();
          if (data) setContent(data);
        }
      } catch (err) {
        console.warn('Content load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { content, loading };
}
