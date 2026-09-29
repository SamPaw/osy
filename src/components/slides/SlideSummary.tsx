'use client';

import React from 'react';
import { RotateCcw, Share2, Layers, Cpu, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/sound';

interface SlideSummaryProps {
  onRestart: () => void;
  onOpenPhoneModal: () => void;
  onJumpToSlide: (slideIdx: number) => void;
}

export function SlideSummary({
  onRestart,
  onOpenPhoneModal,
  onJumpToSlide,
}: SlideSummaryProps) {
  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full gap-4">
      {/* Slide Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
          Key Educational Takeaway
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          The Core Difference
        </h2>
        <p className="text-sm sm:text-base text-gray-300 font-normal">
          A side-by-side distillation of how operating system algorithms reason about physical memory.
        </p>
      </div>

      {/* Two Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-auto">
        {/* FIFO Pillar */}
        <div className="p-6 rounded-3xl bg-[#12151d] border border-sky-500/20 shadow-2xl flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
              FIFO
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              &ldquo;What came first?&rdquo;
            </h3>
            <p className="text-sm text-gray-300 font-normal leading-relaxed mt-1">
              Treats memory as an chronological arrival queue.
              Eviction is strictly tied to time of entrance, completely disregarding frequency of access.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between font-mono text-xs text-sky-200">
            <span>Primary Metric: Arrival Order</span>
            <span className="text-gray-500">Queue Buffer</span>
          </div>
        </div>

        {/* LRU Pillar */}
        <div className="p-6 rounded-3xl bg-[#12151d] border border-emerald-500/20 shadow-2xl flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              LRU
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              &ldquo;What was used least recently?&rdquo;
            </h3>
            <p className="text-sm text-gray-300 font-normal leading-relaxed mt-1">
              Treats memory as a recency cache.
              Eviction is governed by access history, retaining pages that the CPU has utilized most recently.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between font-mono text-xs text-emerald-200">
            <span>Primary Metric: Temporal Recency</span>
            <span className="text-gray-500">Stack Algorithm</span>
          </div>
        </div>
      </div>

      {/* Central Creed */}
      <div className="text-center py-2">
        <p className="text-base sm:text-xl font-mono text-gray-300 font-semibold tracking-tight">
          Same memory. Same reference string.{' '}
          <span className="text-white font-black underline decoration-sky-400 underline-offset-4">
            Different replacement decisions.
          </span>
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.click();
              onRestart();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs sm:text-sm font-mono text-gray-300 hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Presentation</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              onJumpToSlide(10); // Slide 11: Live Comparison
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-xs sm:text-sm font-mono text-sky-300 hover:bg-sky-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Open Live Dual Simulator</span>
          </button>
        </div>

        <button
          onClick={() => {
            sound.click();
            onOpenPhoneModal();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-mono font-bold text-xs sm:text-sm hover:bg-gray-200 active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Scan Phone QR Code</span>
        </button>
      </div>
    </div>
  );
}
