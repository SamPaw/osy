'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PresentationHeader } from './PresentationHeader';
import { PresentationFooter } from './PresentationFooter';
import { SlideDrawer, SLIDE_METADATA } from './SlideDrawer';
import { QRCodeModal } from './QRCodeModal';
import { StartupScreen } from './StartupScreen';
import { MobileLayout } from './MobileLayout';
import { sound } from '@/lib/sound';

// Slide components
import { SlideTitle } from './slides/SlideTitle';
import { SlideProblem } from './slides/SlideProblem';
import { SlidePageFault } from './slides/SlidePageFault';
import { SlideMemoryFrames } from './slides/SlideMemoryFrames';
import { SlideFIFOConcept } from './slides/SlideFIFOConcept';
import { SlideFIFOTakeaways } from './slides/SlideFIFOTakeaways';
import { SlideLRUConcept } from './slides/SlideLRUConcept';
import { SlideLRUTakeaways } from './slides/SlideLRUTakeaways';
import { SlideComparisonTable } from './slides/SlideComparisonTable';
import { SlideQuiz } from './slides/SlideQuiz';
import { SlideSummary } from './slides/SlideSummary';
import { AlgorithmSimulator } from './simulator/AlgorithmSimulator';
import { ComparisonVisualizer } from './simulator/ComparisonVisualizer';
import { BeladyAnomalyVisualizer } from './simulator/BeladyAnomalyVisualizer';

export function PresentationShell() {
  const [appMode, setAppMode] = useState<'STARTUP' | 'PRESENTATION' | 'MOBILE'>('STARTUP');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isSlideDrawerOpen, setIsSlideDrawerOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Auto-detect mobile screen on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobileScreen = window.innerWidth < 768;
      if (isMobileScreen) {
        // If opened directly on mobile (e.g. via QR code), show startup with option to start directly in mobile view
      }
    }
  }, []);

  const totalSlides = SLIDE_METADATA.length;
  const currentSlideInfo = SLIDE_METADATA[currentSlideIndex] || SLIDE_METADATA[0];

  // Fullscreen controller
  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Slide navigation
  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  }, [currentSlideIndex, totalSlides]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  }, [currentSlideIndex]);

  // Touch Swipe Gesture Detection for Smart Whiteboard
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Minimum swipe threshold (60px) and mostly horizontal
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        sound.click();
        goToNextSlide();
      } else {
        sound.click();
        goToPrevSlide();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in textareas or inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        sound.click();
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        sound.click();
        goToPrevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        sound.click();
        toggleFullscreen();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        sound.click();
        setIsQRModalOpen((p) => !p);
      } else if (e.key === 'Escape') {
        setIsSlideDrawerOpen(false);
        setIsQRModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, toggleFullscreen]);

  // Audio mute toggle
  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setIsMuted(!sound.enabled);
  };

  // Render startup waiting room screen
  if (appMode === 'STARTUP') {
    return (
      <StartupScreen
        onStartPresentation={() => setAppMode('PRESENTATION')}
        onOpenMobileView={() => setAppMode('MOBILE')}
      />
    );
  }

  // Render dedicated mobile mode
  if (appMode === 'MOBILE') {
    return (
      <>
        <MobileLayout
          onSwitchToPresentation={() => setAppMode('PRESENTATION')}
          onOpenQRModal={() => setIsQRModalOpen(true)}
        />
        <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
      </>
    );
  }

  // Render active slide component
  const renderSlideContent = () => {
    switch (currentSlideIndex) {
      case 0:
        return <SlideTitle onStartClick={goToNextSlide} />;
      case 1:
        return <SlideProblem />;
      case 2:
        return <SlidePageFault />;
      case 3:
        return <SlideMemoryFrames />;
      case 4:
        return <SlideFIFOConcept />;
      case 5:
        return <AlgorithmSimulator algorithm="FIFO" initialPresetId="basic-fifo" defaultFrames={3} />;
      case 6:
        return <SlideFIFOTakeaways />;
      case 7:
        return <SlideLRUConcept />;
      case 8:
        return <AlgorithmSimulator algorithm="LRU" initialPresetId="lru-locality" defaultFrames={3} />;
      case 9:
        return <SlideLRUTakeaways />;
      case 10:
        return <ComparisonVisualizer />;
      case 11:
        return <BeladyAnomalyVisualizer />;
      case 12:
        return <SlideComparisonTable />;
      case 13:
        return <SlideQuiz />;
      case 14:
        return (
          <SlideSummary
            onRestart={() => setCurrentSlideIndex(0)}
            onOpenPhoneModal={() => setIsQRModalOpen(true)}
            onJumpToSlide={(idx) => setCurrentSlideIndex(idx)}
          />
        );
      default:
        return <SlideTitle onStartClick={goToNextSlide} />;
    }
  };

  return (
    <div
      className="presentation-viewport bg-[#090a0f] text-gray-100 relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Header Navigation Bar */}
      <PresentationHeader
        currentSlideIndex={currentSlideIndex}
        totalSlides={totalSlides}
        slideTitle={currentSlideInfo.title}
        isFullscreen={isFullscreen}
        isMuted={isMuted}
        onToggleFullscreen={toggleFullscreen}
        onToggleSound={toggleSound}
        onOpenPhoneModal={() => setIsQRModalOpen(true)}
        onOpenSlideDrawer={() => setIsSlideDrawerOpen(true)}
      />

      {/* 2. Slide Content Area (Strict 100% Viewport, No Vertical Scrolling) */}
      <main className="flex-1 w-full overflow-hidden flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`slide-${currentSlideIndex}`}
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full h-full flex flex-col justify-center overflow-y-auto no-scrollbar"
          >
            {renderSlideContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer Controller */}
      <PresentationFooter
        currentSlideIndex={currentSlideIndex}
        totalSlides={totalSlides}
        onPrevSlide={goToPrevSlide}
        onNextSlide={goToNextSlide}
        onOpenSlideDrawer={() => setIsSlideDrawerOpen(true)}
      />

      {/* 4. Slide Drawer Modal */}
      <SlideDrawer
        isOpen={isSlideDrawerOpen}
        currentSlide={currentSlideIndex}
        onSelectSlide={(idx) => setCurrentSlideIndex(idx)}
        onClose={() => setIsSlideDrawerOpen(false)}
      />

      {/* 5. Phone View QR Modal */}
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
}
