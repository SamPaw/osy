'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '@/lib/sound';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Zap,
  Server,
  Layers,
} from 'lucide-react';

export function SlidePageFault() {
  const [incomingPage, setIncomingPage] = useState<number>(4);
  const [memory, setMemory] = useState<number[]>([1, 2, 3]);
  const [stage, setStage] = useState<'IDLE' | 'CHECK' | 'RESULT'>('IDLE');
  const [evictedPage, setEvictedPage] = useState<number | null>(null);

  const isHit = memory.includes(incomingPage);

  const runSimulation = (page: number) => {
    sound.click();
    setIncomingPage(page);
    setStage('CHECK');

    setTimeout(() => {
      if (memory.includes(page)) {
        sound.hit();
        setStage('RESULT');
      } else {
        sound.fault();
        setStage('RESULT');
        // Evict oldest (page 1)
        setTimeout(() => {
          sound.evict();
          setEvictedPage(memory[0]);
          setMemory((prev) => [page, prev[1], prev[2]]);
        }, 1200);
      }
    }, 600);
  };

  const handleReset = () => {
    sound.click();
    setMemory([1, 2, 3]);
    setIncomingPage(4);
    setStage('IDLE');
    setEvictedPage(null);
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full gap-4">
      {/* Slide Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
          OS Virtual Memory Anatomy
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What Is a Page Fault?
        </h2>
        <p className="text-sm sm:text-base text-gray-300 font-normal">
          A page fault is an interrupt (trap) raised by hardware when a program accesses a virtual memory page not currently loaded into physical RAM.
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-auto">
        {/* Left: Incoming CPU Reference */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-xl">
          <span className="text-xs font-mono uppercase text-gray-400 font-semibold flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-sky-400" />
            1. CPU Memory Reference
          </span>

          <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] gap-1">
            <span className="text-xs font-mono text-gray-400">Target Page:</span>
            <span className="text-4xl font-black font-mono text-sky-400 tracking-tight">
              Page {incomingPage}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => runSimulation(2)}
              className="flex-1 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-emerald-300 hover:bg-emerald-500/10 active:scale-95 transition-all cursor-pointer"
            >
              Test Hit (Page 2)
            </button>
            <button
              onClick={() => runSimulation(4)}
              className="flex-1 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-rose-300 hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer"
            >
              Test Fault (Page 4)
            </button>
          </div>
        </div>

        {/* Middle: Hardware Page Table Check */}
        <div className="md:col-span-4 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#151822] border border-white/[0.1] flex items-center justify-center text-gray-300 shadow-md">
            <Layers className="w-6 h-6 text-sky-400" />
          </div>
          <span className="text-xs font-mono uppercase text-gray-400">
            2. Memory Management Unit (MMU)
          </span>

          <div className="w-full mt-1">
            {stage === 'IDLE' && (
              <span className="text-xs font-mono text-gray-500">
                Click a test button to trigger hardware check
              </span>
            )}
            {stage === 'CHECK' && (
              <span className="text-xs font-mono text-sky-400 animate-pulse font-semibold">
                Scanning Page Table Valid Bits...
              </span>
            )}
            {stage === 'RESULT' && (
              <div
                className={`p-2.5 rounded-xl border text-xs font-mono font-bold ${
                  isHit
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                {isHit ? '✓ Valid Bit = 1 (PAGE HIT)' : '✕ Valid Bit = 0 (PAGE FAULT TRAP)'}
              </div>
            )}
          </div>
        </div>

        {/* Right: Physical RAM Frames */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400 font-semibold flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-400" />
              3. Physical Memory Frames
            </span>
            <span className="text-[10px] font-mono text-gray-500">RAM Slots</span>
          </div>

          <div className="flex flex-col gap-2">
            {memory.map((p, idx) => {
              const isTargetHit = stage === 'RESULT' && isHit && p === incomingPage;

              return (
                <div
                  key={`pf-frame-${idx}`}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isTargetHit
                      ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-500/40'
                      : 'bg-white/[0.03] border-white/[0.08]'
                  }`}
                >
                  <span className="text-xs font-mono text-gray-400">Frame {idx + 1}</span>
                  <span className="text-base font-mono font-bold text-white px-3 py-0.5 rounded bg-white/[0.05]">
                    Page {p}
                  </span>
                </div>
              );
            })}
          </div>

          {evictedPage !== null && (
            <div className="text-[11px] font-mono text-rose-300 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
              Evicted Page {evictedPage} from Frame 1 to load Page {incomingPage}.
            </div>
          )}
        </div>
      </div>

      {/* Explanation Footer Card */}
      <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex items-center justify-between gap-3 shadow-lg">
        <div className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
          {stage === 'IDLE' && 'Select either test button above to compare a Page Hit against a Page Fault.'}
          {stage === 'CHECK' && 'CPU generates address reference. MMU inspects page table...'}
          {stage === 'RESULT' && isHit && (
            <span>
              <strong className="text-emerald-400">Page Hit:</strong> Page {incomingPage} is already resident in RAM.
              Access occurs at hardware clock speed without kernel intervention.
            </span>
          )}
          {stage === 'RESULT' && !isHit && (
            <span>
              <strong className="text-rose-400">Page Fault:</strong> Page {incomingPage} is missing from RAM.
              The OS kernel takes over, identifies a victim page to evict, and loads Page {incomingPage} from disk.
            </span>
          )}
        </div>

        <button
          onClick={handleReset}
          className="flex-shrink-0 px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs font-mono text-gray-300 hover:bg-white/[0.08] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset
        </button>
      </div>
    </div>
  );
}
