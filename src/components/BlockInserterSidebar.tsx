import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  AlertTriangle,
  Lightbulb,
  FileText,
  Target,
  Zap,
  Sparkles,
  CheckCircle2,
  ListOrdered,
  Columns3,
  SplitSquareVertical,
  Clock,
  Table2,
  HelpCircle,
  Image,
  Heading,
  AlignLeft,
  Search,
  FlaskConical,
  Columns2,
  Award,
  Scissors,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Flame,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Command,
  Star,
  LayoutGrid,
  Rows,
  GripVertical,
  Plus,
} from 'lucide-react';
import type { BlockType } from '../types/document';
import { recordBlockUsage, getFrequentlyUsedBlocks } from '../utils/blockUsage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onExpand?: () => void;
  onAddBlock: (type: BlockType) => void;
  onOpenCommandPalette?: () => void;
  highlightedBlockType?: BlockType | null;
  highlightTrigger?: number;
  pendingInsertIndex?: number | null;
  onCancelPendingInsert?: () => void;
  onDragStartBlock?: (type: BlockType) => void;
  onDragEndBlock?: () => void;
}

interface BlockItem {
  type: BlockType;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'Structure' | 'Callouts' | 'Lists' | 'Questions' | 'Tables' | 'Media';
  categoryColor: string;
  badge: string;
}

