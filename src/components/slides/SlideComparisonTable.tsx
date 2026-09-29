'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, GitCompare, Info } from 'lucide-react';
import { sound } from '@/lib/sound';

interface ComparisonRow {
  property: string;
  fifo: string;
  lru: string;
  notes: string;
  fifoBadge?: 'neutral' | 'negative' | 'positive';
  lruBadge?: 'neutral' | 'negative' | 'positive';
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    property: 'Full Form',
    fifo: 'First-In, First-Out',
    lru: 'Least Recently Used',
    notes: 'Fundamental design paradigm difference.',
    fifoBadge: 'neutral',
    lruBadge: 'neutral',
  },
  {
    property: 'Eviction Criterion',
    fifo: 'Oldest page loaded into RAM',
    lru: 'Page unreferenced for the longest time',
    notes: 'FIFO cares about arrival timestamp; LRU cares about last access timestamp.',
    fifoBadge: 'neutral',
    lruBadge: 'positive',
  },
  {
    property: 'Underlying Metric',
    fifo: 'Arrival Order (FIFO Queue)',
    lru: 'Recency History (Temporal Locality)',
    notes: 'LRU assumes past memory patterns predict near-future behavior.',
    fifoBadge: 'neutral',
    lruBadge: 'positive',
  },
  {
    property: 'Hardware Overhead',
    fifo: 'Zero / Minimal (Software queue pointer)',
    lru: 'High (Counter register / Stack update per access)',
    notes: 'True LRU requires hardware assist on every instruction fetch/load/store.',
    fifoBadge: 'positive',
    lruBadge: 'negative',
  },
  {
    property: "Belady's Anomaly",
    fifo: 'Vulnerable (More RAM can cause MORE faults)',
    lru: 'Mathematically Immune (Stack Algorithm)',
    notes: 'Proved by Mattson et al. (1970). n-frame set is always subset of (n+1)-frame set.',
    fifoBadge: 'negative',
    lruBadge: 'positive',
  },
  {
    property: 'Real-World Operating Systems',
    fifo: 'Rarely used directly for page tables',
    lru: 'Approximated via Clock / Second-Chance in Linux/Windows',
    notes: 'Modern OSes use a reference bit scanned periodically by a clock pointer.',
    fifoBadge: 'neutral',
    lruBadge: 'positive',
  },
];

export function SlideComparisonTable() {
  const [activeRow, setActiveRow] = useState<number | null>(null);

  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full gap-4">
      {/* Slide Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400 flex items-center gap-1.5">
          <GitCompare className="w-3.5 h-3.5" />
          Comparative Analysis
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          FIFO vs LRU: The Architectural Matrix
        </h2>
        <p className="text-sm sm:text-base text-gray-300 font-normal">
          Side-by-side evaluation of design trade-offs, algorithmic properties, and practical OS implementations.
        </p>
      </div>

      {/* Comparison Table Container */}
      <div className="my-auto overflow-hidden rounded-3xl bg-[#12151d] border border-white/[0.08] shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs font-mono uppercase text-gray-400 tracking-wider">
                <th className="p-4 sm:p-5 w-1/4">Property</th>
                <th className="p-4 sm:p-5 w-3/8 text-sky-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    FIFO
                  </span>
                </th>
                <th className="p-4 sm:p-5 w-3/8 text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    LRU
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm">
              {COMPARISON_DATA.map((row, idx) => {
                const isSelected = activeRow === idx;

                return (
                  <tr
                    key={row.property}
                    onClick={() => {
                      sound.click();
                      setActiveRow(isSelected ? null : idx);
                    }}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.06]'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <td className="p-4 sm:p-5 font-bold text-white font-mono flex items-center gap-2">
                      <span>{row.property}</span>
                      {isSelected && <Info className="w-3.5 h-3.5 text-sky-400" />}
                    </td>
                    <td className="p-4 sm:p-5 text-gray-300 font-sans">
                      <div className="flex items-center gap-2">
                        {row.fifoBadge === 'negative' && (
                          <X className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        )}
                        {row.fifoBadge === 'positive' && (
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                        <span>{row.fifo}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-gray-300 font-sans">
                      <div className="flex items-center gap-2">
                        {row.lruBadge === 'positive' && (
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                        {row.lruBadge === 'negative' && (
                          <X className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        )}
                        <span>{row.lru}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row detail footnote */}
      <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] text-xs sm:text-sm font-mono text-gray-300 flex items-center justify-between shadow-lg">
        <div>
          {activeRow !== null ? (
            <span>
              <strong className="text-white">{COMPARISON_DATA[activeRow].property}:</strong>{' '}
              {COMPARISON_DATA[activeRow].notes}
            </span>
          ) : (
            <span className="text-gray-400">
              Tap any row above on the smart whiteboard to view detailed architectural notes.
            </span>
          )}
        </div>
        <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider hidden sm:inline">
          Matrix
        </span>
      </div>
    </div>
  );
}
