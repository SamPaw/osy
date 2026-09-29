'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { sound } from '@/lib/sound';
import { Play, Smartphone, CheckCircle2, Cpu, ExternalLink } from 'lucide-react';

const PRODUCTION_URL = 'https://os.platesight.in';

interface StartupScreenProps {
  onStartPresentation: () => void;
  onOpenMobileView: () => void;
}

export function StartupScreen({
  onStartPresentation,
  onOpenMobileView,
}: StartupScreenProps) {
  const [isReady, setIsReady] = useState(false);
  const [initProgress, setInitProgress] = useState(0);

  useEffect(() => {
    // Simulate brief high-tech engine initialization phase
    const interval = setInterval(() => {
      setInitProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + 25;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between p-6 sm:p-12 bg-[#090a0f] text-gray-100 relative overflow-hidden select-none">
      {/* Background ambient lighting subtle grids */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.06),transparent_60%)] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400">
          <Cpu className="w-4 h-4" />
          <span>PlateSight OS • Classroom Edition</span>
        </div>

        <div className="flex items-center gap-2">
          {isReady ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM READY
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-mono text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-spin" />
              INITIALIZING {initProgress}%
            </span>
          )}
        </div>
      </div>

      {/* Central Waiting Room Layout */}
      <div className="relative z-10 my-auto max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Titles & Launch Button */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-3">
            <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-sky-400/90 font-bold">
              OPERATING SYSTEMS
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-none">
              PAGE REPLACEMENT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
                ALGORITHMS
              </span>
            </h1>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-gray-200">
                FIFO
              </span>
              <span className="text-xl font-mono text-gray-500">×</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
                LRU
              </span>
            </div>
          </div>

          <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl">
            Interactive smart whiteboard lecture experience.
            Students can scan the QR code to follow along, execute the real simulation engine,
            and experiment in real time from their mobile devices.
          </p>

          {/* Large Start Button for Smart Whiteboard */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={() => {
                sound.click();
                onStartPresentation();
              }}
              disabled={!isReady}
              className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white text-black font-mono font-black text-lg sm:text-xl hover:bg-gray-200 active:scale-95 disabled:opacity-50 transition-all shadow-2xl cursor-pointer"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>START PRESENTATION</span>
            </button>

            <button
              onClick={() => {
                sound.click();
                onOpenMobileView();
              }}
              className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border border-white/[0.12] bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] active:scale-95 font-mono text-sm transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>Phone / Handheld Mode</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live QR Code Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="p-7 rounded-3xl bg-[#12151d] border border-white/[0.1] shadow-2xl flex flex-col items-center gap-5 text-center max-w-sm w-full">
            {/* Dynamic QR Code */}
            <div className="relative group">
              <QRCodeDisplay value={PRODUCTION_URL} size={220} />
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="font-bold text-base text-white tracking-tight">
                Scan to open on your phone
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Follow along synchronously and run live simulations in class.
              </p>
            </div>

            <div className="w-full pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-sky-300">
              <span className="font-bold tracking-wider">os.platesight.in</span>
              <a
                href={PRODUCTION_URL}
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-white flex items-center gap-1"
              >
                <span>Direct Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-gray-500 pt-6 border-t border-white/[0.06]">
        <span>Classroom Smart Whiteboard Mode • 16:9 Landscape Optimized</span>
        <span>Keyboard Shortcuts: [←] [→] [Space] Navigate • [F] Fullscreen • [P] Phone QR</span>
      </div>
    </div>
  );
}
