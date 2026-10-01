import React from 'react';
import { ArrowUp, ArrowDown, Copy, Trash2, GripVertical } from 'lucide-react';
import type { BlockType } from '../types/document';

interface BlockWrapperProps {
  id: string;
  type: BlockType;
  index: number;
  totalBlocks: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  children: React.ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
  isNewlyInserted?: boolean;
}

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  'hero-intro': 'Hero Banner',
  'heading': 'Heading',
  'paragraph': 'Paragraph',
  'box-lead': 'Lead Box',
  'box-definition': 'Definition Box',
  'box-caution': 'Exam Caution',
  'box-life-example': 'Real-Life Example',
  'box-case-study': 'Case Study',
  'box-exam-tip': 'Exam Tip',
  'box-formula': 'Formula & Law',
  'box-worked': 'Worked Example',
  'box-summary': 'Summary Recap',
  'box-instructions': 'General Instructions',
  'bullet-list': 'Bullet Points',
  'card-grid-3': '3-Card Grid',
  'comparison-vs': 'Versus Strip',
  'timeline-steps': 'Chronology Timeline',
  'data-table': 'Data Table',
  'question-card': 'Question Card (PYQ)',
  'companion-grid': '2-Col Visual Companion',
  'image-block': 'Image / Diagram',
  'page-break': 'Page Break',
  'box-activity': 'NCERT Activity',
  'hallmark-closing': 'Closing Hallmark Card',
};

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
  type,
  index,
  totalBlocks,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  children,
  isSelected = false,
  onSelect,
  isNewlyInserted = false,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group/block relative my-3 transition-all duration-150 break-inside-avoid print:my-2 print:break-inside-avoid ${
        isNewlyInserted ? 'canvas-block-inserted-highlight' : ''
      }`}
    >
      {/* Floating Action Controls on Hover - Hidden in Print */}
      <div className="no-print absolute -top-3.5 right-2 opacity-0 group-hover/block:opacity-100 transition-opacity duration-150 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-xs text-slate-800 border border-stone-200 px-1.5 py-0.5 rounded-md shadow-md text-[11px]">
        <span className="text-[10px] font-medium text-slate-500 mr-1 flex items-center gap-0.5">
          <GripVertical size={11} className="text-slate-400" />
          {BLOCK_TYPE_LABELS[type] || type}
        </span>

        {index > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            title="Move Up"
            className="p-1 hover:bg-stone-100 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowUp size={12} />
          </button>
        )}

        {index < totalBlocks - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            title="Move Down"
            className="p-1 hover:bg-stone-100 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowDown size={12} />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplicate Block"
          className="p-1 hover:bg-stone-100 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <Copy size={12} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete Block"
          className="p-1 hover:bg-red-50 rounded text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Block Outline on Hover or Selection in Edit Mode */}
      <div
        className={`relative rounded-md transition-shadow ${
          isSelected
            ? 'ring-2 ring-blue-500/70 shadow-sm'
            : 'group-hover/block:ring-1 group-hover/block:ring-blue-400/40'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