const ALL_BLOCKS: BlockItem[] = [
  // 1. Invariant & Structure
  {
    type: 'hero-intro',
    title: 'Chapter Hero Banner',
    description: 'Official chapter masthead with marks weightage, curriculum tags & summary',
    icon: <Heading size={15} className="text-blue-500" />,
    category: 'Structure',
    categoryColor: 'border-blue-500/40 text-blue-500',
    badge: 'Masthead',
  },
  {
    type: 'heading',
    title: 'Topic Heading (H2/H3)',
    description: 'Section heading with sub-topic breadcrumb tag & level selector',
    icon: <Heading size={15} className="text-slate-600" />,
    category: 'Structure',
    categoryColor: 'border-slate-500/40 text-slate-600',
    badge: 'Heading',
  },
  {
    type: 'paragraph',
    title: 'Body Text Paragraph',
    description: 'Narrative explanatory paragraph supporting rich inline HTML formatting',
    icon: <AlignLeft size={15} className="text-slate-600" />,
    category: 'Structure',
    categoryColor: 'border-slate-500/40 text-slate-600',
    badge: 'Body',
  },
  {
    type: 'page-break',
    title: 'Page Break (नया पृष्ठ)',
    description: 'Clean physical A4 page separator forcing a fresh sheet on canvas and print',
    icon: <Scissors size={15} className="text-indigo-500" />,
    category: 'Structure',
    categoryColor: 'border-indigo-500/40 text-indigo-500',
    badge: 'Print Break',
  },
  {
    type: 'hallmark-closing',
    title: 'Institutional Closing Card',
    description: 'Official hallmark sign-off, address, session and student helpline stamp',
    icon: <Award size={15} className="text-amber-500" />,
    category: 'Structure',
    categoryColor: 'border-amber-500/40 text-amber-500',
    badge: 'Sign-off',
  },

  // 2. Extendable Callout Boxes
  {
    type: 'box-lead',
    title: 'Lead Highlight Card (.lead)',
    description: 'Prominent summary card with bold blue accent and Devanagari badge',
    icon: <BookOpen size={15} className="text-blue-500" />,
    category: 'Callouts',
    categoryColor: 'border-blue-500/40 text-blue-500',
    badge: 'Lead Box',
  },
  {
    type: 'box-definition',
    title: 'Formal Definition Box (.def)',
    description: 'Standard NCERT definition with bilingual Hindi/English terminology',
    icon: <FileText size={15} className="text-emerald-500" />,
    category: 'Callouts',
    categoryColor: 'border-emerald-500/40 text-emerald-500',
    badge: 'Definition',
  },
  {
    type: 'box-caution',
    title: 'Exam Trap & Caution (.caution)',
    description: 'Crucial distinction box warning students about common exam mistakes',
    icon: <AlertTriangle size={15} className="text-rose-500" />,
    category: 'Callouts',
    categoryColor: 'border-rose-500/40 text-rose-500',
    badge: 'Exam Trap',
  },
  {
    type: 'box-life-example',
    title: 'Real Life Example (.example)',
    description: 'Everyday relatable scenario demonstrating academic principles',
    icon: <Lightbulb size={15} className="text-amber-500" />,
    category: 'Callouts',
    categoryColor: 'border-amber-500/40 text-amber-500',
    badge: 'Example',
  },
  {
    type: 'box-case-study',
    title: 'CBSE Case Study (.case-study)',
    description: 'Analytical case study narrative with scenario analysis and key takeaway',
    icon: <Target size={15} className="text-indigo-500" />,
    category: 'Callouts',
    categoryColor: 'border-indigo-500/40 text-indigo-500',
    badge: 'Case Study',
  },
  {
    type: 'box-exam-tip',
    title: 'Topper Exam Tip (.exam-tip)',
    description: 'High-scoring presentation advice, keywords & time-management strategy',
    icon: <Zap size={15} className="text-cyan-500" />,
    category: 'Callouts',
    categoryColor: 'border-cyan-500/40 text-cyan-500',
    badge: 'Topper Tip',
  },
  {
    type: 'box-formula',
    title: 'Formula & Equation Card',
    description: 'Live KaTeX math formula box with LaTeX editor and quick math symbol chips',
    icon: <Sparkles size={15} className="text-purple-500" />,
    category: 'Callouts',
    categoryColor: 'border-purple-500/40 text-purple-500',
    badge: 'Formula',
  },
  {
    type: 'box-worked',
    title: 'Worked Solution (.worked)',
    description: 'Step-by-step problem solver with given data, steps & final boxed answer',
    icon: <CheckCircle2 size={15} className="text-emerald-500" />,
    category: 'Callouts',
    categoryColor: 'border-emerald-500/40 text-emerald-500',
    badge: 'Solution',
  },
  {
    type: 'box-activity',
    title: 'NCERT Activity & Experiment',
    description: 'Hands-on classroom activity, required apparatus, and observation table',
    icon: <FlaskConical size={15} className="text-teal-500" />,
    category: 'Callouts',
    categoryColor: 'border-teal-500/40 text-teal-500',
    badge: 'Activity',
  },
  {
    type: 'box-summary',
    title: 'Quick Revision Summary',
    description: 'Chapter takeaway recap list for quick review before examinations',
    icon: <BookOpen size={15} className="text-amber-500" />,
    category: 'Callouts',
    categoryColor: 'border-amber-500/40 text-amber-500',
    badge: 'Summary',
  },
  {
    type: 'box-instructions',
    title: "Teacher's Exam Instructions",
    description: 'Test instructions, duration, negative marking rules & student guidelines',
    icon: <Target size={15} className="text-purple-500" />,
    category: 'Callouts',
    categoryColor: 'border-purple-500/40 text-purple-500',
    badge: 'Instructions',
  },

  // 3. Lists & Comparisons
  {
    type: 'bullet-list',
    title: 'Universal Bullet Points',
    description: 'Structured list items with configurable bullet icons and bold lead keywords',
    icon: <ListOrdered size={15} className="text-blue-500" />,
    category: 'Lists',
    categoryColor: 'border-blue-500/40 text-blue-500',
    badge: 'Bullets',
  },
  {
    type: 'card-grid-3',
    title: '3-Column Concept Cards',
    description: 'Three parallel pillar cards comparing central themes or classifications',
    icon: <Columns3 size={15} className="text-emerald-500" />,
    category: 'Lists',
    categoryColor: 'border-emerald-500/40 text-emerald-500',
    badge: '3-Cards',
  },
  {
    type: 'comparison-vs',
    title: 'Difference Comparison (VS)',
    description: 'Side-by-side comparison columns for contrasting two theories or systems',
    icon: <SplitSquareVertical size={15} className="text-indigo-500" />,
    category: 'Lists',
    categoryColor: 'border-indigo-500/40 text-indigo-500',
    badge: 'VS Split',
  },
  {
    type: 'timeline-steps',
    title: 'Step Sequence & Timeline',
    description: 'Sequential numbered milestone process for historical events or procedures',
    icon: <Clock size={15} className="text-cyan-500" />,
    category: 'Lists',
    categoryColor: 'border-cyan-500/40 text-cyan-500',
    badge: 'Steps',
  },

  // 4. Tables & Grids
  {
    type: 'data-table',
    title: 'Academic Data Table',
    description: 'Editable rows and columns with bold header row and alternating striping',
    icon: <Table2 size={15} className="text-emerald-500" />,
    category: 'Tables',
    categoryColor: 'border-emerald-500/40 text-emerald-500',
    badge: 'Table',
  },
  {
    type: 'companion-grid',
    title: 'Two-Column Companion Layout',
    description: 'Split layout placing core concept on the left and note/diagram on the right',
    icon: <Columns2 size={15} className="text-teal-500" />,
    category: 'Tables',
    categoryColor: 'border-teal-500/40 text-teal-400',
    badge: '2-Col Split',
  },

  // 5. Questions & Assessment
  {
    type: 'question-card',
    title: 'CBSE Question & PYQ Card',
    description: 'MCQ or subjective question with marks pill, year badge, and teacher key',
    icon: <HelpCircle size={15} className="text-amber-500" />,
    category: 'Questions',
    categoryColor: 'border-amber-500/40 text-amber-500',
    badge: 'CBSE PYQ',
  },

  // 6. Visual Figures & Diagrams
  {
    type: 'image-block',
    title: 'Image / Diagram Block',
    description: 'Academic diagram figure with caption, alt text and pre-cropped RK graphics',
    icon: <Image size={15} className="text-rose-500" />,
    category: 'Media',
    categoryColor: 'border-rose-500/40 text-rose-500',
    badge: 'Diagram',
  },
];

// Human-friendly short labels for pinned chips (prevents awkward slicing)
const PINNED_SHORT_TITLES: Record<BlockType, string> = {
  'hero-intro': 'Hero Banner',
  'heading': 'Topic Heading',
  'paragraph': 'Body Paragraph',
  'page-break': 'Page Break',
  'hallmark-closing': 'Closing Card',
  'box-lead': 'Lead Card',
  'box-definition': 'Definition Box',
  'box-caution': 'Caution Trap',
  'box-life-example': 'Real Example',
  'box-case-study': 'Case Study',
  'box-exam-tip': 'Exam Tip',
  'box-formula': 'Formula (KaTeX)',
  'box-worked': 'Worked Solution',
  'box-activity': 'NCERT Activity',
  'box-summary': 'Summary Card',
  'box-instructions': 'Instructions',
  'bullet-list': 'Bullet List',
  'card-grid-3': '3-Card Grid',
  'comparison-vs': 'Comparison VS',
  'timeline-steps': 'Timeline Steps',
  'data-table': 'Data Table',
  'question-card': 'CBSE Question',
  'companion-grid': '2-Col Split',
  'image-block': 'Diagram Image',
};

