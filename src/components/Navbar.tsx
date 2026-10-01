import React, { useRef, useState, useEffect } from 'react';
import {
  Printer,
  Sliders,
  Download,
  Upload,
  FolderOpen,
  Code2,
  ChevronDown,
  RotateCcw,
  RotateCw,
  History,
  PanelLeftOpen,
  FilePlus2,
  Sparkles,
  Award,
  GraduationCap,
  HardDrive,
  Layers,
  FileText,
} from 'lucide-react';
import type { RKDocument } from '../types/document';

interface Props {
  currentDoc: RKDocument;
  onOpenTemplates: () => void;
  onNewBlankDoc?: () => void;
  onOpenImporter?: () => void;
  onOpenStamps?: () => void;
  teachingMode?: 'teacher' | 'student';
  onToggleTeachingMode?: () => void;
  onSaveToDiskDirect?: () => void;
  onOpenFromDiskDirect?: () => void;
  onOpenPrintGuide?: () => void;
  isSidebarOpen: boolean;
  isSidebarCollapsed?: boolean;
  onToggleSidebar: () => void;
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
  zoomLevel?: number;
  onZoomChange?: (newZoom: number) => void;
  viewMode?: 'paged' | 'continuous';
  onViewModeChange?: (mode: 'paged' | 'continuous') => void;
  onPrint: () => void;
  onExportHtml: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onOpenVersions?: () => void;
  versionCount?: number;
  onOpenInsertBlock?: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentDoc,
  onOpenTemplates,
  onNewBlankDoc,
  onOpenImporter,
  onOpenStamps,
  teachingMode = 'teacher',
  onToggleTeachingMode,
  onSaveToDiskDirect,
  onOpenFromDiskDirect,
  onOpenPrintGuide,
  isSidebarOpen,
  isSidebarCollapsed = false,
  onToggleSidebar,
  isSettingsOpen,
  onToggleSettings,
  onPrint,
  onExportHtml,
  onExportJson,
  onImportJson,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onOpenVersions,
  versionCount = 0,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const fileMenuRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target as Node)) {
        setIsFileMenuOpen(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="no-print h-13 shrink-0 bg-white border-b border-stone-200 px-3.5 flex items-center justify-between text-slate-800 select-none z-40 shadow-xs relative">
      {/* ── ZONE 1: BRAND & FILE MANAGEMENT MENU ── */}
      <div className="flex items-center gap-2">
        {/* Brand Crest */}
        <div className="flex items-center gap-2 pr-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0f3457] via-[#1a5c9c] to-[#2563eb] flex items-center justify-center shadow-xs border border-blue-400/30">
            <span className="font-heading font-black text-amber-300 text-[11px]">RK</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-[11px] font-extrabold tracking-tight font-heading text-slate-800 flex items-center gap-1.5 leading-none">
              <span>RK STUDIO</span>
              <span className="text-[8.5px] font-bold text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                PDF
              </span>
            </div>
          </div>
        </div>

        <div className="h-4 w-px bg-stone-200 mx-0.5" />

        {/* Unified "File ▾" Dropdown Menu */}
        <div className="relative" ref={fileMenuRef}>
          <button
            onClick={() => setIsFileMenuOpen((prev) => !prev)}
            className={`px-2.5 py-1.2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isFileMenuOpen
                ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-200'
            }`}
            title="File Management: Blank note, blueprints, importer, disk save/open, and version history"
          >
            <span className="font-bold">File</span>
            <ChevronDown size={12} className={`text-slate-500 transition-transform ${isFileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFileMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-stone-200 rounded-xl shadow-xl p-1.5 z-50 text-xs animate-fadeIn text-slate-700">
              {/* Blank Page */}
              {onNewBlankDoc && (
                <button
                  onClick={() => {
                    setIsFileMenuOpen(false);
                    onNewBlankDoc();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer text-slate-800"
                >
                  <FilePlus2 size={15} className="text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-bold">New Blank Note (कोरा पृष्ठ)</div>
                    <div className="text-[10px] text-slate-500">Start fresh with empty canvas</div>
                  </div>
                </button>
              )}

              {/* Blueprints / Templates */}
              <button
                onClick={() => {
                  setIsFileMenuOpen(false);
                  onOpenTemplates();
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer text-slate-800"
              >
                <FolderOpen size={15} className="text-blue-600 shrink-0" />
                <div className="flex-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>Subject Blueprints</span>
                    <span className="text-[9.5px] font-mono bg-blue-50 text-blue-600 px-1 rounded border border-blue-200">Ctrl+T</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Economics, Polity, History, Science (9 presets)</div>
                </div>
              </button>

              {/* Bulk Importer */}
              {onOpenImporter && (
                <button
                  onClick={() => {
                    setIsFileMenuOpen(false);
                    onOpenImporter();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer text-slate-800"
                >
                  <Sparkles size={15} className="text-amber-500 shrink-0" />
                  <div>
                    <div className="font-bold">Import Notes / Markdown</div>
                    <div className="text-[10px] text-slate-500">Auto-convert raw outlines &amp; MCQs to blocks</div>
                  </div>
                </button>
              )}

              {/* Stamps & Seals */}
              {onOpenStamps && (
                <button
                  onClick={() => {
                    setIsFileMenuOpen(false);
                    onOpenStamps();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer text-slate-800"
                >
                  <Award size={15} className="text-rose-500 shrink-0" />
                  <div>
                    <div className="font-bold">Stamps &amp; Seals Vault</div>
                    <div className="text-[10px] text-slate-500">CBSE PYQ Badges, Marks Grid, Sir's Signature</div>
                  </div>
                </button>
              )}

              <div className="h-px bg-stone-200 my-1" />

              {/* Save to disk */}
              {onSaveToDiskDirect && (
                <button
                  onClick={() => {
                    setIsFileMenuOpen(false);
                    onSaveToDiskDirect();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer text-slate-800"
                >
                  <HardDrive size={15} className="text-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold flex items-center justify-between">
                      <span>Save Project to Disk</span>
                      <span className="text-[9.5px] font-mono bg-stone-100 text-slate-500 px-1 rounded">.rkdoc</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Save directly to your D:\ notes folder</div>
                  </div>
                </button>
              )}

              {/* Open from disk */}
              <button
                onClick={() => {
                  setIsFileMenuOpen(false);
                  if (onOpenFromDiskDirect) {
                    onOpenFromDiskDirect();
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer text-slate-800"
              >
                <Upload size={15} className="text-purple-600 shrink-0" />
                <div>
                  <div className="font-bold">Open Project (.rkdoc)</div>
                  <div className="text-[10px] text-slate-500">Load existing document from computer</div>
                </div>
              </button>

              {/* Version History */}
              {onOpenVersions && (
                <button
                  onClick={() => {
                    setIsFileMenuOpen(false);
                    onOpenVersions();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer text-slate-800 border-t border-stone-100 mt-1"
                >
                  <History size={15} className="text-blue-500 shrink-0" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <div className="font-bold">Version History</div>
                      <div className="text-[10px] text-slate-500">Auto-saved snapshots &amp; restore points</div>
                    </div>
                    {versionCount > 0 && (
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.2 rounded-full font-bold">
                        {versionCount}
                      </span>
                    )}
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Minimalist Undo / Redo */}
        <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1 rounded hover:bg-stone-100 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1 rounded hover:bg-stone-100 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>

      {/* ── ZONE 2: DOCUMENT IDENTITY & LIVE STATUS (Breathing Center) ── */}
      <div className="hidden md:flex items-center gap-2 max-w-md text-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
          <span className="font-bold text-slate-800 tracking-tight">
            {currentDoc.subject || 'Custom'}
          </span>
          <span className="text-stone-300">/</span>
          <span className="text-slate-600 font-medium truncate max-w-[240px]">
            {currentDoc.chapterTitle || currentDoc.title || 'Untitled Note'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Auto-saved</span>
        </div>
      </div>

      {/* ── ZONE 3: ACTIONS, TEACHING MODE & EXPORT ── */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImportJson}
          accept=".json,.rkdoc"
          className="hidden"
        />

        {/* Component Library Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className={`px-2.5 py-1.2 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
            !isSidebarOpen
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 text-blue-700 border-blue-300 ring-1 ring-blue-200/50 shadow-2xs'
              : isSidebarCollapsed
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 shadow-2xs'
              : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-200'
          }`}
          title="Toggle 24 Academic Blocks Library (Ctrl+B)"
        >
          <div className="relative flex items-center justify-center">
            {!isSidebarOpen ? (
              <PanelLeftOpen size={14} className="text-blue-600 animate-pulse" />
            ) : isSidebarCollapsed ? (
              <PanelLeftOpen size={14} className="text-amber-600" />
            ) : (
              <Layers size={14} className="text-slate-600" />
            )}
          </div>
          <span className="hidden sm:inline font-medium">Library</span>
          <span className="text-[9px] font-mono bg-stone-100 text-slate-500 px-1 py-0.2 rounded border border-stone-200 hidden lg:inline">
            24
          </span>
        </button>

        {/* Student Mode vs Teacher Key Toggle */}
        {onToggleTeachingMode && (
          <button
            onClick={onToggleTeachingMode}
            className={`px-2.5 py-1.2 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              teachingMode === 'student'
                ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-1 ring-emerald-200'
            }`}
            title={
              teachingMode === 'student'
                ? 'Student Worksheet Mode (Solutions masked). Click to toggle to Teacher Key.'
                : 'Teacher Key Mode (Full solutions visible). Click to mask for Students.'
            }
          >
            <GraduationCap size={14} className={teachingMode === 'student' ? 'text-amber-600' : 'text-emerald-600'} />
            <span className="hidden sm:inline">
              {teachingMode === 'student' ? 'Student Mode' : 'Teacher Key'}
            </span>
          </button>
        )}

        {/* Header & Invariant Branding Drawer */}
        <button
          onClick={onToggleSettings}
          className={`p-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
            isSettingsOpen
              ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
              : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-200'
          }`}
          title="Page Setup, Header Templates & Invariant Branding"
        >
          <Sliders size={14} />
          <span className="hidden xl:inline text-xs">Settings</span>
        </button>

        <div className="h-4 w-px bg-stone-200 mx-0.5" />

        {/* Export / Share Dropdown */}
        <div className="relative" ref={exportMenuRef}>
          <button
            onClick={() => setIsExportMenuOpen((prev) => !prev)}
            className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-slate-700 px-2.5 py-1.2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            title="Export options: Standalone HTML or JSON"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown size={11} className="text-slate-500" />
          </button>

          {isExportMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-stone-200 rounded-xl shadow-xl p-1 z-50 text-xs animate-fadeIn text-slate-700">
              <button
                onClick={() => {
                  setIsExportMenuOpen(false);
                  onExportHtml();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-50 text-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <Code2 size={14} className="text-blue-500 shrink-0" />
                <div>
                  <div className="font-semibold">Standalone HTML</div>
                  <div className="text-[10px] text-slate-500">Opens in any browser with print styles</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsExportMenuOpen(false);
                  onExportJson();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-50 text-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <FileText size={14} className="text-emerald-500 shrink-0" />
                <div>
                  <div className="font-semibold">Download .rkdoc</div>
                  <div className="text-[10px] text-slate-500">Portable project file</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Primary CTA: Print PDF */}
        <button
          onClick={onOpenPrintGuide || onPrint}
          className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs px-3.5 py-1.4 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-blue-500/20 active:scale-98"
          title="Print or Save as Vector A4 PDF (Ctrl+P)"
        >
          <Printer size={14} />
          <span>Print PDF</span>
        </button>
      </div>
    </header>
  );
};
