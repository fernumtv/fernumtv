"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sparkles, Play, Pause, Volume2, VolumeX, Film } from "lucide-react";

interface ReelItem {
  id: string;
  badge: string;
  tabLabel: string;
  title: string;
  videoSrc: string;
  posterSrc: string;
  breakdown: string;
}

const SHOWCASE_REELS: ReelItem[] = [
  {
    id: "reel-3d",
    badge: "01:11 // 1080p Cinematic",
    tabLabel: "3D Synthetic Reel",
    title: "Fernum Synthetic Direct-Response Reel",
    videoSrc: "/samples/fernum-reel.mp4",
    posterSrc: "/samples/fernum-reel-poster.webp",
    breakdown:
      "Hand-curated 3D product environments, synthetic procedural cameras, and high-velocity pacing. Built for brands needing premium retention assets without heavy production crew overhead.",
  },
  {
    id: "reel-animation",
    badge: "00:30 // 1080p Narrative",
    tabLabel: "2D Character Comedy",
    title: "Office Dialogue Direct-Response Story",
    videoSrc: "/samples/fernum-animation.mp4",
    posterSrc: "/samples/fernum-animation-poster.webp",
    breakdown:
      "Humorous character dialogue dramatizing customer frustration with outdated tools before introducing the upgrade. High-retention narrative angle.",
  },
];

export function StudioWork() {
  const [selectedReelIndex, setSelectedReelIndex] = useState(0);
  const masterVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMasterPlaying, setIsMasterPlaying] = useState(false);
  const [isMasterAudioOn, setIsMasterAudioOn] = useState(false);

  const activeReel = SHOWCASE_REELS[selectedReelIndex];

  // IntersectionObserver to only autoplay when video container is visible in viewport
  useEffect(() => {
    const video = masterVideoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video
              .play()
              .then(() => setIsMasterPlaying(true))
              .catch(() => setIsMasterPlaying(false));
          } else {
            video.pause();
            setIsMasterPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [selectedReelIndex]);

  // When switching reels, load and play new video
  useEffect(() => {
    if (masterVideoRef.current) {
      masterVideoRef.current.load();
    }
  }, [selectedReelIndex]);

  const toggleMasterPlay = () => {
    if (!masterVideoRef.current) return;
    if (masterVideoRef.current.paused) {
      masterVideoRef.current.play();
      setIsMasterPlaying(true);
    } else {
      masterVideoRef.current.pause();
      setIsMasterPlaying(false);
    }
  };

  const toggleMasterAudio = () => {
    setIsMasterAudioOn((prev) => !prev);
  };

  return (
    <section id="work-showcase" className="relative bg-[var(--block-3-bg)] text-[var(--block-3-fg)] py-16 sm:py-20 overflow-hidden border-t-2 border-[var(--border)]">
      {/* Background Halftone Pattern */}
      <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none z-0" />

      {/* Oversized Word Partly Cropping at Screen Edge */}
      <div className="absolute top-0 right-0 translate-x-12 -translate-y-6 pointer-events-none select-none z-0">
        <span className="font-display font-black text-[13vw] text-[var(--block-3-fg)]/[0.05] leading-none tracking-tighter uppercase whitespace-nowrap">
          PORTFOLIO
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header + Reel Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--block-2-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
              <span>● Production Master Reels</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[var(--block-3-fg)] tracking-tighter uppercase leading-[0.95] mb-2">
              FEATURED STUDIO REELS
            </h2>
            <p className="text-[17px] text-[var(--block-3-fg)]/80 font-normal max-w-xl">
              Switch between our 3D synthetic visual reel and 2D character comedy narrative below.
            </p>
          </div>

          {/* Reel Switcher Buttons */}
          <div className="flex items-center gap-2 bg-[var(--block-2-bg)] border-2 border-[var(--border)] p-1.5 shadow-brutal text-[var(--block-2-fg)]">
            {SHOWCASE_REELS.map((reel, idx) => (
              <button
                key={reel.id}
                type="button"
                onClick={() => setSelectedReelIndex(idx)}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedReelIndex === idx
                    ? "bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-[var(--border)] shadow-sm"
                    : "bg-transparent text-[var(--block-2-fg)] border-transparent hover:bg-[var(--border)]/10"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>{reel.tabLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Master Showreel (16:9 Cinema Card) */}
        <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-4 sm:p-6 shadow-brutal-lg relative group">
          {/* Top Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b-2 border-[var(--border)] pb-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-mono font-bold uppercase tracking-wider border border-[var(--border)] shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Master Reel
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[var(--block-2-fg)]">
                {activeReel.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono opacity-70">
              <span className="px-2 py-0.5 bg-[var(--border)]/10 border border-[var(--border)] font-bold">
                {activeReel.badge}
              </span>
            </div>
          </div>

          {/* 16:9 Video Canvas */}
          <div
            ref={containerRef}
            data-cursor="video"
            onClick={toggleMasterPlay}
            className="relative aspect-video w-full overflow-hidden bg-black border-2 border-[var(--border)] cursor-pointer select-none"
          >
            <video
              ref={masterVideoRef}
              aria-label={activeReel.title}
              muted={!isMasterAudioOn}
              loop
              playsInline
              preload="metadata"
              poster={activeReel.posterSrc}
              className="w-full h-full object-cover"
              onPlay={() => setIsMasterPlaying(true)}
              onPause={() => setIsMasterPlaying(false)}
            >
              <source src={activeReel.videoSrc} type="video/mp4" />
            </video>

            {/* Play/Pause Center Indicator */}
            <div
              className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${
                !isMasterPlaying ? "opacity-100 bg-black/40" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--accent)] border-2 border-[var(--border)] text-[var(--accent-fg)] flex items-center justify-center shadow-brutal transform transition-transform group-hover:scale-105">
                {isMasterPlaying ? (
                  <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                ) : (
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                )}
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-3 pointer-events-auto"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMasterPlay}
                  aria-label={isMasterPlaying ? "Pause master reel" : "Play master reel"}
                  className="px-3 py-1.5 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  {isMasterPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isMasterPlaying ? "Pause" : "Play"}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleMasterAudio}
                  aria-label={isMasterAudioOn ? "Mute master reel audio" : "Unmute master reel audio"}
                  className={`px-3 py-1.5 border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 ${
                    isMasterAudioOn
                      ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                      : "bg-[var(--block-2-bg)] text-[var(--block-2-fg)] hover:bg-[var(--block-4-bg)] hover:text-[var(--block-4-fg)]"
                  }`}
                >
                  {isMasterAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isMasterAudioOn ? "Sound On" : "Unmute Audio"}</span>
                </button>
              </div>

              <div className="hidden sm:inline-block px-2.5 py-1 bg-black/80 text-white border border-[var(--border)] text-[11px] font-mono">
                Click anywhere on video to toggle
              </div>
            </div>
          </div>

          {/* Master Reel Description */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[var(--block-2-fg)]">
            <p className="max-w-3xl leading-relaxed text-[var(--block-2-fg)]/80 font-sans text-sm">
              <strong className="font-mono text-[var(--block-2-fg)] uppercase">Production Breakdown:</strong> {activeReel.breakdown}
            </p>
            <a
              href="/#pricing"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-sm transition-all"
            >
              Get Ads Like This →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
