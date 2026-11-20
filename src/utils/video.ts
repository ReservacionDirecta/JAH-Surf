const YT_PARAMS =
  'autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&iv_load_policy=3';
const VIMEO_PARAMS = 'autoplay=1&muted=1&loop=1&autopause=0&background=1';

const PATTERNS: Array<[RegExp, (id: string) => string]> = [
  [/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{6,})/i, id => `https://www.youtube.com/embed/${id}?${YT_PARAMS}&playlist=${id}`],
  [/(?:youtu\.be\/)([a-zA-Z0-9_-]{6,})/i, id => `https://www.youtube.com/embed/${id}?${YT_PARAMS}&playlist=${id}`],
  [/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/i, id => `https://www.youtube.com/embed/${id}?${YT_PARAMS}&playlist=${id}`],
  [/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{6,})/i, id => `https://www.youtube.com/embed/${id}?${YT_PARAMS}&playlist=${id}`],
  [/(?:player\.vimeo\.com\/video\/|vimeo\.com\/)(\d{6,})/i, id => `https://player.vimeo.com/video/${id}?${VIMEO_PARAMS}`],
];

export function toEmbedUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const url = rawUrl.trim();
  for (const [pattern, build] of PATTERNS) {
    const match = url.match(pattern);
    if (match) return build(match[1]);
  }
  return url;
}

export type VideoSourceType = 'youtube' | 'vimeo' | 'direct' | 'none';

export function getVideoSourceType(rawUrl: string): VideoSourceType {
  if (!rawUrl || !rawUrl.trim()) return 'none';
  const url = rawUrl.trim();
  if (/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/i.test(url)) {
    return 'youtube';
  }
  if (/(?:player\.vimeo\.com\/video\/|vimeo\.com\/)(\d{6,})/i.test(url)) {
    return 'vimeo';
  }
  return 'direct';
}

export function normalizeVideoUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const url = rawUrl.trim();
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/i);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/(?:player\.vimeo\.com\/video\/|vimeo\.com\/)(\d{6,})/i);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}