const DEFAULT_PINNED_BLOCKS: BlockType[] = [
  'heading',
  'box-definition',
  'question-card',
  'box-caution',
  'bullet-list',
  'box-formula',
  'box-worked',
  'box-summary',
];

const COLLAPSED_STORAGE_KEY = 'rk_docflow_sidebar_collapsed';
const PINNED_STORAGE_KEY = 'rk_docflow_pinned_blocks';
const SECTION_VIEW_STORAGE_KEY = 'rk_docflow_section_view_modes';
const SIDEBAR_WIDTH_STORAGE_KEY = 'rk_docflow_sidebar_width';

type SectionViewMode = 'cards' | 'icons';

const CATEGORY_META = [
  { id: 'Structure', label: 'Structure & Invariants', icon: '🏛️', count: 5 },
  { id: 'Callouts', label: 'Extendable NCERT Boxes', icon: '📦', count: 11 },
  { id: 'Lists', label: 'Lists & Comparisons', icon: '📝', count: 4 },
  { id: 'Questions', label: 'CBSE Questions & PYQ', icon: '❓', count: 1 },
  { id: 'Tables', label: 'Tables & Layouts', icon: '📊', count: 2 },
  { id: 'Media', label: 'Figures & Media', icon: '🖼️', count: 1 },
];

