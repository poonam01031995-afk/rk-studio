import React, { useState } from 'react';
import type { RKDocument } from '../types/document';
import { Sliders, BookmarkPlus, Sparkles, Check } from 'lucide-react';
import { saveHeaderTemplate } from '../utils/headerPresets';

interface RunningHeaderProps {
  doc: RKDocument;
  onUpdateDocument?: (updater: (prev: RKDocument) => RKDocument) => void;
  onSelectHeader?: () => void;
  isSelected?: boolean;
}

export const RunningHeader: React.FC<RunningHeaderProps> = ({
  doc,
  onUpdateDocument,
  onSelectHeader,
  isSelected = false,
}) => {
  const { headerPreset, headerConfig, subject, className, chapterNumber, chapterTitle } = doc;
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (headerPreset === 'none') {
    return (
      <div 
        onClick={onSelectHeader}
        className="no-print border border-dashed border-slate-300 rounded-lg p-3 mb-4 text-center text-xs text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer bg-slate-50/50"
      >
        <span>+ Header is currently hidden. Click to select preset and branding options.</span>
      </div>
    );
  }

  // Helper to update headerConfig
  const updateConfig = (key: keyof RKDocument['headerConfig'], value: any) => {
    if (!onUpdateDocument) return;
    onUpdateDocument((prev) => ({
      ...prev,
      headerConfig: {
        ...prev.headerConfig,
        [key]: value,
      },
    }));
  };

  // Helper to update doc meta
  const updateDocMeta = (key: 'className' | 'subject' | 'chapterNumber' | 'chapterTitle', value: string) => {
    if (!onUpdateDocument) return;
    onUpdateDocument((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newPresetName.trim()) return;

    saveHeaderTemplate(newPresetName.trim(), doc);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSavingPreset(false);
      setNewPresetName('');
    }, 1500);
  };

  const handleKeyDownSingleLine = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div 
      onClick={() => {
        onSelectHeader?.();
      }}
      className={`group/header relative transition-all duration-150 rounded-lg ${
        isSelected 
          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white' 
          : 'hover:ring-1 hover:ring-blue-400/50'
      }`}
    >
      {/* Floating Action Pill on Hover / Selection (Hidden in Print) */}
      <div className="no-print absolute -top-3.5 right-2 opacity-0 group-hover/header:opacity-100 transition-opacity duration-150 z-30 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 px-2 py-0.5 rounded-full shadow-lg text-[10.5px]">
        <span className="font-semibold text-blue-300 flex items-center gap-1">
          <Sparkles size={11} className="text-amber-400" />
          RK Invariant Header
        </span>
        <span className="text-slate-600">•</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectHeader?.();
          }}
          className="text-slate-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
          title="Open Header Options & Branding in Sidebar"
        >
          <Sliders size={11} className="text-blue-400" />
          <span>Sidebar Settings</span>
        </button>
        <span className="text-slate-600">•</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSavingPreset((prev) => !prev);
          }}
          className="text-amber-300 hover:text-amber-200 flex items-center gap-1 hover:underline cursor-pointer font-medium"
          title="Save this custom header as a reusable template"
        >
          <BookmarkPlus size={11} />
          <span>Save as Template</span>
        </button>
      </div>

      {/* Save Template Inline Modal */}
      {isSavingPreset && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="no-print absolute top-8 right-2 z-40 bg-[#0d121f] text-slate-100 border border-blue-500/40 rounded-xl p-3 shadow-2xl w-72 animate-fadeIn"
        >
          <div className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
            <BookmarkPlus size={14} className="text-amber-400" />
            <span>Save Header as Template</span>
          </div>
          <p className="text-[10px] text-slate-400 mb-2">
            Save current branding, logos, phones, and presets for future notes &amp; tests.
          </p>
          <form onSubmit={handleSavePreset} className="space-y-2">
            <input
              type="text"
              placeholder="e.g. RK Swaroop Nagar Mains 2026"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              autoFocus
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-400"
            />
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsSavingPreset(false)}
                className="px-2 py-1 text-[11px] text-slate-400 hover:text-white rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newPresetName.trim() || savedSuccess}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {savedSuccess ? (
                  <>
                    <Check size={12} className="text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Template</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preset 1: Official RK Crest & Helpline Masthead */}
      {headerPreset === 'official-crest' && (
        <header className="masthead border border-[#cfe0f2] rounded-lg bg-gradient-to-r from-[#f7fbff] to-[#eef5fc] p-3 mb-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-gradient-to-br from-[#0f3457] to-[#1a5c9c] p-0.5 shrink-0 flex items-center justify-center shadow-xs overflow-hidden">
              <img 
                src="/rk-assets/rk-logo.png" 
                alt="RK Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }} 
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 
                contentEditable
                suppressContentEditableWarning
                onKeyDown={handleKeyDownSingleLine}
                onBlur={(e) => updateConfig('instituteName', e.currentTarget.textContent || '')}
                className="text-lg font-bold tracking-tight text-[#0f3457] leading-tight font-heading outline-none focus:bg-blue-50/80 focus:ring-1 focus:ring-blue-400 rounded px-1 -mx-1"
                title="Click to edit Institute Name in-place"
              >
                {headerConfig.instituteName}
              </h1>
              <p 
                contentEditable
                suppressContentEditableWarning
                onKeyDown={handleKeyDownSingleLine}
                onBlur={(e) => updateConfig('tagline', e.currentTarget.textContent || '')}
                className="text-[11px] text-slate-500 font-medium outline-none focus:bg-blue-50/80 focus:ring-1 focus:ring-blue-400 rounded px-1 -mx-1"
                title="Click to edit Tagline in-place"
              >
                {headerConfig.tagline}
              </p>
              <div className="text-[12px] font-semibold text-[#1a5c9c] flex items-center gap-1.5 flex-wrap">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateDocMeta('className', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-blue-50/80 focus:ring-1 focus:ring-blue-400 rounded px-0.5"
                  title="Click to edit Class"
                >
                  {className}
                </span>
                <span>•</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateDocMeta('subject', (e.currentTarget.textContent || '') as any)}
                  className="outline-none focus:bg-blue-50/80 focus:ring-1 focus:ring-blue-400 rounded px-0.5"
                  title="Click to edit Subject"
                >
                  {subject}
                </span>
                <span>•</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateDocMeta('chapterNumber', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-blue-50/80 focus:ring-1 focus:ring-blue-400 rounded px-0.5"
                  title="Click to edit Chapter Number"
                >
                  {chapterNumber}
                </span>
                <span>:</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateDocMeta('chapterTitle', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-blue-50/80 focus:ring-1 focus:ring-blue-400 rounded px-0.5"
                  title="Click to edit Chapter Title"
                >
                  {chapterTitle}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0 bg-white border border-[#cfe0f2] rounded-md px-3 py-1.5 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Helpline &amp; Admission</div>
            <div className="text-sm font-extrabold text-[#0f3457] tracking-tight font-mono flex items-center justify-end gap-1">
              <span>📞</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onKeyDown={handleKeyDownSingleLine}
                onBlur={(e) => updateConfig('phone', e.currentTarget.textContent || '')}
                className="outline-none focus:bg-blue-50/80 focus:ring-1 focus:ring-blue-400 rounded px-0.5"
                title="Click to edit Helpline"
              >
                {headerConfig.phone}
              </span>
            </div>
          </div>
        </header>
      )}

      {/* Preset 2: Diagnostic Assessment Banner */}
      {headerPreset === 'assessment-banner' && (
        <header className="assessment-header border border-slate-300 rounded-lg bg-white p-3 mb-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <img 
                src="/rk-assets/rk-logo.png" 
                alt="RK Crest" 
                className="w-10 h-10 object-contain shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateConfig('instituteName', e.currentTarget.textContent || '')}
                  className="text-base font-extrabold text-[#0f3457] tracking-wide font-heading outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-400 rounded px-1 -mx-1"
                >
                  {headerConfig.instituteName}
                </div>
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateConfig('tagline', e.currentTarget.textContent || '')}
                  className="text-[10.5px] text-slate-500 italic outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-400 rounded px-1 -mx-1"
                >
                  {headerConfig.tagline}
                </div>
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateConfig('examSeries', e.currentTarget.textContent || '')}
                  className="text-[11px] font-bold text-amber-600 uppercase tracking-tight outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-400 rounded px-1 -mx-1"
                >
                  {headerConfig.examSeries || `${className} ${subject} Diagnostic Periodic Assessment`}
                </div>
              </div>
            </div>

            <div className="text-right bg-slate-50 border border-slate-200 rounded px-2.5 py-1 shrink-0">
              <div className="text-[9.5px] uppercase font-bold text-slate-400">FOR ENQUIRIES / DOUBTS</div>
              <div className="text-xs font-bold text-slate-800 font-mono flex items-center justify-end gap-1">
                <span className="text-pink-600 font-bold">📞</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateConfig('phone', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-400 rounded px-0.5"
                >
                  {headerConfig.phone}
                </span>
              </div>
            </div>
          </div>

          {headerConfig.studentFields && (
            <div className="grid grid-cols-4 gap-2 pt-2 text-[11px] text-slate-700 font-medium">
              <div className="border-b border-slate-300 pb-0.5">
                <span className="font-semibold text-slate-800">Student Name / नाम:</span>
              </div>
              <div className="border-b border-slate-300 pb-0.5">
                <span className="font-semibold text-slate-800">Roll No / अनुक्रमांक:</span>
              </div>
              <div className="border-b border-slate-300 pb-0.5 flex items-center gap-1">
                <span className="font-semibold text-slate-800">Marks / पूर्णांक:</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateConfig('marks', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-400 rounded px-1 font-bold text-slate-900"
                >
                  {headerConfig.marks}
                </span>
              </div>
              <div className="border-b border-slate-300 pb-0.5 flex items-center gap-1">
                <span className="font-semibold text-slate-800">Time / समय:</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateConfig('time', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-400 rounded px-1 font-bold text-slate-900"
                >
                  {headerConfig.time}
                </span>
              </div>
            </div>
          )}
        </header>
      )}

      {/* Preset 3: Modern Academic Navy Hero */}
      {headerPreset === 'modern-hero' && (
        <header className="modern-hero bg-gradient-to-r from-[#0d3559] via-[#17538c] to-[#1b6bb0] text-white rounded-lg p-3.5 mb-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xs border border-white/30 flex items-center justify-center font-bold text-amber-300 text-sm shrink-0">
                RK
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-wider font-semibold text-white/80 flex items-center gap-1 flex-wrap">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={handleKeyDownSingleLine}
                    onBlur={(e) => updateConfig('instituteName', e.currentTarget.textContent || '')}
                    className="outline-none focus:bg-white/20 rounded px-1"
                    title="Click to edit Institute Name"
                  >
                    {headerConfig.instituteName}
                  </span>
                  <span>•</span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={handleKeyDownSingleLine}
                    onBlur={(e) => updateDocMeta('className', e.currentTarget.textContent || '')}
                    className="outline-none focus:bg-white/20 rounded px-1"
                    title="Click to edit Class"
                  >
                    {className}
                  </span>
                </div>
                <div className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 flex-wrap">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={handleKeyDownSingleLine}
                    onBlur={(e) => updateDocMeta('subject', (e.currentTarget.textContent || '') as any)}
                    className="outline-none focus:bg-white/20 rounded px-1"
                    title="Click to edit Subject"
                  >
                    {subject}
                  </span>
                  <span>:</span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={handleKeyDownSingleLine}
                    onBlur={(e) => updateDocMeta('chapterTitle', e.currentTarget.textContent || '')}
                    className="outline-none focus:bg-white/20 rounded px-1"
                    title="Click to edit Chapter Title"
                  >
                    {chapterTitle}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-white/90 font-mono shrink-0">
              <span className="bg-white/15 px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                <span>📞</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateConfig('phone', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-white/30 rounded px-0.5"
                  title="Click to edit Helpline"
                >
                  {headerConfig.phone}
                </span>
              </span>
            </div>
          </div>
        </header>
      )}

      {/* Preset 4: English Writing Skills Formal Masthead */}
      {headerPreset === 'english-formal' && (
        <header className="english-formal-header border border-slate-300 rounded-lg bg-white p-3.5 mb-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img 
                src="/rk-assets/rk-logo.png" 
                alt="RK Logo" 
                className="w-11 h-11 object-contain shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateConfig('instituteName', e.currentTarget.textContent || '')}
                  className="text-base font-extrabold tracking-wider text-[#0f3457] font-heading outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-400 rounded px-1 -mx-1"
                  title="Click to edit Institute Name"
                >
                  {headerConfig.instituteName}
                </div>
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateConfig('tagline', e.currentTarget.textContent || '')}
                  className="text-xs font-bold text-slate-700 outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-400 rounded px-1 -mx-1"
                  title="Click to edit Tagline"
                >
                  {headerConfig.tagline || 'English Language & Literature • Secondary Curriculum (Session 2026–27)'}
                </div>
              </div>
            </div>
            <div className="text-right bg-slate-50 border border-slate-200 rounded px-2.5 py-1 shrink-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Student Resource</span>
              <span className="text-xs font-mono font-bold text-blue-900 inline-flex items-center gap-1">
                <span>📞</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateConfig('phone', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-blue-50 rounded px-0.5"
                  title="Click to edit Helpline"
                >
                  {headerConfig.phone}
                </span>
              </span>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-[11.5px] text-slate-600 font-medium">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-800">Module:</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onKeyDown={handleKeyDownSingleLine}
                onBlur={(e) => updateDocMeta('chapterNumber', e.currentTarget.textContent || '')}
                className="outline-none focus:bg-blue-50 rounded px-0.5"
                title="Click to edit Chapter Number"
              >
                {chapterNumber}
              </span>
              <span>:</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onKeyDown={handleKeyDownSingleLine}
                onBlur={(e) => updateDocMeta('chapterTitle', e.currentTarget.textContent || '')}
                className="outline-none focus:bg-blue-50 rounded px-0.5 font-semibold text-slate-800"
                title="Click to edit Chapter Title"
              >
                {chapterTitle}
              </span>
            </div>
            <div className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              CBSE Marking Scheme &amp; Model Formats
            </div>
          </div>
        </header>
      )}

      {/* Preset 5: Physical Education Section Bar */}
      {headerPreset === 'pe-bar' && (
        <header className="pe-bar border-l-4 border-[#0d9488] bg-[#f0fdfa] rounded-r-lg p-3 mb-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img 
              src="/rk-assets/rk-logo.png" 
              alt="RK Crest" 
              className="w-10 h-10 object-contain shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-[#115e59] uppercase tracking-wide font-heading flex items-center gap-1.5 flex-wrap">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateConfig('instituteName', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-teal-100 rounded px-1 -mx-1"
                  title="Click to edit Institute Name"
                >
                  {headerConfig.instituteName}
                </span>
                <span>•</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateDocMeta('subject', (e.currentTarget.textContent || '') as any)}
                  className="outline-none focus:bg-teal-100 rounded px-1 -mx-1"
                  title="Click to edit Subject"
                >
                  {subject}
                </span>
                <span className="text-[11px] font-normal lowercase tracking-normal text-teal-700">
                  (Physical Education)
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 flex-wrap">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateDocMeta('className', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-teal-100 rounded px-0.5"
                  title="Click to edit Class"
                >
                  {className}
                </span>
                <span>•</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateDocMeta('chapterNumber', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-teal-100 rounded px-0.5"
                  title="Click to edit Chapter Number"
                >
                  {chapterNumber}
                </span>
                <span>:</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDownSingleLine}
                  onBlur={(e) => updateDocMeta('chapterTitle', e.currentTarget.textContent || '')}
                  className="outline-none focus:bg-teal-100 rounded px-0.5"
                  title="Click to edit Chapter Title"
                >
                  {chapterTitle}
                </span>
                <span>— आम बोल-चाल की भाषा में संपूर्ण अध्ययन नोट्स</span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-mono bg-white border border-[#99f6e4] text-[#0f766e] px-2 py-1 rounded font-bold inline-flex items-center gap-1">
              <span>📞</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onKeyDown={handleKeyDownSingleLine}
                onBlur={(e) => updateConfig('phone', e.currentTarget.textContent || '')}
                className="outline-none focus:bg-teal-50 rounded px-0.5"
                title="Click to edit Helpline"
              >
                {headerConfig.phone}
              </span>
            </span>
          </div>
        </header>
      )}

      {/* Preset 6: Minimal Running Header */}
      {headerPreset === 'minimal-running' && (
        <header className="minimal-header flex items-center justify-between text-[11px] text-slate-500 border-b border-[#cfe0f2] pb-1.5 mb-4 font-heading">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span 
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDownSingleLine}
              onBlur={(e) => updateConfig('instituteName', e.currentTarget.textContent || '')}
              className="font-bold text-[#0f3457] tracking-wider uppercase text-[10px] bg-slate-100 px-1.5 py-0.5 rounded outline-none focus:bg-blue-50"
              title="Click to edit Institute Name"
            >
              {headerConfig.instituteName}
            </span>
            <span>•</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDownSingleLine}
              onBlur={(e) => updateDocMeta('className', e.currentTarget.textContent || '')}
              className="font-medium text-slate-600 outline-none focus:bg-blue-50 rounded px-0.5"
              title="Click to edit Class"
            >
              {className}
            </span>
            <span
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDownSingleLine}
              onBlur={(e) => updateDocMeta('subject', (e.currentTarget.textContent || '') as any)}
              className="font-medium text-slate-600 outline-none focus:bg-blue-50 rounded px-0.5"
              title="Click to edit Subject"
            >
              {subject}
            </span>
          </div>
          <div className="font-semibold text-[#1a5c9c] flex items-center gap-1 flex-wrap">
            <span
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDownSingleLine}
              onBlur={(e) => updateDocMeta('chapterNumber', e.currentTarget.textContent || '')}
              className="outline-none focus:bg-blue-50 rounded px-0.5"
              title="Click to edit Chapter Number"
            >
              {chapterNumber}
            </span>
            <span>:</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDownSingleLine}
              onBlur={(e) => updateDocMeta('chapterTitle', e.currentTarget.textContent || '')}
              className="outline-none focus:bg-blue-50 rounded px-0.5"
              title="Click to edit Chapter Title"
            >
              {chapterTitle}
            </span>
          </div>
        </header>
      )}

      {/* Preset 7: Custom Image Header Banner */}
      {headerPreset === 'custom-image' && (
        <header className="custom-image-header mb-4 rounded-lg overflow-hidden border border-slate-200 relative group">
          <img 
            src={headerConfig.customImageUrl || '/rk-assets/header_crop.png'} 
            alt="Institute Header Banner" 
            className="w-full h-auto object-cover block"
            onError={(e) => {
              // Fallback placeholder if image not found
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="120" viewBox="0 0 800 120"><rect width="800" height="120" fill="%230f3457"/><text x="50%" y="50%" fill="%23ffffff" font-size="20" font-family="sans-serif" text-anchor="middle" dy=".3em">RK INSTITUTE CUSTOM HEADER BANNER</text></svg>';
            }}
          />
          <div className="no-print absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectHeader?.();
              }}
              className="px-3 py-1 bg-white text-slate-900 text-xs font-bold rounded shadow-md cursor-pointer hover:bg-slate-100"
            >
              Configure Banner in Sidebar
            </button>
          </div>
        </header>
      )}
    </div>
  );
};

