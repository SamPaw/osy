'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '@/lib/sound';
import { ArrowDown, RotateCcw } from 'lucide-react';

const PROCESS_PAGES = [1, 2, 3, 4, 5, 6, 7];

export function StoryMemoryConstraint() {
  const [loadedPages, setLoadedPages] = useState<number[]>([1]);

  const handleLoadNext = () => {
    sound.click();
    if (loadedPages.length < 3) {
      sound.fault();
      setLoadedPages((prev) => [...prev, prev.length + 1]);
    }
  };

  const handleReset = () => {
    sound.click();
    setLoadedPages([1]);
  };

  const isFull = loadedPages.length === 3;

  return (
    <section className="min-h-[100dvh] w-full flex flex-col justify-between items-center p-6 sm:p-12 md:p-16 max-w-5xl mx-auto select-none">
      {/* Editorial Section Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#0071e3]">
          The Constraint
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[var(--foreground)]">
          Physical memory is finite.
        </h2>
        <p className="text-base sm:text-xl text-[#86868b] font-normal max-w-xl">
          An executing process requires multiple virtual memory pages. But physical RAM only provides a small number of frames.
        </p>
      </div>

      {/* Main Physical Memory Interactive Demonstration */}
      <div className="w-full flex flex-col items-center gap-10 my-auto py-6">
        {/* Process Virtual Pages Stream */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="flex items-center justify-between w-full max-w-md px-2 text-xs font-mono text-[#86868b]">
            <span>Process Virtual Pages</span>
            <span>Virtual Address Space</span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {PROCESS_PAGES.map((page) => {
              const isResident = loadedPages.includes(page);
              const isPending = !isResident && page <= 4;

              return (
                <div
                  key={`process-page-${page}`}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-medium transition-all duration-300 ${
                    isResident
                      ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-black shadow-md scale-105'
                      : isPending
                      ? 'bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] shadow-sm'
                      : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#86868b] border border-transparent'
                  }`}
                >
                  <span className="text-lg sm:text-xl font-semibold">{page}</span>
                  <span className="text-[9px] opacity-60">
                    {isResident ? 'In RAM' : 'On disk'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Downward Flow Vector */}
        <div className="flex flex-col items-center gap-1 text-[#86868b]">
          <span className="text-xs font-mono uppercase tracking-wider">
            Loading into Physical RAM
          </span>
          <ArrowDown className="w-4 h-4 animate-bounce text-[#0071e3]" />
        </div>

        {/* 3 Physical Memory Frames */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-lg">
          {[0, 1, 2].map((slotIdx) => {
            const pageInSlot = loadedPages[slotIdx];
            const isEmpty = pageInSlot === undefined;

            return (
              <div
                key={`slot-${slotIdx}`}
                className="flex-1 w-full sm:w-36 h-36 sm:h-44 rounded-3xl memory-frame-slot p-3 flex flex-col justify-between items-center relative overflow-hidden transition-all duration-300"
              >
                <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#86868b]">
                  <span>Frame {slotIdx + 1}</span>
                  <span>{isEmpty ? 'Empty' : 'Occupied'}</span>
                </div>

                <AnimatePresence mode="wait">
                  {!isEmpty ? (
                    <motion.div
                      key={`resident-${pageInSlot}`}
                      initial={{ opacity: 0, y: -30, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 30, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl page-tile flex flex-col items-center justify-center my-auto"
                    >
                      <span className="text-xs text-[#86868b] font-mono">Page</span>
                      <span className="text-3xl sm:text-4xl font-semibold font-mono text-[var(--tile-text)]">
                        {pageInSlot}
                      </span>
                    </motion.div>
                  ) : (
                    <div className="my-auto flex flex-col items-center justify-center text-xs text-[#86868b] border border-dashed border-black/[0.1] dark:border-white/[0.1] w-20 h-20 sm:w-24 sm:h-24 rounded-2xl">
                      <span>Available</span>
                    </div>
                  )}
                </AnimatePresence>

                <div className="w-full text-center text-[10px] font-mono text-[#86868b]">
                  {isEmpty ? 'Awaiting allocation' : 'Resident in cache'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic State Callout & Step Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-lg px-2">
          <p className="text-xs sm:text-sm text-[#86868b] font-normal text-center sm:text-left">
            {isFull ? (
              <span className="text-[var(--foreground)] font-medium">
                Capacity reached: all 3 physical frames are occupied.
              </span>
            ) : (
              <span>
                {3 - loadedPages.length} {3 - loadedPages.length === 1 ? 'frame' : 'frames'} remaining.
              </span>
            )}
          </p>

          <div className="flex items-center gap-2">
            {isFull ? (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border)] text-xs font-medium text-[var(--foreground)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            ) : (
              <button
                onClick={handleLoadNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-black text-xs font-medium hover:bg-black dark:hover:bg-[#f5f5f7] active:scale-95 transition-all shadow cursor-pointer"
              >
                <span>Load Page {loadedPages.length + 1} into RAM</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-4" />
    </section>
  );
}
