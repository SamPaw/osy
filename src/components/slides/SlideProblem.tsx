'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HardDrive, Server, ArrowDown, RefreshCw, AlertCircle } from 'lucide-react';
import { sound } from '@/lib/sound';

const PROCESS_PAGES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];

export function SlideProblem() {
  const [requestedIdx, setRequestedIdx] = useState(2); // Initially requested P1, P2, P3
  const [frames, setFrames] = useState<(string | null)[]>(['P1', 'P2', 'P3']);
  const [lastEvent, setLastEvent] = useState<string>('Memory is currently 100% full (3/3 frames allocated).');

  const handleNextRequest = () => {
    sound.click();
    const nextIdx = (requestedIdx + 1) % PROCESS_PAGES.length;
    const nextPage = PROCESS_PAGES[nextIdx];
    setRequestedIdx(nextIdx);

    // If nextPage already in frames -> hit
    if (frames.includes(nextPage)) {
      sound.hit();
      setLastEvent(`${nextPage} is already resident in RAM. (PAGE HIT)`);
    } else {
      sound.fault();
      // Replace oldest frame (FIFO style demo)
      setFrames((prev) => {
        const nextFrames = [...prev];
        const victim = nextFrames[0];
        nextFrames.shift();
        nextFrames.push(nextPage);
        setLastEvent(`PAGE FAULT! ${nextPage} was not in RAM. Evicted ${victim} to make room.`);
        return nextFrames;
      });
    }
  };

  const handleReset = () => {
    sound.click();
    setRequestedIdx(2);
    setFrames(['P1', 'P2', 'P3']);
    setLastEvent('Memory reset: frames allocated with P1, P2, P3.');
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full gap-4">
      {/* Slide Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
          Core Operating System Dilemma
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          The Problem: Physical Memory is Finite
        </h2>
        <p className="text-sm sm:text-base text-gray-300 font-normal">
          Active processes demand more virtual address pages than physical RAM frames can hold simultaneously.
        </p>
      </div>

      {/* Main Visual Schema */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-auto">
        {/* Process Virtual Pages */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400 font-bold flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-sky-400" />
              Process Virtual Pages (7 Pages)
            </span>
            <span className="text-[10px] font-mono text-gray-500">Backing Store</span>
          </div>

          <div className="flex flex-wrap gap-2 py-2">
            {PROCESS_PAGES.map((page, idx) => {
              const isCurrentReq = idx === requestedIdx;
              const isLoaded = frames.includes(page);

              return (
                <div
                  key={page}
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-all ${
                    isCurrentReq
                      ? 'bg-sky-500 text-black ring-2 ring-sky-300 scale-105 shadow-lg'
                      : isLoaded
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-white/[0.04] border border-white/[0.08] text-gray-400'
                  }`}
                >
                  <span className="text-sm">{page}</span>
                  <span className="text-[9px] opacity-75 font-normal">
                    {isLoaded ? 'in RAM' : 'on disk'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-xs font-mono text-gray-400 pt-1 border-t border-white/[0.06]">
            Current CPU Request:{' '}
            <strong className="text-sky-400 font-bold text-sm">
              {PROCESS_PAGES[requestedIdx]}
            </strong>
          </div>
        </div>

        {/* Transfer / OS Decision Bridge */}
        <div className="md:col-span-2 flex flex-col items-center justify-center gap-2 text-center">
          <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-sky-400">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>
          <span className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
            OS Page Replacement
          </span>
        </div>

        {/* Limited RAM Frames */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400 font-bold flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-400" />
              Limited Physical RAM (3 Frames)
            </span>
            <span className="text-[10px] font-mono text-rose-400 font-bold">100% Full</span>
          </div>

          <div className="flex flex-col gap-2 py-1">
            {frames.map((page, fIdx) => (
              <div
                key={`problem-frame-${fIdx}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]"
              >
                <span className="text-xs font-mono text-gray-400">Frame #{fIdx + 1}</span>
                <span className="text-base font-mono font-bold text-white px-3 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                  {page}
                </span>
              </div>
            ))}
          </div>

          <div className="text-xs font-mono text-gray-400 pt-1 border-t border-white/[0.06] flex items-center justify-between">
            <span>Capacity: 3 Pages</span>
            <span className="text-rose-400">Exhausted</span>
          </div>
        </div>
      </div>

      {/* Dynamic Status Callout & Interactive Controls */}
      <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-gray-200">
          <AlertCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>{lastEvent}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs font-mono text-gray-300 hover:bg-white/[0.08] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 inline mr-1" /> Reset
          </button>
          <button
            onClick={handleNextRequest}
            className="px-5 py-2.5 rounded-xl bg-sky-500 text-black font-mono font-bold text-xs sm:text-sm hover:bg-sky-400 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            Request Next Process Page →
          </button>
        </div>
      </div>
    </div>
  );
}
