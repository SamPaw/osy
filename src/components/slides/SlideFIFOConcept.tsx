'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ArrowRight, AlertTriangle, RotateCcw } from 'lucide-react';
import { sound } from '@/lib/sound';

export function SlideFIFOConcept() {
  const [queue, setQueue] = useState<number[]>([1, 2, 3]);
  const [incoming, setIncoming] = useState<number>(4);
  const [lastEvicted, setLastEvicted] = useState<number | null>(null);

  const handleEvictAndInsert = () => {
    sound.click();
    sound.evict();
    const victim = queue[0];
    setLastEvicted(victim);

    setQueue((prev) => {
      const nextQ = [...prev.slice(1), incoming];
      return nextQ;
    });
    setIncoming((prev) => prev + 1);
  };

  const handleReset = () => {
    sound.click();
    setQueue([1, 2, 3]);
    setIncoming(4);
    setLastEvicted(null);
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full gap-4">
      {/* Slide Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
          Algorithm Principle 01
        </span>
        <div className="flex items-baseline gap-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            FIFO
          </h2>
          <span className="text-xl font-mono text-gray-400 font-normal">
            First-In, First-Out
          </span>
        </div>
        <p className="text-sm sm:text-base text-gray-300 font-normal">
          &ldquo;The page that entered physical memory earliest is removed first.&rdquo;
        </p>
      </div>

      {/* Main Interactive Queue Visual */}
      <div className="flex flex-col gap-6 my-auto p-6 rounded-3xl bg-[#12151d] border border-white/[0.08] shadow-2xl">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            Arrival Order Queue (Managed as FIFO Buffer)
          </span>
          <span>Oldest enters left, exits left</span>
        </div>

        {/* Labels: Oldest to Newest */}
        <div className="flex justify-between items-center text-xs font-mono tracking-wider uppercase px-2">
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <span>Oldest (Head / Next Victim)</span>
          </span>
          <span className="text-sky-400 font-bold">Newest (Tail)</span>
        </div>

        {/* The Animated Queue Row */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto py-4">
          <AnimatePresence mode="popLayout">
            {queue.map((page, index) => {
              const isOldest = index === 0;
              const isNewest = index === queue.length - 1;

              return (
                <motion.div
                  key={`fifo-concept-page-${page}`}
                  layout
                  initial={{ opacity: 0, scale: 0.6, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: 20 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`relative flex-1 min-w-[100px] h-28 rounded-2xl border flex flex-col items-center justify-center shadow-lg transition-all ${
                    isOldest
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 ring-2 ring-amber-500/30'
                      : isNewest
                      ? 'bg-sky-500/10 border-sky-500/40 text-sky-200'
                      : 'bg-white/[0.03] border-white/[0.1] text-gray-200'
                  }`}
                >
                  {/* Next victim pointer banner */}
                  {isOldest && (
                    <div className="absolute -top-3.5 bg-amber-500 text-black text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow-lg tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Next Victim
                    </div>
                  )}

                  <span className="text-xs font-mono opacity-60">Slot {index + 1}</span>
                  <span className="text-3xl font-extrabold font-mono tracking-tight my-0.5">
                    Page {page}
                  </span>
                  <span className="text-[11px] font-mono opacity-70">
                    {isOldest ? 'Loaded First' : isNewest ? 'Loaded Last' : 'In Queue'}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Action demonstration row */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-3 font-mono text-sm">
            <span className="text-gray-400">Next incoming page:</span>
            <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40">
              Page {incoming}
            </span>
            {lastEvicted !== null && (
              <span className="text-xs text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                Evicted Page {lastEvicted}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs font-mono text-gray-300 hover:bg-white/[0.08] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset
            </button>
            <button
              onClick={handleEvictAndInsert}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-500 text-black font-mono font-bold text-xs sm:text-sm hover:bg-sky-400 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>Arrive Page {incoming} (Evict Oldest)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Key Takeaway */}
      <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] text-xs sm:text-sm font-mono text-gray-300 shadow-lg">
        <strong className="text-amber-400">Core Characteristic:</strong> FIFO tracks <em>pure arrival sequence</em>.
        Even if Page 1 is continuously read by the CPU hundreds of times, FIFO will still evict it simply because it was loaded first.
      </div>
    </div>
  );
}
