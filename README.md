# 📚 Academic PDF Creator — Professional A4 Notes & Assessment PDF Studio

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/KaTeX-Math%20Ready-00D084?style=for-the-badge&logo=latex&logoColor=white" alt="KaTeX" />
  <img src="https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge" alt="License" />
</p>

> **Academic PDF Creator** is a modern, high-craft WYSIWYG document composer and vector A4 PDF creator engineered specifically for teachers, tutors, and academic institutions (designed for **RK Institute**). Build publishing-grade study notes, CBSE test papers, and formula reference sheets with institutional branding, LaTeX equations, and 1-click answer masking.

---

## ✨ Highlights & Key Capabilities

### 📄 True-to-Scale A4 Multi-Page Canvas
* **Discrete A4 Sheets & Continuous Mode**: Preview exact A4 page splits ($210 \times 297\,\text{mm}$) with running headers, footers, and page counters (`Page 1 of N`), or toggle continuous document roll.
* **Whole Page (Max Height) View**: Automatically calculates the exact screen-fit zoom scale with a dynamic `ResizeObserver`, fitting 100% of the A4 page from top header to bottom footer on your monitor with zero vertical scrolling.
* **Floating Canvas Viewport HUD**: Unobtrusive frosted-glass HUD (bottom-right) with *Whole Page Fit*, *Fit Width*, *1:1 Actual Size*, zoom stepper, and page jump navigation.

### 👨‍🏫 Teacher Key vs. 🎓 Student Mode (1-Click Answer Masking)
* **Master Solution Key**: Complete worked answers, step-by-step solutions, and green explanation strips for teacher reference.
* **Student Worksheet**: With a single click, answers and explanations are masked, turning question cards into printed test papers with lined student working spaces.

### 📐 24 Modular Pedagogical Blocks
Structured into 6 specialized academic categories:
1. **Structure & Mastheads**: Chapter Hero Banner, Section Headings (H2/H3), Narrative Paragraphs, Page Breaks, and Institutional Closing Sign-off.
2. **NCERT Callout Boxes**: Formal Definition Box (`.def`), Exam Trap Alert (`.caution`), Real-life Example (`.example`), CBSE Case Study (`.case-study`), Topper Exam Tip (`.exam-tip`), Summary Revision (`.summary`), and Teacher Instructions.
3. **Interactive Math & LaTeX Formulae**: Live KaTeX formula cards with raw LaTeX editor, real-time preview, and quick math symbol chips ($\frac{a}{b}$, $\sqrt{x}$, $\Delta$, $\sum$, $\pi$, Multiplier $K = \frac{1}{1-MPC}$).
4. **Lists & Structured Comparisons**: Universal Bullet Lists, 3-Column Concept Cards, Side-by-Side Difference Comparison (`VS`), and Sequential Step Timelines.
5. **Assessment & Question Cards**: CBSE Exam Cards with marks weightage, syllabus year tags, MCQ options `(a)`–`(d)`, and lined student response spaces.
6. **Academic Tables & Media**: Data Tables with column editing, 2-Column Concept Split, and Diagram Figures with captions.

### 📋 Direct Clipboard Screenshot (`Ctrl+V`) & Explorer Drag-and-Drop
* Take a screenshot using `Win + Shift + S` and press `Ctrl+V` anywhere on the canvas to immediately create an image block at your working location.
* Drag and drop image files directly from Windows File Explorer into any canvas drop zone.

### 📥 Bulk Notes & Markdown Importer
* Paste raw text or Markdown notes from your drive.
* The smart parser automatically translates headings (`#`, `##`), callout quotes (`> Note:`, `> Caution:`), question patterns (`Q1.`, `Ans:`), and formula tags into structured, styled blocks.

### 🎖️ Institutional Stamp & Seal Vault
* One-click insertion of official seals: *CBSE Most Important PYQ*, *Topper Must-Know Concept*, *Exam Trap Alert*, *Checked by RK Sir (Signature & Date)*, and *Evaluation Marks Grid*.

