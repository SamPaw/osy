'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  AlgorithmType,
  simulateFIFO,
  simulateLRU,
  PRESETS,
  SimulationResult,
} from '@/lib/pageReplacement';
import { ReferenceTimeline } from './ReferenceTimeline';
import { MemoryFrames } from './MemoryFrames';
import { FIFOQueueVisualizer } from './FIFOQueueVisualizer';
import { LRURecencyVisualizer } from './LRURecencyVisualizer';
import { ExplanationPanel } from './ExplanationPanel';
import { SimulationMetrics } from './SimulationMetrics';
import { SimulationControls } from './SimulationControls';
import { sound } from '@/lib/sound';

interface AlgorithmSimulatorProps {
  algorithm: AlgorithmType;
  initialPresetId?: string;
  defaultFrames?: number;
  compact?: boolean;
  className?: string;
}

export function AlgorithmSimulator({
  algorithm,
  initialPresetId = 'basic-fifo',
  defaultFrames = 3,
  compact = false,
  className = '',
}: AlgorithmSimulatorProps) {
  const [selectedPresetId, setSelectedPresetId] = useState(initialPresetId);
  const [frameCount, setFrameCount] = useState(defaultFrames);

  const initialPreset = PRESETS.find((p) => p.id === initialPresetId) || PRESETS[0];
  const [referenceString, setReferenceString] = useState<number[]>(initialPreset.referenceString);

  // Current step index (-1 means not started, 0 to referenceString.length - 1)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Run simulation engine to produce immutable step array
  const simulationResult: SimulationResult = useMemo(() => {
    return algorithm === 'FIFO'
      ? simulateFIFO(referenceString, frameCount)
      : simulateLRU(referenceString, frameCount);
  }, [algorithm, referenceString, frameCount]);

  const currentStep =
    currentStepIndex >= 0 && currentStepIndex < simulationResult.steps.length
      ? simulationResult.steps[currentStepIndex]
      : null;

  // Sound triggering helper
  const triggerStepSound = useCallback((stepData: typeof currentStep) => {
    if (!stepData) return;
    if (stepData.isHit) {
      sound.hit();
    } else {
      if (stepData.evictedPage !== null) {
        sound.evict();
      } else {
        sound.fault();
      }
    }
  }, []);

  // Step navigation handlers
  const handleNext = useCallback(() => {
    if (currentStepIndex < referenceString.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const nextStepData = simulationResult.steps[nextIdx];
      triggerStepSound(nextStepData);
    } else {
      setIsPlaying(false);
    }
  }, [currentStepIndex, referenceString.length, simulationResult.steps, triggerStepSound]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      const prevStepData = simulationResult.steps[prevIdx];
      triggerStepSound(prevStepData);
    } else if (currentStepIndex === 0) {
      setCurrentStepIndex(-1);
    }
  }, [currentStepIndex, simulationResult.steps, triggerStepSound]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  }, []);

  const handleSelectStep = useCallback(
    (stepIndex: number) => {
      setCurrentStepIndex(stepIndex);
      const stepData = simulationResult.steps[stepIndex];
      triggerStepSound(stepData);
    },
    [simulationResult.steps, triggerStepSound]
  );

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(presetId);
      setReferenceString(preset.referenceString);
      setFrameCount(preset.recommendedFrames);
      handleReset();
    }
  };

  const handleApplyCustomString = (pages: number[]) => {
    setSelectedPresetId('custom');
    setReferenceString(pages);
    handleReset();
  };

  // Autoplay timer effect
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 1600 / playbackSpeed;
    const interval = setInterval(() => {
      if (!isPlayingRef.current) return;
      setCurrentStepIndex((prev) => {
        if (prev < referenceString.length - 1) {
          const next = prev + 1;
          const nextStep = simulationResult.steps[next];
          triggerStepSound(nextStep);
          return next;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, referenceString.length, simulationResult.steps, triggerStepSound]);

  return (
    <div className={`flex flex-col gap-3.5 w-full ${className}`}>
      {/* 1. Reference Timeline Scrubber */}
      <ReferenceTimeline
        referenceString={referenceString}
        currentStepIndex={currentStepIndex}
        steps={simulationResult.steps}
        onSelectStep={handleSelectStep}
      />

      {/* 2. Main Visualizer Grid: Memory Frames + Queue / Recency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Physical Memory Frames */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] shadow-lg flex flex-col justify-between">
          <MemoryFrames
            frameCount={frameCount}
            currentStep={currentStep}
            algorithm={algorithm}
            compact={compact}
          />
        </div>

        {/* Right: Algorithm Specific Queue / Recency Visualization */}
        <div className="lg:col-span-6">
          {algorithm === 'FIFO' ? (
            <FIFOQueueVisualizer currentStep={currentStep} />
          ) : (
            <LRURecencyVisualizer currentStep={currentStep} />
          )}
        </div>
      </div>

      {/* 3. Teacher Dynamic Explanation Panel */}
      <ExplanationPanel currentStep={currentStep} />

      {/* 4. Live Metric Cards */}
      <SimulationMetrics
        totalReferences={referenceString.length}
        currentStep={currentStep}
      />

      {/* 5. Smart Whiteboard Touch Controls */}
      <SimulationControls
        currentStepIndex={currentStepIndex}
        totalSteps={referenceString.length}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        frameCount={frameCount}
        selectedPresetId={selectedPresetId}
        referenceString={referenceString}
        onPrev={handlePrev}
        onNext={handleNext}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onReset={handleReset}
        onChangeSpeed={setPlaybackSpeed}
        onChangeFrameCount={(newFrames) => {
          setFrameCount(newFrames);
          handleReset();
        }}
        onSelectPreset={handleSelectPreset}
        onApplyCustomString={handleApplyCustomString}
      />
    </div>
  );
}
