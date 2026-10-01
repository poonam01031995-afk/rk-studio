import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { RKDocument, ContentBlock, BlockType } from '../types/document';
import { RunningHeader, PageRunningHeader } from './RunningHeader';
import { RunningFooter } from './RunningFooter';
import { Watermark } from './Watermark';
import { BlockWrapper, BLOCK_TYPE_LABELS } from './BlockWrapper';
import { CanvasViewportHUD } from './CanvasViewportHUD';

// Block View Components
import { HeroIntroBlockView } from './blocks/HeroIntroBlockView';
import { HeadingBlockView, ParagraphBlockView } from './blocks/HeadingBlockView';
import {
  BoxLeadView,
  BoxDefinitionView,
  BoxCautionView,
  BoxLifeExampleView,
  BoxCaseStudyView,
  BoxExamTipView,
  BoxFormulaView,
  BoxWorkedView,
  BoxActivityView,
  BoxSummaryView,
  BoxInstructionsView,
  HallmarkClosingView,
} from './blocks/BoxViews';
import {
  BulletListView,
  CardGrid3View,
  ComparisonVsView,
  TimelineStepsView,
  DataTableView,
  QuestionCardView,
  CompanionGridView,
  ImageBlockView,
  PageBreakView,
} from './blocks/ListAndLayoutViews';
import { Plus, FilePlus, Sparkles, FolderOpen, ClipboardPaste, FileText } from 'lucide-react';

interface A4CanvasProps {
  doc: RKDocument;
  zoomLevel: number;
  onZoomChange?: (newZoom: number) => void;
  viewMode: 'paged' | 'continuous';
  onViewModeChange?: (mode: 'paged' | 'continuous') => void;
  isFitToHeight?: boolean;
  onToggleFitToHeight?: () => void;
  onUpdateDocument: (updater: (prev: RKDocument) => RKDocument) => void;
  onInsertBlockAt: (index: number, type: BlockType) => void;
  onSelectHeader?: () => void;
  isHeaderSelected?: boolean;
  pendingInsertIndex: number | null;
  onTriggerInsertAt: (index: number) => void;
  onCancelPendingInsert: () => void;
  draggedBlockType: BlockType | null;
  onDropBlockAt: (index: number, type: BlockType) => void;
  selectedBlockIndex: number | null;
  onSelectBlock: (index: number, type: BlockType) => void;
  newlyInsertedBlockId: string | null;
  teachingMode?: 'teacher' | 'student';
  onOpenImporter?: () => void;
  onOpenTemplates?: () => void;
  onInsertCustomBlockAt?: (index: number, block: ContentBlock) => void;
}