### 💾 Local-First Persistence & Modern File System API
* Direct disk read/write (`.rkdoc` JSON files) using the modern **File System Access API** with zero upload latency.
* Auto-save caching in `localStorage` with version snapshots and restore points.
* Zero external server dependencies: vector print output via browser print pipeline (`Ctrl+P`).

### 🎛️ Expandable Sidebar with Drag-to-Reorder Pinned Items
* Click and drag the sidebar border to resize freely between $260\,\text{px}$ and $620\,\text{px}$ with 1-click presets ($S$, $M$, $L$).
* Content automatically reflows into 2–4 columns.
* Drag and drop your favorite pinned chips to reorder your workspace.

---

## 🚀 Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0 or newer recommended)
* `npm` or `pnpm` or `yarn`

### Installation
```bash
# Clone the repository
git clone https://github.com/Prabhu0077/academic-pdf-creator.git

# Navigate into project directory
cd academic-pdf-creator

# Install dependencies
npm install

# Start Vite local development server
npm run dev
```

Open your browser at `http://localhost:5173`.

### Production Build
```bash
# Type-check and generate minified production bundle in /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Architecture

```
academic-pdf-creator/
├── public/
│   └── rk-assets/               # Institutional seals, stamps, and logos
├── src/
│   ├── components/
│   │   ├── blocks/              # 24 Pedagogical block renderers
│   │   │   ├── BoxViews.tsx     # NCERT callouts, formulas, solutions
│   │   │   ├── HeadingBlockView.tsx
│   │   │   └── ListAndLayoutViews.tsx # Cards, tables, questions, diagrams
│   │   ├── A4Canvas.tsx         # WYSIWYG A4 multi-page sheet renderer
│   │   ├── BlockInserterSidebar.tsx # Resizable component library & pinned vault
│   │   ├── CanvasViewportHUD.tsx # Floating bottom zoom & whole-page HUD
│   │   ├── Navbar.tsx           # Streamlined 3-zone global command header
│   │   ├── HeaderFooterDrawer.tsx # Invariant branding & exam settings
│   │   ├── BulkNotesImporterModal.tsx # Text/Markdown notes converter
│   │   ├── AssetStampLibraryModal.tsx # Stamps & badges modal
│   │   └── MathRenderer.tsx     # KaTeX math rendering utilities
│   ├── data/
│   │   ├── templates.ts         # 9 Pre-configured CBSE subject blueprints
│   │   └── stampsAndAssets.ts   # Institutional stamp definitions
│   ├── types/
│   │   └── document.ts          # Core TypeScript document schemas
│   ├── utils/
│   │   ├── blockFactory.ts      # Default block generators
│   │   ├── fileSystemSync.ts    # File System Access API disk save/load
│   │   ├── rawNotesParser.ts    # Markdown-to-blocks parser
│   │   └── versionHistory.ts    # Snapshot revision manager
│   ├── App.tsx                  # Root studio orchestrator & state manager
│   ├── main.tsx                 # App entry point
│   └── index.css                # Tailwind CSS v4 & print stylesheet
├── package.json
└── vite.config.ts
```

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + B` | Toggle / Collapse Left Component Library |
| `Ctrl + K` | Open Quick Block Command Palette |
| `Ctrl + T` | Open Subject Templates & Blueprints Gallery |
| `Ctrl + P` | Print / Save Vector A4 PDF |
| `Ctrl + V` | Paste Clipboard Screenshot directly as image block |
| `Ctrl + Z` | Undo last edit |
| `Ctrl + Y` | Redo |

---

## 🖨️ PDF Export & Printing Recommendations

To produce crisp, borderless A4 study notes:
1. In **Academic PDF Creator**, click **Print PDF** (or press `Ctrl+P`).
2. In your browser's Print dialog:
   * **Destination**: *Save as PDF*
   * **Paper Size**: *A4*
   * **Margins**: *None* (or *Custom: 0*)
   * **Options**: Check **Background graphics** ✅

---

## 📜 License

Distributed under the **MIT License**. Free for personal, educational, and institutional use.

---

<p align="center">
  Crafted with precision for <b>RK Institute of Learning</b> • Designed for excellence in academic publishing.
</p>
