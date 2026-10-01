import React, { useState, useRef } from 'react';
import type { RKDocument, HeaderPreset, FooterPreset, AccentTheme, SubjectPreset, SavedHeaderTemplate } from '../types/document';
import { Sliders, Check, Shield, BookmarkPlus, Trash2, Sparkles, Image, Palette, Upload } from 'lucide-react';
import {
  getSavedHeaderTemplates,
  saveHeaderTemplate,
  deleteHeaderTemplate,
  applyHeaderTemplateToDocument,
} from '../utils/headerPresets';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  doc: RKDocument;
  onUpdateDocument: (updater: (prev: RKDocument) => RKDocument) => void;
  isHeaderSelected?: boolean;
}

const HEADER_PRESET_OPTIONS: { id: HeaderPreset; label: string; desc: string }[] = [
  {
    id: 'official-crest',
    label: 'Official RK Crest & Masthead',
    desc: 'Crest logo, Swaroop Nagar address, Helpline: 7903952008 & Chapter tag',
  },
  {
    id: 'assessment-banner',
    label: 'Diagnostic Assessment Header',
    desc: 'Candidate Name, Roll No, Max Marks (80), Time limit (3 Hrs) grid',
  },
  {
    id: 'english-formal',
    label: 'English Writing Formal Masthead',
    desc: 'Secondary Curriculum 2026-27 English Language & Literature masthead',
  },
  {
    id: 'pe-bar',
    label: 'Physical Education Section Bar',
    desc: 'Teal border bar with sports module and conversational notes tag',
  },
  {
    id: 'modern-hero',
    label: 'Modern Academic Navy Hero',
    desc: 'Sleek navy gradient banner with breadcrumb hierarchy',
  },
  {
    id: 'minimal-running',
    label: 'Minimal Running Rule',
    desc: 'Single-line header with chapter on right and institute on left',
  },
  {
    id: 'custom-image',
    label: 'Custom Image Banner',
    desc: 'Uses custom graphic banner (e.g. header_crop.png)',
  },
  {
    id: 'none',
    label: 'None / Hidden',
    desc: 'No top header banner',
  },
];

const FOOTER_PRESET_OPTIONS: { id: FooterPreset; label: string; desc: string }[] = [
  {
    id: 'hallmark-official',
    label: 'RK Hallmark Official Footer',
    desc: 'Institute name, subject, Helpline 7903952008 & Page X of Y',
  },
  {
    id: 'dual-rule',
    label: 'Dual-Rule Internal Circulation',
    desc: 'Strictly for Student Internal Circulation - Swaroop Nagar',
  },
  {
    id: 'minimal-badge',
    label: 'Minimal Centered Badge',
    desc: 'Compact centered pill badge with page indicator',
  },
  {
    id: 'none',
    label: 'None / Hidden',
    desc: 'No footer',
  },
];

const ACCENT_THEMES: { id: AccentTheme; label: string; bg: string }[] = [
  { id: 'navy', label: 'RK Navy', bg: 'bg-[#0f3457]' },
  { id: 'blue', label: 'Royal Blue', bg: 'bg-[#1a5c9c]' },
  { id: 'emerald', label: 'Emerald Green', bg: 'bg-[#127048]' },
  { id: 'amber', label: 'Amber Gold', bg: 'bg-[#9a6a05]' },
  { id: 'crimson', label: 'Crimson Rose', bg: 'bg-[#a92d34]' },
  { id: 'purple', label: 'Imperial Purple', bg: 'bg-[#5d4595]' },
];

const SUBJECT_OPTIONS: SubjectPreset[] = [
  'Economics',
  'Polity',
  'History',
  'Geography',
  'English',
  'Physical Education',
  'Science',
  'Mathematics',
  'General Studies',
  'Custom',
];

