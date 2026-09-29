'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Sparkles, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { sound } from '@/lib/sound';

interface PageAccessItem {
  page: number;
  lastUsedAgo: number;
}

export function SlideLRUConcept() {
  const [items, setItems] = useState<PageAccessItem[]>([
    { page: 7, lastUsedAgo: 6 },
    { page: 1, lastUsedAgo: 3 },
    { page: 0, lastUsedAgo: 1 },
  ]);
  const [actionLog, setActionLog] = useState<string>(
    'Page 0 was used 1 step ago (MRU). Page 7 has been idle for 6 steps (LRU Victim).'
  );

  const handleAccessPage = (targetPage: number) => {
    sound.click();
    sound.hit();
    setItems((prev) => {
      const existing = prev.find((p) => p.page === targetPage);
      if (!existing) return prev;

      // Update ages: all other pages age by 1, targetPage becomes 0 (MRU)
      const updated = prev.map((p) => {
        if (p.page === targetPage) {
          return { page: p.page, lastUsedAgo: 0 };
        } else {
          return { page: p.page, lastUsedAgo: p.lastUsedAgo + 1 };
        }
      });

      // Sort ascending by lastUsedAgo reversed (oldest first, newest last)
      updated.sort((a, b) => b.lastUsedAgo - a.lastUsedAgo);
      return updated;
    });

    setActionLog(
      `CPU referenced Page ${targetPage}! It moves directly to Most Recently Used (MRU).`
    );
  };

  const handleEvictAndLoad = () => {
    sound.click();
    sound.evict();
    setItems((prev) => {
      const victim = prev[0]; // oldest
      const newPage = 4;
      const updated = prev.slice(1).map((p) => ({ page: p.page, lastUsedAgo: p.lastUsedAgo + 1 }));
      updated.push({ page: newPage, lastUsedAgo: 0 });
      updated.sort((a, b) => b.lastUsedAgo - a.lastUsedAgo);

      setActionLog(
        `Memory full! LRU evicted Page ${victim.page} (idle for ${victim.lastUsedAgo} steps) to load Page ${newPage}.`
      );
      return updated;
    });
  };

  const handleReset = () => {
    sound.click();
    setItems([
      { page: 7, lastUsedAgo: 6 },
      { page: 1, lastUsedAgo: 3 },
      { page: 0, lastUsedAgo: 1 },
    ]);
    setActionLog('Recency stack reset to initial state.');
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full gap-4">
      {/* Slide Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
          Algorithm Principle 02
        </span>
        <div className="flex items-baseline gap-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            LRU
          </h2>
          <span className="text-xl font-mono text-gray-400 font-normal">
            Least Recently Used
          </span>
        </div>
        <p className="text-sm sm:text-base text-gray-300 font-normal">
          &ldquo;Remove the page that has not been referenced for the longest period of time.&rdquo;
        </p>
      </div>

      {/* Main Interactive Recency Visual */}
      <div className="flex flex-col gap-6 my-auto p-6 rounded-3xl bg-[#12151d] border border-white/[0.08] shadow-2xl">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <span className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            Recency Stack (Temporal Locality Approximation)
          </span>
          <span className="text-emerald-400">Tap a page to refresh its recency!</span>
        </div>

        {/* Labels: LRU to MRU */}
        <div className="flex justify-between items-center text-xs font-mono tracking-wider uppercase px-2">
          <span className="text-rose-400 font-bold flex items-center gap-1">
            <span>Least Recently Used (LRU Victim)</span>
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Most Recently Used (MRU)</span>
          </span>
        </div>

        {/* Animated Recency Cards */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto py-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => {
              const isLRU = index === 0;
              const isMRU = index === items.length - 1;

              return (
                <motion.button
                  key={`lru-card-${item.page}`}
                  layout
                  onClick={() => handleAccessPage(item.page)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, y: -20 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`relative flex-1 min-w-[100px] h-28 rounded-2xl border flex flex-col items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer ${
                    isLRU
                      ? 'bg-rose-500/10 border-rose-500/50 text-rose-200 ring-2 ring-rose-500/30'
                      : isMRU
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200 ring-2 ring-emerald-500/30'
                      : 'bg-white/[0.03] border-white/[0.1] text-gray-200'
                  }`}
                >
                  {/* Next victim banner over LRU */}
                  {isLRU && (
                    <div className="absolute -top-3.5 bg-rose-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow-lg tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      LRU Victim
                    </div>
                  )}

                  {/* MRU banner */}
                  {isMRU && (
                    <div className="absolute -top-3.5 bg-emerald-500 text-black text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow-lg tracking-wider">
                      Most Recent
                    </div>
                  )}

                  <span className="text-3xl font-extrabold font-mono tracking-tight my-0.5">
                    Page {item.page}
                  </span>

                  <span className="text-[11px] font-mono opacity-80">
                    {item.lastUsedAgo === 0
                      ? 'Active now'
                      : `Idle ${item.lastUsedAgo} ${item.lastUsedAgo === 1 ? 'step' : 'steps'}`}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Action log & demo controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-xs sm:text-sm font-mono text-gray-300 max-w-xl">
            {actionLog}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs font-mono text-gray-300 hover:bg-white/[0.08] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset
            </button>
            <button
              onClick={handleEvictAndLoad}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-mono font-bold text-xs sm:text-sm hover:bg-emerald-400 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Simulate Page 4 Fault (Evict LRU) →
            </button>
          </div>
        </div>
      </div>

      {/* Footer Key Takeaway */}
      <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] text-xs sm:text-sm font-mono text-gray-300 shadow-lg">
        <strong className="text-emerald-400">The Heuristic:</strong> Past behavior predicts near-future behavior.
        By exploiting <em>Temporal Locality</em>, LRU minimizes page faults by keeping actively circulating pages in RAM.
      </div>
    </div>
  );
}
