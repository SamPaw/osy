'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SimulationStep } from '@/lib/pageReplacement';
import { CheckCircle2, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';

interface ExplanationPanelProps {
  currentStep: SimulationStep | null;
  className?: string;
}

export function ExplanationPanel({
  currentStep,
  className = '',
}: ExplanationPanelProps) {
  if (!currentStep) {
    return (
      <div
        className={`p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex items-center gap-3 text-gray-400 font-mono text-sm ${className}`}
      >
        <HelpCircle className="w-5 h-5 text-gray-500 flex-shrink-0" />
        <span>Press <strong className="text-white">Next</strong> or <strong className="text-white">Play</strong> to start the step-by-step teacher explanation.</span>
      </div>
    );
  }

  const { isHit, page, explanation, evictedPage } = currentStep;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden shadow-lg ${
        isHit
          ? 'bg-emerald-950/20 border-emerald-500/30'
          : 'bg-rose-950/20 border-rose-500/30'
      } ${className}`}
    >
      {/* Top subtle glow line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] ${
          isHit ? 'bg-emerald-400/80' : 'bg-rose-400/80'
        }`}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`step-exp-${currentStep.stepIndex}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col gap-2.5"
        >
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {isHit ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <span className="font-mono text-xs uppercase tracking-wider text-gray-400">
                Step {currentStep.stepIndex + 1}
              </span>
              <span className="text-gray-600">•</span>
              <span className="font-mono text-xs text-gray-300">
                Incoming: <strong className="text-white font-bold text-sm">Page {page}</strong>
              </span>
            </div>

            <span
              className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                isHit
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {isHit ? 'PAGE HIT' : evictedPage !== null ? 'PAGE FAULT & EVICTION' : 'PAGE FAULT (ALLOCATE)'}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-base sm:text-lg font-semibold tracking-tight text-white leading-snug">
            {explanation.title}
          </h4>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
            {explanation.description}
          </p>

          {/* Eviction Reason Callout if page was evicted */}
          {explanation.victimReason && (
            <div className="mt-1 flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs sm:text-sm font-mono text-amber-200/90">
              <ArrowRight className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-400 font-bold">Why Page {evictedPage} was chosen:</strong>{' '}
                <span>{explanation.victimReason}</span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
