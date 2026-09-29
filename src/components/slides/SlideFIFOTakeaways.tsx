'use client';

import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export function SlideFIFOTakeaways() {
  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full gap-4">
      {/* Slide Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
          Algorithm Assessment
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          FIFO: Strengths &amp; Critical Limitations
        </h2>
        <p className="text-sm sm:text-base text-gray-300 font-normal">
          While computationally lightweight, FIFO suffers from fundamental algorithmic blind spots.
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
                <strong className="text-white font-semibold">Trivial Implementation:</strong> Managed with a circular buffer or standard FIFO queue pointer in O(1) time.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-semibold">Zero Hardware Tracking:</strong> Does not require hardware reference bits or memory access timestamps.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-semibold">Deterministic Overhead:</strong> Guaranteed constant memory and CPU execution cost per replacement.
              </span>
            </li>
          </ul>
        </div>

        {/* Limitations Card */}
        <div className="p-6 rounded-3xl bg-[#12151d] border border-rose-500/20 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.06]">
            <XCircle className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Vulnerabilities &amp; Flaws
            </h3>
          </div>

          <ul className="flex flex-col gap-3 text-xs sm:text-sm text-gray-300 font-normal">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-semibold">Blind to Frequency &amp; Recency:</strong> A heavily used page in a tight execution loop will still be evicted if it arrived first.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-semibold">Vulnerable to Belady&apos;s Anomaly:</strong> Increasing physical RAM frames can paradoxically <em>increase</em> total page faults.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-semibold">Sub-Optimal Hit Rates:</strong> Real software access patterns exhibit high temporal locality, which FIFO completely ignores.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Transition Callout to LRU */}
      <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs sm:text-sm font-mono text-indigo-200 flex items-center justify-between shadow-lg">
        <span>
          <strong>The Solution:</strong> Can we predict future memory needs based on recent usage history? Enter <strong>LRU</strong>.
        </span>
        <span className="text-indigo-400 text-xs font-bold">Next: LRU Concept →</span>
      </div>
    </div>
  );
}
