'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Copy, Check } from 'lucide-react';
import { sound } from '@/lib/sound';

const PRODUCTION_URL = 'https://os.platesight.in';

interface QROverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QROverlay({ isOpen, onClose }: QROverlayProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    sound.click();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(PRODUCTION_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-black/[0.06] flex flex-col items-center gap-6 text-center relative select-none">
        <button
          onClick={() => {
            sound.click();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.05] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
          <Smartphone className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-semibold text-[#1d1d1f] tracking-tight">
            Continue on your phone
          </h3>
          <p className="text-xs text-[#86868b] leading-relaxed">
            Open the companion simulation on any mobile device to follow along during the lecture.
          </p>
        </div>

        <div className="p-3 bg-[#f5f5f7] rounded-3xl border border-black/[0.04]">
          <QRCodeSVG
            value={PRODUCTION_URL}
            size={180}
            level="M"
            bgColor="#f5f5f7"
            fgColor="#1d1d1f"
            includeMargin={false}
          />
        </div>

        <div className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#f5f5f7] text-xs font-mono text-[#1d1d1f]">
          <span className="font-medium text-[#0071e3]">os.platesight.in</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#34c759]" />
                <span className="text-[#34c759]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
