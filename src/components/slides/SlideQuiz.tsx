'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '@/lib/sound';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  title: string;
  scenario: string;
  currentMemory: number[];
  historyDescription: string;
  nextReference: number;
  algorithm: 'FIFO' | 'LRU';
  options: {
    label: string;
    page: number;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'FIFO Replacement Challenge',
    scenario: 'A process with 3 physical frames has loaded pages in this arrival order:',
    currentMemory: [7, 0, 1],
    historyDescription: 'Page 7 arrived first at step 1, Page 0 at step 2, Page 1 at step 3.',
    nextReference: 2,
    algorithm: 'FIFO',
    options: [
      {
        label: 'Evict Page 7',
        page: 7,
        isCorrect: true,
        explanation:
          'Correct! FIFO removes the oldest loaded page. Page 7 arrived first, so it is the head of the arrival queue and must be replaced.',
      },
      {
        label: 'Evict Page 0',
        page: 0,
        isCorrect: false,
        explanation:
          'Incorrect. Page 0 arrived at step 2, which is newer than Page 7. FIFO always evicts the oldest page first.',
      },
      {
        label: 'Evict Page 1',
        page: 1,
        isCorrect: false,
        explanation:
          'Incorrect. Page 1 is the most recently loaded page (tail of queue). It is the newest page in memory.',
      },
    ],
  },
  {
    id: 2,
    title: 'LRU Recency Challenge',
    scenario: 'Memory frames hold pages [7, 0, 1]. The recent access sequence was:',
    currentMemory: [7, 0, 1],
    historyDescription: 'Page 7 was accessed 6 steps ago; Page 1 was accessed 3 steps ago; Page 0 was accessed 1 step ago.',
    nextReference: 4,
    algorithm: 'LRU',
    options: [
      {
        label: 'Evict Page 0',
        page: 0,
        isCorrect: false,
        explanation:
          'Incorrect. Page 0 was accessed just 1 step ago — it is the Most Recently Used (MRU) page!',
      },
      {
        label: 'Evict Page 1',
        page: 1,
        isCorrect: false,
        explanation:
          'Incorrect. Page 1 was accessed 3 steps ago. Page 7 has been idle longer (6 steps ago).',
      },
      {
        label: 'Evict Page 7',
        page: 7,
        isCorrect: true,
        explanation:
          'Correct! LRU evicts the page unaccessed for the longest duration. Page 7 was idle for 6 steps, making it the LRU victim.',
      },
    ],
  },
  {
    id: 3,
    title: 'Page Hit vs Fault Recognition',
    scenario: 'Physical frames currently hold pages [2, 0, 3].',
    currentMemory: [2, 0, 3],
    historyDescription: 'Next incoming page reference from CPU is Page 0.',
    nextReference: 0,
    algorithm: 'LRU',
    options: [
      {
        label: 'Page Fault: Evict Page 2',
        page: 2,
        isCorrect: false,
        explanation:
          'Incorrect. Page 0 is ALREADY loaded in memory frame 2! No page fault occurs.',
      },
      {
        label: 'Page Hit: No Eviction Needed',
        page: 0,
        isCorrect: true,
        explanation:
          'Correct! Since Page 0 is already present in memory, it is a PAGE HIT. Under LRU, Page 0’s recency timestamp is refreshed to current time.',
      },
      {
        label: 'Page Fault: Allocate Frame 4',
        page: 4,
        isCorrect: false,
        explanation:
          'Incorrect. Memory only has 3 frames and Page 0 is already present in frame 2.',
      },
    ],
  },
  {
    id: 4,
    title: "Belady's Anomaly Property",
    scenario: 'A system administrator increases memory from 3 frames to 4 frames.',
    currentMemory: [1, 2, 3, 4],
    historyDescription: 'Under which page replacement algorithm can total page faults INCREASE?',
    nextReference: 5,
    algorithm: 'FIFO',
    options: [
      {
        label: 'LRU only',
        page: 1,
        isCorrect: false,
        explanation:
          'Incorrect! LRU is a stack algorithm (Mattson et al., 1970) and is mathematically guaranteed never to suffer from Belady’s Anomaly.',
      },
      {
        label: 'FIFO',
        page: 2,
        isCorrect: true,
        explanation:
          'Correct! FIFO is NOT a stack algorithm. In sequences such as 1 2 3 4 1 2 5..., 3 frames gives 9 faults while 4 frames gives 10 faults.',
      },
      {
        label: 'Neither algorithm',
        page: 3,
        isCorrect: false,
        explanation:
          'Incorrect. While intuitive logic suggests more RAM always reduces faults, FIFO exhibits Belady’s anomaly on specific reference patterns.',
      },
    ],
  },
];

