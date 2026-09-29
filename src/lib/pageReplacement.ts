export type AlgorithmType = 'FIFO' | 'LRU';

export interface FrameState {
  page: number | null;
  loadedAtStep: number;
  lastAccessedStep: number;
}

export interface SimulationStep {
  stepIndex: number; // 0-based index in reference string
  page: number; // current requested page
  frames: (number | null)[]; // snapshot of frames after this step
  isHit: boolean;
  hitIndex: number | null; // index of frame that had the hit
  evictedPage: number | null; // page that was removed, if any
  evictedFrameIndex: number | null; // frame index where eviction occurred
  insertedFrameIndex: number; // frame index where the page was placed
  fifoOrder: number[]; // pages in memory ordered by arrival (oldest first)
  lruRecency: { page: number; lastUsedAgo: number; frameIndex: number }[]; // ordered from least recently used to most recently used
  pageFaultCount: number;
  pageHitCount: number;
  faultRate: number; // 0 to 100
  hitRate: number; // 0 to 100
  explanation: {
    status: 'HIT' | 'FAULT_EMPTY' | 'FAULT_REPLACE';
    title: string;
    description: string;
    victimReason?: string;
  };
}

export interface SimulationResult {
  algorithm: AlgorithmType;
  referenceString: number[];
  frameCount: number;
  steps: SimulationStep[];
  totalFaults: number;
  totalHits: number;
  faultRate: number;
  hitRate: number;
}

/**
 * Parses user input string (e.g. "7, 0, 1, 2", "7 0 1 2") into array of positive integer page numbers.
 */
export function parseReferenceString(input: string): { pages: number[]; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { pages: [], error: 'Reference string cannot be empty.' };
  }

  // Split by spaces, commas, or semicolons
  const tokens = trimmed.split(/[\s,;]+/).filter(Boolean);
  const pages: number[] = [];

  for (const token of tokens) {
    const num = Number(token);
    if (!Number.isInteger(num) || num < 0 || num > 999) {
      return {
        pages: [],
        error: `Invalid page "${token}". Pages must be non-negative integers (0–999).`,
      };
    }
    pages.push(num);
  }

  if (pages.length === 0) {
    return { pages: [], error: 'Please enter at least one page number.' };
  }

  if (pages.length > 30) {
    return {
      pages: pages.slice(0, 30),
      error: 'Max 30 references supported for optimal display clarity. Truncated to 30.',
    };
  }

  return { pages, error: null };
}

/**
 * Run FIFO simulation step-by-step
 */
