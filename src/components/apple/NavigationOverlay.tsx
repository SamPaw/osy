'use client';

import React from 'react';
import { Smartphone, Volume2, VolumeX, Maximize2, Minimize2, Sun, Moon } from 'lucide-react';
import { sound } from '@/lib/sound';
import { useTheme } from '@/context/ThemeContext';

interface NavigationOverlayProps {
  currentSectionTitle: string;
  progressPercent: number; // 0 to 100
  isFullscreen: boolean;
  isMuted: boolean;
  onToggleFullscreen: () => void;
  onToggleSound: () => void;
  onOpenQR: () => void;
}

export function NavigationOverlay({
  currentSectionTitle,
  progressPercent,
  isFullscreen,
  isMuted,
  onToggleFullscreen,
  onToggleSound,
  onOpenQR,
}: NavigationOverlayProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Ultra-slim reading progress line at very top of screen */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-black/[0.04] dark:bg-white/[0.06] z-50">
        <div
          className="h-full bg-[#0071e3] transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Floating minimal Apple header */}
      <header className="fixed top-2 sm:top-4 left-4 right-4 max-w-5xl mx-auto z-40 flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full apple-glass shadow-[0_4px_20px_rgba(0,0,0,0.04)] select-none transition-colors duration-300">
        {/* Left: Brand / Section */}
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
          <span className="font-semibold text-xs text-[var(--foreground)] tracking-tight">
            Operating Systems
          </span>
          <span className="text-[#86868b] text-xs hidden sm:inline">•</span>
          <span className="text-xs text-[#86868b] font-normal truncate max-w-[200px] sm:max-w-xs hidden sm:inline">
            {currentSectionTitle}
          </span>
        </div>

        {/* Right: Quick Tools */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={() => {
              sound.click();
              toggleTheme();
            }}
            className="p-1.5 rounded-full text-[#86868b] hover:text-[var(--foreground)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#ffd60a]" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Phone Companion Trigger */}
          <button
            onClick={() => {
              sound.click();
              onOpenQR();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--foreground)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
            title="Scan QR to open on phone"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#0071e3]" />
            <span className="hidden sm:inline">Phone View</span>
          </button>

          {/* Audio Chimes */}
          <button
            onClick={() => {
              sound.click();
              onToggleSound();
            }}
            className="p-1.5 rounded-full text-[#86868b] hover:text-[var(--foreground)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-[#ff3b30]" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => {
              sound.click();
              onToggleFullscreen();
            }}
            className="p-1.5 rounded-full text-[#86868b] hover:text-[var(--foreground)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
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
    </>
  );
}
