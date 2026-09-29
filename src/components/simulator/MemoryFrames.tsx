'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SimulationStep, AlgorithmType } from '@/lib/pageReplacement';

interface MemoryFramesProps {
  frameCount: number;
  currentStep: SimulationStep | null;
  algorithm: AlgorithmType;
  compact?: boolean;
  className?: string;
}

export function MemoryFrames({
  frameCount,
  currentStep,
  algorithm,
  compact = false,
  className = '',
}: MemoryFramesProps) {
  // If no step has been processed yet, initialize with null frames
  const displayFrames = currentStep ? currentStep.frames : Array(frameCount).fill(null);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-gray-400 font-mono font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-indigo-400" />
          Physical Memory ({frameCount} {frameCount === 1 ? 'Frame' : 'Frames'})
        </span>
        {currentStep && (
          <span
            className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full border ${
              currentStep.isHit
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {currentStep.isHit ? 'PAGE HIT' : 'PAGE FAULT'}
          </span>
        )}
      </div>

      {/* Frame slots container */}
      <div
        className={`grid gap-2 sm:gap-3 ${
          compact
            ? 'grid-cols-2 sm:grid-cols-3'
            : frameCount <= 4
            ? 'grid-cols-2 sm:grid-cols-4'
            : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-8'
        }`}
      >
        {displayFrames.map((pageNumber, frameIdx) => {
          const isEmpty = pageNumber === null;
          const isHitFrame = currentStep?.isHit && currentStep?.hitIndex === frameIdx;
          const isInsertedFrame = !currentStep?.isHit && currentStep?.insertedFrameIndex === frameIdx;
          const isEvictedSlot = currentStep?.evictedFrameIndex === frameIdx;

          // Compute sublabel for LRU or FIFO
          let subLabel = isEmpty ? 'Unallocated' : 'Active';
          if (!isEmpty && currentStep) {
            if (algorithm === 'LRU') {
              const recencyObj = currentStep.lruRecency.find((item) => item.page === pageNumber);
              if (recencyObj) {
                if (recencyObj.lastUsedAgo === 0) {
                  subLabel = 'Just used (MRU)';
                } else {
                  subLabel = `${recencyObj.lastUsedAgo} ${
                    recencyObj.lastUsedAgo === 1 ? 'step' : 'steps'
                  } ago`;
                }
              }
            } else if (algorithm === 'FIFO') {
              const orderIdx = currentStep.fifoOrder.indexOf(pageNumber);
              if (orderIdx === 0) {
                subLabel = 'Oldest (Victim)';
              } else if (orderIdx === currentStep.fifoOrder.length - 1) {
                subLabel = 'Newest';
              } else if (orderIdx > 0) {
                subLabel = `Queue #${orderIdx + 1}`;
              }
            }
          }

          return (
            <div
              key={`frame-${frameIdx}`}
              className={`relative flex flex-col justify-between p-3 rounded-2xl border transition-all duration-300 ${
                compact ? 'min-h-[90px]' : 'min-h-[110px] sm:min-h-[125px]'
              } ${
                isEmpty
                  ? 'bg-white/[0.02] border-dashed border-white/[0.12] text-gray-500'
                  : isHitFrame
                  ? 'bg-emerald-500/[0.12] border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                  : isInsertedFrame
                  ? 'bg-sky-500/[0.12] border-sky-400 text-sky-100 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/30'
                  : 'bg-[#12151d] border-white/[0.1] text-gray-200 hover:border-white/[0.18]'
              }`}
            >
              {/* Header: Frame Index & Status tag */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-gray-400 font-semibold tracking-wider">
                  F{frameIdx + 1}
                </span>

                {isHitFrame && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    HIT
                  </span>
                )}
                {isInsertedFrame && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    LOAD
                  </span>
                )}
                {isEvictedSlot && !isHitFrame && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    REPLACE
                  </span>
                )}
              </div>

              {/* Main Page Number with motion presence */}
              <div className="flex items-center justify-center my-1">
                <AnimatePresence mode="wait">
                  {isEmpty ? (
                    <motion.span
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs uppercase font-mono tracking-widest text-gray-600"
                    >
                      Empty
                    </motion.span>
                  ) : (
                    <motion.div
                      key={`page-${pageNumber}`}
                      initial={{ scale: 0.6, opacity: 0, y: -8 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.6, opacity: 0, y: 8 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className="flex items-baseline gap-1"
                    >
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                        {pageNumber}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer sublabel */}
              <div className="text-[10px] font-mono text-center truncate opacity-75">
                {subLabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
