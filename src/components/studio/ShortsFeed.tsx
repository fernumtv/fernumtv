"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown, Heart, Sparkles, Share2 } from "lucide-react";
import { isCalmModeActive } from "@/lib/interactive/calmMode";

interface VideoFeedItem {
  id: string;
  brand: string;
  handle: string;
  hook: string;
  aspectRatio: string;
  videoSrc: string;
  posterSrc: string;
  tags: string[];
}

const FEED_ADS: VideoFeedItem[] = [
  {
    id: "ad-1",
    brand: "Aura Clean Skincare",
    handle: "@auraskin",
    hook: "POV: You finally stopped stripping your skin barrier and this happened.",
    aspectRatio: "9:16",
    videoSrc: "/videos/preview-sample.mp4",
    posterSrc: "/synthetic-assets/creators/devon-miles-ref.svg",
    tags: ["#SkincareRoutine", "#BeautyUGC", "#HookTested"],
  },
  {
    id: "ad-2",
    brand: "Cold Brew Lab",
    handle: "@coldbrewlab",
    hook: "The reason 90% of founders crash at 2 PM isn't lack of sleep. It's acidic coffee.",
    aspectRatio: "9:16",
    videoSrc: "/videos/preview-sample.mp4",
    posterSrc: "/synthetic-assets/creators/kora-vance-ref.svg",
    tags: ["#FounderLife", "#ColdBrew", "#CleanEnergy"],
  },
  {
    id: "ad-3",
    brand: "ErgoFlex Active",
    handle: "@ergoflex",
    hook: "Stop buying lumbar cushions until you test your spine angle in this chair.",
    aspectRatio: "9:16",
    videoSrc: "/videos/preview-sample.mp4",
    posterSrc: "/synthetic-assets/creators/devon-miles-ref.svg",
    tags: ["#DeskSetup", "#Ergonomics", "#WorkFromHome"],
  },
  {
    id: "ad-4",
    brand: "BarkBrite Dental",
    handle: "@barkbrite",
    hook: "If your dog hates toothbrushing as much as mine, watch this 10-second hack.",
    aspectRatio: "9:16",
    videoSrc: "/videos/preview-sample.mp4",
    posterSrc: "/synthetic-assets/creators/kora-vance-ref.svg",
    tags: ["#DogCare", "#PetTok", "#DogHealth"],
  },
];

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

export function ShortsFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const lastTapRef = useRef<number>(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const currentAd = FEED_ADS[currentIndex];

  const handleNext = () => {
    if (currentIndex < FEED_ADS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(FEED_ADS.length - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === " " && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const triggerHeartBurst = (clientX: number, clientY: number, targetRect: DOMRect) => {
    if (isCalmModeActive()) return;

    const relX = clientX - targetRect.left;
    const relY = clientY - targetRect.top;

    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x: relX,
      y: relY,
      rotation: (Math.random() - 0.5) * 40,
    };

    setHearts((prev) => [...prev.slice(-8), newHeart]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 900);
  };

  // Double tap / double click detection
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const targetRect = e.currentTarget.getBoundingClientRect();

    if (now - lastTapRef.current < 320) {
      // Double click registered!
      triggerHeartBurst(e.clientX, e.clientY, targetRect);
    } else {
      // Single click: toggle play/pause
      setIsPlaying((prev) => !prev);
    }
    lastTapRef.current = now;
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 select-none" role="region" aria-label="Short Video Feed">
      {/* Feed Controller Banner */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-[11px] font-mono font-bold uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
          <span>SNAP SHORT FEED • {currentIndex + 1} / {FEED_ADS.length}</span>
        </div>
        <span className="text-[11px] font-mono opacity-60">Double-tap to react ❤️</span>
      </div>

      {/* Smartphone Frame Container */}
      <div className="relative w-full aspect-[9/16] max-h-[660px] bg-black border-4 border-[var(--border)] shadow-brutal-xl rounded-[28px] overflow-hidden">
        {/* Ad Video / Media Layer */}
        <div
          onClick={handleCardClick}
          className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center bg-zinc-950"
        >
          {/* Simulated Video Canvas */}
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              ref={(el) => {
                videoRefs.current[currentIndex] = el;
              }}
              src={currentAd.videoSrc}
              poster={currentAd.posterSrc}
              loop
              muted={isMuted}
              autoPlay={isPlaying}
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Top Info Header Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-black/65 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>LIVE REEL</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted((prev) => !prev);
              }}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className="pointer-events-auto p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/20"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[var(--accent)]" />}
            </button>
          </div>

          {/* Center Play/Pause Indicator if Paused */}
          {!isPlaying && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
              <div className="w-16 h-16 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-white flex items-center justify-center shadow-brutal">
                <Play className="w-8 h-8 translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Floating Heart Burst Layer (Pure visual animation, 0 fake counters) */}
          {hearts.map((h) => (
            <div
              key={h.id}
              style={{
                left: `${h.x}px`,
                top: `${h.y}px`,
                transform: `translate(-50%, -50%) rotate(${h.rotation}deg)`,
              }}
              className="absolute z-30 pointer-events-none animate-in fade-in zoom-in duration-300"
            >
              <Heart className="w-16 h-16 text-red-500 fill-red-500 drop-shadow-[0_4px_12px_rgba(239,68,68,0.8)] animate-bounce" />
            </div>
          ))}

          {/* Bottom Ad Card Metadata */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent text-white z-20 space-y-2 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm uppercase tracking-wide bg-[var(--accent)] text-black px-2 py-0.5">
                {currentAd.brand}
              </span>
              <span className="text-xs font-mono opacity-70">{currentAd.handle}</span>
            </div>

            <p className="font-medium text-xs sm:text-sm text-zinc-100 leading-snug line-clamp-2">
              "{currentAd.hook}"
            </p>

            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-zinc-400">
              {currentAd.tags.map((t) => (
                <span key={t} className="px-1.5 py-0.5 bg-white/10 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Vertical Action Rail (Swipe, Mute, Heart) */}
        <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              triggerHeartBurst(rect.left, rect.top, rect);
            }}
            aria-label="React to ad (visual reaction)"
            className="w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/90 hover:scale-110 active:scale-90 transition-all cursor-pointer shadow-lg"
          >
            <Heart className="w-5 h-5 text-red-400 fill-red-400/20 hover:fill-red-400 transition-colors" />
          </button>

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous video ad"
            className="w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/90 hover:scale-110 active:scale-90 transition-all cursor-pointer shadow-lg"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next video ad"
            className="w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/90 hover:scale-110 active:scale-90 transition-all cursor-pointer shadow-lg"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