export const HeaderFooterDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  doc,
  onUpdateDocument,
  isHeaderSelected = false,
}) => {
  const [userTab, setUserTab] = useState<'header' | 'footer' | 'palette'>('header');
  const activeTab = isHeaderSelected ? 'header' : userTab;
  const [savedTemplates, setSavedTemplates] = useState<SavedHeaderTemplate[]>(() => getSavedHeaderTemplates());
  const [newTemplateName, setNewTemplateName] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const fileUploadRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveCurrentAsTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;

    saveHeaderTemplate(newTemplateName.trim(), doc);
    setSavedTemplates(getSavedHeaderTemplates());
    setNewTemplateName('');
    setSaveSuccessMsg('Header template saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleApplyTemplate = (tmpl: SavedHeaderTemplate) => {
    onUpdateDocument((prev) => applyHeaderTemplateToDocument(tmpl, prev));
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHeaderTemplate(id);
    setSavedTemplates(getSavedHeaderTemplates());
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUpdateDocument((prev) => ({
          ...prev,
          headerConfig: {
            ...prev.headerConfig,
            customImageUrl: dataUrl,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <aside className="w-96 shrink-0 h-full bg-white border-l border-stone-200 flex flex-col z-30 select-none no-print overflow-hidden shadow-2xl">
      {/* Drawer Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5 font-heading">
              <Sliders size={16} className="text-blue-600" />
              Invariant Areas &amp; Branding
            </h2>
            <p className="text-[11px] text-slate-500">Fixed institutional headers, footers &amp; marks</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-stone-200 transition-colors text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setUserTab('header')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'header'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles size={13} className={activeTab === 'header' ? 'text-amber-300' : 'text-slate-500'} />
            <span>Header</span>
          </button>

          <button
            onClick={() => setUserTab('footer')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'footer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield size={13} />
            <span>Footer &amp; Mark</span>
          </button>

          <button
            onClick={() => setUserTab('palette')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'palette'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette size={13} />
            <span>Theme</span>
          </button>
        </div>
      </div>

      {/* Settings Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Active Selection Banner when opened from Canvas */}
        {isHeaderSelected && activeTab === 'header' && (
          <div className="bg-blue-50 border border-blue-300 rounded-xl p-3 flex items-center justify-between text-xs text-blue-800 shadow-sm ring-1 ring-blue-300/40 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-blue-900">Canvas Header Selected</span>
            </div>
            <span className="text-[10.5px] font-mono text-blue-600">Live Editing Active</span>
          </div>
        )}

        {/* =========================================================
            TAB 1: HEADER OPTIONS & BRANDING
           ========================================================= */}
        {activeTab === 'header' && (
          <>
            {/* 1. SAVED HEADER TEMPLATES SECTION */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Saved Header Templates</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {savedTemplates.length} Presets
                </span>
              </div>

              {/* Quick Apply List */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {savedTemplates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleApplyTemplate(t)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                      doc.headerPreset === t.preset && doc.headerConfig.instituteName === t.headerConfig.instituteName
                        ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                        : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50 hover:border-stone-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className={`text-xs font-semibold truncate flex items-center gap-1 ${
                        doc.headerPreset === t.preset && doc.headerConfig.instituteName === t.headerConfig.instituteName
                          ? 'text-white'
                          : 'group-hover:text-blue-700'
                      }`}>
                        <span>{t.name}</span>
                        {doc.headerPreset === t.preset && (
                          <span className="text-[9px] bg-blue-500 text-white px-1 rounded">Active</span>
                        )}
                      </div>
                      <div className={`text-[10px] truncate ${
                        doc.headerPreset === t.preset && doc.headerConfig.instituteName === t.headerConfig.instituteName
                          ? 'text-blue-100'
                          : 'text-slate-500'
                      }`}>
                        {t.headerConfig.instituteName} • {t.preset}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Apply
                      </span>
                      {t.id.startsWith('custom-header-') && (
                        <button
                          onClick={(e) => handleDeleteTemplate(t.id, e)}
                          title="Delete saved template"
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Current Header as Template Form */}
              <form onSubmit={handleSaveCurrentAsTemplate} className="pt-2 border-t border-blue-200">
                <div className="text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <BookmarkPlus size={12} className="text-amber-500" />
                  <span>Save Current Header as Preset:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Preset name (e.g. Swaroop Nagar Mains)"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded px-2 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400"
                  />
                  <button
                    type="submit"
                    disabled={!newTemplateName.trim()}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold rounded transition-colors cursor-pointer shrink-0"
                  >
                    Save
                  </button>
                </div>
                {saveSuccessMsg && (
                  <p className="text-[10.5px] text-emerald-600 mt-1 font-medium">{saveSuccessMsg}</p>
                )}
              </form>
            </div>

            {/* 2. Top Header Preset Picker */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Top Header Style Preset
              </label>
              <div className="space-y-1.5">
                {HEADER_PRESET_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onUpdateDocument((prev) => ({ ...prev, headerPreset: opt.id }))}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between ${
                      doc.headerPreset === opt.id
                        ? 'bg-blue-50/50 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                        : 'bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div className={`text-[10.5px] mt-0.5 ${doc.headerPreset === opt.id ? 'text-blue-700' : 'text-slate-500'}`}>{opt.desc}</div>
                    </div>
                    {doc.headerPreset === opt.id && (
                      <Check size={14} className="text-blue-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Image Banner Controls */}
            {doc.headerPreset === 'custom-image' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-2.5 animate-fadeIn">
                <div className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                  <Image size={14} className="text-amber-500" />
                  <span>Custom Image Header Configuration</span>
                </div>
                <p className="text-[10.5px] text-slate-600">
                  Provide an image URL or upload a local banner file:
                </p>
                <input
                  type="text"
                  placeholder="/rk-assets/header_crop.png or https://..."
                  value={doc.headerConfig.customImageUrl || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateDocument((prev) => ({
                      ...prev,
                      headerConfig: { ...prev.headerConfig, customImageUrl: val },
                    }));
                  }}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-400"
                />
                <input
                  type="file"
                  ref={fileUploadRef}
                  onChange={handleCustomImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileUploadRef.current?.click()}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-[11px] font-semibold text-white rounded cursor-pointer flex items-center gap-1"
                  >
                    <Upload size={12} />
                    <span>Upload Banner Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateDocument((prev) => ({
                        ...prev,
                        headerConfig: { ...prev.headerConfig, customImageUrl: '/rk-assets/header_crop.png' },
                      }));
                    }}
                    className="px-2 py-1 bg-white hover:bg-stone-100 text-[11px] text-slate-700 rounded cursor-pointer border border-stone-300"
                  >
                    Use Default Banner
                  </button>
                </div>
                {doc.headerConfig.customImageUrl && (
                  <div className="mt-2 rounded border border-stone-200 overflow-hidden max-h-24 bg-stone-100/40">
                    <img
                      src={doc.headerConfig.customImageUrl}
                      alt="Banner Preview"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 3. Institutional Branding Details */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Institutional Branding
              </label>

              <div>
                <div className="text-[11px] text-slate-500 mb-1">Institute Name:</div>
                <input
                  type="text"
                  value={doc.headerConfig.instituteName}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateDocument((prev) => ({
                      ...prev,
                      headerConfig: { ...prev.headerConfig, instituteName: val },
                    }));
                  }}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <div className="text-[11px] text-slate-500 mb-1">Tagline / Motto:</div>
                <input
                  type="text"
                  value={doc.headerConfig.tagline}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateDocument((prev) => ({
                      ...prev,
                      headerConfig: { ...prev.headerConfig, tagline: val },
                    }));
                  }}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[11px] text-slate-500 mb-1">Helpline Phone:</div>
                  <input
                    type="text"
                    value={doc.headerConfig.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateDocument((prev) => ({
                        ...prev,
                        headerConfig: { ...prev.headerConfig, phone: val },
                      }));
                    }}
                    className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 mb-1">Address / Center:</div>
                  <input
                    type="text"
                    value={doc.headerConfig.address}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateDocument((prev) => ({
                        ...prev,
                        headerConfig: { ...prev.headerConfig, address: val },
                      }));
                    }}
                    className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 mb-1">Exam Series / Sub-banner:</div>
                <input
                  type="text"
                  value={doc.headerConfig.examSeries}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateDocument((prev) => ({
                      ...prev,
                      headerConfig: { ...prev.headerConfig, examSeries: val },
                    }));
                  }}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* 4. Subject & Curriculum Meta */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Curriculum Metadata
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[11px] text-slate-500 mb-1">Class / Grade:</div>
                  <input
                    type="text"
                    value={doc.className}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateDocument((prev) => ({ ...prev, className: val }));
                    }}
                    className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 mb-1">Subject:</div>
                  <select
                    value={doc.subject}
                    onChange={(e) => {
                      const val = e.target.value as SubjectPreset;
                      onUpdateDocument((prev) => ({ ...prev, subject: val }));
                    }}
                    className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  >
                    {SUBJECT_OPTIONS.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 mb-1">Chapter Number:</div>
                <input
                  type="text"
                  value={doc.chapterNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateDocument((prev) => ({ ...prev, chapterNumber: val }));
                  }}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <div className="text-[11px] text-slate-500 mb-1">Chapter Title:</div>
                <input
                  type="text"
                  value={doc.chapterTitle}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateDocument((prev) => ({ ...prev, chapterTitle: val }));
                  }}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* 5. Diagnostic Assessment Fields */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Diagnostic Assessment Fields
                </label>
                <input
                  type="checkbox"
                  checked={doc.headerConfig.studentFields}
                  onChange={(e) => {
                    const val = e.target.checked;
                    onUpdateDocument((prev) => ({
                      ...prev,
                      headerConfig: { ...prev.headerConfig, studentFields: val },
                    }));
                  }}
                  className="rounded text-blue-600 cursor-pointer"
                />
              </div>

              {doc.headerConfig.studentFields && (
                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <div>
                    <div className="text-[10px] text-slate-500 mb-0.5">Total Marks:</div>
                    <input
                      type="text"
                      value={doc.headerConfig.marks}
                      onChange={(e) => {
                        const val = e.target.value;
                        onUpdateDocument((prev) => ({
                          ...prev,
                          headerConfig: { ...prev.headerConfig, marks: val },
                        }));
                      }}
                      className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 mb-0.5">Time Limit:</div>
                    <input
                      type="text"
                      value={doc.headerConfig.time}
                      onChange={(e) => {
                        const val = e.target.value;
                        onUpdateDocument((prev) => ({
                          ...prev,
                          headerConfig: { ...prev.headerConfig, time: val },
                        }));
                      }}
                      className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* =========================================================
            TAB 2: FOOTER & WATERMARK
           ========================================================= */}
        {activeTab === 'footer' && (
          <>
            {/* Running Footer Presets */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Running Footer Style Preset
              </label>
              <div className="space-y-1.5">
                {FOOTER_PRESET_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onUpdateDocument((prev) => ({ ...prev, footerPreset: opt.id }))}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between ${
                      doc.footerPreset === opt.id
                        ? 'bg-blue-50/50 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                        : 'bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div className={`text-[10.5px] mt-0.5 ${doc.footerPreset === opt.id ? 'text-blue-700' : 'text-slate-500'}`}>{opt.desc}</div>
                    </div>
                    {doc.footerPreset === opt.id && (
                      <Check size={14} className="text-blue-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Watermark */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} className="text-blue-600" />
                  <span>Document Watermark</span>
                </label>
                <input
                  type="checkbox"
                  checked={doc.footerConfig.showWatermark}
                  onChange={(e) => {
                    const val = e.target.checked;
                    onUpdateDocument((prev) => ({
                      ...prev,
                      footerConfig: { ...prev.footerConfig, showWatermark: val },
                    }));
                  }}
                  className="rounded text-blue-600 cursor-pointer"
                />
              </div>

              {doc.footerConfig.showWatermark && (
                <div>
                  <div className="text-[11px] text-slate-500 mb-1">Watermark Text:</div>
                  <input
                    type="text"
                    value={doc.footerConfig.watermarkText}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateDocument((prev) => ({
                        ...prev,
                        footerConfig: { ...prev.footerConfig, watermarkText: val },
                      }));
                    }}
                    className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-bold uppercase tracking-wider"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* =========================================================
            TAB 3: ACCENT PALETTE & THEME
           ========================================================= */}
        {activeTab === 'palette' && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Document Accent Palette
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ACCENT_THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => onUpdateDocument((prev) => ({ ...prev, accentTheme: th.id }))}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    doc.accentTheme === th.id
                      ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm ring-1 ring-blue-500/50'
                      : 'border-stone-200 bg-stone-50 text-slate-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full ${th.bg} shrink-0 ring-1 ring-white/20`} />
                    <span className="text-xs font-medium truncate">{th.label}</span>
                  </div>
                  {doc.accentTheme === th.id && <Check size={13} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
