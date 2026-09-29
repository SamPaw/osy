'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SimulationStep } from '@/lib/pageReplacement';
import { History, Sparkles, AlertTriangle } from 'lucide-react';

interface LRURecencyVisualizerProps {
  currentStep: SimulationStep | null;
  className?: string;
}

export function LRURecencyVisualizer({
  currentStep,
  className = '',
}: LRURecencyVisualizerProps) {
  // Ordered from least recently used to most recently used
  const recencyItems = currentStep?.lruRecency || [];
  const evictedPage = currentStep?.evictedPage;

  return (
    <div
      className={`p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span className="text-xs uppercase tracking-widest font-mono font-semibold text-gray-300">
            LRU Recency Stack (Least Recently Used)
          </span>
        </div>
        <span className="text-[11px] font-mono text-gray-400">
          Tracks access history (LRU → MRU)
        </span>
      </div>

      {recencyItems.length === 0 ? (
        <div className="h-20 flex items-center justify-center text-sm font-mono text-gray-500 border border-dashed border-white/[0.08] rounded-xl">
          Recency stack is empty. Step forward to begin.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Header row: LRU vs MRU */}
          <div className="flex justify-between items-center text-[10px] font-mono tracking-wider uppercase px-1">
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <span>LRU (Least Recently Used)</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>MRU (Most Recently Used)</span>
            </span>
          </div>

          {/* Cards for each page in recency order */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {recencyItems.map((item, index) => {
                const isLRU = index === 0;
                const isMRU = index === recencyItems.length - 1;

                return (
                  <motion.div
                    key={`lru-recency-${item.page}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className={`relative flex-1 min-w-[70px] sm:min-w-[85px] p-2.5 rounded-xl border flex flex-col items-center justify-center transition-colors ${
                      isLRU
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-200 ring-1 ring-rose-500/30'
                        : isMRU
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 ring-1 ring-emerald-500/30'
                        : 'bg-white/[0.03] border-white/[0.08] text-gray-300'
                    }`}
                  >
                    {/* Badge for LRU victim */}
                    {isLRU && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-500 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-md tracking-wider flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        LRU Victim
                      </div>
                    )}

                    {/* Badge for MRU fresh */}
                    {isMRU && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-500 text-black text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-md tracking-wider">
                        Active (MRU)
                      </div>
                    )}

                    {/* Page number */}
                    <span className="text-xl sm:text-2xl font-black font-mono tracking-tight">
                      {item.page}
                    </span>

                    {/* Elapsed recency badge */}
                    <div className="mt-1 text-[10px] font-mono text-center">
                      <span className={item.lastUsedAgo === 0 ? 'text-emerald-400 font-semibold' : 'opacity-70'}>
                        {item.lastUsedAgo === 0 ? 'Just used' : `${item.lastUsedAgo} ${item.lastUsedAgo === 1 ? 'step' : 'steps'} ago`}
                      </span>
                    </div>

                    {/* Frame slot indicator */}
                    <span className="text-[9px] font-mono opacity-50">
                      Frame {item.frameIndex + 1}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Explanation indicator footer */}
          <div className="text-[11px] font-mono text-gray-400 bg-white/[0.02] p-2 rounded-lg border border-white/[0.05] flex items-center justify-between">
            <span>
              Longest idle page:{' '}
              <strong className="text-rose-400 font-bold">
                Page {recencyItems[0]?.page}
              </strong>{' '}
              ({recencyItems[0]?.lastUsedAgo} {recencyItems[0]?.lastUsedAgo === 1 ? 'step' : 'steps'} ago)
            </span>
            <span className="text-gray-500">
              {evictedPage !== null && evictedPage !== undefined
                ? `(Evicted Page ${evictedPage})`
                : 'Will be evicted if memory fills'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
