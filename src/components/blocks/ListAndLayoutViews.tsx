import React from 'react';
import type {
  BulletListBlock,
  CardGrid3Block,
  ComparisonVsBlock,
  TimelineStepsBlock,
  DataTableBlock,
  QuestionCardBlock,
  CompanionGridBlock,
  ImageBlock,
  PageBreakBlock,
  BulletStyle,
} from '../../types/document';
import { Plus, Trash2 } from 'lucide-react';
import { renderMathInText } from '../MathRenderer';

const BULLET_STYLES: { id: BulletStyle; label: string; icon: string }[] = [
  { id: 'check', label: 'Checkmark Pill', icon: '✓' },
  { id: 'numbered', label: 'Numbered Badge', icon: '1.' },
  { id: 'arrow', label: 'Causal Arrow', icon: '➔' },
  { id: 'star', label: 'Takeaway Star', icon: '⭐' },
  { id: 'dot', label: 'Clean Disc', icon: '•' },
  { id: 'bilingual', label: 'Bilingual (Eng/Hi)', icon: '🇮🇳' },
  { id: 'pros-cons', label: 'Pros & Cons', icon: '+/-' },
];

// 1. Rich Bullet List View
export const BulletListView: React.FC<{ block: BulletListBlock; onChange: (b: BulletListBlock) => void }> = ({ block, onChange }) => {
  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      text: 'नया अध्ययन बिंदु / Key bullet point',
      subText: block.style === 'bilingual' ? 'हिंदी अनुवाद या संदर्भ विवरण यहाँ लिखें' : undefined,
      isPositive: true,
    };
    onChange({ ...block, items: [...block.items, newItem] });
  };

  const handleDeleteItem = (idx: number) => {
    const newItems = block.items.filter((_, i) => i !== idx);
    onChange({ ...block, items: newItems });
  };

  return (
    <div className="bullet-list-block my-3">
      <div className="flex items-center justify-between mb-2">
        {block.title ? (
          <div 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, title: e.currentTarget.textContent || undefined })}
            className="text-[13px] font-bold text-[#0f3457] font-heading outline-none cursor-text"
          >
            {block.title}
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 italic">Bullet List (No Title)</div>
        )}

        {/* Inline Style Selector (Screen only) */}
        <div className="no-print flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-[10px]">
          {BULLET_STYLES.map((st) => (
            <button
              key={st.id}
              onClick={() => onChange({ ...block, style: st.id })}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                block.style === st.id 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
              title={st.label}
            >
              <span>{st.icon}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {block.items.map((item, idx) => (
          <div key={item.id || idx} className="group/item flex items-start justify-between gap-2.5 text-[12.5px] leading-relaxed">
            <div className="flex items-start gap-2.5 flex-1">
              {/* Style Badge / Bullet */}
              {block.style === 'dot' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a5c9c] mt-2 shrink-0" />
              )}

              {block.style === 'check' && (
                <span className="w-4 h-4 rounded-full bg-[#ecf8f1] border border-[#b8e2cc] text-[#127048] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </span>
              )}

              {block.style === 'numbered' && (
                <span className="w-5 h-5 rounded-full bg-[#0f3457] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 font-mono">
                  {idx + 1}
                </span>
              )}

              {block.style === 'arrow' && (
                <span className="text-[#1a5c9c] font-bold text-sm shrink-0">
                  ➔
                </span>
              )}

              {block.style === 'star' && (
                <span className="text-amber-500 font-bold text-xs shrink-0 mt-0.5">
                  ⭐
                </span>
              )}

              {block.style === 'pros-cons' && (
                <button
                  onClick={() => {
                    const newItems = [...block.items];
                    newItems[idx] = { ...newItems[idx], isPositive: !newItems[idx].isPositive };
                    onChange({ ...block, items: newItems });
                  }}
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 mt-0.5 cursor-pointer no-print-cursor ${
                    item.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}
                  title="Click to toggle pros/cons"
                >
                  {item.isPositive ? '+' : '–'}
                </button>
              )}

              {block.style === 'bilingual' && (
                <span className="w-5 h-5 rounded bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 font-mono mt-0.5">
                  {idx + 1}
                </span>
              )}

              {/* Text content */}
              <div className="flex-1">
                <div 
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => {
                    const newItems = [...block.items];
                    newItems[idx] = { ...newItems[idx], text: e.currentTarget.innerHTML || '' };
                    onChange({ ...block, items: newItems });
                  }}
                  dangerouslySetInnerHTML={{ __html: item.text }}
                  className="text-slate-800 outline-none cursor-text"
                />

                {(item.subText !== undefined || block.style === 'bilingual') && (
                  <div 
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newItems = [...block.items];
                      newItems[idx] = { ...newItems[idx], subText: e.currentTarget.textContent || '' };
                      onChange({ ...block, items: newItems });
                    }}
                    className="text-[11.5px] text-slate-500 italic mt-0.5 outline-none cursor-text"
                  >
                    {item.subText || 'हिंदी / संदर्भ विवरण यहाँ जोड़ें...'}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDeleteItem(idx)}
              className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs cursor-pointer p-0.5"
              title="Delete item"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="no-print mt-2 flex items-center gap-2">
        <button
          onClick={handleAddItem}
          className="text-[11px] text-[#1a5c9c] hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-200 cursor-pointer flex items-center gap-1"
        >
          <Plus size={11} /> Add Bullet Point
        </button>
      </div>
    </div>
  );
};

