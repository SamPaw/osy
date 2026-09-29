# Page Replacement Algorithms — FIFO vs LRU

An Apple-inspired, interactive educational storytelling web application designed for operating systems education, interactive smartboards, and synchronized mobile companion devices.

---

## ✨ Overview

This project reimagines computer science lectures by transforming abstract memory management algorithms into a tangible, physical, and interactive experience:

- **Touch & Smartboard-First**: Designed specifically for 16:9 large interactive classroom displays, touchboards, and mobile browsers.
- **Physical Memory Animations**: Pages visibly enter physical memory slots, victims slide out with momentum, and recency orders dynamically update.
- **Side-by-Side Face-Off**: Synchronously compare FIFO and LRU processing the identical reference string step by step to identify divergence points.
- **Belady's Anomaly Visualizer**: Step through the canonical sequence (`1 2 3 4 1 2 5 1 2 3 4 5`) to observe why 4 frames produces 10 page faults while 3 frames produces only 9 under FIFO.
- **Interactive Whiteboard Quiz**: Live scenario checks to test student intuition with instant interactive memory frame responses.
- **Dark Mode**: Integrated light and deep-space dark themes with automatic system preference detection and instant toggle.
- **Mobile Companion**: Scan the QR code on any smartphone to run simulations and follow along synchronously in class.

---

## 🔬 Algorithms Covered

### 1. FIFO (First-In, First-Out)
- Treats physical memory frames as an arrival queue.
- Evicts the page that has resided in memory the longest, regardless of access frequency.
- Demonstrates vulnerability to Belady's Anomaly.

### 2. LRU (Least Recently Used)
- Treats physical memory frames as a cache with access locality.
- Tracks recency timestamps or stack positions to evict the page unreferenced for the longest duration.
- Belongs to the class of *Stack Algorithms* — mathematically immune to Belady's Anomaly.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Engine**: [qrcode.react](https://github.com/zpao/qrcode.react)
- **Audio Feedback**: Web Audio API synthesized procedural sound effects

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or later
- npm, pnpm, yarn, or bun

### Installation

```bash
git clone https://github.com/gandhaarjoshi412/osy.git
cd osy
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## ⌨️ Controls & Shortcuts

| Key / Gesture | Action |
| :--- | :--- |
| **Space** / **Arrow Down** | Advance to the interactive storytelling canvas |
| **F** | Toggle Fullscreen (recommended for smartboards) |
| **P** | Open Classroom Mobile QR Code modal |
| **Esc** | Close QR Code modal |
| **Theme Button (Sun/Moon)** | Toggle between Light and Dark themes |

---

## 📄 License

MIT License. Designed for educators, students, and engineers.