export function simulateFIFO(referenceString: number[], frameCount: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const frames: (number | null)[] = Array(frameCount).fill(null);
  
  // Track arrival order: array of pages currently in memory in order of arrival
  const arrivalQueue: number[] = [];
  // Also track which step a page was loaded
  const pageLoadedAt: Map<number, number> = new Map();

  let faultCount = 0;
  let hitCount = 0;

  for (let i = 0; i < referenceString.length; i++) {
    const currentPage = referenceString[i];
    const existingIndex = frames.indexOf(currentPage);

    let isHit = false;
    let hitIndex: number | null = null;
    let evictedPage: number | null = null;
    let evictedFrameIndex: number | null = null;
    let insertedFrameIndex = -1;
    let status: 'HIT' | 'FAULT_EMPTY' | 'FAULT_REPLACE' = 'HIT';
    let title = '';
    let description = '';
    let victimReason: string | undefined = undefined;

    if (existingIndex !== -1) {
      // PAGE HIT
      isHit = true;
      hitIndex = existingIndex;
      hitCount++;
      status = 'HIT';
      title = `Page ${currentPage} — Page Hit`;
      description = `Page ${currentPage} is already present in Frame ${existingIndex + 1}. No memory replacement needed. FIFO arrival order remains unchanged.`;
    } else {
      // PAGE FAULT
      faultCount++;
      const emptyIndex = frames.indexOf(null);

      if (emptyIndex !== -1) {
        // Empty frame available
        status = 'FAULT_EMPTY';
        frames[emptyIndex] = currentPage;
        arrivalQueue.push(currentPage);
        pageLoadedAt.set(currentPage, i);
        insertedFrameIndex = emptyIndex;
        title = `Page ${currentPage} — Page Fault (Empty Frame)`;
        description = `Page ${currentPage} is not in memory. Frame ${emptyIndex + 1} is empty, so Page ${currentPage} is allocated directly without evicting any page.`;
      } else {
        // Memory is full: Evict oldest page in arrivalQueue
        status = 'FAULT_REPLACE';
        evictedPage = arrivalQueue.shift()!;
        evictedFrameIndex = frames.indexOf(evictedPage);
        frames[evictedFrameIndex] = currentPage;
        arrivalQueue.push(currentPage);
        pageLoadedAt.set(currentPage, i);
        insertedFrameIndex = evictedFrameIndex;

        const loadedStep = pageLoadedAt.get(evictedPage) ?? 0;
        victimReason = `Page ${evictedPage} was loaded earliest (at step ${loadedStep + 1}), making it the oldest page in memory.`;
        title = `Page ${currentPage} — Page Fault (Replacement)`;
        description = `Page ${currentPage} is not in memory and all ${frameCount} frames are full. FIFO identifies Page ${evictedPage} as the oldest loaded page and evicts it from Frame ${evictedFrameIndex + 1}.`;
      }
    }

    const totalProcessed = i + 1;
    const faultRate = Math.round((faultCount / totalProcessed) * 100);
    const hitRate = Math.round((hitCount / totalProcessed) * 100);

    // Build FIFO queue representation
    const fifoOrder = [...arrivalQueue];

    // Dummy lru recency for structure compatibility
    const lruRecency = frames
      .map((p, fIdx) => (p !== null ? { page: p, lastUsedAgo: 0, frameIndex: fIdx } : null))
      .filter((x): x is { page: number; lastUsedAgo: number; frameIndex: number } => x !== null);

    steps.push({
      stepIndex: i,
      page: currentPage,
      frames: [...frames],
      isHit,
      hitIndex,
      evictedPage,
      evictedFrameIndex,
      insertedFrameIndex: isHit ? hitIndex! : insertedFrameIndex,
      fifoOrder,
      lruRecency,
      pageFaultCount: faultCount,
      pageHitCount: hitCount,
      faultRate,
      hitRate,
      explanation: {
        status,
        title,
        description,
        victimReason,
      },
    });
  }

  const total = referenceString.length;
  return {
    algorithm: 'FIFO',
    referenceString,
    frameCount,
    steps,
    totalFaults: faultCount,
    totalHits: hitCount,
    faultRate: total > 0 ? Math.round((faultCount / total) * 100) : 0,
    hitRate: total > 0 ? Math.round((hitCount / total) * 100) : 0,
  };
}

/**
 * Run LRU simulation step-by-step
 */
