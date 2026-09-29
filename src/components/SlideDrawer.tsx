'use client';

import React from 'react';
import { X, Layers, CheckCircle2 } from 'lucide-react';
import { sound } from '@/lib/sound';

export interface SlideInfo {
  index: number;
  title: string;
  category: string;
}

export const SLIDE_METADATA: SlideInfo[] = [
  { index: 0, title: 'Page Replacement Algorithms (Title)', category: 'Hero' },
  { index: 1, title: 'The Problem: Finite Physical Memory', category: 'Concept' },
  { index: 2, title: 'What Is a Page Fault?', category: 'Concept' },
  { index: 3, title: 'Virtual Pages & Physical Frames', category: 'Architecture' },
  { index: 4, title: 'FIFO Concept & Arrival Queue', category: 'FIFO' },
  { index: 5, title: 'FIFO Interactive Simulator', category: 'FIFO Lab' },
  { index: 6, title: 'FIFO Strengths & Critical Limitations', category: 'FIFO' },
  { index: 7, title: 'LRU Concept & Temporal Locality', category: 'LRU' },
  { index: 8, title: 'LRU Interactive Simulator', category: 'LRU Lab' },
  { index: 9, title: 'LRU Strengths & Hardware Overhead', category: 'LRU' },
  { index: 10, title: 'FIFO vs LRU Live Dual Comparison', category: 'Comparison' },
  { index: 11, title: "Belady's Anomaly (3 vs 4 Frames)", category: 'Anomaly' },
  { index: 12, title: 'The Architectural Matrix', category: 'Comparison' },
  { index: 13, title: 'Smart Whiteboard Interactive Quiz', category: 'Interactive' },
  { index: 14, title: 'Summary: The Core Difference', category: 'Conclusion' },
];

interface SlideDrawerProps {
  isOpen: boolean;
  currentSlide: number;
  onSelectSlide: (index: number) => void;
  onClose: () => void;
}

export function SlideDrawer({
  isOpen,
  currentSlide,
  onSelectSlide,
  onClose,
}: SlideDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#12151d] border border-white/[0.15] rounded-3xl p-5 sm:p-7 max-w-4xl w-full shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-lg text-white font-mono">
              Presentation Slide Navigator ({SLIDE_METADATA.length} Slides)
            </h3>
          </div>

          <button
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 overflow-y-auto pr-1">
          {SLIDE_METADATA.map((slide) => {
            const isCurrent = slide.index === currentSlide;

            return (
              <button
                key={slide.index}
                onClick={() => {
                  sound.click();
                  onSelectSlide(slide.index);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all duration-200 active:scale-95 cursor-pointer ${
                  isCurrent
                    ? 'bg-sky-500/20 border-sky-400 text-white ring-2 ring-sky-500/40 shadow-lg'
                    : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:bg-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-400">
                    Slide {String(slide.index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-400">
                    {slide.category}
                  </span>
                </div>

                <span className="text-sm font-semibold tracking-tight text-white line-clamp-1">
                  {slide.title}
                </span>

                {isCurrent && (
                  <span className="text-[10px] font-mono text-sky-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-sky-400" />
                    Currently Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
