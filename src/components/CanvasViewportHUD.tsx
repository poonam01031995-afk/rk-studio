import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Layers,
  ChevronLeft,
  ChevronRight,
  FoldVertical,
  RotateCcw,
} from 'lucide-react';

interface CanvasViewportHUDProps {
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  isFitToHeight: boolean;
  onToggleFitToHeight: () => void;
  onFitWidth?: () => void;
  viewMode: 'paged' | 'continuous';
  onViewModeChange: (mode: 'paged' | 'continuous') => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (pageIndex: number) => void;
}

export const CanvasViewportHUD: React.FC<CanvasViewportHUDProps> = ({
  zoomLevel,
  onZoomChange,
  isFitToHeight,
  onToggleFitToHeight,
  onFitWidth,
  viewMode,
  onViewModeChange,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  return (
    <div className="no-print fixed bottom-4 right-6 z-40 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-xl rounded-full px-2.5 py-1.5 text-xs text-slate-700 select-none ring-1 ring-stone-300/40 animate-fade-in transition-all">
      {/* Page Navigation Indicator (in paged mode) */}
      {viewMode === 'paged' && totalPages > 0 && (
        <>
          <div className="flex items-center gap-1 bg-stone-100/80 rounded-full px-2 py-0.5 border border-stone-200/80">
            <button
              onClick={() => onPageChange && onPageChange(Math.max(0, currentPage - 2))}
              disabled={currentPage <= 1}
              className="p-0.5 hover:bg-white rounded-full text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Previous Page (Page Up)"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="font-mono text-[11px] font-semibold text-slate-800 px-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange && onPageChange(Math.min(totalPages - 1, currentPage))}
              disabled={currentPage >= totalPages}
              className="p-0.5 hover:bg-white rounded-full text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Next Page (Page Down)"
            >
              <ChevronRight size={13} />
            </button>
          </div>
          <div className="h-4 w-px bg-stone-200 mx-0.5" />
        </>
      )}

      {/* Whole Page (Max Height) Mode Toggle */}
      <button
        onClick={onToggleFitToHeight}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-semibold transition-all cursor-pointer ${
          isFitToHeight
            ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-400'
            : 'hover:bg-stone-100 text-slate-700'
        }`}
        title="Fit Entire Page to Screen Height (Max Height — View the whole A4 page without vertical scrolling)"
      >
        <FoldVertical size={13} className={isFitToHeight ? 'text-white' : 'text-blue-600'} />
        <span>Whole Page</span>
        {isFitToHeight && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
        )}
      </button>

      {/* Fit Width button */}
      {onFitWidth && (
        <button
          onClick={onFitWidth}
          className="flex items-center gap-1 px-2 py-1 hover:bg-stone-100 rounded-full text-[11.5px] font-medium text-slate-600 transition-colors cursor-pointer"
          title="Fit Page Width to Canvas Window"
        >
          <Maximize2 size={12} className="text-slate-500" />
          <span className="hidden sm:inline">Fit Width</span>
        </button>
      )}

      {/* Actual 100% Size button */}
      {zoomLevel !== 100 && (
        <button
          onClick={() => onZoomChange(100)}
          className="p-1 hover:bg-stone-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Reset to 100% (Actual 1:1 Size)"
        >
          <RotateCcw size={12} />
        </button>
      )}

      <div className="h-4 w-px bg-stone-200 mx-0.5" />

      {/* Zoom Stepper */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onZoomChange(Math.max(40, zoomLevel - 5))}
          className="p-1 hover:bg-stone-100 text-slate-500 hover:text-slate-800 rounded-full cursor-pointer transition-colors"
          title="Zoom Out (-5%)"
        >
          <ZoomOut size={13} />
        </button>
        <span
          className="font-mono text-[11px] font-bold text-slate-700 min-w-[36px] text-center px-1"
          title={`Current Zoom: ${zoomLevel}%`}
        >
          {zoomLevel}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(150, zoomLevel + 5))}
          className="p-1 hover:bg-stone-100 text-slate-500 hover:text-slate-800 rounded-full cursor-pointer transition-colors"
          title="Zoom In (+5%)"
        >
          <ZoomIn size={13} />
        </button>
      </div>

      <div className="h-4 w-px bg-stone-200 mx-0.5" />

      {/* View Mode Toggle: Paged vs Continuous */}
      <div className="flex items-center bg-stone-100/90 rounded-full p-0.5 border border-stone-200/80">
        <button
          onClick={() => onViewModeChange('paged')}
          className={`px-2 py-0.5 text-[10.5px] font-semibold rounded-full cursor-pointer transition-all flex items-center gap-1 ${
            viewMode === 'paged'
              ? 'bg-white text-blue-600 shadow-2xs font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="A4 Paged Sheets View"
        >
          <FileText size={11} />
          <span>Paged</span>
        </button>
        <button
          onClick={() => onViewModeChange('continuous')}
          className={`px-2 py-0.5 text-[10.5px] font-semibold rounded-full cursor-pointer transition-all flex items-center gap-1 ${
            viewMode === 'continuous'
              ? 'bg-white text-blue-600 shadow-2xs font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Continuous Scroll Document View"
        >
          <Layers size={11} />
          <span>Scroll</span>
        </button>
      </div>
    </div>
  );
};
