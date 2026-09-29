'use client';

import React from 'react';
import {
  Smartphone,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Layers,
  Cpu,
} from 'lucide-react';
import { sound } from '@/lib/sound';

interface PresentationHeaderProps {
  currentSlideIndex: number;
  totalSlides: number;
  slideTitle: string;
  isFullscreen: boolean;
  isMuted: boolean;
  onToggleFullscreen: () => void;
  onToggleSound: () => void;
  onOpenPhoneModal: () => void;
  onOpenSlideDrawer: () => void;
}

export function PresentationHeader({
  currentSlideIndex,
  totalSlides,
  slideTitle,
  isFullscreen,
  isMuted,
  onToggleFullscreen,
  onToggleSound,
  onOpenPhoneModal,
  onOpenSlideDrawer,
}: PresentationHeaderProps) {
  return (
    <header className="h-14 sm:h-16 px-4 sm:px-8 border-b border-white/[0.08] bg-[#090a0f]/80 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-30 select-none">
      {/* Left: Topic Breadcrumb & Slide Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            sound.click();
            onOpenSlideDrawer();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-mono text-gray-300 transition-all cursor-pointer"
          title="Open slide navigator"
        >
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-bold text-white">
            {String(currentSlideIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-gray-500">/</span>
          <span>{totalSlides}</span>
        </button>

        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-400">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-gray-500 uppercase tracking-wider">OS Page Replacement</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-200 font-semibold truncate max-w-sm">
            {slideTitle}
          </span>
        </div>
      </div>

      {/* Right: Quick Whiteboard Tools */}
      <div className="flex items-center gap-2">
        {/* Phone View QR Trigger */}
        <button
          onClick={() => {
            sound.click();
            onOpenPhoneModal();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 active:scale-95 text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm"
          title="Scan QR Code to open on phone"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Phone View</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => {
            sound.click();
            onToggleSound();
          }}
          className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
          title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => {
            sound.click();
            onToggleFullscreen();
          }}
          className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (F)'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
}
