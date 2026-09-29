'use client';

import React from 'react';

export function StoryComparisonMatrix() {
  return (
    <section className="min-h-[100dvh] w-full flex flex-col justify-between items-center p-6 sm:p-12 md:p-16 max-w-5xl mx-auto select-none">
      {/* Editorial Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#0071e3]">
          Architectural Contrast
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[var(--foreground)]">
          Two Core Philosophies.
        </h2>
        <p className="text-base sm:text-xl text-[#86868b] font-normal max-w-xl">
          A fundamental choice between chronological simplicity and adaptive recency.
        </p>
      </div>

      {/* Side-by-Side Architectural Cards (Apple Clean Design) */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 my-auto py-6">
        {/* FIFO Philosophy */}
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.1] shadow-sm flex flex-col justify-between gap-8 transition-colors duration-300">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0071e3] font-semibold">
              First-In, First-Out
            </span>
            <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--foreground)]">
              &ldquo;What came first?&rdquo;
            </h3>
            <p className="text-sm text-[#86868b] leading-relaxed mt-1">
              Treats physical memory as an arrival queue. Eviction is locked to time of entry, blind to execution frequency.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-xs sm:text-sm text-[var(--foreground)] pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-[#86868b]">Eviction Criterion</span>
              <span className="font-medium">Oldest loaded page</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#86868b]">Hardware Cost</span>
              <span className="font-medium">Zero (Software queue)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#86868b]">Belady&apos;s Anomaly</span>
              <span className="font-medium text-[#ff3b30]">Vulnerable</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#86868b]">Real-World Usage</span>
              <span className="font-medium">Buffer caches &amp; simple kernels</span>
            </div>
          </div>
        </div>

        {/* LRU Philosophy */}
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.1] shadow-sm flex flex-col justify-between gap-8 transition-colors duration-300">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#34c759] font-semibold">
              Least Recently Used
            </span>
            <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--foreground)]">
              &ldquo;What was used least recently?&rdquo;
            </h3>
            <p className="text-sm text-[#86868b] leading-relaxed mt-1">
              Treats physical memory as a dynamic cache. Eviction is governed by access history, retaining pages the CPU actively references.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-xs sm:text-sm text-[var(--foreground)] pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-[#86868b]">Eviction Criterion</span>
              <span className="font-medium">Unreferenced longest</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#86868b]">Hardware Cost</span>
              <span className="font-medium">Requires MMU reference bits</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#86868b]">Belady&apos;s Anomaly</span>
              <span className="font-medium text-[#34c759]">Mathematically Immune</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#86868b]">Real-World Usage</span>
              <span className="font-medium">Clock (Second-Chance) in Linux/Win</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4" />
    </section>
  );
}
