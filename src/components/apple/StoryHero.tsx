'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { sound } from '@/lib/sound';

interface StoryHeroProps {
  onScrollDown: () => void;
}

export function StoryHero({ onScrollDown }: StoryHeroProps) {
  return (
    <section className="min-h-[100dvh] w-full flex flex-col justify-between items-center text-center p-6 sm:p-12 relative select-none">
      <div className="h-10" />

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 my-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#0071e3]"
        >
          Operating Systems
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-[#1d1d1f] leading-[0.95]"
        >
          Page <br className="hidden sm:inline" />
          Replacement.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center gap-3 text-2xl sm:text-3xl md:text-4xl font-light text-[#86868b] tracking-tight"
        >
          <span>FIFO</span>
          <span className="text-[#d2d2d7]">×</span>
          <span>LRU</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-2xl text-[#86868b] font-normal leading-relaxed max-w-2xl mt-4"
        >
          When physical memory is limited, which page should the operating system remove?
        </motion.p>
      </div>

      {/* Downward Story Scroll Indicator */}
      <motion.button
        onClick={() => {
          sound.click();
          onScrollDown();
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="flex flex-col items-center gap-2 text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors pb-6 cursor-pointer"
      >
        <span>Scroll to begin the story</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </motion.button>
    </section>
  );
}
