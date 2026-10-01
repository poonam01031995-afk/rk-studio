import React from 'react';
import type { HeadingBlock, ParagraphBlock } from '../../types/document';

interface HeadingProps {
  block: HeadingBlock;
  onChange: (updated: HeadingBlock) => void;
}

export const HeadingBlockView: React.FC<HeadingProps> = ({ block, onChange }) => {
  return (
    <div className="heading-block my-3">
      {block.tag && (
        <span 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, tag: e.currentTarget.textContent || undefined })}
          className="inline-block text-[9.5px] font-bold uppercase tracking-wider text-[#0f3457] bg-[#eef4fb] border border-[#cfe0f2] px-2 py-0.5 rounded mb-1 outline-none focus:ring-1 focus:ring-blue-400 cursor-text"
        >
          {block.tag}
        </span>
      )}

      {block.level === 1 && (
        <h1 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent || '' })}
          className="text-xl font-extrabold text-[#0f3457] border-b-2 border-[#1a5c9c] pb-1 tracking-tight font-heading outline-none focus:ring-1 focus:ring-blue-400 rounded cursor-text"
        >
          {block.text}
        </h1>
      )}

      {block.level === 2 && (
        <h2 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent || '' })}
          className="text-base font-bold text-[#0f3457] border-b border-[#cfe0f2] pb-1 tracking-tight font-heading outline-none focus:ring-1 focus:ring-blue-400 rounded cursor-text"
        >
          {block.text}
        </h2>
      )}

      {block.level === 3 && (
        <h3 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent || '' })}
          className="text-sm font-bold text-[#1a5c9c] tracking-tight font-heading outline-none focus:ring-1 focus:ring-blue-400 rounded cursor-text"
        >
          {block.text}
        </h3>
      )}
    </div>
  );
};

interface ParagraphProps {
  block: ParagraphBlock;
  onChange: (updated: ParagraphBlock) => void;
}

export const ParagraphBlockView: React.FC<ParagraphProps> = ({ block, onChange }) => {
  return (
    <div 
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange({ ...block, text: e.currentTarget.innerHTML || '' })}
      dangerouslySetInnerHTML={{ __html: block.text }}
      className="paragraph-block text-[13px] leading-relaxed text-slate-800 my-2 outline-none focus:ring-1 focus:ring-blue-400 p-1 rounded cursor-text"
    />
  );
};
