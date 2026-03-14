# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at http://localhost:5173
npm run build     # tsc -b && vite build
npm run preview   # preview production build locally
```

No test runner is configured. There is no lint script.

To generate the OG image (requires puppeteer, already installed as devDependency):
```bash
node scripts/gen-og-image.mjs
```

## Architecture

Single-page app with no router. State is managed by a single custom hook (`useResumeStore`) passed as a `store` prop from `App.tsx` down to all editor components — there is no context or external state library.

**App flow:**
- `App.tsx` controls a `view` state (`'landing' | 'editor'`). Landing page shows on first load; editors show after "새로 작성하기" or JSON import.
- The editor panel is resizable via a mouse-drag divider. `editorWidth` state is managed in `App.tsx`.
- Left panel: tab-switched between `ResumeEditor` and `CareerDescEditor`.
- Right panel: `PreviewPanel` renders a live A4 preview that is also the PDF export target.

**Data layer (`src/store/resumeStore.ts`):**
- All resume data lives in a single `ResumeData` object in `useState`.
- Auto-saved to `localStorage` on every change via `useEffect` (key: `resume2pdf_data`).
- `startNew()` and `resetData()` both set `emptyData` and clear localStorage. `exportData()` downloads JSON; `importData(file)` reads JSON.
- `reorderArray<T>` is a generic splice-based helper used by all reorder functions.

**Two document types share the same `ResumeData`:**
1. **이력서** — rendered by `ResumePage.tsx` with automatic page splitting via `buildResumePages()` (height estimation per section). Sections that don't fit are pushed to a new `.a4-page` div. Page 2+ shows "이력서 (계속)" header.
2. **경력 기술서** — rendered by `CareerDescriptionPage.tsx` with automatic page splitting via height estimation in `buildPages()`.

**Rich text fields** (자기소개, 업무 내용, 프로젝트 설명, 주요 성과, 추가 항목 설명):
- Edited via `FormRichTextarea` (`contenteditable` div with a Bold button using `document.execCommand('bold')`).
- Values stored as raw HTML strings (may contain `<strong>` tags).
- Rendered in preview with `dangerouslySetInnerHTML` — do NOT use plain text rendering for these fields.

**PDF export (`src/utils/pdfExport.ts`):**
- `exportToPdf`: html2canvas (scale: 3, PNG) → jsPDF. Targets `.a4-page` elements inside the container.
- `printAsPdf`: calls `window.print()`. Print CSS in `index.css` handles page layout.

**Drag-and-drop reordering (`src/components/editor/DraggableList.tsx`):**
- HTML5 native DnD, no library. Works on all list sections in both editors.

**A4 dimensions:** 794px × 1123px at 96dpi.
