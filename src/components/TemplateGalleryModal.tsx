import React, { useState } from 'react';
import { Search, X, BookOpen, Check, Sparkles } from 'lucide-react';
import type { RKDocument } from '../types/document';
import { ALL_TEMPLATES } from '../data/templates';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDocId: string;
  onSelectTemplate: (template: RKDocument) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  activeDocId,
  onSelectTemplate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  if (!isOpen) return null;

  const templatesList = Object.values(ALL_TEMPLATES);

  const filteredTemplates = templatesList.filter((tmpl) => {
    const matchesSubject = selectedSubject === 'All' || tmpl.subject === selectedSubject;
    const matchesSearch = 
      tmpl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const subjects = ['All', 'Economics', 'Polity', 'History', 'Geography', 'English', 'Physical Education', 'Science', 'Mathematics'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-800/40 backdrop-blur-sm p-4 select-none animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 flex items-center justify-center shadow-md">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight font-heading flex items-center gap-2">
                <span>RK Ready-Made Template Gallery</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  CBSE 2026-27 Curricula
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Official notes and assessment blueprints extracted from real RK Institute PDFs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-5 py-3 border-b border-stone-200 bg-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search templates, chapters, subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedSubject === subj
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-stone-200 hover:text-slate-800'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((tmpl) => {
            const isActive = activeDocId === tmpl.id;

            return (
              <div
                key={tmpl.id}
                onClick={() => {
                  onSelectTemplate(tmpl);
                  onClose();
                }}
                className={`group border rounded-xl p-4 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-50 border-blue-300 shadow-sm ring-1 ring-blue-300'
                    : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                        {tmpl.className}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {tmpl.subject}
                      </span>
                    </div>

                    {isActive && (
                      <span className="text-[10.5px] font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Check size={12} /> Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors font-heading mb-1">
                    {tmpl.chapterTitle}
                  </h3>

                  <p className="text-[11.5px] text-slate-500 leading-relaxed mb-3 line-clamp-2">
                    {tmpl.subtitle || tmpl.title}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {tmpl.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[9.5px] bg-stone-100 text-slate-500 px-1.5 py-0.5 rounded border border-stone-200 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {tmpl.blocks.length} Modular Blocks
                  </span>
                  <button className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                    <Sparkles size={12} /> Load Blueprint
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 px-5 flex items-center justify-between text-xs text-slate-500">
          <div>💡 Loading a template loads ready-made headers, footers, and modular blocks.</div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-slate-600 text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
