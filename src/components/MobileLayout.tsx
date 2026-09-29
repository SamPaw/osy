'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  GitCompare,
  AlertTriangle,
  HelpCircle,
  Monitor,
  Share2,
} from 'lucide-react';
import { AlgorithmSimulator } from './simulator/AlgorithmSimulator';
import { ComparisonVisualizer } from './simulator/ComparisonVisualizer';
import { BeladyAnomalyVisualizer } from './simulator/BeladyAnomalyVisualizer';
import { SlideQuiz } from './slides/SlideQuiz';
import { sound } from '@/lib/sound';

type MobileTab = 'fifo' | 'lru' | 'compare' | 'belady' | 'quiz' | 'concepts';

interface MobileLayoutProps {
  onSwitchToPresentation: () => void;
  onOpenQRModal: () => void;
}

export function MobileLayout({
  onSwitchToPresentation,
  onOpenQRModal,
}: MobileLayoutProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>('fifo');

  const navItems: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
    { id: 'fifo', label: 'FIFO Lab', icon: <Cpu className="w-4 h-4" /> },
    { id: 'lru', label: 'LRU Lab', icon: <Layers className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'belady', label: 'Belady', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'concepts', label: 'Concepts', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between bg-[#090a0f] text-gray-100 select-none pb-16">
      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-40 px-4 py-3 border-b border-white/[0.08] bg-[#090a0f]/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="font-bold text-sm text-white font-mono tracking-tight">
            PlateSight OS
          </span>
          <span className="text-xs text-gray-500 font-mono">Mobile</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.click();
              onOpenQRModal();
            }}
            className="p-1.5 rounded-lg border border-white/[0.1] text-gray-400 hover:text-white"
            title="Show QR"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.click();
              onSwitchToPresentation();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs font-mono font-semibold"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Whiteboard Mode</span>
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 p-4 overflow-y-auto max-w-2xl mx-auto w-full">
        {activeTab === 'fifo' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase text-sky-400 font-bold">
                Algorithm Simulator
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                FIFO (First-In, First-Out)
              </h2>
              <p className="text-xs text-gray-300">
                Evicts the page loaded earliest into memory. Tap next or pick presets below.
              </p>
            </div>
            <AlgorithmSimulator algorithm="FIFO" initialPresetId="basic-fifo" compact={true} />
          </div>
        )}

        {activeTab === 'lru' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                Algorithm Simulator
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                LRU (Least Recently Used)
              </h2>
              <p className="text-xs text-gray-300">
                Evicts the page that was not accessed for the longest time.
              </p>
            </div>
            <AlgorithmSimulator algorithm="LRU" initialPresetId="lru-locality" compact={true} />
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase text-indigo-400 font-bold">
                Synchronous Execution
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                FIFO vs LRU Live
              </h2>
              <p className="text-xs text-gray-300">
                Same sequence running through both algorithms. Watch for divergence points!
              </p>
            </div>
            <ComparisonVisualizer />
          </div>
        )}

        {activeTab === 'belady' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                Anomalous Behavior
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Belady&apos;s Anomaly
              </h2>
              <p className="text-xs text-gray-300">
                Increasing frames from 3 to 4 increases faults from 9 to 10 in FIFO.
              </p>
            </div>
            <BeladyAnomalyVisualizer />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="flex flex-col gap-4 min-h-[500px]">
            <SlideQuiz />
          </div>
        )}

        {activeTab === 'concepts' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase text-sky-400 font-bold">
                Quick Theory Summary
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Page Replacement Concepts
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-2">
              <h3 className="font-bold text-white text-sm font-mono text-sky-300">
                What is a Page Fault?
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                An interrupt raised by hardware (MMU) when a program accesses a virtual page that has its valid bit set to 0 (not in physical RAM).
                The OS kernel halts execution, loads the page from disk into an available frame, updates the page table, and resumes the instruction.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-2">
              <h3 className="font-bold text-white text-sm font-mono text-emerald-300">
                FIFO vs LRU Core Difference
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                <strong>FIFO:</strong> &ldquo;What came first?&rdquo; Treats memory as a queue buffer. Low CPU overhead, but suffers from Belady&apos;s anomaly and ignores frequency of usage.
                <br /><br />
                <strong>LRU:</strong> &ldquo;What was used least recently?&rdquo; Exploits temporal locality. Immune to Belady&apos;s anomaly (stack algorithm), but requires hardware support or approximation like Clock.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-2">
              <h3 className="font-bold text-white text-sm font-mono text-amber-300">
                Belady&apos;s Anomaly Definition
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Discovered by László Bélády in 1969. In FIFO, adding physical frames can sometimes lead to more page faults.
                LRU is a <em>Stack Algorithm</em> where the set of pages in <em>n</em> frames is always a subset of pages in <em>n+1</em> frames, making it mathematically impossible to exhibit Belady&apos;s anomaly.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Fixed Navigation Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090a0f]/95 backdrop-blur-lg border-t border-white/[0.08] px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.click();
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-sky-400 font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-sky-500/20' : 'bg-transparent'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] font-mono tracking-tight mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
