import React from 'react';
import type { RKDocument } from '../types/document';

interface RunningFooterProps {
  doc: RKDocument;
  pageNum?: number;
  totalPages?: number;
}

export const RunningFooter: React.FC<RunningFooterProps> = ({ 
  doc, 
  pageNum = 1, 
  totalPages = 1 
}) => {
  const { footerPreset, footerConfig, subject, className, chapterNumber, headerConfig } = doc;

  if (footerPreset === 'none') {
    return null;
  }

  // Preset 1: Hallmark Official (Matches print-hallmark in notes.html)
  if (footerPreset === 'hallmark-official') {
    return (
      <footer className="hallmark-footer mt-auto pt-2.5 border-t border-[#cbd5e1] text-[10.5px] text-slate-500 font-medium flex items-center justify-between font-heading select-none">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0f3457] uppercase tracking-wide">
            {headerConfig.instituteName}
          </span>
          <span className="text-slate-300">•</span>
          <span>{className} {subject}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-mono text-[10px]">Helpline: {headerConfig.phone}</span>
        </div>

        {footerConfig.showPageNumbers && (
          <div className="text-right text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
            Page <span className="text-[#0f3457] font-bold">{pageNum}</span> of {totalPages}
          </div>
        )}
      </footer>
    );
  }

  // Preset 2: Dual Rule Internal Circulation
  if (footerPreset === 'dual-rule') {
    return (
      <footer className="dual-rule-footer mt-auto pt-2 border-t-2 border-slate-800 text-[10px] text-slate-600 flex items-center justify-between select-none">
        <div className="font-semibold uppercase tracking-wider text-slate-700">
          Strictly for Student Internal Circulation — {headerConfig.address || 'Swaroop Nagar, Delhi'}
        </div>
        {footerConfig.showPageNumbers && (
          <div className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
            [{pageNum} / {totalPages}]
          </div>
        )}
      </footer>
    );
  }

  // Preset 3: Minimal Badge
  if (footerPreset === 'minimal-badge') {
    return (
      <footer className="minimal-footer mt-auto pt-2 border-t border-slate-200 flex justify-center select-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] text-slate-500 font-medium">
          <span className="font-bold text-[#0f3457]">RK</span>
          <span>•</span>
          <span>{className} {subject} {chapterNumber}</span>
          {footerConfig.showPageNumbers && (
            <>
              <span>•</span>
              <span className="font-mono font-bold text-slate-700">P. {pageNum}/{totalPages}</span>
            </>
          )}
        </div>
      </footer>
    );
  }

  return null;
};
