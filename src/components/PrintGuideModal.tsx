import React from 'react';
import { X, Printer, CheckCircle2, AlertCircle, FileText, GraduationCap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProceedPrint: () => void;
  teachingMode: 'teacher' | 'student';
  onToggleTeachingMode: (mode: 'teacher' | 'student') => void;
}

export const PrintGuideModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onProceedPrint,
  teachingMode,
  onToggleTeachingMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Printer size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading">
                A4 Vector PDF &amp; Print Assistant
              </h2>
              <p className="text-[11px] text-slate-500">
                Optimize settings for crisp, physical A4 sheets and borderless printing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Print Edition Selector */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-800 text-[11.5px] block">
              Choose Print Edition:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onToggleTeachingMode('student')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2 ${
                  teachingMode === 'student'
                    ? 'bg-blue-50 border-blue-400 text-blue-900 ring-1 ring-blue-300'
                    : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-100'
                }`}
              >
                <GraduationCap size={16} className={teachingMode === 'student' ? 'text-blue-600' : 'text-slate-400'} />
                <div>
                  <div className="font-bold text-xs">Student Worksheet</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Answers &amp; solutions masked with blank lines</div>
                </div>
              </button>

              <button
                onClick={() => onToggleTeachingMode('teacher')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2 ${
                  teachingMode === 'teacher'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-300'
                    : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-100'
                }`}
              >
                <FileText size={16} className={teachingMode === 'teacher' ? 'text-emerald-600' : 'text-slate-400'} />
                <div>
                  <div className="font-bold text-xs">Teacher Key (पूर्ण हल)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Includes full explanations &amp; marking tips</div>
                </div>
              </button>
            </div>
          </div>

          {/* Browser Print Dialog Checklist */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 text-[11.5px] block">
              In the upcoming browser print dialog:
            </span>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Destination: <strong>Save as PDF</strong> (or physical printer)</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Paper size: <strong>A4</strong> (210 × 297 mm)</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Background graphics: <strong>Checked / ON</strong> (preserves headers &amp; boxes)</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Margins: <strong>Default</strong> or <strong>None</strong></span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px] flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0 text-blue-600" />
            <span>Interactive buttons, sidebars, and edit markers are automatically hidden in print output.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              onProceedPrint();
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>Open Print Dialog (Ctrl+P)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