export const A4Canvas: React.FC<A4CanvasProps> = ({
  doc,
  zoomLevel,
  onZoomChange,
  viewMode,
  onViewModeChange,
  isFitToHeight = true,
  onToggleFitToHeight,
  onUpdateDocument,
  onInsertBlockAt,
  onSelectHeader,
  isHeaderSelected = false,
  pendingInsertIndex,
  onTriggerInsertAt,
  onCancelPendingInsert,
  draggedBlockType,
  onDropBlockAt,
  selectedBlockIndex,
  onSelectBlock,
  newlyInsertedBlockId,
  teachingMode = 'teacher',
  onOpenImporter,
  onOpenTemplates,
  onInsertCustomBlockAt,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Dynamic Fit to Screen Height (Whole Page Mode)
  const calculateFitHeight = useCallback(() => {
    if (!containerRef.current || !onZoomChange) return;
    const availableHeight = containerRef.current.clientHeight - 48; // padding
    const targetPageHeight = 1152; // 1123 A4 + 26 label + 3 gap
    const fitZoom = Math.min(130, Math.max(40, Math.floor((availableHeight / targetPageHeight) * 100)));
    onZoomChange(fitZoom);
  }, [onZoomChange]);

  const handleFitWidth = useCallback(() => {
    if (!containerRef.current || !onZoomChange) return;
    const availableWidth = containerRef.current.clientWidth - 48;
    const targetWidth = 794;
    const fitZoom = Math.min(150, Math.max(40, Math.floor((availableWidth / targetWidth) * 100)));
    onZoomChange(fitZoom);
  }, [onZoomChange]);

  // Auto-resize observer when in Whole Page (Max Height) mode
  useEffect(() => {
    if (!isFitToHeight) return;
    calculateFitHeight();
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      calculateFitHeight();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isFitToHeight, calculateFitHeight]);

  // Scroll detection to update active page number
  const handleScroll = () => {
    if (!containerRef.current || viewMode !== 'paged') return;
    const containerTop = containerRef.current.scrollTop;
    const containerCenter = containerTop + containerRef.current.clientHeight / 2;

    let closestIndex = 0;
    let minDiff = Infinity;
    pageRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const top = ref.offsetTop;
      const diff = Math.abs(top - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
    setCurrentPage(closestIndex + 1);
  };

  const handlePageJump = (targetPageIdx: number) => {
    const targetRef = pageRefs.current[targetPageIdx];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(targetPageIdx + 1);
    }
  };

  // Move block up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    onUpdateDocument((prev) => {
      const newBlocks = [...prev.blocks];
      const temp = newBlocks[index - 1];
      newBlocks[index - 1] = newBlocks[index];
      newBlocks[index] = temp;
      return { ...prev, blocks: newBlocks };
    });
  };

  // Move block down
  const handleMoveDown = (index: number) => {
    if (index >= doc.blocks.length - 1) return;
    onUpdateDocument((prev) => {
      const newBlocks = [...prev.blocks];
      const temp = newBlocks[index + 1];
      newBlocks[index + 1] = newBlocks[index];
      newBlocks[index] = temp;
      return { ...prev, blocks: newBlocks };
    });
  };

  // Duplicate block
  const handleDuplicate = (index: number) => {
    onUpdateDocument((prev) => {
      const newBlocks = [...prev.blocks];
      const target = newBlocks[index];
      const cloned: ContentBlock = JSON.parse(JSON.stringify(target));
      cloned.id = `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      newBlocks.splice(index + 1, 0, cloned);
      return { ...prev, blocks: newBlocks };
    });
  };

  // Delete block
  const handleDelete = (index: number) => {
    onUpdateDocument((prev) => {
      const newBlocks = prev.blocks.filter((_, i) => i !== index);
      return { ...prev, blocks: newBlocks };
    });
  };

  // Update specific block
  const handleBlockChange = (index: number, updated: ContentBlock) => {
    onUpdateDocument((prev) => {
      const newBlocks = [...prev.blocks];
      newBlocks[index] = updated;
      return { ...prev, blocks: newBlocks };
    });
  };

  // Render block content based on type
  const renderBlockContent = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'hero-intro':
        return <HeroIntroBlockView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'heading':
        return <HeadingBlockView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'paragraph':
        return <ParagraphBlockView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'box-lead':
        return <BoxLeadView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'box-definition':
        return <BoxDefinitionView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'box-caution':
        return <BoxCautionView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'box-life-example':
        return <BoxLifeExampleView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'box-case-study':
        return <BoxCaseStudyView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'box-exam-tip':
        return <BoxExamTipView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'box-formula':
        return <BoxFormulaView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'box-worked':
        return <BoxWorkedView block={block} onChange={(b) => handleBlockChange(index, b)} teachingMode={teachingMode} />;
      case 'box-activity':
        return <BoxActivityView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'box-summary':
        return <BoxSummaryView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'box-instructions':
        return <BoxInstructionsView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'bullet-list':
        return <BulletListView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'card-grid-3':
        return <CardGrid3View block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'comparison-vs':
        return <ComparisonVsView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'timeline-steps':
        return <TimelineStepsView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'data-table':
        return <DataTableView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'question-card':
        return <QuestionCardView block={block} onChange={(b) => handleBlockChange(index, b)} teachingMode={teachingMode} />;
      case 'companion-grid':
        return <CompanionGridView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'image-block':
        return <ImageBlockView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      case 'page-break':
        return <PageBreakView block={block} />;
      case 'hallmark-closing':
        return <HallmarkClosingView block={block} onChange={(b) => handleBlockChange(index, b)} />;
      default:
        return null;
    }
  };

  // Split blocks into pages based on 'page-break' blocks for paged view mode
  const getPageChunks = () => {
    const chunks: { globalIndex: number; block: ContentBlock }[][] = [];
    let currentChunk: { globalIndex: number; block: ContentBlock }[] = [];

    doc.blocks.forEach((block, idx) => {
      if (block.type === 'page-break') {
        chunks.push(currentChunk);
        currentChunk = [];
      } else {
        currentChunk.push({ globalIndex: idx, block });
      }
    });

    chunks.push(currentChunk);
    return chunks;
  };

  const pageChunks = getPageChunks();
  const totalPages = Math.max(1, pageChunks.length);

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverIndex !== targetIndex) {
      setDragOverIndex(targetIndex);
    }
  };

  const handleDragLeave = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX >= rect.right ||
      e.clientY < rect.top ||
      e.clientY >= rect.bottom
    ) {
      if (dragOverIndex === targetIndex) {
        setDragOverIndex(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);

    // 1. Direct Image File Drop from Windows Explorer or Desktop
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl && onInsertCustomBlockAt) {
            onInsertCustomBlockAt(targetIndex, {
              id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              type: 'image-block',
              url: dataUrl,
              caption: file.name.replace(/\.[^/.]+$/, '') || 'Dropped Diagram / Image',
              alt: file.name,
              widthPercent: 90,
            });
          }
        };
        reader.readAsDataURL(file);
        return;
      }
    }

    let droppedType: BlockType | null = null;
    try {
      const raw = e.dataTransfer.getData('application/json');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.type === 'rk-new-block' && parsed.blockType) {
          droppedType = parsed.blockType;
        }
      }
    } catch {
      // fallback
    }

    if (!droppedType) {
      const plain = e.dataTransfer.getData('text/plain');
      if (plain) {
        droppedType = plain as BlockType;
      }
    }

    if (!droppedType && draggedBlockType) {
      droppedType = draggedBlockType;
    }

    if (droppedType) {
      onDropBlockAt(targetIndex, droppedType);
    }
  };

  const renderDropZone = (targetIndex: number, label?: string) => {
    const isPending = pendingInsertIndex === targetIndex;
    const isDragOver = dragOverIndex === targetIndex;
    const isDragging = draggedBlockType !== null;
    const blockLabel = draggedBlockType
      ? BLOCK_TYPE_LABELS[draggedBlockType] || draggedBlockType
      : 'Block';

    if (isDragOver) {
      return (
        <div
          onDragOver={(e) => handleDragOver(e, targetIndex)}
          onDragLeave={(e) => handleDragLeave(e, targetIndex)}
          onDrop={(e) => handleDrop(e, targetIndex)}
          className="no-print w-full py-3 my-1.5 rounded-xl border-2 border-dashed border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 ring-2 ring-blue-200/50 animate-pulse transition-all cursor-copy"
        >
          <Sparkles size={14} className="text-amber-500 animate-spin" />
          <span>--- Drop to insert {blockLabel} here ---</span>
        </div>
      );
    }

    if (isPending) {
      return (
        <div
          onDragOver={(e) => handleDragOver(e, targetIndex)}
          onDragLeave={(e) => handleDragLeave(e, targetIndex)}
          onDrop={(e) => handleDrop(e, targetIndex)}
          className="no-print my-2 p-2.5 rounded-lg bg-blue-50 border-2 border-dashed border-blue-300 text-blue-700 flex items-center justify-between text-xs font-semibold shadow-sm ring-1 ring-blue-300/40 animate-pulse"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-blue-800 font-bold">Active Insertion Point:</span>
            <span className="text-blue-600">Click any block in the sidebar to insert here</span>
          </div>
          <button
            onClick={onCancelPendingInsert}
            className="text-[11px] text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded bg-white hover:bg-stone-100 transition-colors border border-stone-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      );
    }

    if (isDragging) {
      return (
        <div
          onDragOver={(e) => handleDragOver(e, targetIndex)}
          onDragLeave={(e) => handleDragLeave(e, targetIndex)}
          onDrop={(e) => handleDrop(e, targetIndex)}
          className="no-print h-6 my-1 border-2 border-dashed border-blue-300/60 hover:border-blue-400 rounded-lg flex items-center justify-center transition-all bg-blue-50/40 hover:bg-blue-100/50 text-[10.5px] text-blue-600 font-semibold cursor-copy"
        >
          <span>+ Drop {label || 'block'} here</span>
        </div>
      );
    }

    return (
      <div
        onDragOver={(e) => handleDragOver(e, targetIndex)}
        onDragLeave={(e) => handleDragLeave(e, targetIndex)}
        onDrop={(e) => handleDrop(e, targetIndex)}
        className="no-print h-3 group/divider flex items-center justify-center relative my-0.5 z-20"
      >
        <div className="w-full h-px bg-transparent group-hover/divider:bg-blue-300 transition-colors" />
        <button
          onClick={() => onTriggerInsertAt(targetIndex)}
          className="opacity-0 group-hover/divider:opacity-100 transition-all duration-150 transform scale-95 group-hover/divider:scale-100 absolute bg-blue-600 hover:bg-blue-700 text-white rounded-full py-0.5 px-2.5 text-[10px] font-bold shadow-md cursor-pointer flex items-center gap-1 ring-2 ring-white"
          title="Insert block here (highlights in sidebar)"
        >
          <Plus size={11} />
          <span>Insert Block</span>
        </button>
      </div>
    );
  };

  const renderEmptyState = (targetIndex = 0) => (
    <div
      onDragOver={(e) => handleDragOver(e, targetIndex)}
      onDragLeave={(e) => handleDragLeave(e, targetIndex)}
      onDrop={(e) => handleDrop(e, targetIndex)}
      className="py-12 px-6 text-center border-2 border-dashed border-stone-300 hover:border-blue-400 bg-stone-50/70 rounded-2xl my-6 flex-1 flex flex-col items-center justify-center transition-all select-none"
    >
      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl mb-3 shadow-xs">
        📄
      </div>
      <div className="text-base font-extrabold text-slate-800 font-heading">
        Your study notes canvas is ready &amp; waiting (कोरा पृष्ठ)
      </div>
      <div className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
        Start fresh with your own content, paste raw outlines from your D:\ drive, or drag blocks from the library.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-6 w-full max-w-2xl text-left">
        <button
          onClick={() => onTriggerInsertAt(targetIndex)}
          className="p-3 bg-white hover:bg-blue-50 border border-stone-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all shadow-2xs group"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Plus size={14} />
          </div>
          <div className="font-bold text-xs text-slate-800">1. Add First Block</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Hero banner, heading or callout box</div>
        </button>

        <button
          onClick={onOpenImporter}
          className="p-3 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl cursor-pointer transition-all shadow-2xs group"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <FileText size={14} />
          </div>
          <div className="font-bold text-xs text-slate-800">2. Paste Raw Notes</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Auto-converts outlines &amp; MCQs</div>
        </button>

        <button
          onClick={() => {
            alert('Tip: Press Ctrl+V anywhere on this canvas to paste a screenshot directly, or drag an image file from your computer onto any drop zone!');
          }}
          className="p-3 bg-white hover:bg-purple-50 border border-stone-200 hover:border-purple-300 rounded-xl cursor-pointer transition-all shadow-2xs group"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <ClipboardPaste size={14} />
          </div>
          <div className="font-bold text-xs text-slate-800">3. Paste Screenshot</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Press Ctrl+V anywhere on canvas</div>
        </button>

        <button
          onClick={onOpenTemplates}
          className="p-3 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-xl cursor-pointer transition-all shadow-2xs group"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <FolderOpen size={14} />
          </div>
          <div className="font-bold text-xs text-slate-800">4. Use Blueprint</div>
          <div className="text-[10px] text-slate-500 mt-0.5">9 CBSE subject templates</div>
        </button>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="canvas-wrapper flex-1 overflow-y-auto bg-[#EEEDEA] flex flex-col items-center py-5 px-4 print:p-0 print:m-0 print:bg-white print:overflow-visible relative"
    >
      {/* Ambient Canvas Glow */}
      <div className="no-print absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-blue-100/20 blur-3xl pointer-events-none rounded-full" />

      {/* Sized container to avoid overflow/blank voids */}
      <div
        style={{
          width: `${794 * (zoomLevel / 100)}px`,
        }}
        className="relative flex flex-col items-center transition-all duration-150 ease-out"
      >
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-100 ease-out print:!transform-none flex flex-col items-center gap-8 print:gap-0 relative z-10 w-[794px]"
        >
          {/* Render either Paged A4 Sheets or Continuous View */}
          {viewMode === 'paged' ? (
            pageChunks.map((chunk, pageIndex) => (
              <div 
                key={`page-${pageIndex}`} 
                ref={(el) => { pageRefs.current[pageIndex] = el; }}
                className="flex flex-col items-center"
              >
                {/* Page Number Label (Screen only) */}
                <div className="no-print w-[794px] flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1.5 px-2">
                  <span className="flex items-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    <span className="text-slate-600 font-semibold tracking-wide">
                      A4 SHEET • PAGE {pageIndex + 1} OF {totalPages}
                    </span>
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    210 × 297 mm • Print Ready
                  </span>
                </div>

                {/* Physical A4 Sheet Container */}
                <div 
                  className="print-page-sheet w-[794px] min-h-[1123px] bg-white text-slate-900 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] rounded-xs p-[38px] relative select-text flex flex-col justify-between print:shadow-none print:p-0 print:w-full print:min-h-0 print:rounded-none print:break-after-page"
                >
                  {/* Faint Background Watermark */}
                  <Watermark 
                    show={doc.footerConfig.showWatermark} 
                    text={doc.footerConfig.watermarkText} 
                  />

                  {/* Page Content */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    {/* Page 1 gets primary header, subsequent pages get PageRunningHeader */}
                    {pageIndex === 0 ? (
                      <RunningHeader 
                        doc={doc} 
                        onUpdateDocument={onUpdateDocument}
                        onSelectHeader={onSelectHeader}
                        isSelected={isHeaderSelected}
                      />
                    ) : (
                      <PageRunningHeader 
                        doc={doc} 
                        pageNum={pageIndex + 1} 
                        onSelectHeader={onSelectHeader}
                        isSelected={isHeaderSelected}
                      />
                    )}

                    {/* Empty state for page 1 if no blocks */}
                    {chunk.length === 0 && pageIndex === 0 && renderEmptyState(0)}

                    {/* Page Blocks List */}
                    <div className="flex-1">
                      {chunk.length > 0 && renderDropZone(chunk[0].globalIndex, 'at start of page')}
                      {chunk.map(({ globalIndex, block }) => (
                        <React.Fragment key={block.id || globalIndex}>
                          <BlockWrapper
                            id={block.id}
                            type={block.type}
                            index={globalIndex}
                            totalBlocks={doc.blocks.length}
                            onMoveUp={() => handleMoveUp(globalIndex)}
                            onMoveDown={() => handleMoveDown(globalIndex)}
                            onDuplicate={() => handleDuplicate(globalIndex)}
                            onDelete={() => handleDelete(globalIndex)}
                            isSelected={selectedBlockIndex === globalIndex}
                            onSelect={() => onSelectBlock(globalIndex, block.type)}
                            isNewlyInserted={newlyInsertedBlockId === block.id}
                          >
                            {renderBlockContent(block, globalIndex)}
                          </BlockWrapper>

                          {renderDropZone(globalIndex + 1)}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Invariant Running Footer for this sheet */}
                    <RunningFooter doc={doc} pageNum={pageIndex + 1} totalPages={totalPages} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Continuous Canvas Mode */
            <div 
              id="print-canvas"
              className="w-[794px] min-h-[1123px] bg-white text-slate-900 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] rounded-xs p-[38px] relative select-text print:shadow-none print:p-0 print:w-full print:min-h-0 print:rounded-none flex flex-col justify-between"
            >
              <Watermark 
                show={doc.footerConfig.showWatermark} 
                text={doc.footerConfig.watermarkText} 
              />

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <RunningHeader 
                    doc={doc} 
                    onUpdateDocument={onUpdateDocument}
                    onSelectHeader={onSelectHeader}
                    isSelected={isHeaderSelected}
                  />

                  {doc.blocks.length === 0 ? (
                    renderEmptyState(0)
                  ) : (
                    <div>
                      {renderDropZone(0, 'at top of document')}
                      {doc.blocks.map((block, idx) => (
                        <React.Fragment key={block.id || idx}>
                          <BlockWrapper
                            id={block.id}
                            type={block.type}
                            index={idx}
                            totalBlocks={doc.blocks.length}
                            onMoveUp={() => handleMoveUp(idx)}
                            onMoveDown={() => handleMoveDown(idx)}
                            onDuplicate={() => handleDuplicate(idx)}
                            onDelete={() => handleDelete(idx)}
                            isSelected={selectedBlockIndex === idx}
                            onSelect={() => onSelectBlock(idx, block.type)}
                            isNewlyInserted={newlyInsertedBlockId === block.id}
                          >
                            {renderBlockContent(block, idx)}
                          </BlockWrapper>

                          {renderDropZone(idx + 1)}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                <RunningFooter doc={doc} pageNum={1} totalPages={1} />
              </div>
            </div>
          )}

          {/* Bottom Action Buttons (Screen only) */}
          <div className="no-print flex items-center gap-3 my-4">
            <button
              onClick={() => onTriggerInsertAt(doc.blocks.length)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
            >
              <Plus size={15} />
              <span>+ Add Block to End</span>
            </button>

            <button
              onClick={() => onInsertBlockAt(doc.blocks.length, 'page-break')}
              className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-slate-700 text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <FilePlus size={14} className="text-blue-600" />
              <span>+ Insert Page Break (नया पृष्ठ)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Canvas Viewport HUD (Whole Page, Zoom, Page Indicator, View Mode) */}
      {onZoomChange && onViewModeChange && (
        <CanvasViewportHUD
          zoomLevel={zoomLevel}
          onZoomChange={onZoomChange}
          isFitToHeight={!!isFitToHeight}
          onToggleFitToHeight={onToggleFitToHeight || (() => {})}
          onFitWidth={handleFitWidth}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageJump}
        />
      )}
    </div>
  );
};
