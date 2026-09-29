'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SimulationStep } from '@/lib/pageReplacement';
import { ArrowDown, AlertTriangle, Clock } from 'lucide-react';

interface FIFOQueueVisualizerProps {
  currentStep: SimulationStep | null;
  className?: string;
}

const CIRCLE_NUMBERS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];

export function FIFOQueueVisualizer({
  currentStep,
  className = '',
}: FIFOQueueVisualizerProps) {
  const queue = currentStep?.fifoOrder || [];
  const evictedPage = currentStep?.evictedPage;

  return (
    <div
      className={`p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span className="text-xs uppercase tracking-widest font-mono font-semibold text-gray-300">
            FIFO Arrival Queue (First-In, First-Out)
          </span>
        </div>
        <span className="text-[11px] font-mono text-gray-400">
          Tracks arrival order (oldest → newest)
        </span>
      </div>

      {queue.length === 0 ? (
        <div className="h-20 flex items-center justify-center text-sm font-mono text-gray-500 border border-dashed border-white/[0.08] rounded-xl">
          Queue is empty. Step forward to load pages.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Labels: Oldest vs Newest */}
          <div className="flex justify-between items-center text-[10px] font-mono tracking-wider uppercase text-gray-400 px-1">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <span>Oldest (Head)</span>
            </span>
            <span className="text-sky-400 font-semibold">Newest (Tail)</span>
          </div>

          {/* Queue items row */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {queue.map((page, index) => {
                const isOldest = index === 0;
                const isNewest = index === queue.length - 1;
                const badge = CIRCLE_NUMBERS[index] || `#${index + 1}`;

                return (
                  <motion.div
                    key={`fifo-queue-${page}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className={`relative flex-1 min-w-[70px] sm:min-w-[85px] p-2.5 rounded-xl border flex flex-col items-center justify-center transition-colors ${
                      isOldest
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 ring-1 ring-amber-500/30'
                        : isNewest
                        ? 'bg-sky-500/10 border-sky-500/40 text-sky-200'
                        : 'bg-white/[0.03] border-white/[0.08] text-gray-300'
                    }`}
                  >
                    {/* Next victim banner over oldest */}
                    {isOldest && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-500 text-black text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-md tracking-wider flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Next Victim
                      </div>
                    )}

                    {/* Page number */}
                    <span className="text-xl sm:text-2xl font-black font-mono tracking-tight">
                      {page}
                    </span>

                    {/* Arrival order badge */}
                    <div className="flex items-center gap-1 mt-1 text-[11px] font-mono opacity-80">
                      <span>{badge}</span>
                      <span className="text-[10px]">
                        {isOldest ? 'Head' : isNewest ? 'Tail' : `pos ${index + 1}`}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Victim explanation indicator */}
          <div className="text-[11px] font-mono text-gray-400 bg-white/[0.02] p-2 rounded-lg border border-white/[0.05] flex items-center justify-between">
            <span>
              Oldest page in memory:{' '}
              <strong className="text-amber-400 font-bold">
                Page {queue[0]}
              </strong>
            </span>
            <span className="text-gray-500">
              {evictedPage !== null && evictedPage !== undefined
                ? `(Just evicted page ${evictedPage})`
                : 'Will be evicted if memory fills'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
