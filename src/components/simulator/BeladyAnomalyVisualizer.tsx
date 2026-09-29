'use client';

import React, { useState, useMemo } from 'react';
import { simulateFIFO, simulateLRU } from '@/lib/pageReplacement';
import { MemoryFrames } from './MemoryFrames';
import { ReferenceTimeline } from './ReferenceTimeline';
import { sound } from '@/lib/sound';
import {
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const BELADY_STRING = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];

export function BeladyAnomalyVisualizer({ className = '' }: { className?: string }) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showLRUComparison, setShowLRUComparison] = useState<boolean>(false);

  // 3 frames FIFO
  const fifo3Result = useMemo(() => simulateFIFO(BELADY_STRING, 3), []);
  // 4 frames FIFO
  const fifo4Result = useMemo(() => simulateFIFO(BELADY_STRING, 4), []);

  // LRU comparisons
  const lru3Result = useMemo(() => simulateLRU(BELADY_STRING, 3), []);
  const lru4Result = useMemo(() => simulateLRU(BELADY_STRING, 4), []);

  const step3 = currentStepIndex >= 0 ? fifo3Result.steps[currentStepIndex] : null;
  const step4 = currentStepIndex >= 0 ? fifo4Result.steps[currentStepIndex] : null;

  const handleNext = () => {
    if (currentStepIndex < BELADY_STRING.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      sound.click();
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      sound.click();
    } else if (currentStepIndex === 0) {
      setCurrentStepIndex(-1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  };

  // Check if step 3 has a hit while step 4 has a fault (anomaly moment!)
  const isAnomalyStep = step3?.isHit && !step4?.isHit;

  return (
    <div className={`flex flex-col gap-3.5 w-full ${className}`}>
      {/* Reference Timeline */}
      <ReferenceTimeline
        referenceString={BELADY_STRING}
        currentStepIndex={currentStepIndex}
        steps={fifo3Result.steps}
        onSelectStep={(idx) => {
          setCurrentStepIndex(idx);
          sound.click();
        }}
      />

      {/* Anomaly Callout Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="text-xs sm:text-sm font-mono text-gray-200">
            <strong className="text-amber-400">Belady&apos;s Anomaly in Action:</strong>{' '}
            FIFO with <strong className="text-white">3 Frames</strong> yields{' '}
            <strong className="text-emerald-400 font-bold">9 Faults</strong>, but adding more RAM (
            <strong className="text-white">4 Frames</strong>) yields{' '}
            <strong className="text-rose-400 font-bold">10 Faults</strong>!
          </div>
        </div>

        <button
          onClick={() => {
            sound.click();
            setShowLRUComparison((p) => !p);
          }}
          className="text-xs font-mono px-3 py-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>{showLRUComparison ? 'Hide LRU Proof' : 'Verify LRU Immunity'}</span>
        </button>
      </div>

      {isAnomalyStep && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs sm:text-sm font-mono animate-pulse flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>
            <strong>Anomaly Highlight at Step #{currentStepIndex + 1} (Page {BELADY_STRING[currentStepIndex]}):</strong>{' '}
            3 Frames registered a <strong>PAGE HIT</strong>, while 4 Frames suffered a <strong>PAGE FAULT</strong>!
          </span>
        </div>
      )}

      {/* Side-by-Side: 3 Frames vs 4 Frames */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* 3 Frames Container */}
        <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <h3 className="font-bold text-base text-white font-mono">
                FIFO with 3 Frames
              </h3>
            </div>
            <div className="font-mono text-xs text-gray-300 flex items-center gap-2">
              <span className="text-rose-400 font-bold">
                Faults: {step3?.pageFaultCount ?? 0} / 9
              </span>
              <span className="text-emerald-400 font-bold">
                Hits: {step3?.pageHitCount ?? 0}
              </span>
            </div>
          </div>

          <MemoryFrames
            frameCount={3}
            currentStep={step3}
            algorithm="FIFO"
            compact={true}
          />

          <div className="text-xs font-mono text-gray-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
            {step3 ? step3.explanation.description : 'Press Next to step through.'}
          </div>
        </div>

        {/* 4 Frames Container */}
        <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <h3 className="font-bold text-base text-white font-mono">
                FIFO with 4 Frames (+1 Frame)
              </h3>
            </div>
            <div className="font-mono text-xs text-gray-300 flex items-center gap-2">
              <span className="text-rose-400 font-bold">
                Faults: {step4?.pageFaultCount ?? 0} / 10
              </span>
              <span className="text-emerald-400 font-bold">
                Hits: {step4?.pageHitCount ?? 0}
              </span>
            </div>
          </div>

          <MemoryFrames
            frameCount={4}
            currentStep={step4}
            algorithm="FIFO"
            compact={true}
          />

          <div className="text-xs font-mono text-gray-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
            {step4 ? step4.explanation.description : 'Press Next to step through.'}
          </div>
        </div>
      </div>

      {/* LRU Proof Box (When toggled) */}
      {showLRUComparison && (
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-gray-200 flex flex-col gap-2 shadow-xl">
          <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Stack Algorithm Property (Why LRU is Immune)
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
            Under LRU, the set of pages in an <em>n</em>-frame memory is <strong>always a strict subset</strong> of the pages in an <em>(n+1)</em>-frame memory at any step.
            For this exact same sequence:
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-indigo-200 pt-1">
            <span>LRU with 3 Frames: <strong>{lru3Result.totalFaults} Faults</strong></span>
            <span>LRU with 4 Frames: <strong>{lru4Result.totalFaults} Faults</strong> (fewer faults as expected!)</span>
          </div>
        </div>
      )}

      {/* Stepping controls */}
      <div className="p-3 rounded-2xl bg-[#12151d] border border-white/[0.08] flex items-center justify-between">
        <span className="text-xs font-mono text-gray-400">
          Step {currentStepIndex + 1} / {BELADY_STRING.length}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs font-mono text-gray-300 hover:bg-white/[0.08]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex < 0}
            className="px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs font-mono text-gray-200 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 inline" /> Prev
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex >= BELADY_STRING.length - 1}
            className="px-4 py-2 rounded-xl bg-white/[0.08] border border-white/[0.15] text-xs font-mono font-bold text-white hover:bg-white/[0.14] disabled:opacity-30"
          >
            Next Step <ChevronRight className="w-4 h-4 inline" />
          </button>
        </div>
      </div>
    </div>
  );
}
