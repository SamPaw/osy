'use client';

import React from 'react';
import { SimulationStep } from '@/lib/pageReplacement';

interface SimulationMetricsProps {
  totalReferences: number;
  currentStep: SimulationStep | null;
  className?: string;
}

export function SimulationMetrics({
  totalReferences,
  currentStep,
  className = '',
}: SimulationMetricsProps) {
  const processed = currentStep ? currentStep.stepIndex + 1 : 0;
  const hits = currentStep ? currentStep.pageHitCount : 0;
  const faults = currentStep ? currentStep.pageFaultCount : 0;
  const hitRate = currentStep ? currentStep.hitRate : 0;
  const faultRate = currentStep ? currentStep.faultRate : 0;

  const metrics = [
    {
      label: 'REFERENCES',
      value: `${processed} / ${totalReferences}`,
      subtext: `${totalReferences - processed} remaining`,
      color: 'text-gray-200',
      bg: 'bg-white/[0.02]',
    },
    {
      label: 'PAGE HITS',
      value: hits,
      subtext: `${hitRate}% of total`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/[0.04]',
    },
    {
      label: 'PAGE FAULTS',
      value: faults,
      subtext: `${faultRate}% of total`,
      color: 'text-rose-400',
      bg: 'bg-rose-500/[0.04]',
    },
    {
      label: 'HIT RATE',
      value: `${hitRate}%`,
      subtext: 'Efficiency',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/[0.04]',
    },
    {
      label: 'FAULT RATE',
      value: `${faultRate}%`,
      subtext: 'Memory misses',
      color: 'text-rose-400',
      bg: 'bg-rose-500/[0.04]',
    },
  ];

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 ${className}`}
    >
      {metrics.map((m, idx) => (
        <div
          key={m.label}
          className={`p-3 rounded-2xl border border-white/[0.08] ${m.bg} flex flex-col justify-between transition-all duration-200 hover:border-white/[0.15]`}
        >
          <span className="text-[10px] font-mono tracking-wider uppercase text-gray-400">
            {m.label}
          </span>
          <div className="my-1">
            <span
              className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${m.color}`}
            >
              {m.value}
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-500 truncate">
            {m.subtext}
          </span>
        </div>
      ))}
    </div>
  );
}
