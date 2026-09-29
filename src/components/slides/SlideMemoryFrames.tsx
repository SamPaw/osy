'use client';

import React, { useState } from 'react';
import { Layers, Database, Cpu, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/sound';

interface PageTableEntry {
  pageNumber: number;
  frameNumber: number | null;
  validBit: 0 | 1;
  status: string;
}

const INITIAL_PAGE_TABLE: PageTableEntry[] = [
  { pageNumber: 0, frameNumber: 1, validBit: 1, status: 'Resident in Frame 2' },
  { pageNumber: 1, frameNumber: 2, validBit: 1, status: 'Resident in Frame 3' },
  { pageNumber: 2, frameNumber: null, validBit: 0, status: 'On Disk (Page Fault)' },
  { pageNumber: 3, frameNumber: null, validBit: 0, status: 'On Disk (Page Fault)' },
  { pageNumber: 7, frameNumber: 0, validBit: 1, status: 'Resident in Frame 1' },
];

export function SlideMemoryFrames() {
  const [selectedPage, setSelectedPage] = useState<number>(0);

  const currentEntry = INITIAL_PAGE_TABLE.find((p) => p.pageNumber === selectedPage) || INITIAL_PAGE_TABLE[0];

  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full gap-4">
      {/* Slide Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
          Hardware & OS Foundation
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Virtual Pages &amp; Physical Frames
        </h2>
        <p className="text-sm sm:text-base text-gray-300 font-normal">
          The Memory Management Unit (MMU) uses the Page Table to translate virtual page numbers to physical frame addresses.
        </p>
      </div>

      {/* Main Architecture Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-auto">
        {/* Virtual Page Selector */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400 font-semibold flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-400" />
              1. Virtual Pages
            </span>
            <span className="text-[10px] font-mono text-gray-500">Tap to inspect</span>
          </div>

          <div className="flex flex-col gap-2">
            {INITIAL_PAGE_TABLE.map((entry) => (
              <button
                key={entry.pageNumber}
                onClick={() => {
                  sound.click();
                  setSelectedPage(entry.pageNumber);
                }}
                className={`p-2.5 rounded-xl border font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                  selectedPage === entry.pageNumber
                    ? 'bg-sky-500/20 border-sky-400 text-white font-bold ring-2 ring-sky-500/30'
                    : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:bg-white/[0.05]'
                }`}
              >
                <span>Virtual Page {entry.pageNumber}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    entry.validBit === 1
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {entry.validBit === 1 ? 'In RAM' : 'On Disk'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Page Table Middle Column */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-xl">
          <span className="text-xs font-mono uppercase text-gray-400 font-semibold flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            2. Page Table Entry
          </span>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-gray-400">Page Number:</span>
              <span className="text-white font-bold text-sm">#{currentEntry.pageNumber}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-gray-400">Valid/Invalid Bit:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded ${
                  currentEntry.validBit === 1
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {currentEntry.validBit} ({currentEntry.validBit === 1 ? 'Valid' : 'Invalid'})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Assigned Frame:</span>
              <span className="text-white font-bold">
                {currentEntry.frameNumber !== null ? `Frame ${currentEntry.frameNumber + 1}` : 'None (Disk)'}
              </span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-gray-400">
            If Valid Bit = 0, MMU triggers a Page Fault exception to the kernel.
          </div>
        </div>

        {/* Physical RAM Output */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-xl">
          <span className="text-xs font-mono uppercase text-gray-400 font-semibold flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-400" />
            3. Physical Frames (RAM)
          </span>

          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((fIndex) => {
              const isSelectedTarget = currentEntry.frameNumber === fIndex;
              const mappedPage = INITIAL_PAGE_TABLE.find((p) => p.frameNumber === fIndex)?.pageNumber;

              return (
                <div
                  key={`frame-col-${fIndex}`}
                  className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs transition-all ${
                    isSelectedTarget
                      ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-500/40 text-emerald-200'
                      : 'bg-white/[0.02] border-white/[0.06] text-gray-400'
                  }`}
                >
                  <span className="font-semibold">Frame {fIndex + 1}</span>
                  <span className="text-white font-bold bg-white/[0.05] px-2 py-0.5 rounded">
                    Page {mappedPage}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-gray-500 text-center pt-1">
            Total physical frames: 3 (Capacity exhausted)
          </div>
        </div>
      </div>

      {/* Summary note */}
      <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] text-xs sm:text-sm font-mono text-gray-300 shadow-lg">
        <strong className="text-sky-400">Key Principle:</strong> When a page fault occurs and all physical frames are occupied,
        the operating system must execute a <strong>Page Replacement Algorithm</strong> to choose which frame to evacuate.
      </div>
    </div>
  );
}
