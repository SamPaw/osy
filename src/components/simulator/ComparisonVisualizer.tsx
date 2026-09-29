'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  simulateFIFO,
  simulateLRU,
  PRESETS,
  SimulationResult,
} from '@/lib/pageReplacement';
import { ReferenceTimeline } from './ReferenceTimeline';
import { MemoryFrames } from './MemoryFrames';
import { FIFOQueueVisualizer } from './FIFOQueueVisualizer';
import { LRURecencyVisualizer } from './LRURecencyVisualizer';
import { sound } from '@/lib/sound';
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  GitCompare,
  AlertTriangle,
  Minus,
  Plus,
} from 'lucide-react';

interface ComparisonVisualizerProps {
  className?: string;
}

export function ComparisonVisualizer({ className = '' }: ComparisonVisualizerProps) {
  // Use the divergence preset by default so students immediately see the difference
  const divergencePreset = PRESETS.find((p) => p.id === 'divergence') || PRESETS[2];

  const [selectedPresetId, setSelectedPresetId] = useState(divergencePreset.id);
  const [frameCount, setFrameCount] = useState(3);
  const [referenceString, setReferenceString] = useState<number[]>(divergencePreset.referenceString);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Run both simulations synchronously
  const fifoResult: SimulationResult = useMemo(
    () => simulateFIFO(referenceString, frameCount),
    [referenceString, frameCount]
  );

  const lruResult: SimulationResult = useMemo(
    () => simulateLRU(referenceString, frameCount),
    [referenceString, frameCount]
  );

  const currentFifoStep =
    currentStepIndex >= 0 && currentStepIndex < fifoResult.steps.length
      ? fifoResult.steps[currentStepIndex]
      : null;

  const currentLruStep =
    currentStepIndex >= 0 && currentStepIndex < lruResult.steps.length
      ? lruResult.steps[currentStepIndex]
      : null;

  // Check if decisions diverged on the current step
  const isDivergent = useMemo(() => {
    if (!currentFifoStep || !currentLruStep) return false;
    // Diverged if hit vs fault differs OR evicted page differs
    if (currentFifoStep.isHit !== currentLruStep.isHit) return true;
    if (currentFifoStep.evictedPage !== currentLruStep.evictedPage) return true;
    return false;
  }, [currentFifoStep, currentLruStep]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < referenceString.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      sound.click();
    } else {
      setIsPlaying(false);
    }
  }, [currentStepIndex, referenceString.length]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      sound.click();
    } else if (currentStepIndex === 0) {
      setCurrentStepIndex(-1);
    }
  }, [currentStepIndex]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  }, []);

  // Autoplay loop
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 1600 / playbackSpeed;
    const interval = setInterval(() => {
      if (!isPlayingRef.current) return;
      setCurrentStepIndex((prev) => {
        if (prev < referenceString.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, referenceString.length]);

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(presetId);
      setReferenceString(preset.referenceString);
      setFrameCount(preset.recommendedFrames);
      handleReset();
    }
  };

  return (
    <div className={`flex flex-col gap-3.5 w-full ${className}`}>
      {/* Reference Timeline */}
      <ReferenceTimeline
        referenceString={referenceString}
        currentStepIndex={currentStepIndex}
        steps={fifoResult.steps}
        onSelectStep={(idx) => {
          setCurrentStepIndex(idx);
          sound.click();
        }}
      />

      {/* Divergence Notification Banner */}
      {isDivergent && currentFifoStep && currentLruStep && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
            <span>
              <strong>Divergent Decisions at Step #{currentStepIndex + 1}!</strong>{' '}
              {currentFifoStep.isHit !== currentLruStep.isHit ? (
                <span>
                  FIFO had a {currentFifoStep.isHit ? 'HIT' : 'FAULT'}, while LRU had a{' '}
                  {currentLruStep.isHit ? 'HIT' : 'FAULT'}.
                </span>
              ) : (
                <span>
                  FIFO evicted <strong className="text-white">Page {currentFifoStep.evictedPage}</strong> (oldest),
                  whereas LRU evicted <strong className="text-white">Page {currentLruStep.evictedPage}</strong> (least recently used).
                </span>
              )}
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
            Divergence
          </span>
        </div>
      )}

      {/* Side-by-Side Simulators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Left: FIFO */}
        <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400" />
              <h3 className="font-bold text-base text-white tracking-tight">
                FIFO (First-In, First-Out)
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-rose-400 font-bold">
                Faults: {currentFifoStep?.pageFaultCount ?? 0}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-emerald-400 font-bold">
                Hits: {currentFifoStep?.pageHitCount ?? 0}
              </span>
            </div>
          </div>

          <MemoryFrames
            frameCount={frameCount}
            currentStep={currentFifoStep}
            algorithm="FIFO"
            compact={true}
          />

          <FIFOQueueVisualizer currentStep={currentFifoStep} />

          {/* Explanation snapshot */}
          <div className="text-xs font-mono text-gray-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.06]">
            {currentFifoStep ? (
              <span>
                <strong className={currentFifoStep.isHit ? 'text-emerald-400' : 'text-rose-400'}>
                  {currentFifoStep.isHit ? 'HIT:' : 'FAULT:'}
                </strong>{' '}
                {currentFifoStep.explanation.description}
              </span>
            ) : (
              <span className="text-gray-500">Step forward to compare FIFO decisions.</span>
            )}
          </div>
        </div>

        {/* Right: LRU */}
        <div className="p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <h3 className="font-bold text-base text-white tracking-tight">
                LRU (Least Recently Used)
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-rose-400 font-bold">
                Faults: {currentLruStep?.pageFaultCount ?? 0}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-emerald-400 font-bold">
                Hits: {currentLruStep?.pageHitCount ?? 0}
              </span>
            </div>
          </div>

          <MemoryFrames
            frameCount={frameCount}
            currentStep={currentLruStep}
            algorithm="LRU"
            compact={true}
          />

          <LRURecencyVisualizer currentStep={currentLruStep} />

          {/* Explanation snapshot */}
          <div className="text-xs font-mono text-gray-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.06]">
            {currentLruStep ? (
              <span>
                <strong className={currentLruStep.isHit ? 'text-emerald-400' : 'text-rose-400'}>
                  {currentLruStep.isHit ? 'HIT:' : 'FAULT:'}
                </strong>{' '}
                {currentLruStep.explanation.description}
              </span>
            ) : (
              <span className="text-gray-500">Step forward to compare LRU decisions.</span>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Controls Bar */}
      <div className="p-3.5 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Preset & Frames */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-[#1a1e29] border border-white/[0.12] text-xs sm:text-sm font-mono text-gray-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-[#1a1e29] border border-white/[0.12] rounded-xl p-1 gap-1">
            <button
              onClick={() => {
                if (frameCount > 1) {
                  setFrameCount(frameCount - 1);
                  handleReset();
                }
              }}
              disabled={frameCount <= 1}
              className="w-7 h-7 rounded flex items-center justify-center text-gray-300 hover:bg-white/[0.08] disabled:opacity-30"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs font-bold font-mono text-white">
              {frameCount}F
            </span>
            <button
              onClick={() => {
                if (frameCount < 8) {
                  setFrameCount(frameCount + 1);
                  handleReset();
                }
              }}
              disabled={frameCount >= 8}
              className="w-7 h-7 rounded flex items-center justify-center text-gray-300 hover:bg-white/[0.08] disabled:opacity-30"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Stepping controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs font-mono text-gray-300 hover:bg-white/[0.08]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex < 0}
            className="px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs font-mono text-gray-200 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 inline" /> Prev
          </button>

          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold ${
              isPlaying
                ? 'bg-amber-500 text-black'
                : 'bg-sky-500 text-black'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isPlaying ? 'Pause' : 'Play Both'}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex >= referenceString.length - 1}
            className="px-4 py-2 rounded-xl bg-white/[0.08] border border-white/[0.15] text-xs font-mono font-bold text-white hover:bg-white/[0.14] disabled:opacity-30"
          >
            Next Step <ChevronRight className="w-4 h-4 inline" />
          </button>
        </div>
      </div>
    </div>
  );
}