export const BlockInserterSidebar: React.FC<Props> = ({
  isOpen,
  onClose,
  isCollapsed: propsCollapsed,
  onToggleCollapse,
  onExpand,
  onAddBlock,
  onOpenCommandPalette,
  highlightedBlockType = null,
  highlightTrigger = 0,
  pendingInsertIndex = null,
  onCancelPendingInsert,
  onDragStartBlock,
  onDragEndBlock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [isPinMenuOpen, setIsPinMenuOpen] = useState(false);
  const pinMenuRef = useRef<HTMLDivElement>(null);

  // Expandable Sidebar Width (resizable between 260px and 620px)
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
      return saved ? Math.max(260, Math.min(620, parseInt(saved, 10))) : 340;
    } catch {
      return 340;
    }
  });
  const [isResizing, setIsResizing] = useState(false);

  // Collapse sidebar mode (icon-only rail vs expanded)
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const isCollapsed = propsCollapsed !== undefined ? propsCollapsed : internalCollapsed;

  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const handleExpand = () => {
    if (onExpand) {
      onExpand();
    } else {
      setInternalCollapsed(false);
    }
  };

  // Section view modes: 'cards' or 'icons' per section
  const [sectionViewModes, setSectionViewModes] = useState<Record<string, SectionViewMode>>(() => {
    try {
      const saved = localStorage.getItem(SECTION_VIEW_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      Structure: 'cards',
      Callouts: 'cards',
      Lists: 'cards',
      Questions: 'cards',
      Tables: 'cards',
      Media: 'cards',
    };
  });

  // Collapsed categories accordion state (empty set = all open)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // User pinned blocks
  const [pinnedBlocks, setPinnedBlocks] = useState<BlockType[]>(() => {
    try {
      const saved = localStorage.getItem(PINNED_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PINNED_BLOCKS;
  });

  // Drag and Drop reordering state for Pinned items
  const [draggedPinnedIndex, setDraggedPinnedIndex] = useState<number | null>(null);
  const [dragOverPinnedIndex, setDragOverPinnedIndex] = useState<number | null>(null);

  // Hover state for tooltip in collapsed rail and icon grids
  const [hoveredItem, setHoveredItem] = useState<{
    item: BlockItem;
    top: number;
    left?: number;
  } | null>(null);

  // Close pin popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (pinMenuRef.current && !pinMenuRef.current.contains(e.target as Node)) {
        setIsPinMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Sync collapse state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(isCollapsed));
    } catch {
      // ignore
    }
  }, [isCollapsed]);

  // Sync section view modes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SECTION_VIEW_STORAGE_KEY, JSON.stringify(sectionViewModes));
    } catch {
      // ignore
    }
  }, [sectionViewModes]);

  // Sync pinned state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedBlocks));
    } catch {
      // ignore
    }
  }, [pinnedBlocks]);

  // Drag-to-resize sidebar width handler
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const next = Math.max(260, Math.min(620, startWidth + delta));
      setSidebarWidth(next);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      const finalDelta = upEvent.clientX - startX;
      const finalWidth = Math.max(260, Math.min(620, startWidth + finalDelta));
      try {
        localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(finalWidth));
      } catch {
        // ignore
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Compute top pick items: user-pinned blocks in exact ordered sequence + dynamic usage
  const frequentUsageTypes = getFrequentlyUsedBlocks(4);
  const combinedTopTypes = Array.from(new Set([...pinnedBlocks, ...frequentUsageTypes]));
  const topPickItems = combinedTopTypes
    .map((t) => ALL_BLOCKS.find((b) => b.type === t))
    .filter(Boolean) as BlockItem[];

  // Auto-expand category and smoothly scroll to highlighted block
  useEffect(() => {
    if (!highlightedBlockType) return;
    const targetItem = ALL_BLOCKS.find((b) => b.type === highlightedBlockType);
    if (targetItem) {
      setTimeout(() => {
        setCollapsedCategories((prev) => {
          if (!prev.has(targetItem.category)) return prev;
          const next = new Set(prev);
          next.delete(targetItem.category);
          return next;
        });

        setSelectedFilterCategory((prev) =>
          prev !== 'all' && prev !== targetItem.category ? 'all' : prev
        );

        setSearchQuery((prev) => {
          if (!prev.trim()) return prev;
          const matches =
            targetItem.title.toLowerCase().includes(prev.toLowerCase()) ||
            targetItem.description.toLowerCase().includes(prev.toLowerCase()) ||
            targetItem.type.toLowerCase().includes(prev.toLowerCase()) ||
            targetItem.badge.toLowerCase().includes(prev.toLowerCase());
          return matches ? prev : '';
        });
      }, 0);
    }

    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-sidebar-block="${highlightedBlockType}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [highlightedBlockType, highlightTrigger]);

  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'rk-new-block', blockType: type })
    );
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
    (e.currentTarget as HTMLElement).classList.add('opacity-50');
    if (onDragStartBlock) {
      onDragStartBlock(type);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove('opacity-50');
    if (onDragEndBlock) {
      onDragEndBlock();
    }
  };

  // Pinned items Drag & Drop Reordering handlers
  const handlePinnedDragStart = (e: React.DragEvent, index: number, type: BlockType) => {
    setDraggedPinnedIndex(index);
    e.dataTransfer.setData('text/rk-pinned-index', String(index));
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'rk-new-block', blockType: type })
    );
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copyMove';
    if (onDragStartBlock) {
      onDragStartBlock(type);
    }
  };

  const handlePinnedDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverPinnedIndex !== index) {
      setDragOverPinnedIndex(index);
    }
  };

  const handlePinnedDragLeave = () => {
    setDragOverPinnedIndex(null);
  };

  const handlePinnedDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPinnedIndex(null);
    const sourceIndexStr = e.dataTransfer.getData('text/rk-pinned-index');
    if (sourceIndexStr !== '') {
      const sourceIndex = parseInt(sourceIndexStr, 10);
      if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
        setPinnedBlocks((prev) => {
          const next = [...prev];
          const [moved] = next.splice(sourceIndex, 1);
          next.splice(targetIndex, 0, moved);
          return next;
        });
      }
    }
    setDraggedPinnedIndex(null);
  };

  const handlePinnedDragEnd = (e: React.DragEvent) => {
    setDraggedPinnedIndex(null);
    setDragOverPinnedIndex(null);
    handleDragEnd(e);
  };

  const handleBlockClick = (type: BlockType) => {
    recordBlockUsage(type);
    onAddBlock(type);
  };

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const collapseAllCategories = () => {
    setCollapsedCategories(new Set(CATEGORY_META.map((c) => c.id)));
  };

  const expandAllCategories = () => {
    setCollapsedCategories(new Set());
  };

  const togglePin = (type: BlockType, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedBlocks((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const setCategoryViewMode = (catId: string, mode: SectionViewMode, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSectionViewModes((prev) => ({
      ...prev,
      [catId]: mode,
    }));
  };

  const setAllCategoriesViewMode = (mode: SectionViewMode) => {
    const updated: Record<string, SectionViewMode> = {};
    CATEGORY_META.forEach((cat) => {
      updated[cat.id] = mode;
    });
    setSectionViewModes(updated);
  };

  const isAllCards = CATEGORY_META.every((c) => (sectionViewModes[c.id] || 'cards') === 'cards');
  const isAllIcons = CATEGORY_META.every((c) => sectionViewModes[c.id] === 'icons');

  return (
    <aside
      style={{
        width: !isOpen ? 0 : isCollapsed ? '5rem' : `${sidebarWidth}px`,
        transition: isResizing ? 'none' : 'width 250ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`shrink-0 h-full bg-white flex flex-col z-30 select-none no-print border-r border-stone-200 relative ${
        !isOpen ? 'border-r-0 opacity-0 pointer-events-none overflow-hidden' : ''
      }`}
      aria-hidden={!isOpen}
    >
      {/* ── DRAGGABLE RESIZE HANDLE (Right Border) ── */}
      {isOpen && !isCollapsed && (
        <div
          onMouseDown={handleMouseDownResize}
          className={`absolute -right-1.5 top-0 bottom-0 w-3 cursor-col-resize z-50 flex items-center justify-center select-none transition-colors group ${
            isResizing ? 'bg-blue-500/20' : 'hover:bg-blue-400/20'
          }`}
          title="Drag to adjust sidebar width (260px – 620px)"
        >
          <div
            className={`w-1 h-12 rounded-full transition-all ${
              isResizing ? 'bg-blue-600 h-16' : 'bg-stone-300 group-hover:bg-blue-500'
            }`}
          />
        </div>
      )}

      {/* Floating pull-out handle on rail border to expand to full */}
      {isOpen && isCollapsed && (
        <button
          onClick={handleExpand}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-7 h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-r-xl border-y border-r border-blue-200 shadow-2xl transition-all duration-200 cursor-pointer hover:scale-115 hover:shadow-blue-200/50 hover:pl-0.5 group ring-1 ring-blue-200/50"
          title="Expand Blocks Library to Full View (Ctrl+B)"
          aria-label="Expand library"
        >
          <ChevronRight
            size={16}
            className="text-amber-200 group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      )}

      {/* ── TOP HEADER / COMPACT TOOLBAR ── */}
      <div className="p-2 border-b border-stone-200 flex items-center justify-between gap-1.5 bg-stone-50/90 shrink-0">
        {!isCollapsed && (
          <div className="min-w-0 flex-1 flex items-center gap-1.5">
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 font-heading truncate flex items-center gap-1">
              <span>Library</span>
              <span className="text-[9.5px] font-mono text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-200 font-bold">
                24
              </span>
            </h2>
          </div>
        )}

        <div className="flex items-center gap-1 mx-auto sm:mx-0">
          {/* Quick Width Presets (Compact, Standard, Wide) */}
          {!isCollapsed && (
            <div className="flex items-center bg-stone-100 rounded-md p-0.5 border border-stone-200 mr-1">
              <button
                onClick={() => {
                  setSidebarWidth(280);
                  try { localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, '280'); } catch { /* ignore */ }
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors cursor-pointer ${
                  sidebarWidth <= 300
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Compact Width (280px)"
              >
                S
              </button>
              <button
                onClick={() => {
                  setSidebarWidth(350);
                  try { localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, '350'); } catch { /* ignore */ }
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors cursor-pointer ${
                  sidebarWidth > 300 && sidebarWidth < 440
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Standard Width (350px)"
              >
                M
              </button>
              <button
                onClick={() => {
                  setSidebarWidth(480);
                  try { localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, '480'); } catch { /* ignore */ }
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors cursor-pointer ${
                  sidebarWidth >= 440
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Wide Multi-Column Width (480px)"
              >
                L
              </button>
            </div>
          )}

          {/* Toggle Collapsed Rail vs Expanded */}
          <button
            onClick={handleToggleCollapse}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand library with full descriptions' : 'Collapse to icon-only slim rail (Ctrl+B)'}
            aria-label={isCollapsed ? 'Expand library' : 'Collapse library'}
          >
            {isCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </button>

          {!isCollapsed && (
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
              title="Close Library (Ctrl+B)"
              aria-label="Close Library"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── ULTRA-COMPACT ACTIVE INSERTION TARGET BANNER ── */}
      {pendingInsertIndex !== null && (
        <div className="bg-blue-50/95 border-b border-blue-200 px-2.5 py-1 text-[11px] flex items-center justify-between text-blue-800 shadow-2xs shrink-0 animate-fadeIn">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <span className="font-semibold text-blue-900 truncate">
              Target: Insert at #{pendingInsertIndex + 1}
            </span>
          </div>
          {onCancelPendingInsert && (
            <button
              onClick={onCancelPendingInsert}
              className="text-[9.5px] font-semibold text-blue-600 hover:text-blue-900 px-1.5 py-0.2 rounded hover:bg-blue-100 transition-colors cursor-pointer"
              title="Cancel pending insertion"
            >
              Cancel ✕
            </button>
          )}
        </div>
      )}

      {/* ── COLLAPSED SLIM RAIL MODE ── */}
      {isCollapsed ? (
        <div className="flex-1 overflow-hidden py-2 flex flex-col items-center gap-2 px-1 relative">
          <div className="w-full pb-2 border-b border-stone-200 flex flex-col items-center gap-1.5 shrink-0 px-1">
            <button
              onClick={handleExpand}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white text-[10px] font-bold border border-blue-300 shadow-xs transition-all cursor-pointer group"
              title="Expand to Full View with Descriptions (Ctrl+B)"
            >
              <PanelLeftOpen size={13} className="group-hover:translate-x-0.5 transition-transform" />
              <span>Expand</span>
            </button>
          </div>

          {/* Pinned Most-Used Icons at Top */}
          <div className="flex flex-col items-center gap-1 w-full pb-2 border-b border-stone-200 shrink-0">
            <div className="text-[9px] uppercase font-bold text-amber-600 flex items-center gap-0.5" title="Top Picks">
              <Flame size={11} className="text-amber-600" />
              <span>Picks</span>
            </div>
            <div className="grid grid-cols-2 gap-1 w-full px-1">
              {topPickItems.slice(0, 4).map((item) => (
                <button
                  key={`col-top-${item.type}`}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  onDragEnd={handleDragEnd}
                  data-sidebar-top-pick={item.type}
                  data-sidebar-block={item.type}
                  onClick={() => handleBlockClick(item.type)}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const tooltipWidth = 280;
                    const tooltipHeight = 160;
                    let left = rect.right + 10;
                    if (left + tooltipWidth > window.innerWidth) {
                      left = Math.max(10, rect.left - tooltipWidth - 10);
                    }
                    let top = rect.top;
                    if (top + tooltipHeight > window.innerHeight) {
                      top = Math.max(10, window.innerHeight - tooltipHeight - 10);
                    }
                    setHoveredItem({ item, top, left });
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-500 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-400 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-110 active:scale-95 group ${
                    item.type === highlightedBlockType ? 'pulsate-highlight' : ''
                  }`}
                  title={item.title}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* All 24 Blocks Compact 2-Column Icon Grid */}
          <div
            onScroll={() => setHoveredItem(null)}
            className="flex-1 w-full px-1 flex flex-col justify-between overflow-y-auto scrollbar-none"
          >
            <div className="grid grid-cols-2 gap-1 w-full">
              {ALL_BLOCKS.map((item) => (
                <button
                  key={`col-all-${item.type}`}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  onDragEnd={handleDragEnd}
                  data-sidebar-block={item.type}
                  onClick={() => handleBlockClick(item.type)}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const tooltipWidth = 280;
                    const tooltipHeight = 160;
                    let left = rect.right + 10;
                    if (left + tooltipWidth > window.innerWidth) {
                      left = Math.max(10, rect.left - tooltipWidth - 10);
                    }
                    let top = rect.top;
                    if (top + tooltipHeight > window.innerHeight) {
                      top = Math.max(10, window.innerHeight - tooltipHeight - 10);
                    }
                    setHoveredItem({ item, top, left });
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-8 h-8 rounded-lg bg-stone-50 hover:bg-blue-500 text-slate-500 hover:text-white border border-stone-200 hover:border-blue-400 flex items-center justify-center transition-all cursor-pointer group shadow-2xs hover:scale-110 active:scale-95 ${
                    item.type === highlightedBlockType ? 'pulsate-highlight' : ''
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {onOpenCommandPalette && (
            <div className="w-full pt-1.5 border-t border-stone-200 flex justify-center shrink-0">
              <button
                onClick={onOpenCommandPalette}
                className="w-8 h-8 rounded-lg bg-stone-50 hover:bg-stone-100 text-slate-500 hover:text-slate-800 border border-stone-200 flex items-center justify-center cursor-pointer transition-colors"
                title="Command Palette (Ctrl+K)"
              >
                <Command size={12} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── EXPANDED FULL SIDEBAR MODE (WITH REFLOW & DRAG-TO-REORDER) ── */
        <>
          {/* ── FREQUENTLY & PINNED REFLOWABLE SECTION ── */}
          <div className="p-2 bg-stone-50/90 border-b border-stone-200 shrink-0">
            <div className="flex items-center justify-between text-[10.5px] font-bold text-amber-700 uppercase tracking-wider mb-1.5 px-0.5">
              <div className="flex items-center gap-1.5">
                <Flame size={12} className="text-amber-600 shrink-0" />
                <span>Pinned &amp; Top Picks</span>
                <span className="text-[9.5px] font-mono bg-amber-100 text-amber-800 px-1 rounded border border-amber-200">
                  {topPickItems.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-normal text-slate-400 normal-case hidden sm:inline" title="Drag any chip to change its order">
                  Drag to reorder
                </span>

                {/* + Pin More Blocks Dropdown */}
                <div className="relative" ref={pinMenuRef}>
                  <button
                    onClick={() => setIsPinMenuOpen((prev) => !prev)}
                    className="flex items-center gap-0.5 text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-1.5 py-0.5 rounded border border-stone-300 hover:border-blue-400 cursor-pointer shadow-2xs transition-colors"
                    title="Pin more blocks to this top section"
                  >
                    <Plus size={11} />
                    <span>Pin</span>
                  </button>

                  {isPinMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-stone-200 rounded-xl shadow-xl p-1.5 z-50 text-xs animate-fadeIn max-h-72 overflow-y-auto">
                      <div className="text-[10.5px] font-bold text-slate-700 px-2 py-1 border-b border-stone-100 flex items-center justify-between">
                        <span>Pin Blocks to Top</span>
                        <span className="text-[9.5px] text-slate-400 font-normal">Click to toggle</span>
                      </div>
                      <div className="space-y-0.5 mt-1">
                        {ALL_BLOCKS.map((b) => {
                          const isPinned = pinnedBlocks.includes(b.type);
                          return (
                            <button
                              key={`pin-toggle-${b.type}`}
                              onClick={(e) => togglePin(b.type, e)}
                              className={`w-full text-left px-2 py-1 rounded-lg text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                                isPinned
                                  ? 'bg-amber-50 text-amber-900 font-semibold'
                                  : 'hover:bg-stone-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="shrink-0">{b.icon}</span>
                                <span className="truncate">{PINNED_SHORT_TITLES[b.type] || b.title}</span>
                              </div>
                              <Star
                                size={12}
                                className={`shrink-0 ${
                                  isPinned ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reflowable Grid of Pinned Chips (2 to 4 columns dynamically!) */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-1.5">
              {topPickItems.map((item, index) => {
                const isDragOver = dragOverPinnedIndex === index;
                const isPinned = pinnedBlocks.includes(item.type);
                return (
                  <div
                    key={`exp-top-${item.type}`}
                    draggable={true}
                    onDragStart={(e) => handlePinnedDragStart(e, index, item.type)}
                    onDragEnd={handlePinnedDragEnd}
                    onDragOver={(e) => handlePinnedDragOver(e, index)}
                    onDragLeave={handlePinnedDragLeave}
                    onDrop={(e) => handlePinnedDrop(e, index)}
                    onClick={() => handleBlockClick(item.type)}
                    className={`px-2 py-1.5 rounded-lg bg-white text-left transition-all cursor-grab active:cursor-grabbing flex items-center justify-between group shadow-2xs hover:shadow-xs border ${
                      draggedPinnedIndex === index ? 'opacity-40 scale-95 border-dashed border-blue-400' : ''
                    } ${
                      isDragOver
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
                        : 'border-stone-200 hover:border-blue-300 hover:bg-blue-50/50'
                    } ${item.type === highlightedBlockType ? 'pulsate-highlight' : ''}`}
                    title="Click to insert • Drag onto canvas • Drag here to reorder position"
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <GripVertical
                        size={11}
                        className="text-stone-300 group-hover:text-stone-500 shrink-0 -ml-0.5"
                      />
                      <div className="shrink-0 text-slate-600 group-hover:text-blue-600 transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900 truncate">
                        {PINNED_SHORT_TITLES[item.type] || item.title}
                      </span>
                    </div>

                    <button
                      onClick={(e) => togglePin(item.type, e)}
                      className="p-0.5 text-slate-300 hover:text-amber-500 transition-colors ml-0.5 shrink-0"
                      title={isPinned ? 'Unpin block' : 'Pin to top'}
                    >
                      <Star
                        size={11}
                        className={isPinned ? 'text-amber-400 fill-amber-400' : ''}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── SEARCH & CATEGORY FILTER ── */}
          <div className="p-2 border-b border-stone-200 bg-white space-y-1.5 shrink-0">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search blocks (pyq, caution, formula, table...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-7 pr-7 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 transition-colors"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 text-xs cursor-pointer"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-400 bg-stone-100 px-1 py-0.2 rounded border border-stone-200">
                  Ctrl+K
                </span>
              )}
            </div>

            {/* Category Quick Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pr-1 scrollbar-none pb-0.5">
              <button
                onClick={() => setSelectedFilterCategory('all')}
                className={`px-2 py-0.5 rounded text-[9.5px] font-semibold transition-colors cursor-pointer ${
                  selectedFilterCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-stone-100 text-slate-600 hover:text-slate-800 hover:bg-stone-200'
                }`}
              >
                All (24)
              </button>
              {CATEGORY_META.map((cat) => (
                <button
                  key={`pill-${cat.id}`}
                  onClick={() => setSelectedFilterCategory(cat.id)}
                  className={`px-1.5 py-0.5 rounded text-[9.5px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedFilterCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-800'
                  }`}
                >
                  {cat.id} ({cat.count})
                </button>
              ))}
            </div>

            {/* View Switcher & Accordion Controls Strip */}
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-stone-200">
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] font-medium text-slate-500">View:</span>
                <div className="inline-flex rounded-lg bg-stone-100 border border-stone-200 p-0.5">
                  <button
                    onClick={() => setAllCategoriesViewMode('cards')}
                    className={`px-1.5 py-0.2 rounded text-[9px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      isAllCards
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Switch ALL sections to Card View"
                  >
                    <Rows size={10} />
                    <span>Cards</span>
                  </button>
                  <button
                    onClick={() => setAllCategoriesViewMode('icons')}
                    className={`px-1.5 py-0.2 rounded text-[9px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      isAllIcons
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Switch ALL sections to Compact Icon Grid"
                  >
                    <LayoutGrid size={10} />
                    <span>Icons</span>
                  </button>
                </div>
              </div>

              {/* Accordion All Collapse / Expand Toggle */}
              <button
                onClick={
                  collapsedCategories.size === CATEGORY_META.length
                    ? expandAllCategories
                    : collapseAllCategories
                }
                className="text-[9.5px] text-slate-500 hover:text-slate-800 flex items-center gap-1 px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 cursor-pointer transition-colors"
                title="Toggle collapse on all categories"
              >
                <ChevronsUpDown size={10} />
                <span>
                  {collapsedCategories.size === CATEGORY_META.length ? 'Expand All' : 'Collapse All'}
                </span>
              </button>
            </div>
          </div>

          {/* ── REFLOWABLE CATEGORIES & BLOCKS LIST ── */}
          <div
            onScroll={() => setHoveredItem(null)}
            className="flex-1 overflow-y-auto p-2 space-y-2"
          >
            {CATEGORY_META.map((meta) => {
              if (selectedFilterCategory !== 'all' && selectedFilterCategory !== meta.id) {
                return null;
              }

              const items = ALL_BLOCKS.filter(
                (item) =>
                  item.category === meta.id &&
                  (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.badge.toLowerCase().includes(searchQuery.toLowerCase()))
              );

              if (items.length === 0) return null;

              const isCollapsedCategory = searchQuery.trim().length === 0 && collapsedCategories.has(meta.id);
              const sectionMode = sectionViewModes[meta.id] || 'cards';

              return (
                <div key={meta.id} className="rounded-xl border border-stone-200 bg-stone-50/50 overflow-hidden shadow-2xs">
                  {/* Category Accordion Header */}
                  <div className="flex items-center justify-between p-1.5 bg-stone-50 hover:bg-stone-100 transition-colors">
                    <button
                      onClick={() => toggleCategoryCollapse(meta.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer min-w-0 flex-1 text-left"
                    >
                      <div className={`transition-transform duration-200 ${isCollapsedCategory ? '-rotate-90' : 'rotate-0'}`}>
                        <ChevronDown size={13} className="text-slate-400 group-hover:text-slate-600" />
                      </div>
                      <span className="text-xs">{meta.icon}</span>
                      <span className="truncate text-[11px]">{meta.label}</span>
                      <span className="text-[9px] font-mono text-slate-500 bg-stone-100 px-1 py-0.2 rounded border border-stone-200">
                        {items.length}
                      </span>
                    </button>

                    <div className="flex items-center gap-1 shrink-0 ml-1.5">
                      <div className="flex items-center bg-white rounded-lg p-0.5 border border-stone-200 shadow-2xs">
                        <button
                          onClick={(e) => setCategoryViewMode(meta.id, 'cards', e)}
                          className={`p-1 rounded transition-all cursor-pointer ${
                            sectionMode === 'cards'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-stone-50'
                          }`}
                          title={`Switch ${meta.label} to Card View`}
                          aria-label="Card View"
                        >
                          <Rows size={10} />
                        </button>
                        <button
                          onClick={(e) => setCategoryViewMode(meta.id, 'icons', e)}
                          className={`p-1 rounded transition-all cursor-pointer ${
                            sectionMode === 'icons'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-stone-50'
                          }`}
                          title={`Switch ${meta.label} to Icon Grid`}
                          aria-label="Icon Grid View"
                        >
                          <LayoutGrid size={10} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reflowable Items Body */}
                  <div className={`accordion-grid ${!isCollapsedCategory ? 'open' : ''}`}>
                    <div className="accordion-content">
                      {sectionMode === 'cards' ? (
                        /* Reflowable Cards Grid (automatically 2 columns when sidebar width >= 420px!) */
                        <div
                          className={`p-1.5 bg-white/50 gap-1.5 ${
                            sidebarWidth >= 420 ? 'grid grid-cols-2' : 'space-y-1'
                          }`}
                        >
                          {items.map((item) => (
                            <div
                              key={item.type}
                              role="button"
                              tabIndex={0}
                              draggable={true}
                              onDragStart={(e) => handleDragStart(e, item.type)}
                              onDragEnd={handleDragEnd}
                              data-sidebar-block={item.type}
                              onClick={() => handleBlockClick(item.type)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleBlockClick(item.type);
                                }
                              }}
                              className={`w-full text-left p-1.5 rounded-lg bg-white hover:bg-blue-50/50 border border-stone-200 hover:border-blue-300 transition-all duration-150 group cursor-pointer flex items-start justify-between gap-1.5 shadow-2xs hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                                item.type === highlightedBlockType ? 'pulsate-highlight' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2 min-w-0 flex-1">
                                <div className="p-1 rounded-md bg-stone-100 group-hover:bg-blue-50 transition-colors shrink-0 mt-0.5 border border-stone-200">
                                  {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[11.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors truncate">
                                      {item.title}
                                    </span>
                                    <span className="text-[8.5px] font-medium text-slate-400 bg-stone-100 px-1 rounded shrink-0">
                                      {item.badge}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 leading-tight line-clamp-1 mt-0.5">
                                    {item.description}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={(e) => togglePin(item.type, e)}
                                className="p-0.5 text-slate-300 hover:text-amber-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                                title={pinnedBlocks.includes(item.type) ? 'Unpin block' : 'Pin to top'}
                              >
                                <Star
                                  size={11}
                                  className={pinnedBlocks.includes(item.type) ? 'text-amber-400 fill-amber-400' : ''}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Reflowable Compact Icon-Only Grid */
                        <div className="p-1.5 grid grid-cols-[repeat(auto-fill,minmax(42px,1fr))] gap-1 bg-white/30">
                          {items.map((item) => (
                            <button
                              key={item.type}
                              draggable={true}
                              onDragStart={(e) => handleDragStart(e, item.type)}
                              onDragEnd={handleDragEnd}
                              data-sidebar-block={item.type}
                              onClick={() => handleBlockClick(item.type)}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const tooltipWidth = 280;
                                const tooltipHeight = 160;
                                let left = rect.right + 10;
                                if (left + tooltipWidth > window.innerWidth) {
                                  left = Math.max(10, rect.left - tooltipWidth - 10);
                                }
                                let top = rect.top;
                                if (top + tooltipHeight > window.innerHeight) {
                                  top = Math.max(10, window.innerHeight - tooltipHeight - 10);
                                }
                                setHoveredItem({
                                  item,
                                  top,
                                  left,
                                });
                              }}
                              onMouseLeave={() => setHoveredItem(null)}
                              className={`h-11 rounded-lg bg-stone-50 hover:bg-blue-500 border border-stone-200 hover:border-blue-400 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 cursor-pointer shadow-2xs hover:scale-108 active:scale-95 group relative ${
                                item.type === highlightedBlockType ? 'pulsate-highlight' : ''
                              }`}
                              title={`${item.title} — Click to insert`}
                            >
                              <div className="group-hover:scale-110 group-hover:text-white text-slate-600 transition-transform">
                                {item.icon}
                              </div>
                              <span className="text-[7.5px] font-semibold text-slate-500 group-hover:text-white truncate max-w-[40px] leading-none">
                                {item.badge}
                              </span>
                              {pinnedBlocks.includes(item.type) && (
                                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 ring-1 ring-amber-300" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Floating Rich Tooltip Card */}
      {isOpen && hoveredItem && (
        <div
          style={{
            top: hoveredItem.top,
            left: hoveredItem.left ?? 88,
          }}
          className="fixed z-50 w-72 bg-white/98 text-slate-800 border border-stone-200 rounded-xl p-2.5 shadow-2xl pointer-events-none animate-fadeIn ring-1 ring-stone-200/50 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 rounded-lg bg-stone-100 text-blue-600 border border-stone-200 shrink-0">
              {hoveredItem.item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 truncate">
                {hoveredItem.item.title}
              </div>
              <div className="flex items-center gap-1.5 text-[9.5px]">
                <span className="font-semibold text-blue-600 uppercase tracking-wider">
                  {hoveredItem.item.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 bg-stone-100 px-1 rounded">
                  {hoveredItem.item.badge}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[10.5px] text-slate-600 leading-snug">
            {hoveredItem.item.description}
          </p>
          <div className="mt-2 pt-1.5 border-t border-stone-200 text-[10px] text-emerald-600 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Zap size={11} className="text-emerald-500" />
              <span>Click to insert</span>
            </span>
            <span className="text-slate-400 font-mono text-[9px]">Position #End</span>
          </div>
        </div>
      )}
    </aside>
  );
};
