'use client';

import React from 'react';
import { CheckCircle2, XCircle, ShieldCheck, Cpu } from 'lucide-react';

export function SlideLRUTakeaways() {
  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full gap-4">
      {/* Slide Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
          Algorithm Assessment
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          LRU: Strengths &amp; Hardware Overhead
        </h2>
        <p className="text-sm sm:text-base text-gray-300 font-normal">
          While algorithmically superior, true LRU requires costly hardware assistance.
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
        {/* Strengths Card */}
        <div className="p-6 rounded-3xl bg-[#12151d] border border-emerald-500/20 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.06]">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Advantages &amp; Strengths
            </h3>
          </div>

          <ul className="flex flex-col gap-3 text-xs sm:text-sm text-gray-300 font-normal">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-semibold">Near-Optimal Fault Rates:</strong> Closes the gap with the theoretically impossible OPT (Belady&apos;s Optimal) algorithm by leveraging temporal locality.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-semibold">Immune to Belady&apos;s Anomaly:</strong> LRU belongs to the class of <em>Stack Algorithms</em>. More memory frames are guaranteed never to produce more faults.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-semibold">Self-Adapting:</strong> Automatically preserves hot working sets as program execution phases shift.
              </span>
            </li>
          </ul>
        </div>

        {/* Limitations Card */}
        <div className="p-6 rounded-3xl bg-[#12151d] border border-rose-500/20 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.06]">
            <XCircle className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Implementation Hurdles
            </h3>
          </div>

          <ul className="flex flex-col gap-3 text-xs sm:text-sm text-gray-300 font-normal">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-semibold">Hardware Counter Overhead:</strong> Every memory read/write cycle requires writing a hardware timestamp/counter register.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-semibold">Complex Stack Pointer Maintenance:</strong> Hardware doubly linked list requires updating up to 6 pointers on every memory access.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-semibold">Real-World Compromise:</strong> Production kernels (Linux, Windows) implement approximations such as the <strong>Clock (Second-Chance)</strong> algorithm.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Transition Callout to Direct Comparison */}
      <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 text-xs sm:text-sm font-mono text-sky-200 flex items-center justify-between shadow-lg">
        <span>
          <strong>The Face-Off:</strong> What happens when we run the <em>exact same</em> sequence through both algorithms simultaneously?
        </span>
        <span className="text-sky-400 text-xs font-bold">Next: Live Synchronous Comparison →</span>
      </div>
    </div>
  );
}
