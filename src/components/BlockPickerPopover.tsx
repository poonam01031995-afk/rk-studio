import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { BlockType } from '../types/document';
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
  Flame,
} from 'lucide-react';
import { recordBlockUsage, getFrequentlyUsedBlocks } from '../utils/blockUsage';

interface BlockPickerItem {
  type: BlockType;
  title: string;
  category: 'text' | 'boxes' | 'lists' | 'questions' | 'tables';
  categoryLabel: string;
  description: string;
  icon: React.ReactNode;
  badgeColor: string;
  keywords: string[];
}

const ALL_BLOCK_ITEMS: BlockPickerItem[] = [
  // 1. Text & Structure
  {
    type: 'hero-intro',
    title: 'Chapter Hero Banner',
    category: 'text',
    categoryLabel: '✍️ Text & Structure',
    description: 'Executive chapter masthead with marks weightage, curriculum tags and summary',
    icon: <Heading size={16} className="text-blue-400" />,
    badgeColor: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    keywords: ['hero', 'banner', 'chapter', 'header', 'intro', 'title', 'curriculum'],
  },
  {
    type: 'heading',
    title: 'Topic Heading (H1 / H2 / H3)',
    category: 'text',
    categoryLabel: '✍️ Text & Structure',
    description: 'Section heading with sub-topic breadcrumb tag and level selector',
    icon: <Heading size={16} className="text-slate-300" />,
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    keywords: ['heading', 'h1', 'h2', 'h3', 'topic', 'section', 'title'],
  },
  {
    type: 'paragraph',
    title: 'Body Text Paragraph',
    category: 'text',
    categoryLabel: '✍️ Text & Structure',
    description: 'Explanatory narrative paragraph supporting rich inline HTML formatting',
    icon: <AlignLeft size={16} className="text-slate-300" />,
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    keywords: ['paragraph', 'text', 'body', 'content', 'explanation'],
  },
  {
    type: 'page-break',
    title: 'Page Break (नया पृष्ठ)',
    category: 'text',
    categoryLabel: '✍️ Text & Structure',
    description: 'Clean physical A4 page separator that forces a fresh sheet on canvas and print',
    icon: <Scissors size={16} className="text-indigo-400" />,
    badgeColor: 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50',
    keywords: ['page', 'break', 'sheet', 'new', 'print', 'split'],
  },
  {
    type: 'hallmark-closing',
    title: 'Institutional Closing Hallmark',
    category: 'text',
    categoryLabel: '✍️ Text & Structure',
    description: 'Official institute hallmark sign-off, address, session and helpline stamp',
    icon: <Award size={16} className="text-amber-400" />,
    badgeColor: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
    keywords: ['closing', 'hallmark', 'stamp', 'signoff', 'institute', 'helpline'],
  },

  // 2. Callout & NCERT Boxes
  {
    type: 'box-lead',
    title: 'Lead Highlight Card (.lead)',
    category: 'boxes',
    categoryLabel: '📦 Callout & NCERT Boxes',
    description: 'Prominent summary card with bold blue accent and Devanagari badge',
    icon: <BookOpen size={16} className="text-blue-400" />,
    badgeColor: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    keywords: ['lead', 'highlight', 'summary', 'box', 'accent', 'devanagari'],
  },
  {
    type: 'box-definition',
    title: 'Definition Box (.defbox)',
    category: 'boxes',
    categoryLabel: '📦 Callout & NCERT Boxes',
    description: 'Term, 3-point atomic breakdown & Devanagari memory hook for board scoring',
    icon: <BookOpen size={16} className="text-blue-400" />,
    badgeColor: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    keywords: ['definition', 'def', 'term', 'hook', 'ncert', 'concept', 'meaning'],
  },
  {
    type: 'box-caution',
    title: 'Caution Checkpoint (Anti-Trap)',
    category: 'boxes',
    categoryLabel: '📦 Callout & NCERT Boxes',
    description: 'Warning for high-risk exam traps with Misconception vs Reality contrast',
    icon: <AlertTriangle size={16} className="text-amber-400" />,
    badgeColor: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
    keywords: ['caution', 'warning', 'trap', 'misconception', 'reality', 'anti-trap', 'mistake'],
  },
  {
    type: 'box-life-example',
    title: 'Real-Life Analogy Box',
    category: 'boxes',
    categoryLabel: '📦 Callout & NCERT Boxes',
    description: 'Everyday conversational Hindi story with key takeaway for instant intuition',
    icon: <Lightbulb size={16} className="text-emerald-400" />,
    badgeColor: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
    keywords: ['analogy', 'life', 'example', 'intuition', 'story', 'takeaway'],
  },
  {
    type: 'box-case-study',
    title: 'Case Study & Historical Context',
    category: 'boxes',
    categoryLabel: '📦 Callout & NCERT Boxes',
    description: 'Historical evidence card with source tag & analytical points for long answers',
    icon: <FileText size={16} className="text-purple-400" />,
    badgeColor: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
    keywords: ['case', 'study', 'history', 'evidence', 'context', 'source'],
  },
  {
    type: 'box-exam-tip',
    title: "Teacher's Exam Tip & Strategy",
    category: 'boxes',
    categoryLabel: '📦 Callout & NCERT Boxes',
    description: 'CBSE marking scheme hints, scoring rules & examiner keywords',
    icon: <Target size={16} className="text-indigo-400" />,
    badgeColor: 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50',
    keywords: ['tip', 'exam', 'strategy', 'marks', 'scoring', 'teacher', 'cbse'],
  },
  {
    type: 'box-formula',
    title: 'Formula & Scientific Law',
    category: 'boxes',
    categoryLabel: '📦 Callout & NCERT Boxes',
    description: 'Prominent formula math display and variable table with SI units',
    icon: <Zap size={16} className="text-cyan-400" />,
    badgeColor: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50',
    keywords: ['formula', 'law', 'physics', 'math', 'equation', 'variables', 'si unit'],
  },
  {
    type: 'box-worked',
    title: 'Worked Numerical Steps',
    category: 'boxes',
    categoryLabel: '📦 Callout & NCERT Boxes',
    description: 'Problem statement, numbered calculation steps & final answer badge',
    icon: <Sparkles size={16} className="text-sky-400" />,
    badgeColor: 'bg-sky-900/40 text-sky-300 border-sky-700/50',
    keywords: ['worked', 'numerical', 'step', 'solution', 'math', 'problem'],
  },
  {
    type: 'box-activity',
    title: 'NCERT Lab Activity Box',
    category: 'boxes',
    categoryLabel: '📦 Callout & NCERT Boxes',
    description: 'Objective, apparatus, step procedure & observation inference',
    icon: <FlaskConical size={16} className="text-teal-400" />,
    badgeColor: 'bg-teal-900/40 text-teal-300 border-teal-700/50',
    keywords: ['activity', 'lab', 'experiment', 'ncert', 'apparatus', 'observation'],
  },
  {
    type: 'box-summary',
    title: 'Summary & Quick Recap',
    category: 'boxes',
    categoryLabel: '📦 Callout & NCERT Boxes',
    description: 'Checkmark revision points for quick recall before tests',
    icon: <CheckCircle2 size={16} className="text-teal-400" />,
    badgeColor: 'bg-teal-900/40 text-teal-300 border-teal-700/50',
    keywords: ['summary', 'recap', 'revision', 'points', 'review'],
  },
  {
    type: 'box-instructions',
    title: 'General Exam Instructions',
    category: 'boxes',
    categoryLabel: '📦 Callout & NCERT Boxes',
    description: 'Test paper instructions with numbered section rules and marking layout',
    icon: <FileText size={16} className="text-slate-400" />,
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    keywords: ['instructions', 'test', 'exam', 'rules', 'general', 'paper'],
  },

  // 3. Lists & Comparisons
  {
    type: 'bullet-list',
    title: 'Universal Rich Bullets',
    category: 'lists',
    categoryLabel: '📝 Lists & Comparisons',
    description: '7 switchable styles: checkmark pills, numbers, arrows, stars, pros/cons',
    icon: <ListOrdered size={16} className="text-blue-400" />,
    badgeColor: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    keywords: ['bullet', 'list', 'points', 'numbered', 'check', 'arrow', 'stars'],
  },
  {
    type: 'comparison-vs',
    title: 'Versus Strip (A vs B)',
    category: 'lists',
    categoryLabel: '📝 Lists & Comparisons',
    description: '2-column side-by-side contrast comparison with point-by-point differences',
    icon: <SplitSquareVertical size={16} className="text-amber-400" />,
    badgeColor: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
    keywords: ['versus', 'vs', 'comparison', 'diff', 'contrast', 'columns'],
  },
  {
    type: 'card-grid-3',
    title: '3-Card Concept Grid',
    category: 'lists',
    categoryLabel: '📝 Lists & Comparisons',
    description: 'Three parallel model cards (e.g. Capitalism, Socialism, Mixed economy)',
    icon: <Columns3 size={16} className="text-purple-400" />,
    badgeColor: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
    keywords: ['grid', 'cards', '3card', 'models', 'types', 'columns'],
  },
  {
    type: 'timeline-steps',
    title: 'Chronological Timeline',
    category: 'lists',
    categoryLabel: '📝 Lists & Comparisons',
    description: '4-phase sequential timeline with period badges and milestones',
    icon: <Clock size={16} className="text-emerald-400" />,
    badgeColor: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
    keywords: ['timeline', 'chronology', 'phases', 'history', 'steps', 'milestones'],
  },

  // 4. Questions & MCQs
  {
    type: 'question-card',
    title: 'CBSE Question Card (PYQ)',
    category: 'questions',
    categoryLabel: '❓ Questions & MCQs',
    description: 'MCQ with aligned option pills & solution key, or Descriptive QA with marking scheme',
    icon: <HelpCircle size={16} className="text-blue-400" />,
    badgeColor: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    keywords: ['question', 'pyq', 'mcq', 'cbse', 'qa', 'solution', 'test', 'marks'],
  },

  // 5. Tables & Visuals
  {
    type: 'data-table',
    title: 'Academic Data Table',
    category: 'tables',
    categoryLabel: '📊 Tables & Visuals',
    description: 'Structured comparison matrix with custom headers, rows and citation note',
    icon: <Table2 size={16} className="text-indigo-400" />,
    badgeColor: 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50',
    keywords: ['table', 'matrix', 'rows', 'columns', 'data', 'grid'],
  },
  {
    type: 'companion-grid',
    title: '2-Col Visual Companion',
    category: 'tables',
    categoryLabel: '📊 Tables & Visuals',
    description: 'Graphic diagram on left 35%, pedagogical analysis & discussion questions on right',
    icon: <Columns2 size={16} className="text-teal-400" />,
    badgeColor: 'bg-teal-900/40 text-teal-300 border-teal-700/50',
    keywords: ['companion', 'diagram', 'visual', 'split', 'analysis', 'questions'],
  },
  {
    type: 'image-block',
    title: 'Image / Diagram Block',
    category: 'tables',
    categoryLabel: '📊 Tables & Visuals',
    description: 'Academic diagram figure with caption, alt text and preset RK logo',
    icon: <Image size={16} className="text-rose-400" />,
    badgeColor: 'bg-rose-900/40 text-rose-300 border-rose-700/50',
    keywords: ['image', 'diagram', 'photo', 'picture', 'figure', 'caption'],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (type: BlockType) => void;
  insertPositionIndex?: number;
}

export const BlockPickerPopover: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectBlock,
  insertPositionIndex,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const frequentTypes = getFrequentlyUsedBlocks(5);
  const frequentItems = frequentTypes
    .map((t) => ALL_BLOCK_ITEMS.find((item) => item.type === t))
    .filter(Boolean) as BlockPickerItem[];

  // Filter items
  const filtered = ALL_BLOCK_ITEMS.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    if (!matchCat) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const handleSelect = useCallback((type: BlockType) => {
    recordBlockUsage(type);
    onSelectBlock(type);
    onClose();
  }, [onSelectBlock, onClose]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setSelectedIndex(0);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedIndex(0);
  };

  const activeIndex = Math.min(selectedIndex, Math.max(0, filtered.length - 1));

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filtered.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : Math.max(0, filtered.length - 1)));
      } else if (e.key === 'Enter') {
        if (filtered[activeIndex]) {
          e.preventDefault();
          handleSelect(filtered[activeIndex].type);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filtered, activeIndex, handleSelect]);

  if (!isOpen) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/40 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Popover Dialog */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-800 ring-1 ring-stone-200"
      >
        {/* Header with Search */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
                +
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5 font-heading">
                  <span>Insert Pedagogical Block</span>
                  {typeof insertPositionIndex === 'number' && (
                    <span className="text-[10.5px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Position #{insertPositionIndex + 1}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select a standardized block from RK Study Notes &amp; Assessment library
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-stone-200 transition-colors text-xs cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Bar Input */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by block name, concept, or purpose (e.g., 'caution', 'pyq', 'formula')..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs select-none">
            {[
              { id: 'all', label: 'All (24)' },
              { id: 'text', label: '✍️ Text' },
              { id: 'boxes', label: '📦 NCERT Boxes' },
              { id: 'lists', label: '📝 Lists & Cards' },
              { id: 'questions', label: '❓ Questions & PYQ' },
              { id: 'tables', label: '📊 Tables & Visuals' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`px-2.5 py-1 rounded-lg font-medium text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-stone-100 text-slate-600 hover:text-slate-800 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Frequently Used Quick Bar (shown when no search) */}
        {!search && frequentItems.length > 0 && selectedCategory === 'all' && (
          <div className="px-4 py-2 bg-stone-50 border-b border-stone-200 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] uppercase font-bold text-amber-600 flex items-center gap-1 shrink-0">
              <Flame size={12} />
              Quick Pick:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {frequentItems.map((item) => (
                <button
                  key={`freq-${item.type}`}
                  onClick={() => handleSelect(item.type)}
                  className="px-2 py-1 rounded-md bg-white hover:bg-blue-500 text-slate-600 hover:text-white border border-stone-200 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="font-medium">{item.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Blocks Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-sm font-semibold text-slate-600">No blocks found matching "{search}"</div>
              <p className="text-xs text-slate-500 mt-1">Try another keyword like definition, caution, pyq, or formula</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filtered.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.type}
                    onClick={() => handleSelect(item.type)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`text-left p-3 rounded-xl border transition-all duration-150 group cursor-pointer flex items-start gap-3 relative shadow-xs ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-400 shadow-sm ring-1 ring-blue-300/40'
                        : 'bg-white hover:bg-blue-50/40 border-stone-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-colors shrink-0 mt-0.5 border ${
                      isSelected ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-stone-50 text-blue-600 group-hover:bg-blue-100 border-stone-200'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-slate-900 transition-colors truncate">
                          {item.title}
                        </div>
                        <span className="text-[9px] uppercase font-semibold text-slate-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar with Raycast/Linear keyboard shortcuts */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{filtered.length} pedagogical blocks available</span>
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
              <span className="text-slate-400">•</span>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-200 text-[10px] font-mono border border-stone-300 text-slate-600">↑↓</kbd>
              <span>navigate</span>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-200 text-[10px] font-mono border border-stone-300 text-slate-600">↵</kbd>
              <span>select</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-200 text-[10px] font-mono border border-stone-300 text-slate-600">Esc</kbd>
            <span className="text-slate-400">to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
