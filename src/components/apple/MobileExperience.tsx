'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  GitCompare,
  AlertTriangle,
  HelpCircle,
  Share2,
  Sun,
  Moon,
} from 'lucide-react';
import { StoryFIFO } from './StoryFIFO';
import { StoryLRU } from './StoryLRU';
import { StoryComparison } from './StoryComparison';
import { StoryBelady } from './StoryBelady';
import { StoryQuiz } from './StoryQuiz';
import { sound } from '@/lib/sound';
import { useTheme } from '@/context/ThemeContext';

type MobileSection = 'fifo' | 'lru' | 'compare' | 'belady' | 'quiz' | 'story';

interface MobileExperienceProps {
  onOpenQR: () => void;
  onSwitchToDesktop: () => void;
}

export function MobileExperience({
  onOpenQR,
  onSwitchToDesktop,
}: MobileExperienceProps) {
  const [activeTab, setActiveTab] = useState<MobileSection>('fifo');
  const { theme, toggleTheme } = useTheme();

  const tabs: { id: MobileSection; label: string; icon: React.ReactNode }[] = [
    { id: 'fifo', label: 'FIFO', icon: <Cpu className="w-4 h-4" /> },
    { id: 'lru', label: 'LRU', icon: <Layers className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'belady', label: 'Belady', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'story', label: 'Concepts', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between bg-[var(--background)] text-[var(--foreground)] select-none pb-20 transition-colors duration-300">
      {/* Top Header */}
      <header className="sticky top-0 z-40 px-4 py-3 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
          <span className="font-semibold text-xs text-[var(--foreground)] tracking-tight">
            Operating Systems
          </span>
          <span className="text-[10px] text-[#86868b] font-mono">Mobile</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => {
              sound.click();
              toggleTheme();
            }}
            className="p-1.5 rounded-full text-[#86868b] hover:text-[var(--foreground)] cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#ffd60a]" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => {
              sound.click();
              onOpenQR();
            }}
            className="p-1.5 rounded-full text-[#86868b] hover:text-[var(--foreground)] cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.click();
              onSwitchToDesktop();
            }}
            className="text-xs text-[#0071e3] font-medium cursor-pointer"
          >
            Full View
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 p-4 overflow-y-auto w-full max-w-xl mx-auto">
        {activeTab === 'fifo' && (
          <div className="flex flex-col gap-4">
            <StoryFIFO />
          </div>
        )}

        {activeTab === 'lru' && (
          <div className="flex flex-col gap-4">
            <StoryLRU />
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="flex flex-col gap-4">
            <StoryComparison />
          </div>
        )}

        {activeTab === 'belady' && (
          <div className="flex flex-col gap-4">
            <StoryBelady />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="flex flex-col gap-4">
            <StoryQuiz />
          </div>
        )}

        {activeTab === 'story' && (
          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0071e3]">
                Core Architecture
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                FIFO vs LRU
              </h2>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-sm flex flex-col gap-2">
              <h3 className="font-semibold text-sm text-[#0071e3]">FIFO Principle</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Remove the page that arrived in physical memory earliest. Tracks chronological order via queue, but ignores access frequency and is vulnerable to Belady&apos;s anomaly.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-sm flex flex-col gap-2">
              <h3 className="font-semibold text-sm text-[#34c759]">LRU Principle</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Remove the page that hasn&apos;t been referenced for the longest time. Exploits temporal locality. A stack algorithm immune to Belady&apos;s anomaly.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-sm flex flex-col gap-2">
              <h3 className="font-semibold text-sm text-[#ff3b30]">Belady&apos;s Anomaly</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                A phenomenon where increasing the number of physical frames paradoxically increases total page faults under FIFO.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Fixed Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-lg border-t border-black/[0.06] dark:border-white/[0.08] px-2 py-2 flex items-center justify-around transition-colors">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.click();
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#0071e3] font-semibold'
                  : 'text-[#86868b] hover:text-[var(--foreground)]'
              }`}
            >
              <div className={`p-1 rounded-xl ${isActive ? 'bg-[#0071e3]/10' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
