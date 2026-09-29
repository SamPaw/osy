'use client';

import React from 'react';
import { ArrowUp, Smartphone, RotateCcw } from 'lucide-react';
import { sound } from '@/lib/sound';

interface StorySummaryProps {
  onRestart: () => void;
  onOpenQR: () => void;
}

export function StorySummary({ onRestart, onOpenQR }: StorySummaryProps) {
  return (
    <section className="min-h-[100dvh] w-full flex flex-col justify-between items-center text-center p-6 sm:p-12 md:p-16 max-w-4xl mx-auto select-none">
      <div className="h-6" />

      {/* Main Creed */}
      <div className="flex flex-col items-center gap-8 my-auto">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#0071e3]">
          The Core Difference
        </span>

        <div className="flex flex-col gap-4">
          <p className="text-3xl sm:text-4xl md:text-5xl font-light text-[#86868b] tracking-tight">
            FIFO asks: <br />
            <strong className="text-[#1d1d1f] font-semibold">&ldquo;Who arrived first?&rdquo;</strong>
          </p>

          <p className="text-3xl sm:text-4xl md:text-5xl font-light text-[#86868b] tracking-tight mt-4">
            LRU asks: <br />
            <strong className="text-[#0071e3] font-semibold">&ldquo;Who was used least recently?&rdquo;</strong>
          </p>
        </div>

        <p className="text-xl sm:text-2xl text-[#1d1d1f] font-medium tracking-tight mt-6 max-w-xl">
          Same memory. Same reference stream. Different replacement decisions.
        </p>

        {/* Action pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              sound.click();
              onRestart();
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1d1d1f] text-white text-sm font-medium hover:bg-black active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return to Beginning</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              onOpenQR();
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-black/[0.1] text-[#1d1d1f] text-sm font-medium hover:bg-black/[0.04] active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <Smartphone className="w-4 h-4 text-[#0071e3]" />
            <span>Scan Phone QR Code</span>
          </button>
        </div>
      </div>

      {/* Footer credits */}
      <footer className="w-full pt-8 border-t border-black/[0.06] flex flex-wrap items-center justify-between text-xs text-[#86868b]">
        <span>PlateSight OS • Interactive Operating Systems</span>
        <span>os.platesight.in</span>
      </footer>
    </section>
  );
}
