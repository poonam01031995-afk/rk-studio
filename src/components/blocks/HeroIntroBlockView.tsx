import React from 'react';
import type { HeroIntroBlock } from '../../types/document';

interface Props {
  block: HeroIntroBlock;
  onChange: (updated: HeroIntroBlock) => void;
}

export const HeroIntroBlockView: React.FC<Props> = ({ block, onChange }) => {
  return (
    <div className="hero-banner bg-gradient-to-r from-[#0d3559] via-[#17538c] to-[#1b6bb0] text-white rounded-xl p-5 mb-4 shadow-sm">
      {/* Eyebrow */}
      <div className="mb-2">
        <span 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, eyebrow: e.currentTarget.textContent || '' })}
          className="inline-block text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-white/15 border border-white/30 text-white/95 cursor-text outline-none focus:ring-1 focus:ring-amber-300"
        >
          {block.eyebrow}
        </span>
      </div>

      {/* Main Title */}
      <h1 
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, title: e.currentTarget.textContent || '' })}
        className="text-2xl font-extrabold tracking-tight text-white mb-2 leading-tight font-heading outline-none focus:ring-1 focus:ring-amber-300 rounded cursor-text"
      >
        {block.title}
      </h1>

      {/* Subtitle / Intro blurb */}
      <p 
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, subtitle: e.currentTarget.textContent || '' })}
        className="text-[13px] leading-relaxed text-white/90 mb-3 outline-none focus:ring-1 focus:ring-amber-300 rounded cursor-text"
      >
        {block.subtitle}
      </p>

      {/* Chip tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {block.chips.map((chip, i) => (
          <span
            key={i}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const newChips = [...block.chips];
              newChips[i] = e.currentTarget.textContent || '';
              onChange({ ...block, chips: newChips });
            }}
            className="text-[10.5px] font-semibold bg-white/15 border border-white/25 text-white/95 px-2 py-0.5 rounded-full outline-none focus:ring-1 focus:ring-amber-300 cursor-text"
          >
            {chip}
          </span>
        ))}
        <button
          onClick={() => onChange({ ...block, chips: [...block.chips, '✨ New Focus'] })}
          className="no-print text-[10.5px] font-medium text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 border border-dashed border-white/30 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
        >
          + Add Chip
        </button>
      </div>
    </div>
  );
};
