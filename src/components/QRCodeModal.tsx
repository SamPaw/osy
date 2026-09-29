'use client';

import React from 'react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { sound } from '@/lib/sound';
import { X, Smartphone, ExternalLink, Copy, Check } from 'lucide-react';

const PRODUCTION_URL = 'https://os.platesight.in';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = React.useState(false);

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12151d] border border-white/[0.15] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center gap-5 text-center relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => {
            sound.click();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
          <Smartphone className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Phone Interactive View
          </h3>
          <p className="text-xs text-gray-400 font-sans">
            Scan to interact on your phone, run simulations, and follow the presentation.
          </p>
        </div>

        <div className="p-2 bg-white rounded-2xl shadow-xl">
          <QRCodeDisplay value={PRODUCTION_URL} size={180} />
        </div>

        <div className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-gray-300">
          <span className="font-bold text-sky-300">os.platesight.in</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