export function SlideQuiz() {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const question = QUIZ_QUESTIONS[currentQIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOptionIndex !== null) return; // already answered
    setSelectedOptionIndex(index);
    const opt = question.options[index];

    if (opt.isCorrect) {
      sound.hit();
      setScore((s) => s + 1);
    } else {
      sound.fault();
    }
  };

  const handleNextQuestion = () => {
    sound.click();
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex((q) => q + 1);
      setSelectedOptionIndex(null);
    } else {
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // confetti fallback
      }
    }
  };

  const handleRestart = () => {
    sound.click();
    setCurrentQIndex(0);
    setSelectedOptionIndex(null);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-2xl">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
            Smart Whiteboard Challenge Complete
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            You Scored {score} / {QUIZ_QUESTIONS.length}!
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base font-normal">
            {score === QUIZ_QUESTIONS.length
              ? 'Flawless comprehension! You have mastered the core differences, eviction policies, and anomalies of FIFO and LRU.'
              : 'Great effort! Review the live comparison simulator or try again to achieve 100% mastery.'}
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 text-black font-mono font-bold text-sm hover:bg-sky-400 active:scale-95 shadow-xl transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Whiteboard Challenge</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between p-2 sm:p-4 max-w-4xl mx-auto w-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xs font-mono font-bold text-sky-400">
            {currentQIndex + 1}
          </span>
          <span className="text-sm sm:text-base font-bold text-white font-mono">
            {question.title}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-gray-400">
          <span>
            Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-emerald-400 font-bold">Score: {score}</span>
        </div>
      </div>

      {/* Scenario & Memory Snapshot */}
      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#12151d] border border-white/[0.08] shadow-lg">
        <p className="text-sm sm:text-base text-gray-200 font-normal">
          {question.scenario}
        </p>

        {/* Frames Visual */}
        <div className="flex items-center gap-3 py-1">
          <span className="text-xs font-mono uppercase text-gray-400">
            Memory:
          </span>
          <div className="flex items-center gap-2">
            {question.currentMemory.map((p, i) => (
              <div
                key={`mem-${i}`}
                className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.15] flex flex-col items-center justify-center"
              >
                <span className="text-[9px] font-mono text-gray-500">F{i + 1}</span>
                <span className="text-base font-bold font-mono text-white">{p}</span>
              </div>
            ))}
          </div>

          <ArrowRight className="w-5 h-5 text-gray-500 mx-2" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-sky-400">
              Incoming:
            </span>
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border-2 border-sky-400 flex flex-col items-center justify-center shadow-lg shadow-sky-500/20">
              <span className="text-[9px] font-mono text-sky-300">REQ</span>
              <span className="text-base font-bold font-mono text-sky-200">
                {question.nextReference}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-mono text-gray-400 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
          {question.historyDescription}
        </p>
      </div>

      {/* Interactive Options */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
          Select the correct outcome:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const hasAnswered = selectedOptionIndex !== null;

            let btnStyle =
              'bg-[#12151d] border-white/[0.1] text-gray-200 hover:border-white/[0.25] hover:bg-white/[0.04]';
            if (hasAnswered) {
              if (opt.isCorrect) {
                btnStyle =
                  'bg-emerald-500/20 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500/40';
              } else if (isSelected && !opt.isCorrect) {
                btnStyle =
                  'bg-rose-500/20 border-rose-400 text-rose-100 ring-2 ring-rose-500/40';
              } else {
                btnStyle = 'opacity-40 bg-[#12151d] border-white/[0.05] text-gray-500';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={hasAnswered}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between min-h-[90px] transition-all duration-200 active:scale-95 cursor-pointer shadow-md ${btnStyle}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-mono text-gray-400">
                    Option {idx + 1}
                  </span>
                  {hasAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {hasAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <span className="text-sm sm:text-base font-bold tracking-tight">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer feedback & Next button */}
      <AnimatePresence>
        {selectedOptionIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-lg ${
              question.options[selectedOptionIndex].isCorrect
                ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-950/25 border-rose-500/30 text-rose-200'
            }`}
          >
            <div className="text-xs sm:text-sm font-sans flex-1">
              <strong className="font-bold">
                {question.options[selectedOptionIndex].isCorrect ? 'Correct! ' : 'Incorrect. '}
              </strong>
              {question.options[selectedOptionIndex].explanation}
            </div>

            <button
              onClick={handleNextQuestion}
              className="flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-black font-mono font-bold text-xs sm:text-sm hover:bg-gray-200 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>{currentQIndex === QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
