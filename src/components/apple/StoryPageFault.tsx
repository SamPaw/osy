'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '@/lib/sound';
import { AlertCircle, ArrowDown, RotateCcw } from 'lucide-react';

export function StoryPageFault() {
  const [stage, setStage] = useState<'IDLE' | 'APPROACH' | 'FAULT'>('IDLE');

  const handleSimulateRequest = () => {
    sound.click();
    setStage('APPROACH');

    setTimeout(() => {
      sound.fault();
      setStage('FAULT');
    }, 700);
  };

  const handleReset = () => {
    sound.click();
    setStage('IDLE');
  };

  return (
    <section className="min-h-[100dvh] w-full flex flex-col justify-between items-center p-6 sm:p-12 md:p-16 max-w-5xl mx-auto select-none">
      {/* Editorial Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#ff3b30]">
          The Collision
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#1d1d1f]">
          What is a Page Fault?
        </h2>
        <p className="text-base sm:text-xl text-[#86868b] font-normal max-w-xl">
          When the CPU requests a virtual page that is absent from physical RAM, hardware pauses execution and invokes the kernel.
        </p>
      </div>

      {/* Main Visual Stage */}
      <div className="w-full flex flex-col items-center gap-8 my-auto py-6">
        {/* Incoming Page 4 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono text-[#86868b] uppercase tracking-wider">
            Incoming CPU Reference
          </span>

          <motion.div
            animate={
              stage === 'APPROACH'
                ? { y: [0, 20], scale: 1.05 }
                : stage === 'FAULT'
                ? { y: 25, scale: 1 }
                : { y: 0, scale: 1 }
            }
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className={`w-24 h-24 rounded-3xl page-tile flex flex-col items-center justify-center transition-colors duration-300 ${
              stage === 'FAULT'
                ? 'border-[#ff3b30]/30 shadow-[0_12px_30px_rgba(255,59,48,0.12)]'
                : ''
            }`}
          >
            <span className="text-xs text-[#86868b] font-mono">Page</span>
            <span className="text-4xl font-semibold font-mono text-[#1d1d1f]">
              4
            </span>
          </motion.div>
        </div>

        {/* State Transition Badge */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {stage === 'FAULT' ? (
              <motion.div
                key="fault-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30] text-xs font-mono font-semibold"
              >
                <AlertCircle className="w-4 h-4" />
                <span>PAGE FAULT — Page 4 is not in memory</span>
              </motion.div>
            ) : stage === 'APPROACH' ? (
              <span className="text-xs font-mono text-[#86868b] animate-pulse">
                Checking Page Table presence...
              </span>
            ) : (
              <span className="text-xs font-mono text-[#86868b]">
                Memory is full. What happens when Page 4 is requested?
              </span>
            )}
          </AnimatePresence>
        </div>

        {/* Current Physical Memory: [1, 2, 3] */}
        <div className="flex flex-col items-center gap-3 w-full max-w-lg">
          <div className="flex items-center justify-between w-full px-2 text-xs font-mono text-[#86868b]">
            <span>Current Physical Memory</span>
            <span className="text-[#ff3b30] font-medium">3/3 Frames Full</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
            {[1, 2, 3].map((pageVal, fIdx) => (
              <div
                key={`page-fault-frame-${fIdx}`}
                className={`flex-1 w-full sm:w-36 h-32 sm:h-40 rounded-3xl memory-frame-slot p-3 flex flex-col justify-between items-center transition-all duration-300 ${
                  stage === 'FAULT' ? 'border-[#ff3b30]/25' : ''
                }`}
              >
                <span className="text-[11px] font-mono text-[#86868b]">
                  Frame {fIdx + 1}
                </span>

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl page-tile flex flex-col items-center justify-center my-auto">
                  <span className="text-[10px] text-[#86868b] font-mono">Page</span>
                  <span className="text-2xl sm:text-3xl font-semibold font-mono text-[#1d1d1f]">
                    {pageVal}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-[#86868b]">
                  Candidate victim
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action & Teacher Question */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-lg px-2">
          <p className="text-xs sm:text-sm text-[#86868b] font-normal text-center sm:text-left">
            {stage === 'FAULT' ? (
              <span className="text-[#1d1d1f] font-medium">
                The Dilemma: To load Page 4, one of 1, 2, or 3 must be evicted. Which one?
              </span>
            ) : (
              <span>Simulate what occurs when the CPU references an unmapped page.</span>
            )}
          </p>

          <div className="flex items-center gap-2">
            {stage === 'FAULT' ? (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/[0.1] text-xs font-medium text-[#1d1d1f] hover:bg-black/[0.04] transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            ) : (
              <button
                onClick={handleSimulateRequest}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white text-xs font-medium hover:bg-black active:scale-95 transition-all shadow cursor-pointer"
              >
                <span>Request Page 4</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-4" />
    </section>
  );
}
