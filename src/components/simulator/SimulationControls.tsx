'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Minus,
  Plus,
  Sliders,
  Sparkles,
  Check,
  AlertCircle,
} from 'lucide-react';
import { PRESETS, parseReferenceString } from '@/lib/pageReplacement';
import { sound } from '@/lib/sound';

interface SimulationControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number; // e.g. 1
  frameCount: number;
  selectedPresetId: string;
  referenceString: number[];
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onChangeSpeed: (speed: number) => void;
  onChangeFrameCount: (frames: number) => void;
  onSelectPreset: (presetId: string) => void;
  onApplyCustomString: (pages: number[]) => void;
  className?: string;
}

const SPEEDS = [0.5, 1, 1.5, 2];

export function SimulationControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  frameCount,
  selectedPresetId,
  referenceString,
  onPrev,
  onNext,
  onTogglePlay,
  onReset,
  onChangeSpeed,
  onChangeFrameCount,
  onSelectPreset,
  onApplyCustomString,
  className = '',
}: SimulationControlsProps) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInputText, setCustomInputText] = useState(referenceString.join(' '));
  const [customError, setCustomError] = useState<string | null>(null);

  const canGoPrev = currentStepIndex >= 0;
  const canGoNext = currentStepIndex < totalSteps - 1;

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const { pages, error } = parseReferenceString(customInputText);
    if (error) {
      setCustomError(error);
      return;
    }
    setCustomError(null);
    onApplyCustomString(pages);
    setShowCustomModal(false);
  };

  return (
    <div
      className={`p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col gap-3 shadow-lg ${className}`}
    >
      {/* Top Row: Presets & Frame Count Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-mono uppercase text-gray-400 hidden sm:inline">
            Preset:
          </span>
          <select
            value={selectedPresetId}
            onChange={(e) => {
              sound.click();
              if (e.target.value === 'custom') {
                setShowCustomModal(true);
              } else {
                onSelectPreset(e.target.value);
              }
            }}
            className="bg-[#1a1e29] border border-white/[0.12] text-xs sm:text-sm font-mono text-gray-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="custom">✎ Custom String...</option>
          </select>

          <button
            onClick={() => {
              sound.click();
              setCustomInputText(referenceString.join(' '));
              setShowCustomModal(true);
            }}
            className="text-xs font-mono text-sky-400 hover:text-sky-300 underline underline-offset-4 px-2 py-1"
          >
            Edit String
          </button>
        </div>

        {/* Frames Counter (− 3 +) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-gray-400">
            Frames:
          </span>
          <div className="flex items-center bg-[#1a1e29] border border-white/[0.12] rounded-xl p-1 gap-1">
            <button
              onClick={() => {
                if (frameCount > 1) {
                  sound.click();
                  onChangeFrameCount(frameCount - 1);
                }
              }}
              disabled={frameCount <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-white/[0.08] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              title="Decrease frames"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold font-mono text-white">
              {frameCount}
            </span>
            <button
              onClick={() => {
                if (frameCount < 8) {
                  sound.click();
                  onChangeFrameCount(frameCount + 1);
                }
              }}
              disabled={frameCount >= 8}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-white/[0.08] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              title="Increase frames"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Row: Step by Step Touch Controls & Playback */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Playback step buttons */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={() => {
              sound.click();
              onReset();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs sm:text-sm font-mono text-gray-300 hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
            title="Reset to beginning"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Previous Step */}
          <button
            onClick={() => {
              sound.click();
              onPrev();
            }}
            disabled={!canGoPrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs sm:text-sm font-mono text-gray-200 hover:bg-white/[0.08] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => {
              sound.click();
              onTogglePlay();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-md cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-black border border-amber-400 hover:bg-amber-400'
                : 'bg-sky-500 text-black border border-sky-400 hover:bg-sky-400'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Auto</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={() => {
              sound.click();
              onNext();
            }}
            disabled={!canGoNext}
            className="flex items-center gap-1 px-5 py-2.5 rounded-xl border border-white/[0.15] bg-white/[0.08] text-xs sm:text-sm font-mono text-white font-bold hover:bg-white/[0.14] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer ring-1 ring-white/10"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 bg-[#1a1e29] border border-white/[0.1] rounded-xl p-1">
          <span className="text-[11px] font-mono uppercase text-gray-400 px-2 hidden sm:inline">
            Speed:
          </span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => {
                sound.click();
                onChangeSpeed(s);
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                playbackSpeed === s
                  ? 'bg-sky-500 text-black font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Custom String Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151822] border border-white/[0.15] rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-400" />
                Custom Reference String
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-gray-400 hover:text-white text-sm font-mono px-2 py-1"
              >
                Cancel
              </button>
            </div>

            <p className="text-sm text-gray-300">
              Enter page reference sequence separated by spaces or commas (e.g.{' '}
              <code className="text-sky-300">7 0 1 2 0 3 0 4 2 3</code>):
            </p>

            <form onSubmit={handleApplyCustom} className="flex flex-col gap-3">
              <textarea
                value={customInputText}
                onChange={(e) => {
                  setCustomInputText(e.target.value);
                  setCustomError(null);
                }}
                rows={3}
                placeholder="7 0 1 2 0 3 0 4 2 3"
                className="w-full bg-[#0a0c10] border border-white/[0.15] rounded-xl p-3 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />

              {customError && (
                <div className="flex items-center gap-2 text-rose-400 text-xs font-mono bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{customError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-sm font-mono text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-500 text-black font-semibold text-sm hover:bg-sky-400 active:scale-95 transition-all"
                >
                  <Check className="w-4 h-4" />
                  Apply Reference String
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
