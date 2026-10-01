import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { RKDocument, BlockType } from './types/document';
import { TEMPLATE_ECONOMICS } from './data/templates';
import { Navbar } from './components/Navbar';
import { BlockInserterSidebar } from './components/BlockInserterSidebar';
import { HeaderFooterDrawer } from './components/HeaderFooterDrawer';
import { A4Canvas } from './components/A4Canvas';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { BlockPickerPopover } from './components/BlockPickerPopover';
import { BulkNotesImporterModal } from './components/BulkNotesImporterModal';
import { AssetStampLibraryModal } from './components/AssetStampLibraryModal';
import { PrintGuideModal } from './components/PrintGuideModal';
import { PanelLeftOpen, Sparkles, ChevronRight } from 'lucide-react';
import { createDefaultBlock } from './utils/blockFactory';
import { exportDocumentToStandaloneHtml } from './utils/htmlExport';
import { getDocumentSnapshots, saveDocumentSnapshot } from './utils/versionHistory';
import { saveDocumentDirectToDisk, openDocumentDirectFromDisk } from './utils/fileSystemSync';
import type { ContentBlock } from './types/document';

const STORAGE_KEY = 'rk_docflow_active_doc';

export function App() {
  // Load saved document from localStorage or fallback to Economics template
  const [currentDoc, setCurrentDoc] = useState<RKDocument>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return TEMPLATE_ECONOMICS;
  });

  // Undo / Redo history state stack
  const [history, setHistory] = useState<RKDocument[]>([currentDoc]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isHistoryActionRef = useRef(false);

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('rk_docflow_sidebar_open');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('rk_docflow_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Sync sidebar open and collapse state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rk_docflow_sidebar_open', String(isSidebarOpen));
    } catch {
      // ignore
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    try {
      localStorage.setItem('rk_docflow_sidebar_collapsed', String(isSidebarCollapsed));
    } catch {
      // ignore
    }
  }, [isSidebarCollapsed]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [isStampsOpen, setIsStampsOpen] = useState(false);
  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState(false);
  const [teachingMode, setTeachingMode] = useState<'teacher' | 'student'>(() => {
    try {
      const saved = localStorage.getItem('rk_docflow_teaching_mode');
      return saved === 'student' ? 'student' : 'teacher';
    } catch {
      return 'teacher';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rk_docflow_teaching_mode', teachingMode);
    } catch {
      // ignore
    }
  }, [teachingMode]);

  const [isHeaderSelected, setIsHeaderSelected] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteInsertIndex, setPaletteInsertIndex] = useState(0);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [lastSelectedBlockType, setLastSelectedBlockType] = useState<BlockType>('heading');
  const [pendingInsertIndex, setPendingInsertIndex] = useState<number | null>(null);
  const [highlightedBlockType, setHighlightedBlockType] = useState<BlockType | null>(null);
  const [highlightTrigger, setHighlightTrigger] = useState(0);
  const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null);
  const [newlyInsertedBlockId, setNewlyInsertedBlockId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'paged' | 'continuous'>('paged');
  const [zoomLevel, setZoomLevel] = useState(72);
  const [isFitToHeight, setIsFitToHeight] = useState(true);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoomLevel(newZoom);
    setIsFitToHeight(false);
  }, []);

  const handleToggleFitToHeight = useCallback(() => {
    setIsFitToHeight((prev) => !prev);
  }, []);

  const [saveStatus, setSaveStatus] = useState<string>('All changes saved');
  const [versionCount, setVersionCount] = useState<number>(() => {
    try {
      const existing = getDocumentSnapshots();
      if (existing.length === 0) {
        saveDocumentSnapshot(currentDoc, 'Milestone Baseline: Initial Ready State');
        return 1;
      }
      return existing.length;
    } catch {
      return 0;
    }
  });

  // Auto-save to localStorage whenever currentDoc changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDoc));
      const timer = setTimeout(() => {
        setSaveStatus('Auto-saved to local cache');
        const clearTimer = setTimeout(() => setSaveStatus(''), 2500);
        return () => clearTimeout(clearTimer);
      }, 10);
      return () => clearTimeout(timer);
    } catch {
      const errTimer = setTimeout(() => setSaveStatus('Auto-save error'), 10);
      return () => clearTimeout(errTimer);
    }
  }, [currentDoc]);

  // Keep history stack updated on changes (unless coming from undo/redo)
  const pushToHistory = useCallback((doc: RKDocument) => {
    setHistory((prev) => {
      const truncated = prev.slice(0, historyIndex + 1);
      const nextStack = [...truncated, JSON.parse(JSON.stringify(doc))];
      // Keep last 40 states
      return nextStack.slice(-40);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 39));
  }, [historyIndex]);

  // Update document helper
  const handleUpdateDocument = useCallback((updater: (prev: RKDocument) => RKDocument) => {
    setCurrentDoc((prev) => {
      const next = updater(prev);
      if (!isHistoryActionRef.current) {
        pushToHistory(next);
      }
      return next;
    });
  }, [pushToHistory]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isHistoryActionRef.current = true;
      const targetIndex = historyIndex - 1;
      const targetDoc = history[targetIndex];
      setHistoryIndex(targetIndex);
      setCurrentDoc(JSON.parse(JSON.stringify(targetDoc)));
      setTimeout(() => {
        isHistoryActionRef.current = false;
      }, 50);
    }
  }, [historyIndex, history]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isHistoryActionRef.current = true;
      const targetIndex = historyIndex + 1;
      const targetDoc = history[targetIndex];
      setHistoryIndex(targetIndex);
      setCurrentDoc(JSON.parse(JSON.stringify(targetDoc)));
      setTimeout(() => {
        isHistoryActionRef.current = false;
      }, 50);
    }
  }, [historyIndex, history]);

  // Insert block at specific index and trigger glowing animation
  const handleInsertBlockAt = useCallback((index: number, type: BlockType) => {
    const newBlock = createDefaultBlock(type);
    handleUpdateDocument((prev) => {
      const newBlocks = [...prev.blocks];
      newBlocks.splice(index, 0, newBlock);
      return {
        ...prev,
        blocks: newBlocks,
      };
    });
    setNewlyInsertedBlockId(newBlock.id);
    setSelectedBlockIndex(index);
    setLastSelectedBlockType(type);
    setTimeout(() => {
      setNewlyInsertedBlockId((current) => (current === newBlock.id ? null : current));
    }, 2500);
  }, [handleUpdateDocument]);

  // User triggers insert block (from Navbar, Canvas dividers, or bottom add button)
  // Instead of popover: expands sidebar, sets pending index, highlights & scrolls to block
  const handleTriggerInsertBlock = useCallback((targetIndex?: number) => {
    setIsSidebarOpen(true);
    setIsSidebarCollapsed(false);
    const resolvedIndex =
      targetIndex !== undefined
        ? targetIndex
        : selectedBlockIndex !== null
        ? selectedBlockIndex + 1
        : currentDoc.blocks.length;
    setPendingInsertIndex(resolvedIndex);
    const typeToHighlight = lastSelectedBlockType || 'heading';
    setHighlightedBlockType(typeToHighlight);
    setHighlightTrigger((prev) => prev + 1);
  }, [selectedBlockIndex, currentDoc.blocks.length, lastSelectedBlockType]);

  // Cancel pending insertion point
  const handleCancelPendingInsert = useCallback(() => {
    setPendingInsertIndex(null);
    setHighlightedBlockType(null);
  }, []);

  // When user clicks a block in the sidebar:
  // If pendingInsertIndex is set, insert there; else append to bottom; then clear highlight & pending
  const handleSidebarAddBlock = useCallback((type: BlockType) => {
    const target = pendingInsertIndex !== null ? pendingInsertIndex : currentDoc.blocks.length;
    handleInsertBlockAt(target, type);
    setPendingInsertIndex(null);
    setHighlightedBlockType(null);
  }, [pendingInsertIndex, currentDoc.blocks.length, handleInsertBlockAt]);

  // When user selects / clicks a block on the canvas
  const handleSelectBlock = useCallback((index: number, type: BlockType) => {
    setSelectedBlockIndex(index);
    setLastSelectedBlockType(type);
  }, []);

  // When user drops a block from sidebar onto canvas drop zone
  const handleDropBlockAt = useCallback((index: number, type: BlockType) => {
    handleInsertBlockAt(index, type);
    setDraggedBlockType(null);
    setPendingInsertIndex(null);
    setHighlightedBlockType(null);
  }, [handleInsertBlockAt]);

  // Insert any custom block (e.g. pasted screenshot, stamp, or imported block)
  const handleInsertCustomBlockAt = useCallback((index: number, block: ContentBlock) => {
    handleUpdateDocument((prev) => {
      const newBlocks = [...prev.blocks];
      newBlocks.splice(index, 0, block);
      return { ...prev, blocks: newBlocks };
    });
    setNewlyInsertedBlockId(block.id);
    setSelectedBlockIndex(index);
    setSaveStatus(`Added ${block.type} block`);
  }, [handleUpdateDocument]);

  // Start fresh with a blank document (कोरा पृष्ठ)
  const handleNewBlankDoc = useCallback(() => {
    if (currentDoc.blocks.length > 0) {
      const confirmNew = window.confirm(
        'Start fresh with a blank note? Your current document is auto-saved in local cache and Version History.'
      );
      if (!confirmNew) return;
    }
    const blankDoc: RKDocument = {
      id: `doc-blank-${Date.now()}`,
      title: 'Untitled Study Note / New Document',
      subject: 'Custom',
      className: 'Class 10 / 12',
      chapterNumber: 'Chapter 1',
      chapterTitle: 'Topic / Chapter Title',
      subtitle: 'RK Institute Study Material & Notes',
      tags: ['Study Notes', 'CBSE 2026'],
      accentTheme: 'navy',
      headerPreset: 'official-crest',
      footerPreset: 'hallmark-official',
      headerConfig: {
        instituteName: 'RK INSTITUTE OF LEARNING',
        tagline: 'स्वरूप नगर, दिल्ली • गुणवत्तापूर्ण शिक्षा और संकल्प से सिद्धि',
        phone: '7903952008',
        address: 'स्वरूप नगर, कुशाल रोड, दिल्ली-110042',
        examSeries: 'CBSE BOARD REVISION SERIES 2026-27',
        studentFields: false,
        marks: '80',
        time: '3 Hours',
      },
      footerConfig: {
        footerText: 'RK INSTITUTE OF LEARNING • Swaroop Nagar, Delhi',
        showPageNumbers: true,
        showWatermark: true,
        watermarkText: 'RK INSTITUTE',
      },
      showClosingHallmark: false,
      blocks: [],
    };
    handleUpdateDocument(() => blankDoc);
    setIsHeaderSelected(false);
    setSelectedBlockIndex(null);
    setSaveStatus('Started fresh with blank canvas');
  }, [currentDoc.blocks.length, handleUpdateDocument]);

  // Import raw parsed blocks from BulkNotesImporterModal
  const handleImportRawBlocks = useCallback((newBlocks: ContentBlock[], replaceAll: boolean) => {
    handleUpdateDocument((prev) => {
      return {
        ...prev,
        blocks: replaceAll ? newBlocks : [...prev.blocks, ...newBlocks],
      };
    });
    setSaveStatus(`Imported ${newBlocks.length} blocks successfully`);
  }, [handleUpdateDocument]);

  // Save directly to disk using modern File System Access API
  const handleSaveToDiskDirect = useCallback(async () => {
    const res = await saveDocumentDirectToDisk(currentDoc);
    if (res.success) {
      setSaveStatus(`Saved to disk: ${res.filename}`);
    }
  }, [currentDoc]);

  // Open directly from disk using modern File System Access API
  const handleOpenFromDiskDirect = useCallback(async () => {
    const loaded = await openDocumentDirectFromDisk();
    if (loaded) {
      handleUpdateDocument(() => loaded);
      setSaveStatus(`Loaded document from disk: ${loaded.title}`);
    }
  }, [handleUpdateDocument]);

  // Global Clipboard Screenshot Paste (Ctrl+V anywhere on canvas)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't intercept if user is typing in an active text input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              if (dataUrl) {
                const targetIndex = pendingInsertIndex !== null 
                  ? pendingInsertIndex 
                  : selectedBlockIndex !== null 
                  ? selectedBlockIndex + 1 
                  : currentDoc.blocks.length;

                const imageBlock: ContentBlock = {
                  id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  type: 'image-block',
                  url: dataUrl,
                  caption: 'Pasted Screenshot / Diagram • Figure',
                  alt: 'Pasted Screenshot',
                  widthPercent: 90,
                };

                handleUpdateDocument((prev) => {
                  const newBlocks = [...prev.blocks];
                  newBlocks.splice(targetIndex, 0, imageBlock);
                  return { ...prev, blocks: newBlocks };
                });

                setNewlyInsertedBlockId(imageBlock.id);
                setPendingInsertIndex(null);
                setSaveStatus('📋 Screenshot pasted from clipboard into canvas!');
              }
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [pendingInsertIndex, selectedBlockIndex, currentDoc.blocks.length, handleUpdateDocument]);

  // Switch template
  const handleSelectTemplate = (template: RKDocument) => {
    const cloned: RKDocument = JSON.parse(JSON.stringify(template));
    cloned.id = `doc-${Date.now()}`;
    handleUpdateDocument(() => cloned);
    setIsHeaderSelected(false);
  };

  // Click on header on canvas -> select and automatically open Header & Branding Options in sidebar
  const handleSelectHeader = () => {
    setIsHeaderSelected(true);
    setIsSettingsOpen(true);
  };

  // Print PDF using native browser print engine with A4 CSS rules
  const handlePrint = () => {
    window.print();
  };

  // Export standalone HTML file
  const handleExportHtml = () => {
    exportDocumentToStandaloneHtml(currentDoc);
  };

  // Export JSON file (.rkdoc)
  const handleExportJson = useCallback(() => {
    const jsonStr = JSON.stringify(currentDoc, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDoc.title.replace(/[^a-zA-Z0-9_\u0900-\u097F-]/g, '_')}.rkdoc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentDoc]);

  // Import JSON file (.rkdoc / .json)
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.blocks && Array.isArray(parsed.blocks)) {
          handleUpdateDocument(() => parsed);
        } else {
          alert('Invalid RK Document format: missing blocks array.');
        }
      } catch {
        alert('Failed to parse document JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z (without Shift)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        // check if inside contentEditable or input
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          handleUndo();
        }
      } 
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          handleRedo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteInsertIndex(currentDoc.blocks.length);
        setIsPaletteOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleExportJson();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (!isSidebarOpen) {
          setIsSidebarOpen(true);
          setIsSidebarCollapsed(false);
        } else if (isSidebarCollapsed) {
          setIsSidebarCollapsed(false);
        } else {
          setIsSidebarOpen(false);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setIsTemplatesOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleExportJson, currentDoc.blocks.length, isSidebarOpen, isSidebarCollapsed]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#EEEDEA] text-slate-800 overflow-hidden font-sans">
      {/* Top Studio Navbar */}
      <Navbar
        currentDoc={currentDoc}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onNewBlankDoc={handleNewBlankDoc}
        onOpenImporter={() => setIsImporterOpen(true)}
        onOpenStamps={() => setIsStampsOpen(true)}
        teachingMode={teachingMode}
        onToggleTeachingMode={() => setTeachingMode((m) => (m === 'student' ? 'teacher' : 'student'))}
        onSaveToDiskDirect={handleSaveToDiskDirect}
        onOpenFromDiskDirect={handleOpenFromDiskDirect}
        onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
        isSidebarOpen={isSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => {
          if (!isSidebarOpen) {
            setIsSidebarOpen(true);
            setIsSidebarCollapsed(false);
          } else if (isSidebarCollapsed) {
            setIsSidebarCollapsed(false);
          } else {
            setIsSidebarOpen(false);
          }
        }}
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={() => {
          setIsSettingsOpen((prev) => !prev);
          if (isSettingsOpen) setIsHeaderSelected(false);
        }}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrint={handlePrint}
        onExportHtml={handleExportHtml}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenVersions={() => {
          setVersionCount(getDocumentSnapshots().length);
          setIsVersionsOpen(true);
        }}
        versionCount={versionCount}
        onOpenInsertBlock={() => {
          handleTriggerInsertBlock();
        }}
      />

      {/* Main Studio Body: Sidebar + A4 Canvas + Settings Drawer */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Floating Pull-Out Edge Tab (Anchored to left screen edge when sidebar is closed) */}
        {!isSidebarOpen && (
          <button
            onClick={() => {
              setIsSidebarOpen(true);
              setIsSidebarCollapsed(false);
            }}
            className="no-print absolute left-0 top-1/2 -translate-y-1/2 z-40 group flex items-center bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white pl-2.5 pr-3.5 py-4 rounded-r-2xl shadow-lg border-y border-r border-blue-200/50 hover:border-blue-300 transition-all duration-300 ease-out cursor-pointer hover:pl-4 ring-1 ring-blue-200/40 animate-slide-in-left"
            title="Open Component Library (Ctrl+B) — 24 Academic Blocks Available"
            aria-label="Open Component Library"
          >
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1 text-white">
                <ChevronRight
                  size={15}
                  className="text-amber-200 group-hover:translate-x-0.5 transition-transform shrink-0"
                />
                <PanelLeftOpen
                  size={16}
                  className="group-hover:scale-110 transition-transform shrink-0"
                />
                <span className="text-[11px] font-extrabold font-heading tracking-wider uppercase">
                  Blocks Library
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9.5px] font-semibold text-blue-100 bg-blue-900/80 px-2 py-0.5 rounded-full border border-blue-400/40 shadow-xs">
                <Sparkles size={9} className="text-amber-200 shrink-0" />
                <span>24 Blocks</span>
              </div>
              <span className="text-[9px] font-mono text-blue-100/90 bg-blue-800/60 px-1 rounded border border-blue-400/30">
                Ctrl+B
              </span>
            </div>
          </button>
        )}

        {/* Left Component Library Sidebar (supports collapsible icon-only rail) */}
        <BlockInserterSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onExpand={() => {
            setIsSidebarOpen(true);
            setIsSidebarCollapsed(false);
          }}
          onAddBlock={handleSidebarAddBlock}
          onOpenCommandPalette={() => {
            setPaletteInsertIndex(currentDoc.blocks.length);
            setIsPaletteOpen(true);
          }}
          highlightedBlockType={highlightedBlockType}
          highlightTrigger={highlightTrigger}
          pendingInsertIndex={pendingInsertIndex}
          onCancelPendingInsert={handleCancelPendingInsert}
          onDragStartBlock={(type) => setDraggedBlockType(type)}
          onDragEndBlock={() => setDraggedBlockType(null)}
        />

        {/* Center WYSIWYG A4 Canvas (with multi-page sheets & continuous modes) */}
        <A4Canvas
          doc={currentDoc}
          zoomLevel={zoomLevel}
          onZoomChange={handleZoomChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isFitToHeight={isFitToHeight}
          onToggleFitToHeight={handleToggleFitToHeight}
          onUpdateDocument={handleUpdateDocument}
          onInsertBlockAt={handleInsertBlockAt}
          onSelectHeader={handleSelectHeader}
          isHeaderSelected={isHeaderSelected && isSettingsOpen}
          pendingInsertIndex={pendingInsertIndex}
          onTriggerInsertAt={handleTriggerInsertBlock}
          onCancelPendingInsert={handleCancelPendingInsert}
          draggedBlockType={draggedBlockType}
          onDropBlockAt={handleDropBlockAt}
          selectedBlockIndex={selectedBlockIndex}
          onSelectBlock={handleSelectBlock}
          newlyInsertedBlockId={newlyInsertedBlockId}
          teachingMode={teachingMode}
          onOpenImporter={() => setIsImporterOpen(true)}
          onOpenTemplates={() => setIsTemplatesOpen(true)}
          onInsertCustomBlockAt={handleInsertCustomBlockAt}
        />

        {/* Right Settings & Invariant Area Drawer */}
        <HeaderFooterDrawer
          isOpen={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
            setIsHeaderSelected(false);
          }}
          doc={currentDoc}
          onUpdateDocument={handleUpdateDocument}
          isHeaderSelected={isHeaderSelected && isSettingsOpen}
        />
      </div>

      {/* Global Block Command Palette Popover (Ctrl+K or Navbar trigger) */}
      <BlockPickerPopover
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectBlock={(type) => handleInsertBlockAt(paletteInsertIndex, type)}
        insertPositionIndex={paletteInsertIndex}
      />

      {/* Template Gallery Modal */}
      <TemplateGalleryModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        activeDocId={currentDoc.id}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={isVersionsOpen}
        onClose={() => {
          setIsVersionsOpen(false);
          setVersionCount(getDocumentSnapshots().length);
        }}
        currentDoc={currentDoc}
        onRestoreDoc={(restored) => {
          handleUpdateDocument(() => restored);
          setSaveStatus('Restored version snapshot');
        }}
      />

      {/* Bulk Notes Importer Modal */}
      <BulkNotesImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImportBlocks={handleImportRawBlocks}
      />

      {/* RK Institute Asset & Stamp Library Modal */}
      <AssetStampLibraryModal
        isOpen={isStampsOpen}
        onClose={() => setIsStampsOpen(false)}
        onInsertStamp={(block) =>
          handleInsertCustomBlockAt(
            selectedBlockIndex !== null ? selectedBlockIndex + 1 : currentDoc.blocks.length,
            block
          )
        }
      />

      {/* Print & PDF Guide Modal */}
      <PrintGuideModal
        isOpen={isPrintGuideOpen}
        onClose={() => setIsPrintGuideOpen(false)}
        onProceedPrint={handlePrint}
        teachingMode={teachingMode}
        onToggleTeachingMode={(mode) => setTeachingMode(mode)}
      />

      {/* Bottom Status Indicator (Screen only) */}
      {saveStatus && (
        <div className="no-print fixed bottom-3 left-4 z-50 bg-white/95 border border-stone-200 text-[11px] text-slate-600 px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">{saveStatus}</span>
        </div>
      )}
    </div>
  );
}

export default App;