// 2. 3-Card Concept Grid View (.cg-3)
export const CardGrid3View: React.FC<{ block: CardGrid3Block; onChange: (b: CardGrid3Block) => void }> = ({ block, onChange }) => {
  const handleAddPointToCard = (cardIdx: number) => {
    const newCards = [...block.cards];
    newCards[cardIdx] = {
      ...newCards[cardIdx],
      points: [...newCards[cardIdx].points, 'नया बिंदु / New point'],
    };
    onChange({ ...block, cards: newCards });
  };

  const handleDeletePointFromCard = (cardIdx: number, ptIdx: number) => {
    const newCards = [...block.cards];
    newCards[cardIdx] = {
      ...newCards[cardIdx],
      points: newCards[cardIdx].points.filter((_, i) => i !== ptIdx),
    };
    onChange({ ...block, cards: newCards });
  };

  return (
    <div className="card-grid-3 grid grid-cols-3 gap-3 my-3">
      {block.cards.map((card, cIdx) => (
        <div 
          key={card.id || cIdx} 
          className="border border-[#cfe0f2] rounded-lg p-3 bg-white shadow-2xs flex flex-col justify-between"
        >
          <div>
            <div 
              contentEditable suppressContentEditableWarning
              onBlur={(e) => {
                const newCards = [...block.cards];
                newCards[cIdx] = { ...newCards[cIdx], title: e.currentTarget.textContent || '' };
                onChange({ ...block, cards: newCards });
              }}
              className="text-[12px] font-bold text-[#0f3457] font-heading pb-1 mb-2 border-b border-[#cfe0f2]/60 outline-none cursor-text"
            >
              {card.title}
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-700">
              {card.points.map((pt, pIdx) => (
                <div key={pIdx} className="group/item flex items-start justify-between gap-1.5">
                  <div 
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newCards = [...block.cards];
                      const newPts = [...newCards[cIdx].points];
                      newPts[pIdx] = e.currentTarget.textContent || '';
                      newCards[cIdx] = { ...newCards[cIdx], points: newPts };
                      onChange({ ...block, cards: newCards });
                    }}
                    className="outline-none cursor-text flex-1 leading-relaxed"
                  >
                    • {pt}
                  </div>
                  <button
                    onClick={() => handleDeletePointFromCard(cIdx, pIdx)}
                    className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-[10px] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100">
            {card.note && (
              <div 
                contentEditable suppressContentEditableWarning
                onBlur={(e) => {
                  const newCards = [...block.cards];
                  newCards[cIdx] = { ...newCards[cIdx], note: e.currentTarget.textContent || '' };
                  onChange({ ...block, cards: newCards });
                }}
                className="text-[10px] text-slate-500 italic outline-none cursor-text mb-1"
              >
                {card.note}
              </div>
            )}
            <button
              onClick={() => handleAddPointToCard(cIdx)}
              className="no-print text-[10px] text-[#1a5c9c] hover:underline cursor-pointer"
            >
              + Add Point
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// 3. Versus Comparison Strip (.comparison-vs)
export const ComparisonVsView: React.FC<{ block: ComparisonVsBlock; onChange: (b: ComparisonVsBlock) => void }> = ({ block, onChange }) => {
  const handleAddLeftPoint = () => {
    onChange({ ...block, leftPoints: [...block.leftPoints, 'नया बिंदु / Feature point'] });
  };

  const handleAddRightPoint = () => {
    onChange({ ...block, rightPoints: [...block.rightPoints, 'नया बिंदु / Feature point'] });
  };

  return (
    <div className="comparison-vs my-3 border border-[#cfe0f2] rounded-lg overflow-hidden bg-white shadow-2xs">
      <div className="grid grid-cols-2 divide-x divide-[#cfe0f2]">
        {/* Left Side */}
        <div className="p-3.5 bg-gradient-to-b from-[#f8fbfe] to-white">
          <div 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, leftTitle: e.currentTarget.textContent || '' })}
            className="text-[12.5px] font-bold text-[#0f3457] font-heading pb-1.5 mb-2 border-b border-[#cfe0f2] outline-none cursor-text"
          >
            {block.leftTitle}
          </div>
          <div className="space-y-1.5 text-[11.5px] text-slate-700">
            {block.leftPoints.map((pt, i) => (
              <div key={i} className="group/item flex items-start justify-between gap-1.5">
                <div 
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => {
                    const newPts = [...block.leftPoints];
                    newPts[i] = e.currentTarget.textContent || '';
                    onChange({ ...block, leftPoints: newPts });
                  }}
                  className="outline-none cursor-text flex-1"
                >
                  • {pt}
                </div>
                <button
                  onClick={() => onChange({ ...block, leftPoints: block.leftPoints.filter((_, idx) => idx !== i) })}
                  className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 text-[10px] cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddLeftPoint}
            className="no-print mt-2 text-[10px] text-[#1a5c9c] hover:underline cursor-pointer"
          >
            + Add Point
          </button>
        </div>

        {/* Right Side */}
        <div className="p-3.5 bg-gradient-to-b from-[#fbfcfe] to-white">
          <div 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, rightTitle: e.currentTarget.textContent || '' })}
            className="text-[12.5px] font-bold text-[#1a5c9c] font-heading pb-1.5 mb-2 border-b border-[#cfe0f2] outline-none cursor-text"
          >
            {block.rightTitle}
          </div>
          <div className="space-y-1.5 text-[11.5px] text-slate-700">
            {block.rightPoints.map((pt, i) => (
              <div key={i} className="group/item flex items-start justify-between gap-1.5">
                <div 
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => {
                    const newPts = [...block.rightPoints];
                    newPts[i] = e.currentTarget.textContent || '';
                    onChange({ ...block, rightPoints: newPts });
                  }}
                  className="outline-none cursor-text flex-1"
                >
                  • {pt}
                </div>
                <button
                  onClick={() => onChange({ ...block, rightPoints: block.rightPoints.filter((_, idx) => idx !== i) })}
                  className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 text-[10px] cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddRightPoint}
            className="no-print mt-2 text-[10px] text-[#1a5c9c] hover:underline cursor-pointer"
          >
            + Add Point
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Chronology Timeline Steps (.timeline-steps)
export const TimelineStepsView: React.FC<{ block: TimelineStepsBlock; onChange: (b: TimelineStepsBlock) => void }> = ({ block, onChange }) => {
  return (
    <div className="timeline-steps my-3 p-3.5 border border-[#cfe0f2] rounded-lg bg-[#f9fcff] shadow-2xs">
      <div className="grid grid-cols-4 gap-2.5 relative">
        {block.items.map((item, idx) => (
          <div key={item.id || idx} className="relative flex flex-col justify-between">
            <div>
              <div 
                contentEditable suppressContentEditableWarning
                onBlur={(e) => {
                  const newItems = [...block.items];
                  newItems[idx] = { ...newItems[idx], period: e.currentTarget.textContent || '' };
                  onChange({ ...block, items: newItems });
                }}
                className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded inline-block mb-1 font-mono outline-none cursor-text"
              >
                {item.period}
              </div>
              <div 
                contentEditable suppressContentEditableWarning
                onBlur={(e) => {
                  const newItems = [...block.items];
                  newItems[idx] = { ...newItems[idx], title: e.currentTarget.textContent || '' };
                  onChange({ ...block, items: newItems });
                }}
                className="text-[12px] font-bold text-[#0f3457] font-heading mb-1 outline-none cursor-text"
              >
                {item.title}
              </div>
              <div 
                contentEditable suppressContentEditableWarning
                onBlur={(e) => {
                  const newItems = [...block.items];
                  newItems[idx] = { ...newItems[idx], desc: e.currentTarget.textContent || '' };
                  onChange({ ...block, items: newItems });
                }}
                className="text-[11px] text-slate-600 leading-snug outline-none cursor-text"
              >
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Academic Data Table (.data-table)
export const DataTableView: React.FC<{ block: DataTableBlock; onChange: (b: DataTableBlock) => void }> = ({ block, onChange }) => {
  const handleAddRow = () => {
    const newRow = new Array(block.headers.length).fill('नई प्रविष्टि / Value');
    onChange({ ...block, rows: [...block.rows, newRow] });
  };

  const handleDeleteRow = (rIdx: number) => {
    const newRows = block.rows.filter((_, i) => i !== rIdx);
    onChange({ ...block, rows: newRows });
  };

  return (
    <div className="data-table-block my-3">
      {block.caption && (
        <div 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, caption: e.currentTarget.textContent || '' })}
          className="text-[12px] font-bold text-[#0f3457] font-heading mb-1 outline-none cursor-text"
        >
          {block.caption}
        </div>
      )}

      <div className="overflow-x-auto border border-[#cbd5e1] rounded-lg shadow-2xs">
        <table className="w-full text-left text-[11.5px] border-collapse bg-white">
          <thead className="bg-[#f1f6fd] border-b border-[#cbd5e1] text-[#0f3457] font-heading font-bold text-[11px] uppercase tracking-wide">
            <tr>
              {block.headers.map((h, i) => (
                <th 
                  key={i} 
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => {
                    const newH = [...block.headers];
                    newH[i] = e.currentTarget.textContent || '';
                    onChange({ ...block, headers: newH });
                  }}
                  className="p-2 border-r border-[#cbd5e1] last:border-r-0 outline-none cursor-text"
                >
                  {h}
                </th>
              ))}
              <th className="no-print w-6 p-1"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#cbd5e1] text-slate-800">
            {block.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/80">
                {row.map((cell, cIdx) => (
                  <td 
                    key={cIdx}
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newRows = [...block.rows];
                      newRows[rIdx] = [...newRows[rIdx]];
                      newRows[rIdx][cIdx] = e.currentTarget.textContent || '';
                      onChange({ ...block, rows: newRows });
                    }}
                    className="p-2 border-r border-[#cbd5e1] last:border-r-0 outline-none cursor-text"
                  >
                    {cell}
                  </td>
                ))}
                <td className="no-print p-1 text-center">
                  <button
                    onClick={() => handleDeleteRow(rIdx)}
                    className="text-slate-300 hover:text-red-500 text-xs cursor-pointer"
                    title="Delete row"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="no-print mt-2 flex items-center justify-between text-xs">
        <button
          onClick={handleAddRow}
          className="text-[11px] text-[#1a5c9c] hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-200 cursor-pointer flex items-center gap-1"
        >
          <Plus size={11} /> Add Table Row
        </button>
        {block.note && (
          <div 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, note: e.currentTarget.textContent || '' })}
            className="text-[10px] text-slate-500 italic outline-none cursor-text"
          >
            {block.note}
          </div>
        )}
      </div>
    </div>
  );
};

// 6. CBSE Board Question Card (.board-qa-card / .qcard) with Student Mode Masking & KaTeX
export const QuestionCardView: React.FC<{ 
  block: QuestionCardBlock; 
  onChange: (b: QuestionCardBlock) => void;
  teachingMode?: 'teacher' | 'student';
}> = ({ block, onChange, teachingMode = 'teacher' }) => {
  const isMcq = block.questionType === 'mcq';
  const isStudentMode = teachingMode === 'student';

  return (
    <div className="qcard board-qa-card border border-blue-200/90 bg-[#fafcff] rounded-lg p-3.5 my-3 shadow-2xs">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <span 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, qno: e.currentTarget.textContent || '' })}
            className="text-xs font-bold text-white bg-[#0f3457] px-2 py-0.5 rounded font-mono outline-none cursor-text"
          >
            {block.qno}
          </span>
          <span 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, marks: e.currentTarget.textContent || '' })}
            className="text-[10.5px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded font-mono outline-none cursor-text"
          >
            {block.marks}
          </span>
          {block.hot && (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
              🔥 Frequent PYQ
            </span>
          )}
          {isStudentMode && (
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              Student Paper
            </span>
          )}
        </div>

        {/* Mode Toggle (Screen only) */}
        <div className="no-print flex items-center gap-1 text-[10px] bg-slate-100 p-0.5 rounded border border-slate-200">
          <button
            onClick={() => onChange({ ...block, questionType: 'mcq' })}
            className={`px-2 py-0.5 rounded cursor-pointer ${isMcq ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'}`}
          >
            MCQ
          </button>
          <button
            onClick={() => onChange({ ...block, questionType: 'descriptive' })}
            className={`px-2 py-0.5 rounded cursor-pointer ${!isMcq ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'}`}
          >
            Descriptive
          </button>
        </div>
      </div>

      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, question: e.currentTarget.innerHTML || '' })}
        className="text-[12.5px] font-medium text-slate-900 leading-relaxed mb-1 outline-none cursor-text"
      >
        {renderMathInText(block.question)}
      </div>

      {block.questionHindi && (
        <div 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, questionHindi: e.currentTarget.textContent || '' })}
          className="text-[12px] text-slate-600 mb-2.5 outline-none cursor-text"
        >
          {renderMathInText(block.questionHindi)}
        </div>
      )}

      {/* MCQ 4-Option Grid with circular pills */}
      {isMcq && block.options && (
        <div className="grid grid-cols-2 gap-2 my-2.5">
          {block.options.map((opt, oIdx) => {
            const pillLabels = ['क', 'ख', 'ग', 'घ'];
            const romanLabels = ['A', 'B', 'C', 'D'];
            // In student mode, do NOT show green answer highlight!
            const isAnswer = !isStudentMode && Boolean(block.answer && opt.includes(block.answer));

            return (
              <div 
                key={oIdx}
                onClick={() => !isStudentMode && onChange({ ...block, answer: opt })}
                className={`p-2 rounded border flex items-center gap-2 transition-colors ${
                  !isStudentMode ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isAnswer
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold shrink-0 ${
                  isAnswer ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}>
                  {romanLabels[oIdx] || pillLabels[oIdx]}
                </span>
                <span 
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => {
                    const newOpts = [...block.options!];
                    newOpts[oIdx] = e.currentTarget.textContent || '';
                    onChange({ ...block, options: newOpts });
                  }}
                  className="text-[11.5px] outline-none cursor-text flex-1"
                >
                  {renderMathInText(opt)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Choice Box for MCQ */}
      {isMcq && isStudentMode && (
        <div className="mt-2 p-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-between text-[11px] text-slate-700 font-mono">
          <span>उत्तर विकल्प (Candidate Answer Choice):</span>
          <span className="font-bold bg-white px-3 py-0.5 border border-slate-300 rounded text-slate-900">[ &nbsp; &nbsp; &nbsp; ]</span>
        </div>
      )}

      {/* Descriptive Sub-Questions */}
      {!isMcq && block.subQuestions && block.subQuestions.length > 0 && (
        <div className="my-2 space-y-1 pl-2 border-l-2 border-blue-300 text-[12px] text-slate-800">
          {block.subQuestions.map((sq, sIdx) => (
            <div key={sIdx} className="group/item flex items-start justify-between">
              <div 
                contentEditable suppressContentEditableWarning
                onBlur={(e) => {
                  const newSq = [...block.subQuestions!];
                  newSq[sIdx] = e.currentTarget.textContent || '';
                  onChange({ ...block, subQuestions: newSq });
                }}
                className="outline-none cursor-text flex-1"
              >
                ({String.fromCharCode(97 + sIdx)}) {renderMathInText(sq)}
              </div>
              <button
                onClick={() => onChange({ ...block, subQuestions: block.subQuestions!.filter((_, i) => i !== sIdx) })}
                className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Student Lined Space for Descriptive */}
      {!isMcq && isStudentMode && (
        <div className="mt-2.5 pt-2 border-t border-dashed border-blue-200">
          <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>उत्तर लिखने हेतु स्थान (Candidate Answer Space):</span>
            <span className="text-[10px] font-mono text-slate-500">{block.marks}</span>
          </div>
          <div className="space-y-3.5 py-1">
            <div className="border-b border-dashed border-slate-300 h-4"></div>
            <div className="border-b border-dashed border-slate-300 h-4"></div>
            <div className="border-b border-dashed border-slate-300 h-4"></div>
          </div>
        </div>
      )}

      {/* Answer & Explanation Strip (Teacher Key Mode ONLY - Completely hidden in Student Mode) */}
      {!isStudentMode && (
        <div className="mt-2.5 pt-2 border-t border-blue-100 text-[11.5px]">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
              <span>✓ Correct Answer:</span>
              <span 
                contentEditable suppressContentEditableWarning
                onBlur={(e) => onChange({ ...block, answer: e.currentTarget.textContent || '' })}
                className="font-bold outline-none cursor-text"
              >
                {block.answer || 'Select or type correct answer'}
              </span>
            </div>

            <button
              onClick={() => onChange({ ...block, showSolution: !block.showSolution })}
              className="no-print text-[10px] text-blue-600 hover:underline cursor-pointer"
            >
              {block.showSolution ? 'Hide Explanation' : 'Show Explanation'}
            </button>
          </div>

          {block.showSolution && block.explanation && (
            <div 
              contentEditable suppressContentEditableWarning
              onBlur={(e) => onChange({ ...block, explanation: e.currentTarget.textContent || '' })}
              className="mt-1.5 p-2 bg-emerald-50/80 rounded border border-emerald-200 text-emerald-900 leading-relaxed outline-none cursor-text"
            >
              <strong>व्याख्या (Explanation):</strong> {renderMathInText(block.explanation)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 7. 2-Column Visual Companion Grid (.cartoon-duo-grid / .media-duo-grid)
export const CompanionGridView: React.FC<{ block: CompanionGridBlock; onChange: (b: CompanionGridBlock) => void }> = ({ block, onChange }) => {
  const handleAddPoint = () => {
    const pts = [...block.points, 'नया विश्लेषणात्मक बिंदु / Analysis point'];
    onChange({ ...block, points: pts });
  };

  const handleDeletePoint = (idx: number) => {
    const pts = block.points.filter((_, i) => i !== idx);
    onChange({ ...block, points: pts });
  };

  return (
    <div className="companion-grid cartoon-duo-grid my-3 border border-[#cfe0f2] rounded-lg p-3 bg-white shadow-2xs">
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Left Column (35% width ~ 4-5 cols): Visual Image/Diagram */}
        <div className="col-span-4 border border-slate-200 rounded p-1 bg-slate-50 text-center">
          <img 
            src={block.imageSrc || '/rk-assets/rk-logo.png'} 
            alt="Companion graphic" 
            className="max-h-40 mx-auto object-contain block rounded"
          />
          <div 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, imageCaption: e.currentTarget.textContent || '' })}
            className="text-[10px] text-slate-500 italic mt-1 outline-none cursor-text"
          >
            {block.imageCaption}
          </div>
        </div>

        {/* Right Column (65% width ~ 8 cols): Pedagogical Narrative & Questions */}
        <div className="col-span-8">
          <div 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, title: e.currentTarget.textContent || '' })}
            className="text-[12.5px] font-bold text-[#0f3457] font-heading mb-1 outline-none cursor-text"
          >
            {block.title}
          </div>
          <div 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, narrative: e.currentTarget.innerHTML || '' })}
            dangerouslySetInnerHTML={{ __html: block.narrative }}
            className="text-[11.5px] text-slate-700 leading-relaxed mb-2 outline-none cursor-text"
          />

          <div className="space-y-1 text-[11px] text-slate-800 bg-blue-50/60 p-2 rounded border border-blue-100">
            {block.points.map((pt, i) => (
              <div key={i} className="group/item flex items-start justify-between gap-1.5">
                <div 
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => {
                    const newPts = [...block.points];
                    newPts[i] = e.currentTarget.textContent || '';
                    onChange({ ...block, points: newPts });
                  }}
                  className="outline-none cursor-text flex-1"
                >
                  • {pt}
                </div>
                <button
                  onClick={() => handleDeletePoint(i)}
                  className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 text-[10px] cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddPoint}
            className="no-print mt-1.5 text-[10px] text-[#1a5c9c] hover:underline cursor-pointer"
          >
            + Add Analysis Point
          </button>
        </div>
      </div>
    </div>
  );
};

// 8. Image / Diagram Block View
export const ImageBlockView: React.FC<{ block: ImageBlock; onChange: (b: ImageBlock) => void }> = ({ block, onChange }) => {
  return (
    <figure className="image-figure my-3 text-center break-inside-avoid">
      <div className="inline-block border border-slate-200 rounded-lg p-1.5 bg-white shadow-2xs max-w-full">
        <img 
          src={block.url} 
          alt={block.alt || 'Academic diagram'} 
          className="max-h-72 mx-auto rounded object-contain block"
        />
      </div>

      {/* Preset Asset Quick Selector (Screen only) */}
      <div className="no-print my-1 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
        <span>Presets:</span>
        <button 
          onClick={() => onChange({ ...block, url: '/rk-assets/rk-logo.png' })} 
          className="hover:text-blue-600 underline cursor-pointer"
        >
          Crest Logo
        </button>
        <span>•</span>
        <button 
          onClick={() => onChange({ ...block, url: '/rk-assets/header_crop.png' })} 
          className="hover:text-blue-600 underline cursor-pointer"
        >
          Assessment Banner
        </button>
        <span>•</span>
        <button 
          onClick={() => onChange({ ...block, url: '/rk-assets/options_aligned.png' })} 
          className="hover:text-blue-600 underline cursor-pointer"
        >
          Aligned Options
        </button>
        <span>•</span>
        <button 
          onClick={() => onChange({ ...block, url: '/rk-assets/solutions_digital.png' })} 
          className="hover:text-blue-600 underline cursor-pointer"
        >
          Solutions Key
        </button>
      </div>

      {block.caption && (
        <figcaption 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, caption: e.currentTarget.textContent || '' })}
          className="text-[11px] text-slate-600 italic mt-1 outline-none cursor-text"
        >
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
};

// 9. Page Break View
export const PageBreakView: React.FC<{ block: PageBreakBlock }> = ({ block }) => {
  return (
    <div className="page-break-indicator my-5 relative flex items-center justify-center select-none">
      <div className="border-t-2 border-dashed border-blue-300 w-full absolute" />
      <span className="bg-blue-50 text-blue-800 text-[10.5px] font-bold px-3 py-1 rounded-full border border-blue-300 relative z-10 uppercase tracking-widest flex items-center gap-1.5 shadow-2xs">
        <span>📄</span>
        <span>नया पृष्ठ / Page Break</span>
        {block.label && <span className="text-slate-500 font-normal">({block.label})</span>}
      </span>
    </div>
  );
};
