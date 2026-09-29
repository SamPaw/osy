'use client';

import React from 'react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowDown, Smartphone, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/sound';

const PRODUCTION_URL = 'https://os.platesight.in';

interface StartupExperienceProps {
  onStart: () => void;
  onOpenMobile: () => void;
}

export function StartupExperience({
  onStart,
  onOpenMobile,
}: StartupExperienceProps) {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between p-6 sm:p-12 md:p-16 bg-[#fbfbfd] text-[#1d1d1f] relative overflow-hidden select-none">
      {/* Discreet Top Brand Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3]" />
          <span className="font-semibold text-xs tracking-wider uppercase text-[#1d1d1f]">
            PlateSight OS
          </span>
          <span className="text-[#86868b] text-xs">/</span>
          <span className="text-[#86868b] text-xs font-normal">Classroom Experience</span>
        </div>

        <button
          onClick={() => {
            sound.click();
            onOpenMobile();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Companion</span>
        </button>
      </header>

      {/* Main Center Stage */}
      <div className="my-auto max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-8">
        {/* Left: Apple Editorial Title & Action */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold tracking-widest uppercase text-[#0071e3]">
              Operating Systems
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.05]">
              Page Replacement <br />
              <span className="text-[#86868b] font-normal">Algorithms.</span>
            </h1>
            <p className="text-2xl font-light text-[#1d1d1f] tracking-tight mt-1">
              FIFO <span className="text-[#86868b] font-normal">×</span> LRU
            </p>
          </div>

          <p className="text-base sm:text-lg text-[#86868b] font-normal leading-relaxed max-w-xl">
            When physical memory is limited, which page should the operating system remove?
            An interactive visual exploration designed for classroom smartboards and mobile devices.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={() => {
                sound.click();
                onStart();
              }}
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1d1d1f] text-white font-medium text-base hover:bg-black active:scale-[0.98] transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>Begin Experience</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <span className="text-xs text-[#86868b] text-center sm:text-left">
              Touch, swipe, or scroll to navigate naturally.
            </span>
          </div>
        </div>

        {/* Right: Crisp Apple-Style QR Code Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="p-8 rounded-[2rem] bg-white border border-black/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col items-center gap-6 text-center max-w-xs w-full">
            <div className="p-3 bg-white rounded-2xl border border-black/[0.04] shadow-sm">
              <QRCodeSVG
                value={PRODUCTION_URL}
                size={180}
                level="M"
                bgColor="#ffffff"
                fgColor="#1d1d1f"
                includeMargin={false}
              />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-sm text-[#1d1d1f]">
                Scan with your phone
              </h3>
              <p className="text-xs text-[#86868b] leading-normal">
                Follow along synchronously and run live simulations in class.
              </p>
            </div>

            <div className="w-full pt-3 border-t border-black/[0.06] flex items-center justify-center text-xs font-mono text-[#0071e3]">
              <span className="font-medium">os.platesight.in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discreet Footer Note */}
      <footer className="flex flex-wrap items-center justify-between text-xs text-[#86868b] pt-6 border-t border-black/[0.06]">
        <span>Designed for classroom touchscreen smartboards &amp; 16:9 displays</span>
        <span>Keyboard: Arrow keys / Space to advance • F for Fullscreen</span>
      </footer>
    </div>
  );
}
