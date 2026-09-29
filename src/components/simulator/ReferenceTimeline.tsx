'use client';

import React from 'react';
import { SimulationStep } from '@/lib/pageReplacement';
import { sound } from '@/lib/sound';

interface ReferenceTimelineProps {
  referenceString: number[];
  currentStepIndex: number; // -1 if not started, 0 to length - 1
  steps: SimulationStep[];
  onSelectStep: (stepIndex: number) => void;
  className?: string;
}

export function ReferenceTimeline({
  referenceString,
  currentStepIndex,
  steps,
  onSelectStep,
  className = '',
}: ReferenceTimelineProps) {
  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between text-xs tracking-wider uppercase text-gray-400 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          Reference String ({referenceString.length} Pages)
        </span>
        <span className="text-gray-500 hidden sm:inline">
          Tap any page to jump to step
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 no-scrollbar scroll-smooth">
        {referenceString.map((page, index) => {
          const isCurrent = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          const stepData = index <= currentStepIndex ? steps[index] : null;
          const isHit = stepData?.isHit;

          return (
            <button
              key={`${index}-${page}`}
              onClick={() => {
                sound.click();
                onSelectStep(index);
              }}
              className={`group relative flex-shrink-0 flex flex-col items-center justify-center min-w-[50px] sm:min-w-[56px] h-14 rounded-xl border transition-all duration-200 active:scale-95 cursor-pointer ${
                isCurrent
                  ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/20 ring-2 ring-sky-400/40'
                  : isPast
                  ? isHit
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                  : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:bg-white/[0.07] hover:text-gray-200'
              }`}
              title={`Step ${index + 1}: Page ${page}`}
            >
              {/* Step number subscript */}
              <span className="text-[10px] font-mono opacity-60 leading-none mb-0.5">
                #{index + 1}
              </span>

              {/* Page Number */}
              <span className="text-lg font-bold font-mono tracking-tight leading-none">
                {page}
              </span>

              {/* Hit / Fault indicator dot */}
              {isPast && (
                <div className="absolute -bottom-1 flex items-center justify-center">
                  <span
                    className={`w-2 h-2 rounded-full ring-2 ring-[#090a0f] ${
                      isHit ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                </div>
              )}

              {/* Current pointer indicator */}
              {isCurrent && (
                <div className="absolute -bottom-2 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 ring-4 ring-sky-400/30 animate-ping" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
