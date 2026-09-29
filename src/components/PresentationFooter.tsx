'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { sound } from '@/lib/sound';

interface PresentationFooterProps {
  currentSlideIndex: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onOpenSlideDrawer: () => void;
}

export function PresentationFooter({
  currentSlideIndex,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  onOpenSlideDrawer,
}: PresentationFooterProps) {
  const canGoPrev = currentSlideIndex > 0;
  const canGoNext = currentSlideIndex < totalSlides - 1;

  return (
    <footer className="h-16 sm:h-18 px-4 sm:px-8 border-t border-white/[0.08] bg-[#090a0f]/80 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-30 select-none">
      {/* Keyboard Shortcuts Hint */}
      <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-500">
        <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-gray-400">
          ← / →
        </span>
        <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-gray-400">
          Space
        </span>
        <span>to navigate slides</span>
        <span className="text-gray-700">•</span>
        <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-gray-400">
          F
        </span>
        <span>Fullscreen</span>
      </div>

      {/* Main Slide Navigation Controller */}
      <div className="flex items-center gap-3 mx-auto md:mx-0">
        {/* Previous Slide Button */}
        <button
          onClick={() => {
            sound.click();
            onPrevSlide();
          }}
          disabled={!canGoPrev}
          className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl border border-white/[0.1] bg-white/[0.04] text-xs sm:text-sm font-mono font-bold text-gray-200 hover:bg-white/[0.08] active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
          title="Previous slide (Left Arrow)"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Slide Counter Drawer Trigger */}
        <button
          onClick={() => {
            sound.click();
            onOpenSlideDrawer();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#151822] border border-white/[0.12] hover:border-white/[0.25] text-xs sm:text-sm font-mono text-white transition-all cursor-pointer shadow-md"
          title="Open slide list"
        >
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="font-extrabold text-sm sm:text-base">
            {String(currentSlideIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">{totalSlides}</span>
        </button>

        {/* Next Slide Button */}
        <button
          onClick={() => {
            sound.click();
            onNextSlide();
          }}
          disabled={!canGoNext}
          className="flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-2xl border border-white/[0.15] bg-white text-black text-xs sm:text-sm font-mono font-extrabold hover:bg-gray-200 active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer shadow-lg"
          title="Next slide (Right Arrow or Space)"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Progress Track */}
      <div className="hidden lg:flex items-center gap-1">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentSlideIndex
                ? 'w-6 bg-sky-400'
                : i < currentSlideIndex
                ? 'w-2 bg-emerald-400/60'
                : 'w-2 bg-white/[0.1]'
            }`}
          />
        ))}
      </div>
    </footer>
  );
}