// Running Header specifically for subsequent pages (Page 2, Page 3...)
export const PageRunningHeader: React.FC<{ 
  doc: RKDocument; 
  pageNum: number;
  onSelectHeader?: () => void;
  isSelected?: boolean;
}> = ({ doc, pageNum, onSelectHeader, isSelected = false }) => {
  return (
    <div 
      onClick={onSelectHeader}
      className={`page-running-header flex items-center justify-between text-[10.5px] text-slate-500 border-b border-[#cbd5e1] pb-1 mb-3 pt-0 font-heading select-none cursor-pointer group/pagehdr transition-all rounded px-1 -mx-1 ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50/50' 
          : 'hover:bg-slate-50/80 hover:ring-1 hover:ring-blue-300'
      }`}
      title="Click to configure Header & Invariant Branding in sidebar"
    >
      <div className="flex items-center gap-1.5">
        <img src="/rk-assets/rk-logo.png" alt="RK Logo" className="w-4 h-4 object-contain inline-block" />
        <span className="font-bold text-[#0f3457] uppercase tracking-wide group-hover/pagehdr:text-blue-700">
          {doc.headerConfig.instituteName}
        </span>
        <span className="text-slate-300">•</span>
        <span className="font-medium text-slate-600">{doc.className} {doc.subject}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-700 font-semibold truncate max-w-xs">{doc.chapterTitle}</span>
        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
          P. {pageNum}
        </span>
      </div>
    </div>
  );
};
