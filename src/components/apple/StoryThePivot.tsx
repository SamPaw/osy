'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '@/lib/sound';
import { ArrowRight, Sparkles, Clock, RefreshCw } from 'lucide-react';

export function StoryThePivot() {
  const [mode, setMode] = useState<'FIFO' | 'LRU'>('FIFO');

  const handleToggle = (newMode: 'FIFO' | 'LRU') => {
    sound.click();
    setMode(newMode);
  };

  return (
    <section className="min-h-[100dvh] w-full flex flex-col justify-between items-center p-6 sm:p-12 md:p-16 max-w-5xl mx-auto select-none">
      {/* Editorial Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#0071e3]">
          The Flaw of Arrival Time
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#1d1d1f]">
          What if the oldest page <br className="hidden sm:inline" />
          is still being used?
        </h2>
        <p className="text-base sm:text-xl text-[#86868b] font-normal max-w-xl">
          FIFO blindly tracks the clock. But software execution patterns care about recent usage.
        </p>
      </div>

      {/* Main Interactive Metamorphosis */}
      <div className="w-full flex flex-col items-center gap-8 my-auto py-6">
        {/* Toggle Switch */}
        <div className="p-1.5 rounded-full bg-white border border-black/[0.08] shadow-sm flex items-center gap-1">
          <button
            onClick={() => handleToggle('FIFO')}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              mode === 'FIFO'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            Arrival Order (FIFO)
          </button>
          <button
            onClick={() => handleToggle('LRU')}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              mode === 'LRU'
                ? 'bg-[#0071e3] text-white shadow-sm'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            Access Recency (LRU)
          </button>
        </div>

        {/* 3 Physical Memory Frames: Notice the SAME pages remain, but their metadata transforms! */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-lg">
          {/* Frame 1: Page 7 */}
          <div className="flex-1 w-full sm:w-36 h-40 sm:h-44 rounded-3xl memory-frame-slot p-3 flex flex-col justify-between items-center transition-all duration-300">
            <span className="text-[11px] font-mono text-[#86868b]">Frame 1</span>

            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl page-tile flex flex-col items-center justify-center my-auto">
              <span className="text-[10px] text-[#86868b] font-mono">Page</span>
              <span className="text-3xl font-semibold font-mono text-[#1d1d1f]">7</span>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'FIFO' ? (
                <motion.div
                  key="fifo-7"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-center text-[11px] font-mono text-[#ff3b30] font-medium"
                >
                  Arrived 1st (Victim!)
                </motion.div>
              ) : (
                <motion.div
                  key="lru-7"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-center text-[11px] font-mono text-[#34c759] font-medium"
                >
                  Used 1 step ago (Hot!)
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Frame 2: Page 0 */}
          <div className="flex-1 w-full sm:w-36 h-40 sm:h-44 rounded-3xl memory-frame-slot p-3 flex flex-col justify-between items-center transition-all duration-300">
            <span className="text-[11px] font-mono text-[#86868b]">Frame 2</span>

            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl page-tile flex flex-col items-center justify-center my-auto">
              <span className="text-[10px] text-[#86868b] font-mono">Page</span>
              <span className="text-3xl font-semibold font-mono text-[#1d1d1f]">0</span>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'FIFO' ? (
                <motion.div
                  key="fifo-0"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-center text-[11px] font-mono text-[#86868b]"
                >
                  Arrived 2nd
                </motion.div>
              ) : (
                <motion.div
                  key="lru-0"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-center text-[11px] font-mono text-[#86868b]"
                >
                  Used 4 steps ago
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Frame 3: Page 1 */}
          <div className="flex-1 w-full sm:w-36 h-40 sm:h-44 rounded-3xl memory-frame-slot p-3 flex flex-col justify-between items-center transition-all duration-300">
            <span className="text-[11px] font-mono text-[#86868b]">Frame 3</span>

            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl page-tile flex flex-col items-center justify-center my-auto">
              <span className="text-[10px] text-[#86868b] font-mono">Page</span>
              <span className="text-3xl font-semibold font-mono text-[#1d1d1f]">1</span>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'FIFO' ? (
                <motion.div
                  key="fifo-1"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-center text-[11px] font-mono text-[#0071e3]"
                >
                  Arrived 3rd (Newest)
                </motion.div>
              ) : (
                <motion.div
                  key="lru-1"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-center text-[11px] font-mono text-[#ff3b30] font-medium"
                >
                  Used 8 steps ago (LRU)
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Narrative Explanation */}
        <div className="w-full max-w-xl text-center">
          <AnimatePresence mode="wait">
            {mode === 'FIFO' ? (
              <motion.p
                key="exp-fifo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm sm:text-base text-[#1d1d1f] font-normal leading-relaxed"
              >
                Under <strong>FIFO</strong>, Page 7 is marked for eviction simply because it entered first — even if a tight loop is actively reading it.
              </motion.p>
            ) : (
              <motion.p
                key="exp-lru"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm sm:text-base text-[#0071e3] font-normal leading-relaxed"
              >
                Under <strong>LRU</strong>, the OS preserves Page 7 because it was accessed recently, and instead evicts Page 1, which has sat idle for 8 steps.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-4" />
    </section>
  );
}
