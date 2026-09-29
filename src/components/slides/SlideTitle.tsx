'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { sound } from '@/lib/sound';

interface SlideTitleProps {
  onStartClick: () => void;
}

export function SlideTitle({ onStartClick }: SlideTitleProps) {
  const [activeTab, setActiveTab] = useState<'FIFO' | 'LRU'>('FIFO');

  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-6xl mx-auto w-full">
      {/* Top Tagline */}
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-mono uppercase tracking-widest text-sky-400 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5" />
          Operating Systems • Virtual Memory
        </span>
        <span className="text-gray-500 font-mono text-xs hidden sm:inline">
          Interactive Classroom Lecture
        </span>
      </div>

      {/* Main Hero Header */}
      <div className="flex flex-col gap-4 my-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-none">
            Page Replacement <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
              Algorithms
            </span>
          </h1>
          <p className="text-xl sm:text-2xl font-mono text-gray-400 tracking-tight mt-1">
            FIFO <span className="text-gray-600">vs</span> LRU
          </p>
        </div>

        <p className="text-base sm:text-lg text-gray-300 font-normal max-w-2xl leading-relaxed">
          How modern operating systems decide which memory page to evict when physical frames are exhausted.
          An interactive, step-by-step visual exploration.
        </p>

        {/* Interactive Comparison Preview Pill */}
        <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] max-w-xl shadow-xl flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">
              Interactive Paradigm Preview:
            </span>
            <div className="flex items-center gap-1 bg-[#1a1e29] p-1 rounded-xl border border-white/[0.1]">
              <button
                onClick={() => {
                  sound.click();
                  setActiveTab('FIFO');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'FIFO'
                    ? 'bg-sky-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                FIFO Principle
              </button>
              <button
                onClick={() => {
                  sound.click();
                  setActiveTab('LRU');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'LRU'
                    ? 'bg-emerald-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                LRU Principle
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-mono p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="text-xl font-bold text-white">
              {activeTab === 'FIFO' ? 'FIFO:' : 'LRU:'}
            </span>
            <span className="text-gray-300">
              {activeTab === 'FIFO'
                ? '"Evict the page that arrived in memory first."'
                : '"Evict the page that has not been referenced for the longest time."'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
        <div className="flex items-center gap-6 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            100% Real OS Simulation Engine
          </span>
          <span className="flex items-center gap-1.5 hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Smart Whiteboard Touch Optimized
          </span>
        </div>

        <button
          onClick={() => {
            sound.click();
            onStartClick();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-mono font-bold text-sm sm:text-base hover:bg-gray-200 active:scale-95 transition-all shadow-xl cursor-pointer"
        >
          <span>Begin Presentation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
