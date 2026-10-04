"use client";

import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, AlertCircle } from "lucide-react";

export interface VideoCardData {
  id: string;
  adNumber: number;
  category: string;
  title: string;
  caption: string;
  videoSrc: string;
  posterSrc: string;
  rotation?: string;
}

interface DirectVideoCardProps {
  card: VideoCardData;
  activeUnmutedId: string | null;
  onToggleMute: (id: string) => void;
}

export function DirectVideoCard({
  card,
  activeUnmutedId,
  onToggleMute,
}: DirectVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const isUnmuted = activeUnmutedId === card.id;

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // IntersectionObserver to only play when on-screen (saving battery & data)
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    if (prefersReducedMotion || userPaused) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                setIsPlaying(false);
              });
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion, userPaused]);

  // Handle Audio Mute/Unmute
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isUnmuted;
  }, [isUnmuted]);

  const toggleManualPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setUserPaused(false);
        })
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
      setUserPaused(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-[320px] mx-auto shrink-0 transform ${
        card.rotation || "rotate-0"
      } hover:rotate-0 hover:-translate-y-2 transition-all duration-200 group`}
    >
      <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-4 shadow-brutal-lg group-hover:shadow-brutal-xl transition-all flex flex-col justify-between">
        {/* Top Header: Tag + Concept Badge */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--block-4-bg)] text-[var(--accent)] border border-[var(--border)] flex items-center justify-center font-display font-black text-xs">
              0{card.adNumber}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold leading-none">
                @fernum
              </span>
              <span className="text-[10px] font-mono opacity-70">
                {card.category}
              </span>
            </div>
          </div>

          <span className="px-2 py-0.5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-[9px] font-mono font-bold uppercase tracking-wider border border-[var(--border)]">
            Concept ad
          </span>
        </div>

        {/* 9:16 Video Frame with Autoplay */}
        <div
          data-cursor="video"
          onClick={toggleManualPlay}
          className="relative aspect-[9/16] overflow-hidden bg-black border-2 border-[var(--border)] mb-3 select-none cursor-pointer"
        >
          {!hasError ? (
            <video
              ref={videoRef}
              autoPlay={!prefersReducedMotion}
              muted={!isUnmuted}
              loop
              playsInline
              preload="metadata"
              poster={card.posterSrc}
              onError={() => setHasError(true)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            >
              <source src={card.videoSrc} type="video/mp4" />
            </video>
          ) : (
            // Missing file fallback notice
            <div className="w-full h-full relative flex flex-col items-center justify-center p-4 text-center bg-black/90 text-white">
              {card.posterSrc && (
                <img
                  src={card.posterSrc}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
              )}
              <div className="relative z-10 space-y-2">
                <AlertCircle className="w-8 h-8 text-[var(--accent)] mx-auto stroke-[2]" />
                <span className="inline-block px-2 py-0.5 bg-[var(--accent)] text-[var(--accent-fg)] text-[10px] font-mono font-bold uppercase border border-[var(--border)]">
                  Concept Ad Placeholder
                </span>
                <p className="text-[11px] font-mono opacity-80">
                  Add file: <code className="text-[var(--sticker-3)]">{card.videoSrc}</code>
                </p>
                <p className="text-[10px] font-mono opacity-60">
                  (Vertical 9:16, under 1.5MB)
                </p>
              </div>
            </div>
          )}

          {/* Reduced Motion or Paused Play Button Overlay */}
          {(prefersReducedMotion || !isPlaying) && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none transition-opacity">
              <div className="w-14 h-14 rounded-full bg-[var(--accent)] border-2 border-[var(--border)] text-[var(--accent-fg)] flex items-center justify-center shadow-brutal pointer-events-auto">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </div>
          )}

          {/* Audio Mute/Unmute Toggle Button */}
          {!hasError && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute(card.id);
              }}
              aria-label={isUnmuted ? "Mute audio" : "Unmute audio"}
              className={`absolute top-3 left-3 z-20 w-8 h-8 rounded-full border-2 border-[var(--border)] flex items-center justify-center shadow-sm cursor-pointer transition-colors ${
                isUnmuted
                  ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                  : "bg-black/75 text-white hover:bg-black"
              }`}
            >
              {isUnmuted ? (
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <VolumeX className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          )}

          {/* Autoplay status badge */}
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <span className="px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-mono rounded">
              {prefersReducedMotion
                ? "Tap to play"
                : isPlaying
                ? "Playing"
                : "Paused"}
            </span>
          </div>
        </div>

        {/* Title & Caption */}
        <div className="px-1 pt-1 space-y-1">
          <h3 className="font-display font-black text-sm uppercase tracking-tight truncate">
            {card.title}
          </h3>
          <p className="text-xs opacity-80 leading-snug line-clamp-2">
            {card.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