export function simulateLRU(referenceString: number[], frameCount: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const frames: (number | null)[] = Array(frameCount).fill(null);
  
  // Track last used step index for each page in memory
  const lastUsedStep: Map<number, number> = new Map();

  let faultCount = 0;
  let hitCount = 0;

  for (let i = 0; i < referenceString.length; i++) {
    const currentPage = referenceString[i];
    const existingIndex = frames.indexOf(currentPage);

    let isHit = false;
    let hitIndex: number | null = null;
    let evictedPage: number | null = null;
    let evictedFrameIndex: number | null = null;
    let insertedFrameIndex = -1;
    let status: 'HIT' | 'FAULT_EMPTY' | 'FAULT_REPLACE' = 'HIT';
    let title = '';
    let description = '';
    let victimReason: string | undefined = undefined;

    if (existingIndex !== -1) {
      // PAGE HIT
      isHit = true;
      hitIndex = existingIndex;
      hitCount++;
      status = 'HIT';
      
      const prevStep = lastUsedStep.get(currentPage);
      const ago = prevStep !== undefined ? i - prevStep : 0;
      lastUsedStep.set(currentPage, i);

      title = `Page ${currentPage} — Page Hit`;
      description = `Page ${currentPage} is already present in Frame ${existingIndex + 1}. Its recency timer is refreshed to step ${i + 1} (used ${ago} ${ago === 1 ? 'step' : 'steps'} ago). It becomes Most Recently Used (MRU).`;
    } else {
      // PAGE FAULT
      faultCount++;
      const emptyIndex = frames.indexOf(null);

      if (emptyIndex !== -1) {
        // Empty frame available
        status = 'FAULT_EMPTY';
        frames[emptyIndex] = currentPage;
        lastUsedStep.set(currentPage, i);
        insertedFrameIndex = emptyIndex;
        title = `Page ${currentPage} — Page Fault (Empty Frame)`;
        description = `Page ${currentPage} is not in memory. Frame ${emptyIndex + 1} is open, so Page ${currentPage} is loaded and marked as Most Recently Used.`;
      } else {
        // Memory is full: find page with minimum lastUsedStep
        status = 'FAULT_REPLACE';
        let oldestStep = Infinity;
        let lruPage: number | null = null;

        for (const page of frames) {
          if (page !== null) {
            const step = lastUsedStep.get(page) ?? -1;
            if (step < oldestStep) {
              oldestStep = step;
              lruPage = page;
            }
          }
        }

        evictedPage = lruPage!;
        evictedFrameIndex = frames.indexOf(evictedPage);
        frames[evictedFrameIndex] = currentPage;
        lastUsedStep.delete(evictedPage);
        lastUsedStep.set(currentPage, i);
        insertedFrameIndex = evictedFrameIndex;

        const stepsAgo = i - oldestStep;
        victimReason = `Page ${evictedPage} was last accessed at step ${oldestStep + 1} (${stepsAgo} ${stepsAgo === 1 ? 'step' : 'steps'} ago), making it the Least Recently Used page.`;
        title = `Page ${currentPage} — Page Fault (Replacement)`;
        description = `Page ${currentPage} is not in memory and all frames are full. LRU inspects access history and replaces Page ${evictedPage} in Frame ${evictedFrameIndex + 1} because it has been unused the longest.`;
      }
    }

    const totalProcessed = i + 1;
    const faultRate = Math.round((faultCount / totalProcessed) * 100);
    const hitRate = Math.round((hitCount / totalProcessed) * 100);

    // Sort active pages by lastUsedStep ascending (least recently used first -> most recently used last)
    const activePages = frames
      .map((p, fIdx) => {
        if (p === null) return null;
        const lastStep = lastUsedStep.get(p) ?? 0;
        return {
          page: p,
          lastStep,
          lastUsedAgo: i - lastStep,
          frameIndex: fIdx,
        };
      })
      .filter((x): x is { page: number; lastStep: number; lastUsedAgo: number; frameIndex: number } => x !== null)
      .sort((a, b) => a.lastStep - b.lastStep);

    steps.push({
      stepIndex: i,
      page: currentPage,
      frames: [...frames],
      isHit,
      hitIndex,
      evictedPage,
      evictedFrameIndex,
      insertedFrameIndex: isHit ? hitIndex! : insertedFrameIndex,
      fifoOrder: activePages.map((x) => x.page),
      lruRecency: activePages.map((x) => ({
        page: x.page,
        lastUsedAgo: x.lastUsedAgo,
        frameIndex: x.frameIndex,
      })),
      pageFaultCount: faultCount,
      pageHitCount: hitCount,
      faultRate,
      hitRate,
      explanation: {
        status,
        title,
        description,
        victimReason,
      },
    });
  }

  const total = referenceString.length;
  return {
    algorithm: 'LRU',
    referenceString,
    frameCount,
    steps,
    totalFaults: faultCount,
    totalHits: hitCount,
    faultRate: total > 0 ? Math.round((faultCount / total) * 100) : 0,
    hitRate: total > 0 ? Math.round((hitCount / total) * 100) : 0,
  };
}

/**
 * Built-in presets for teaching
 */
export interface Preset {
  id: string;
  name: string;
  description: string;
  referenceString: number[];
  recommendedFrames: number;
}

export const PRESETS: Preset[] = [
  {
    id: 'basic-fifo',
    name: 'Basic Beginner (7 0 1 2 0 3...)',
    description: 'Classic textbook sequence showing arrival-based eviction.',
    referenceString: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3],
    recommendedFrames: 3,
  },
  {
    id: 'lru-locality',
    name: 'Temporal Locality (LRU Advantage)',
    description: 'Frequently accessed working set where LRU achieves significantly fewer faults.',
    referenceString: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1],
    recommendedFrames: 3,
  },
  {
    id: 'divergence',
    name: 'FIFO vs LRU Divergence',
    description: 'Specific sequence where FIFO and LRU make visibly opposite eviction choices.',
    referenceString: [2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2],
    recommendedFrames: 3,
  },
  {
    id: 'belady-anomaly',
    name: "Belady's Anomaly (1 2 3 4 1 2 5...)",
    description: "The canonical sequence where 3 frames yields 9 faults, but 4 frames yields 10 faults!",
    referenceString: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5],
    recommendedFrames: 3,
  },
];
