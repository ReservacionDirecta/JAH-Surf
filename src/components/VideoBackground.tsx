import React, { useState } from 'react';
import { getVideoSourceType, toEmbedUrl } from '../utils/video';

export interface VideoBackgroundProps {
  /** YouTube, Vimeo, or direct video URL (.mp4/.webm). */
  url?: string;
  /** Optional poster/fallback image URL shown behind the video or when url is empty. */
  poster?: string;
  /** Optional className for the outer container (defaults to absolute inset-0). */
  className?: string;
  /** Optional className for an overlay scrim rendered above the video. */
  overlayClassName?: string;
  /** Accessible title for the embedded iframe. */
  title?: string;
}

/**
 * Full-bleed, silent, looping autoplay background video component.
 * Uses 16:9 cover scaling so YouTube/Vimeo embeds fill any viewport without black bars.
 */
export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  url = '',
  poster,
  className = 'absolute inset-0',
  overlayClassName,
  title = 'Background video',
}) => {
  const [loaded, setLoaded] = useState(false);
  const sourceType = getVideoSourceType(url);
  const embedUrl = sourceType === 'youtube' || sourceType === 'vimeo' ? toEmbedUrl(url) : '';

  return (
    <div
      className={`overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {poster && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {sourceType === 'direct' && url && (
        <video
          src={url}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            loaded || !poster ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {(sourceType === 'youtube' || sourceType === 'vimeo') && embedUrl && (
        <iframe
          src={embedUrl}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          onLoad={() => setLoaded(true)}
          style={{
            width: 'max(100%, 177.78vh)',
            height: 'max(100%, 56.25vw)',
          }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-none transition-opacity duration-700 ${
            loaded || !poster ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`} />}
    </div>
  );
};

export default VideoBackground;
